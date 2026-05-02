import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Leaf, Users, Shield, Activity, AlertTriangle,
  Wifi, WifiOff, UserPlus, RefreshCw,
} from 'lucide-react'
import { computeCommonsHealth } from '../lib/network-health'
import { openDB } from '../lib/db'
import { SEEDLING_GRACE_DAYS, MAX_DEMURRAGE_MULTIPLIER } from '../lib/karma-engine'
import { MIN_REDUNDANCY_TARGET, MIN_VIABLE_NETWORK_NODES } from '../lib/network-health'
import type { CommonsHealthSnapshot } from '../lib/network-health'

/* ── helpers ── */

function statusColor(s: CommonsHealthSnapshot['status']) {
  if (s === 'healthy')  return 'var(--sp-sapling)'
  if (s === 'degraded') return 'var(--sp-amber)'
  return 'var(--danger)'
}

function fmt(n: number, d = 1) { return n >= 99 || n === Infinity ? '∞' : n.toFixed(d) }

function redundancyColor(r: number) {
  if (r <= 1) return 'var(--danger)'
  if (r < MIN_REDUNDANCY_TARGET) return 'var(--sp-amber)'
  return 'var(--sp-sapling)'
}

/* ── Node map (canvas) ── */

function NodeMap({ nodeCount, status }: { nodeCount: number; status: CommonsHealthSnapshot['status'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    ctx.clearRect(0, 0, W, H)

    const center = { x: cx, y: cy }
    const peers = Array.from({ length: Math.min(nodeCount - 1, 20) }, (_, i) => {
      const angle = (i / Math.min(nodeCount - 1, 20)) * Math.PI * 2 - Math.PI / 2
      const r = 80
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
    })

    // Draw edges
    ctx.strokeStyle = 'rgba(45,106,79,0.3)'
    ctx.lineWidth = 1
    for (const p of peers) {
      ctx.beginPath()
      ctx.moveTo(center.x, center.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }

    // Draw peer nodes
    for (const p of peers) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'var(--sp-fern)' in document.documentElement.style
        ? '#40916c'
        : '#40916c'
      ctx.fill()
    }

    // Draw self (center, larger, colored by status)
    const selfColor = status === 'healthy' ? '#52b788' : status === 'degraded' ? '#d4a017' : '#e11d48'
    ctx.beginPath()
    ctx.arc(center.x, center.y, 10, 0, Math.PI * 2)
    ctx.fillStyle = selfColor
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [nodeCount, status])

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={200}
      className="mx-auto block"
      style={{ opacity: 0.9 }}
    />
  )
}

/* ── Stat card ── */

function StatCard({
  label, value, sub, color, icon: Icon,
}: {
  label: string
  value: string
  sub?: string
  color?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div
      className="flex flex-col gap-1 p-3"
      style={{ border: '1px solid rgba(82,183,136,0.15)', background: 'rgba(27,67,50,0.3)' }}
    >
      <div className="flex items-center gap-1.5">
        {Icon && <span style={{ color: 'var(--sp-parchment)', opacity: 0.6 }}><Icon className="h-3 w-3" /></span>}
        <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--sp-parchment)', opacity: 0.6 }}>
          {label}
        </span>
      </div>
      <span className="font-mono text-xl" style={{ color: color ?? 'var(--sp-cream)' }}>
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[9px]" style={{ color: 'var(--sp-parchment)', opacity: 0.5 }}>
          {sub}
        </span>
      )}
    </div>
  )
}

/* ── Main page ── */

