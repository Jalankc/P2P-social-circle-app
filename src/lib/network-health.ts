// Digital commons health computation.
// Provides real-time snapshots of network resilience, redundancy, and
// individual contribution scores. All values read from IndexedDB — no mock data.

import {
  getAllPeers,
  getAllChunks,
  getNetworkEventsSince,
  getIdentity,
} from './db'
import { computeSeedingRatio, computeEffectiveDemurrageRate, computeMScore } from './karma-engine'
import type { Chunk, Peer, NetworkEvent } from './db'

// ── Tunable constants ─────────────────────────────────────────────────────────

export const MIN_REDUNDANCY_TARGET = 3   // target copies of every chunk
export const VULNERABLE_REDUNDANCY = 2   // below this = vulnerable (amber)
export const CRITICAL_REDUNDANCY = 1     // single copy = critical (red)
export const MIN_VIABLE_NETWORK_NODES = 3
export const HEALTH_WINDOW_MS = 24 * 60 * 60 * 1000 // 24h look-back for seeding ratio

// ── Types ─────────────────────────────────────────────────────────────────────

export type CommonsStatus = 'healthy' | 'degraded' | 'critical'

export interface CommonsHealthSnapshot {
  nodeCount: number
  redundancyMin: number          // lowest copy count of any chunk
  redundancyAvg: number          // average across all chunks
  vulnerableChunkCount: number   // chunks with replicationCount < VULNERABLE_REDUNDANCY
  criticalChunkCount: number     // chunks with replicationCount === CRITICAL_REDUNDANCY
  coveragePercent: number        // % of chunks with at least one online peer
  seedingRatio: number           // local user's upload:download in last 24h
  swarmSeedingRatio: number      // estimated network average
  myContributionScore: number    // local user's M score [0, 1]
  accountAgeDays: number
  effectiveDemurrageRate: number // 1.0 = normal, up to MAX_DEMURRAGE_MULTIPLIER
  isViable: boolean              // nodeCount >= MIN_VIABLE_NETWORK_NODES
  status: CommonsStatus
  checkedAt: number              // Unix ms
}

// ── Internal helpers ──────────────────────────────────────────────────────────

export function computeRedundancy(chunks: Chunk[]): {
  min: number
  avg: number
  vulnerable: number
  critical: number
} {
  if (chunks.length === 0) return { min: 0, avg: 0, vulnerable: 0, critical: 0 }
  let min = Infinity, sum = 0, vulnerable = 0, critical = 0
  for (const c of chunks) {
    const r = c.replicationCount
    if (r < min) min = r
    sum += r
    if (r < VULNERABLE_REDUNDANCY) vulnerable++
    if (r === CRITICAL_REDUNDANCY) critical++
  }
  return { min, avg: sum / chunks.length, vulnerable, critical }
}

export function computeCoveragePercent(chunks: Chunk[], peers: Peer[]): number {
  if (chunks.length === 0) return 100
  const onlinePeerIds = new Set(
    peers
      .filter((p) => Date.now() - p.lastSeen < 5 * 60 * 1000) // seen in last 5 min
      .map((p) => p.peerId)
  )
  // A chunk is "covered" if replicationCount > 0 and at least one online peer exists
  // (since we can't map chunk→peer without the transport layer yet, we use a proxy:
  //  if any peer is online and replicationCount > 0, the chunk is reachable)
  const anyOnline = onlinePeerIds.size > 0
  const covered = chunks.filter((c) => c.replicationCount > 0 && anyOnline).length
  return chunks.length === 0 ? 100 : Math.round((covered / chunks.length) * 100)
}

function deriveStatus(
  nodeCount: number,
  redundancyMin: number,
  coveragePercent: number
): CommonsStatus {
  if (nodeCount < MIN_VIABLE_NETWORK_NODES) return 'critical'
  if (redundancyMin < VULNERABLE_REDUNDANCY || coveragePercent < 50) return 'degraded'
  if (redundancyMin < MIN_REDUNDANCY_TARGET || coveragePercent < 80) return 'degraded'
  return 'healthy'
}

function estimateSwarmSeedingRatio(peers: Peer[]): number {
  // Proxy from stored peer stats until the transport layer feeds real values
  const seeding = peers.filter(
    (p) => (p.bytesSeeded ?? 0) >= (p.bytesLeeched ?? 0)
  ).length
  return peers.length === 0 ? 1 : seeding / peers.length
}

function myMScore(events: NetworkEvent[], chunks: Chunk[], peers: Peer[]): number {
  const seedingRatio = computeSeedingRatio(events)
  const normalizedRatio = Math.min(seedingRatio === Infinity ? 2 : seedingRatio, 2) / 2
  const storedGB = chunks
    .filter((c) => c.replicationCount > 0)
    .reduce((sum, c) => sum + c.data.byteLength, 0) / (1024 ** 3)
  const storedScore = Math.min(storedGB / 10, 1) // 10GB = max score
  const onlinePeers = peers.filter(
    (p) => Date.now() - p.lastSeen < 5 * 60 * 1000
  ).length
  const uptimeScore = Math.min(onlinePeers / Math.max(peers.length, 1), 1)
  return computeMScore({
    storage_contributed:     storedScore,
    replication_reliability: uptimeScore,
    bandwidth_ratio:         normalizedRatio,
    compensation_velocity:   0.5,  // placeholder until compensation engine is live
    uptime_consistency:      uptimeScore,
    seed_diversity:          Math.min(new Set(chunks.map((c) => c.chunkId[0])).size / 16, 1),
  })
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function computeCommonsHealth(db: IDBDatabase): Promise<CommonsHealthSnapshot> {
  const since = Date.now() - HEALTH_WINDOW_MS
  const [peers, chunks, events, identity] = await Promise.all([
    getAllPeers(db),
    getAllChunks(db),
    getNetworkEventsSince(db, since),
    getIdentity(db),
  ])

  const redundancy = computeRedundancy(chunks)
  const coveragePercent = computeCoveragePercent(chunks, peers)
  const seedingRatio = computeSeedingRatio(events)
  const nodeCount = peers.length + 1 // +1 for self

  const accountAgeDays = identity
    ? (Date.now() - identity.createdAt) / (24 * 60 * 60 * 1000)
    : 0

  const effectiveDemurrageRate = computeEffectiveDemurrageRate(accountAgeDays, seedingRatio)
  const contributionScore = myMScore(events, chunks, peers)
  const status = deriveStatus(nodeCount, redundancy.min, coveragePercent)

  return {
    nodeCount,
    redundancyMin:          redundancy.min,
    redundancyAvg:          redundancy.avg,
    vulnerableChunkCount:   redundancy.vulnerable,
    criticalChunkCount:     redundancy.critical,
    coveragePercent,
    seedingRatio:           seedingRatio === Infinity ? 99 : seedingRatio,
    swarmSeedingRatio:      estimateSwarmSeedingRatio(peers),
    myContributionScore:    contributionScore,
    accountAgeDays,
    effectiveDemurrageRate,
    isViable:               nodeCount >= MIN_VIABLE_NETWORK_NODES,
    status,
    checkedAt:              Date.now(),
  }
}
