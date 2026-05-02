// IVS karma engine: tensor-coupled 4-vector updates + M sub-dimension aggregation.
// Axiom 1: KarmaVector is never reduced to a scalar — coupling tensor operates at
// compute time only; storage always writes { M, S, I, E } separately (see db.ts).

import { COMPENSATION_DECAY_DAYS } from './db'
import type { KarmaVector } from './db'

// ── Tunable constants (swarm baseline — communities and individuals can override) ──

export const SEEDLING_GRACE_DAYS = 14
export const SEEDER_RATIO_THRESHOLD = 1.0   // upload:download ratio below this = leecher
export const MAX_DEMURRAGE_MULTIPLIER = 3.0 // worst-case demurrage acceleration for leechers

// M sub-dimension weights (must sum to 1.0)
export const M_SUBDIMENSION_WEIGHTS = {
  storage_contributed:     0.25, // GB of chunks hosted for other peers
  replication_reliability: 0.20, // % uptime of hosted chunks when requested
  bandwidth_ratio:         0.20, // upload ÷ download ratio (capped at 2.0 for scoring)
  compensation_velocity:   0.15, // compensation circulation rate vs hoarding
  uptime_consistency:      0.10, // how consistently the node is reachable
  seed_diversity:          0.10, // breadth of content types hosted
} as const satisfies Record<string, number>

// ── Types ─────────────────────────────────────────────────────────────────────

export type MSubdimensions = {
  [K in keyof typeof M_SUBDIMENSION_WEIGHTS]: number // all values in [0, 1]
}

// Row-major 4×4 coupling tensor [M, S, I, E]
// Identity matrix = no cross-dimensional bleed (current default).
// Off-diagonal terms will be derived once S, I, E sub-dimensions are defined.
export type CouplingTensor = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
]

// ── Default coupling: identity (no bleed between dimensions yet) ──────────────

export const DEFAULT_COUPLING: CouplingTensor = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]

// ── M score computation ───────────────────────────────────────────────────────

/**
 * Aggregates the M sub-dimensions into a single M score [0, 1].
 * This scalar is only used as input to applyKarmaUpdate — it is never
 * stored as an aggregate of the full 4-vector. Axiom 1 preserved.
 */
export function computeMScore(subs: MSubdimensions): number {
  const w = M_SUBDIMENSION_WEIGHTS
  return (
    subs.storage_contributed     * w.storage_contributed +
    subs.replication_reliability * w.replication_reliability +
    subs.bandwidth_ratio         * w.bandwidth_ratio +
    subs.compensation_velocity   * w.compensation_velocity +
    subs.uptime_consistency      * w.uptime_consistency +
    subs.seed_diversity          * w.seed_diversity
  )
}

// ── Tensor karma update ───────────────────────────────────────────────────────

/**
 * Applies a karma delta through the coupling tensor.
 * next = current + C × delta
 * With identity coupling this is simply current + delta.
 * When coupling coefficients are non-zero, a change in one dimension
 * proportionally bleeds into others per the tensor definition.
 */
export function applyKarmaUpdate(
  current: KarmaVector,
  delta: KarmaVector,
  coupling: CouplingTensor = DEFAULT_COUPLING
): KarmaVector {
  const d = [delta.M, delta.S, delta.I, delta.E]
  const coupled = coupling.map((row) =>
    row.reduce((sum, coef, j) => sum + coef * d[j], 0)
  )
  return {
    M: current.M + coupled[0],
    S: current.S + coupled[1],
    I: current.I + coupled[2],
    E: current.E + coupled[3],
  }
}

// ── Demurrage modulation ──────────────────────────────────────────────────────

/**
 * Returns a multiplier [1.0, MAX_DEMURRAGE_MULTIPLIER] applied to the
 * base decay rate. Leechers (ratio < threshold) pay faster demurrage.
 * New accounts within SEEDLING_GRACE_DAYS always get 1.0 regardless.
 * IVS axiom 4: hoarding and leeching are structurally penalized.
 */
export function computeEffectiveDemurrageRate(
  accountAgeDays: number,
  seedingRatio: number
): number {
  if (accountAgeDays < SEEDLING_GRACE_DAYS) return 1.0
  if (seedingRatio >= SEEDER_RATIO_THRESHOLD) return 1.0
  // Linear interpolation: ratio 0 → MAX_MULTIPLIER, ratio threshold → 1.0
  const t = Math.max(0, seedingRatio / SEEDER_RATIO_THRESHOLD)
  return MAX_DEMURRAGE_MULTIPLIER - t * (MAX_DEMURRAGE_MULTIPLIER - 1.0)
}

/**
 * Returns the effective decay period in days for a given user,
 * accounting for their seeding behavior.
 */
export function computeEffectiveDecayDays(
  accountAgeDays: number,
  seedingRatio: number
): number {
  const multiplier = computeEffectiveDemurrageRate(accountAgeDays, seedingRatio)
  // Higher multiplier = faster decay = fewer effective days
  return COMPENSATION_DECAY_DAYS / multiplier
}

// ── Seeding ratio ─────────────────────────────────────────────────────────────

/**
 * Computes upload:download ratio from a set of network events.
 * Returns Infinity if no bytes were downloaded (pure seeder).
 * Returns 0 if no bytes were uploaded (pure leecher).
 */
export function computeSeedingRatio(events: { type: string; bytes: number }[]): number {
  let up = 0, down = 0
  for (const e of events) {
    if (e.type === 'chunk_sent') up += e.bytes
    if (e.type === 'chunk_received') down += e.bytes
  }
  if (down === 0) return up > 0 ? Infinity : 0
  return up / down
}