export default function Commons() {
  const [snapshot, setSnapshot] = useState<CommonsHealthSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load(showSpinner = false) {
    if (showSpinner) setRefreshing(true)
    try {
      const db = await openDB()
      setSnapshot(await computeCommonsHealth(db))
    } catch {
      // no-op — transport not live yet
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const grace = snapshot
    ? Math.max(0, SEEDLING_GRACE_DAYS - snapshot.accountAgeDays)
    : null

  return (
    <div className="min-h-[calc(100dvh-64px)] px-4 py-8 md:px-6 md:py-12" style={{ background: 'var(--sp-canopy)' }}>
      <div className="mx-auto max-w-[1000px] flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="h-4 w-4 text-sp-fern" />
              <span className="font-retro text-sm text-sp-parchment uppercase tracking-widest">
                Digital Commons
              </span>
            </div>
            <h1 className="font-grotesk text-2xl text-sp-cream">Network Health</h1>
            {snapshot && (
              <p className="font-mono text-[10px] mt-1" style={{ color: 'var(--sp-parchment)', opacity: 0.5 }}>
                Last checked {new Date(snapshot.checkedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors hover:text-sp-sapling"
            style={{ border: '1px solid rgba(82,183,136,0.3)', color: 'var(--sp-parchment)' }}
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="font-mono text-[10px] text-sp-parchment opacity-50 text-center py-12">
            Reading commons state…
          </div>
        )}

        {!loading && snapshot && (
          <>
            {/* Status banner */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                border: `1px solid ${statusColor(snapshot.status)}`,
                background: `${statusColor(snapshot.status)}11`,
              }}
            >
              {snapshot.status === 'healthy'
                ? <Wifi className="h-4 w-4 flex-shrink-0" style={{ color: statusColor(snapshot.status) }} />
                : <WifiOff className="h-4 w-4 flex-shrink-0" style={{ color: statusColor(snapshot.status) }} />
              }
              <span className="font-mono text-xs" style={{ color: statusColor(snapshot.status) }}>
                {snapshot.status === 'healthy' && 'Commons is healthy — all systems nominal.'}
                {snapshot.status === 'degraded' && 'Commons is degraded — some content has reduced redundancy.'}
                {snapshot.status === 'critical' && 'Commons is critical — network is too small to be resilient.'}
              </span>
            </motion.div>

            {/* Not viable warning + invite CTA */}
            {!snapshot.isViable && (
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4"
                style={{ border: '1px solid var(--sp-amber)', background: 'rgba(212,160,23,0.08)' }}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--sp-amber)' }} />
                <div className="flex-1">
                  <p className="font-mono text-xs" style={{ color: 'var(--sp-amber)' }}>
                    Your commons has {snapshot.nodeCount} node{snapshot.nodeCount !== 1 ? 's' : ''} — minimum viable is {MIN_VIABLE_NETWORK_NODES}.
                    Content has no meaningful redundancy. Invite people to strengthen it.
                  </p>
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider flex-shrink-0"
                  style={{ border: '1px solid var(--sp-amber)', color: 'var(--sp-amber)', background: 'rgba(212,160,23,0.1)' }}
                >
                  <UserPlus className="h-3 w-3" />
                  Invite a seedling
                </button>
              </div>
            )}

            {/* Grid: network stats */}
            <section>
              <h2 className="font-retro text-xs uppercase tracking-widest text-sp-parchment mb-3 opacity-60">
                Swarm Health
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <StatCard
                  label="Nodes"
                  value={String(snapshot.nodeCount)}
                  sub={snapshot.isViable ? 'viable network' : `need ${MIN_VIABLE_NETWORK_NODES - snapshot.nodeCount} more`}
                  color={snapshot.isViable ? 'var(--sp-sapling)' : 'var(--sp-amber)'}
                  icon={Users}
                />
                <StatCard
                  label="Min redundancy"
                  value={`${snapshot.redundancyMin}×`}
                  sub={`target ${MIN_REDUNDANCY_TARGET}×`}
                  color={redundancyColor(snapshot.redundancyMin)}
                  icon={Shield}
                />
                <StatCard
                  label="Coverage"
                  value={`${snapshot.coveragePercent}%`}
                  sub="content reachable"
                  color={snapshot.coveragePercent < 50 ? 'var(--danger)' : snapshot.coveragePercent < 80 ? 'var(--sp-amber)' : 'var(--sp-sapling)'}
                  icon={Activity}
                />
                <StatCard
                  label="Vulnerable chunks"
                  value={String(snapshot.vulnerableChunkCount)}
                  sub={snapshot.criticalChunkCount > 0 ? `${snapshot.criticalChunkCount} critical` : 'below 2× copies'}
                  color={snapshot.criticalChunkCount > 0 ? 'var(--danger)' : snapshot.vulnerableChunkCount > 0 ? 'var(--sp-amber)' : 'var(--sp-sapling)'}
                  icon={AlertTriangle}
                />
              </div>
            </section>

            {/* Node map */}
            <section className="grid sm:grid-cols-2 gap-4">
              <div style={{ border: '1px solid rgba(82,183,136,0.15)', background: 'rgba(27,67,50,0.3)' }} className="p-4">
                <h2 className="font-retro text-xs uppercase tracking-widest text-sp-parchment mb-3 opacity-60">
                  Node Map
                </h2>
                <NodeMap nodeCount={snapshot.nodeCount} status={snapshot.status} />
                <p className="font-mono text-[9px] text-center mt-2 opacity-40" style={{ color: 'var(--sp-parchment)' }}>
                  You (center) · {snapshot.nodeCount - 1} peer{snapshot.nodeCount - 1 !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Your node */}
              <div style={{ border: '1px solid rgba(82,183,136,0.15)', background: 'rgba(27,67,50,0.3)' }} className="p-4">
                <h2 className="font-retro text-xs uppercase tracking-widest text-sp-parchment mb-3 opacity-60">
                  Your Node
                </h2>
                <div className="flex flex-col gap-3">
                  <Row label="Seeding ratio" value={`${fmt(snapshot.seedingRatio)}:1`} color={snapshot.seedingRatio < 1 ? 'var(--sp-amber)' : 'var(--sp-sapling)'} />
                  <Row label="Contribution (M score)" value={`${Math.round(snapshot.myContributionScore * 100)}%`} />
                  <Row
                    label="Demurrage rate"
                    value={`${fmt(snapshot.effectiveDemurrageRate)}× ${snapshot.effectiveDemurrageRate > 1 ? '(accelerated)' : '(normal)'}`}
                    color={snapshot.effectiveDemurrageRate > 1 ? 'var(--sp-amber)' : 'var(--sp-sapling)'}
                  />
                  {grace !== null && grace > 0 && (
                    <Row
                      label="Seedling grace"
                      value={`${Math.ceil(grace)} days remaining`}
                      color="var(--sp-fern)"
                    />
                  )}
                  <Row label="Account age" value={`${Math.floor(snapshot.accountAgeDays)} days`} />
                </div>

                {snapshot.effectiveDemurrageRate > 1 && (
                  <div
                    className="mt-3 px-2 py-1.5 font-mono text-[9px]"
                    style={{ border: '1px solid var(--sp-amber)', color: 'var(--sp-amber)', background: 'rgba(212,160,23,0.08)' }}
                  >
                    Dimensional imbalance detected — contribute more to reduce demurrage acceleration.
                    &nbsp;<Link to="/settings" className="underline hover:no-underline">Settings</Link>
                  </div>
                )}

                {snapshot.effectiveDemurrageRate >= MAX_DEMURRAGE_MULTIPLIER * 0.9 && (
                  <div
                    className="mt-2 px-2 py-1.5 font-mono text-[9px]"
                    style={{ border: '1px solid var(--danger)', color: 'var(--danger)', background: 'rgba(225,29,72,0.08)' }}
                  >
                    Bandwidth priority degraded — chunk requests from your node are deprioritised by peers.
                  </div>
                )}
              </div>
            </section>

            {/* Mobile & data controls hint */}
            <div
              className="flex items-start gap-3 px-4 py-3"
              style={{ border: '1px solid rgba(82,183,136,0.15)', background: 'rgba(27,67,50,0.2)' }}
            >
              <span className="font-mono text-[9px] uppercase tracking-wider flex-shrink-0 mt-0.5" style={{ color: 'var(--sp-fern)' }}>
                Tip
              </span>
              <p className="font-mono text-[9px]" style={{ color: 'var(--sp-parchment)', opacity: 0.7 }}>
                Configure seeding limits — WiFi only, charge-only, or a daily data cap — in{' '}
                <Link to="/settings" className="text-sp-fern hover:text-sp-sapling transition-colors underline">
                  Settings › Network
                </Link>
                .
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--sp-parchment)', opacity: 0.5 }}>
        {label}
      </span>
      <span className="font-mono text-[10px]" style={{ color: color ?? 'var(--sp-cream)' }}>
        {value}
      </span>
    </div>
  )
}
