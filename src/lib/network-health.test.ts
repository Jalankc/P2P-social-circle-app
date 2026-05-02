import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import {
  computeRedundancy,
  computeCoveragePercent,
  computeCommonsHealth,
  MIN_VIABLE_NETWORK_NODES,
  VULNERABLE_REDUNDANCY,
  CRITICAL_REDUNDANCY,
} from './network-health'
import { openDB, saveChunk, upsertPeer } from './db'
import type { Chunk, Peer } from './db'

function makeChunk(id: string, replicationCount: number): Chunk {
  return { chunkId: id, data: new Uint8Array([1]), replicationCount, createdAt: 1, updatedAt: 1 }
}

function makePeer(id: string, lastSeenMsAgo = 60_000): Peer {
  return {
    peerId: id, did: `did:${id}`, credibility: 0.8,
    lastSeen: Date.now() - lastSeenMsAgo,
    createdAt: 1, updatedAt: 1,
  }
}

describe('computeRedundancy', () => {
  it('returns zeros for empty chunk list', () => {
    const r = computeRedundancy([])
    expect(r).toEqual({ min: 0, avg: 0, vulnerable: 0, critical: 0 })
  })

  it('detects critical (single-copy) chunks', () => {
    const chunks = [makeChunk('a', 1), makeChunk('b', 3)]
    const r = computeRedundancy(chunks)
    expect(r.min).toBe(1)
    expect(r.critical).toBe(1)
  })

  it('detects vulnerable (below threshold) chunks', () => {
    const chunks = [makeChunk('a', VULNERABLE_REDUNDANCY - 1), makeChunk('b', 5)]
    const r = computeRedundancy(chunks)
    expect(r.vulnerable).toBe(1)
  })

  it('calculates correct average', () => {
    const chunks = [makeChunk('a', 2), makeChunk('b', 4)]
    expect(computeRedundancy(chunks).avg).toBe(3)
  })

  it('zero vulnerable when all above threshold', () => {
    const chunks = [makeChunk('a', VULNERABLE_REDUNDANCY), makeChunk('b', 5)]
    expect(computeRedundancy(chunks).vulnerable).toBe(0)
  })
})

describe('computeCoveragePercent', () => {
  it('returns 100 for empty chunk list', () => {
    expect(computeCoveragePercent([], [])).toBe(100)
  })

  it('returns 0 when all peers are offline', () => {
    const chunks = [makeChunk('a', 1)]
    const offlinePeer = makePeer('p1', 10 * 60 * 1000) // 10 min ago
    expect(computeCoveragePercent(chunks, [offlinePeer])).toBe(0)
  })

  it('returns 100 when peer is online and chunks are replicated', () => {
    const chunks = [makeChunk('a', 1), makeChunk('b', 2)]
    const onlinePeer = makePeer('p1', 1_000) // 1 second ago
    expect(computeCoveragePercent(chunks, [onlinePeer])).toBe(100)
  })
})

describe('computeCommonsHealth', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(new IDBFactory())
  })

  it('returns critical status with no peers (1 node = self only)', async () => {
    const health = await computeCommonsHealth(db)
    expect(health.status).toBe('critical')
    expect(health.isViable).toBe(false)
    expect(health.nodeCount).toBe(1)
  })

  it(`returns isViable = false below ${MIN_VIABLE_NETWORK_NODES} nodes`, async () => {
    // Add 1 peer — total = 2 nodes (still not viable)
    await upsertPeer(db, makePeer('p1'))
    const health = await computeCommonsHealth(db)
    expect(health.isViable).toBe(false)
    expect(health.nodeCount).toBe(2)
  })

  it(`returns isViable = true at ${MIN_VIABLE_NETWORK_NODES}+ nodes`, async () => {
    for (let i = 0; i < MIN_VIABLE_NETWORK_NODES - 1; i++) {
      await upsertPeer(db, makePeer(`p${i}`))
    }
    const health = await computeCommonsHealth(db)
    expect(health.isViable).toBe(true)
    expect(health.nodeCount).toBe(MIN_VIABLE_NETWORK_NODES)
  })

  it('exposes redundancyMin = 0 when no chunks exist', async () => {
    const health = await computeCommonsHealth(db)
    expect(health.redundancyMin).toBe(0)
  })

  it('detects critical chunk in redundancyMin', async () => {
    await saveChunk(db, makeChunk('c1', CRITICAL_REDUNDANCY))
    await saveChunk(db, makeChunk('c2', 5))
    const health = await computeCommonsHealth(db)
    expect(health.redundancyMin).toBe(CRITICAL_REDUNDANCY)
    expect(health.criticalChunkCount).toBe(1)
  })

  it('checkedAt is a recent timestamp', async () => {
    const before = Date.now()
    const health = await computeCommonsHealth(db)
    expect(health.checkedAt).toBeGreaterThanOrEqual(before)
    expect(health.checkedAt).toBeLessThanOrEqual(Date.now())
  })
})
