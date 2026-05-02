import { describe, it, expect } from 'vitest'
import {
  computeMScore,
  applyKarmaUpdate,
  computeEffectiveDemurrageRate,
  computeEffectiveDecayDays,
  computeSeedingRatio,
  DEFAULT_COUPLING,
  SEEDLING_GRACE_DAYS,
  MAX_DEMURRAGE_MULTIPLIER,
  SEEDER_RATIO_THRESHOLD,
  M_SUBDIMENSION_WEIGHTS,
  type MSubdimensions,
  type CouplingTensor,
} from './karma-engine'
import { COMPENSATION_DECAY_DAYS } from './db'

const fullSubs: MSubdimensions = {
  storage_contributed:     1,
  replication_reliability: 1,
  bandwidth_ratio:         1,
  compensation_velocity:   1,
  uptime_consistency:      1,
  seed_diversity:          1,
}

const zeroSubs: MSubdimensions = {
  storage_contributed:     0,
  replication_reliability: 0,
  bandwidth_ratio:         0,
  compensation_velocity:   0,
  uptime_consistency:      0,
  seed_diversity:          0,
}

describe('M_SUBDIMENSION_WEIGHTS', () => {
  it('sums to exactly 1.0', () => {
    const total = Object.values(M_SUBDIMENSION_WEIGHTS).reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(1.0, 10)
  })
})

describe('computeMScore', () => {
  it('returns 1.0 for all-max inputs', () => {
    expect(computeMScore(fullSubs)).toBeCloseTo(1.0)
  })

  it('returns 0.0 for all-zero inputs', () => {
    expect(computeMScore(zeroSubs)).toBe(0)
  })

  it('partial inputs produce intermediate score', () => {
    const half: MSubdimensions = {
      storage_contributed:     0.5,
      replication_reliability: 0.5,
      bandwidth_ratio:         0.5,
      compensation_velocity:   0.5,
      uptime_consistency:      0.5,
      seed_diversity:          0.5,
    }
    expect(computeMScore(half)).toBeCloseTo(0.5)
  })
})

describe('applyKarmaUpdate', () => {
  it('with identity coupling equals simple addition', () => {
    const current = { M: 1, S: 2, I: 3, E: 4 }
    const delta = { M: 0.5, S: 0.1, I: 0.2, E: 0.3 }
    const result = applyKarmaUpdate(current, delta, DEFAULT_COUPLING)
    expect(result).toEqual({ M: 1.5, S: 2.1, I: 3.2, E: 4.3 })
  })

  it('never produces a scalar aggregate — result always has all 4 dimensions', () => {
    const result = applyKarmaUpdate({ M: 1, S: 1, I: 1, E: 1 }, { M: 1, S: 0, I: 0, E: 0 })
    expect(result).toHaveProperty('M')
    expect(result).toHaveProperty('S')
    expect(result).toHaveProperty('I')
    expect(result).toHaveProperty('E')
    expect(Object.keys(result)).toHaveLength(4)
  })

  it('with non-identity coupling bleeds delta across dimensions', () => {
    const coupling: CouplingTensor = [
      [1, 0.5, 0, 0],
      [0, 1,   0, 0],
      [0, 0,   1, 0],
      [0, 0,   0, 1],
    ]
    // delta.S = 1 should also add 0.5 to M via coupling[0][1]
    const result = applyKarmaUpdate({ M: 0, S: 0, I: 0, E: 0 }, { M: 0, S: 1, I: 0, E: 0 }, coupling)
    expect(result.M).toBeCloseTo(0.5)
    expect(result.S).toBeCloseTo(1.0)
    expect(result.I).toBeCloseTo(0.0)
    expect(result.E).toBeCloseTo(0.0)
  })
})

describe('computeEffectiveDemurrageRate', () => {
  it('returns 1.0 during seedling grace period regardless of seeding ratio', () => {
    expect(computeEffectiveDemurrageRate(0, 0)).toBe(1.0)
    expect(computeEffectiveDemurrageRate(SEEDLING_GRACE_DAYS - 1, 0)).toBe(1.0)
  })

  it('returns 1.0 for a healthy seeder', () => {
    expect(computeEffectiveDemurrageRate(SEEDLING_GRACE_DAYS + 1, SEEDER_RATIO_THRESHOLD)).toBe(1.0)
    expect(computeEffectiveDemurrageRate(30, 5.0)).toBe(1.0)
  })

  it('returns MAX_DEMURRAGE_MULTIPLIER for a pure leecher (ratio = 0)', () => {
    expect(computeEffectiveDemurrageRate(30, 0)).toBe(MAX_DEMURRAGE_MULTIPLIER)
  })

  it('interpolates between 1.0 and MAX for partial leechers', () => {
    const rate = computeEffectiveDemurrageRate(30, SEEDER_RATIO_THRESHOLD / 2)
    expect(rate).toBeGreaterThan(1.0)
    expect(rate).toBeLessThan(MAX_DEMURRAGE_MULTIPLIER)
  })
})

describe('computeEffectiveDecayDays', () => {
  it('equals COMPENSATION_DECAY_DAYS for a healthy seeder', () => {
    expect(computeEffectiveDecayDays(30, SEEDER_RATIO_THRESHOLD)).toBeCloseTo(COMPENSATION_DECAY_DAYS)
  })

  it('is less than COMPENSATION_DECAY_DAYS for a leecher', () => {
    const days = computeEffectiveDecayDays(30, 0)
    expect(days).toBeLessThan(COMPENSATION_DECAY_DAYS)
    expect(days).toBeCloseTo(COMPENSATION_DECAY_DAYS / MAX_DEMURRAGE_MULTIPLIER)
  })
})

describe('computeSeedingRatio', () => {
  it('returns 0 for no events', () => {
    expect(computeSeedingRatio([])).toBe(0)
  })

  it('returns Infinity for pure seeder', () => {
    expect(computeSeedingRatio([{ type: 'chunk_sent', bytes: 100 }])).toBe(Infinity)
  })

  it('returns 0 for pure leecher', () => {
    expect(computeSeedingRatio([{ type: 'chunk_received', bytes: 100 }])).toBe(0)
  })

  it('calculates correct ratio for mixed activity', () => {
    const events = [
      { type: 'chunk_sent',     bytes: 200 },
      { type: 'chunk_sent',     bytes: 100 },
      { type: 'chunk_received', bytes: 150 },
    ]
    expect(computeSeedingRatio(events)).toBeCloseTo(300 / 150)
  })

  it('ignores non-bandwidth event types', () => {
    const events = [
      { type: 'chunk_stored',   bytes: 1000 },
      { type: 'chunk_dropped',  bytes: 500 },
      { type: 'chunk_sent',     bytes: 100 },
      { type: 'chunk_received', bytes: 50 },
    ]
    expect(computeSeedingRatio(events)).toBeCloseTo(2.0)
  })
})
