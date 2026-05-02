import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { computeCommonsHealth } from '../lib/network-health'
import { openDB } from '../lib/db'
import type { CommonsHealthSnapshot } from '../lib/network-health'

const POLL_INTERVAL_MS = 30_000

function statusColor(status: CommonsHealthSnapshot['status']): string {
  if (status === 'healthy')  return 'var(--sp-sapling)'
  if (status === 'degraded') return 'var(--sp-amber)'
  return 'var(--danger)'
}

function statusLabel(status: CommonsHealthSnapshot['status']): string {
  if (status === 'healthy')  return 'Commons healthy'
  if (status === 'degraded') return 'Commons degraded'
  return 'Commons critical'
}

function fmt(n: number, decimals = 1): string {
  return n === Infinity ? '∞' : n.toFixed(decimals)
}

export default function CommonsHealthBar({ visible }: { visible: boolean }) {
  const [snapshot, setSnapshot] = useState<CommonsHealthSnapshot | null>(null)
  const [expanded, setExpanded] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const db = await openDB()
      setSnapshot(await computeCommonsHealth(db))
    } catch {
      // transport layer not yet live — silently skip
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    refresh()
    const id = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [visible, refresh])

  if (!visible || !snapshot) return null

  const color = statusColor(snapshot.status)
  const seedRatioDisplay = snapshot.seedingRatio >= 99 ? '∞' : fmt(snapshot.seedingRatio)

  return (
    <div style={{ borderBottom: `1px solid rgba(82,183,136,0.15)` }}>
      {/* ── Collapsed strip ── */}
      <button
        onClick={() => setExpanded((x) => !x)}
        className="w-full flex items-center justify-between px-3 transition-colors"
        style={{
          height: '20px',
          background: 'rgba(15,41,30,0.9)',
          cursor: 'pointer',
        }}
        aria-label={expanded ? 'Collapse commons health' : 'Expand commons health'}
      >
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <span
            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
            style={{ background: color }}
          />
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color }}>
            {statusLabel(snapshot.status)}
          </span>
          {!snapshot.isViable && (
            <span className="font-mono text-[9px]" style={{ color: 'var(--sp-amber)' }}>
              · Invite peers to strengthen the commons
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block font-mono text-[9px]" style={{ color: 'var(--sp-parchment)' }}>
            {snapshot.nodeCount} node{snapshot.nodeCount !== 1 ? 's' : ''}
            &nbsp;·&nbsp;
            {snapshot.redundancyMin}× min redundancy
            &nbsp;·&nbsp;
            seed {seedRatioDisplay}:1
          </span>
          {expanded
            ? <ChevronUp className="h-3 w-3" style={{ color: 'var(--sp-parchment)' }} />
            : <ChevronDown className="h-3 w-3" style={{ color: 'var(--sp-parchment)' }} />
          }
        </div>
      </button>

      {/* ── Expanded panel ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', background: 'rgba(15,41,30,0.95)' }}
          >
            <div className="px-3 py-2 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
              <Stat label="Nodes" value={String(snapshot.nodeCount)} color={snapshot.isViable ? 'var(--sp-sapling)' : 'var(--sp-amber)'} />
              <Stat label="Min redundancy" value={`${snapshot.redundancyMin}×`} color={snapshot.redundancyMin < 2 ? 'var(--danger)' : snapshot.redundancyMin < 3 ? 'var(--sp-amber)' : 'var(--sp-sapling)'} />
              <Stat label="Coverage" value={`${snapshot.coveragePercent}%`} color={snapshot.coveragePercent < 50 ? 'var(--danger)' : 'var(--sp-sapling)'} />
              <Stat label="Seeding ratio" value={`${seedRatioDisplay}:1`} color={snapshot.seedingRatio < 1 ? 'var(--sp-amber)' : 'var(--sp-sapling)'} />
              <Stat label="Vulnerable chunks" value={String(snapshot.vulnerableChunkCount)} color={snapshot.vulnerableChunkCount > 0 ? 'var(--sp-amber)' : 'var(--sp-sapling)'} />
              <Stat label="Contribution score" value={`${Math.round(snapshot.myContributionScore * 100)}%`} color="var(--sp-parchment)" />
              <Stat label="Demurrage rate" value={`${fmt(snapshot.effectiveDemurrageRate)}×`} color={snapshot.effectiveDemurrageRate > 1 ? 'var(--sp-amber)' : 'var(--sp-sapling)'} />
              <div className="flex items-end">
                <Link
                  to="/commons"
                  onClick={() => setExpanded(false)}
                  className="font-mono text-[9px] uppercase tracking-wider transition-colors hover:text-sp-sapling"
                  style={{ color: 'var(--sp-fern)' }}
                >
                  Full dashboard →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-0">
      <span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: 'var(--sp-parchment)', opacity: 0.6 }}>
        {label}
      </span>
      <span className="font-mono text-[10px]" style={{ color }}>
        {value}
      </span>
    </div>
  )
}
