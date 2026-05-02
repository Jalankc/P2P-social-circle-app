import { useState, useEffect, useRef, memo } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, ShieldCheck, WifiOff } from 'lucide-react'

interface FriendNode {
  id: string
  name: string
  x: number
  y: number
  chunks: number
  health: 'good' | 'stale' | 'offline'
  lastSync: string
}

const friendNodes: FriendNode[] = [
  { id: '1', name: 'Alex Root', x: 80, y: 30, chunks: 4, health: 'good', lastSync: '2m ago' },
  { id: '2', name: 'Moss Chen', x: 70, y: 70, chunks: 5, health: 'good', lastSync: '5m ago' },
  { id: '3', name: 'Sage Park', x: 30, y: 80, chunks: 3, health: 'stale', lastSync: '2d ago' },
  { id: '4', name: 'Fern Diaz', x: 20, y: 40, chunks: 4, health: 'good', lastSync: '12m ago' },
  { id: '5', name: 'Ivy Loam', x: 50, y: 15, chunks: 6, health: 'offline', lastSync: '8d ago' },
  { id: '6', name: 'Reed Oak', x: 85, y: 55, chunks: 3, health: 'good', lastSync: '1h ago' },
]

const healthColor = {
  good: '#22c55e',
  stale: '#f59e0b',
  offline: '#e11d48',
}

const ChunksBackupPanel = memo(function ChunksBackupPanel() {
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [storageShared, setStorageShared] = useState(2)
  const [autoBalance, setAutoBalance] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const storageOptions = ['100MB', '500MB', '1GB', '5GB', 'Unlimited']

  const startBackup = () => {
    setIsBackingUp(true)
    setBackupProgress(0)
  }

  useEffect(() => {
    if (!isBackingUp) return
    const interval = setInterval(() => {
      setBackupProgress((p) => {
        if (p >= 100) {
          setIsBackingUp(false)
          return 100
        }
        return p + 4
      })
    }, 120)
    return () => clearInterval(interval)
  }, [isBackingUp])

  const handleReseed = () => {
    setSeeding(true)
    setTimeout(() => setSeeding(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream">Your Chunks</h2>
        <p className="mt-1 text-[15px] text-sp-parchment">
          Your data lives in pieces across your network. See where you&apos;re stored.
        </p>
      </div>

      {/* Chunk network visualization */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden" style={{ background: 'rgba(45, 106, 79, 0.1)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <svg ref={svgRef} viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {/* Connection lines */}
            {friendNodes.map((node) => (
              <line
                key={node.id}
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={healthColor[node.health]}
                strokeOpacity={0.4}
                strokeWidth={0.5}
              />
            ))}
            {/* Seeding animation lines */}
            {seeding && friendNodes.map((node) => (
              <motion.circle
                key={`seed-${node.id}`}
                r={1.2}
                fill="var(--sp-honey)"
                initial={{ cx: 50, cy: 50, opacity: 1 }}
                animate={{ cx: node.x, cy: node.y, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: Math.random() * 0.3 }}
              />
            ))}
            {/* Friend nodes */}
            {friendNodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={4}
                  fill={healthColor[node.health]}
                  opacity={0.25}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={2}
                  fill={healthColor[node.health]}
                />
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill="var(--sp-cream)"
                  fontFamily="Inter, sans-serif"
                >
                  {node.name}
                </text>
              </g>
            ))}
            {/* Center node (you) */}
            <g>
              <circle cx="50" cy="50" r={6} fill="var(--sp-amber)" opacity={0.3} />
              <circle cx="50" cy="50" r={3} fill="var(--sp-honey)" />
              <text x="50" y="58" textAnchor="middle" fontSize="2.5" fill="var(--sp-cream)" fontFamily="Inter, sans-serif">You</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center gap-4 text-center">
        <div>
          <p className="font-display text-xl font-bold text-sp-cream">47</p>
          <p className="text-xs text-sp-parchment">Total chunks</p>
        </div>
        <div className="w-px bg-sp-fern/20" />
        <div>
          <p className="font-display text-xl font-bold text-sp-cream">3×</p>
          <p className="text-xs text-sp-parchment">Backup redundancy</p>
        </div>
        <div className="w-px bg-sp-fern/20" />
        <div>
          <p className="font-display text-xl font-bold text-sp-cream">2m ago</p>
          <p className="text-xs text-sp-parchment">Last sync</p>
        </div>
      </div>

      {/* Backup actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={startBackup}
          disabled={isBackingUp}
          className="flex items-center gap-2 rounded-full bg-sp-amber px-5 py-2.5 text-sm font-semibold text-sp-bark shadow-cta transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {isBackingUp ? `Backing up... ${Math.floor(backupProgress * 47 / 100)}/47` : 'Create Local Backup'}
        </button>
        <button
          onClick={handleReseed}
          className="flex items-center gap-2 rounded-full border border-sp-fern px-5 py-2.5 text-sm font-medium text-sp-fern transition-colors hover:bg-sp-fern/10"
        >
          <RefreshCw className={`h-4 w-4 ${seeding ? 'animate-spin' : ''}`} />
          Distribute Now
        </button>
        <button className="flex items-center gap-2 rounded-full border border-sp-fern px-5 py-2.5 text-sm font-medium text-sp-fern transition-colors hover:bg-sp-fern/10">
          <ShieldCheck className="h-4 w-4" />
          Verify Integrity
        </button>
      </div>

      {/* Progress bar */}
      {isBackingUp && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <div className="h-2 rounded-full bg-sp-moss/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-sp-honey"
              initial={{ width: '0%' }}
              animate={{ width: `${backupProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}

      {/* Friend storage health */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Friend Storage Health</p>
        <div className="space-y-2">
          {friendNodes.map((node) => (
            <div key={node.id} className="flex items-center justify-between rounded-md bg-sp-canopy/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 overflow-hidden rounded-full border border-sp-fern/20">
                  <img src="/avatar-default.jpg" alt="" className="h-full w-full object-cover" />
                </div>
                <span className="text-sm text-sp-cream">{node.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-sp-parchment">{node.chunks} chunks</span>
                <span className="text-xs text-sp-parchment">{node.lastSync}</span>
                <span className="h-2 w-2 rounded-full" style={{ background: healthColor[node.health] }} />
                {node.health === 'stale' && (
                  <button className="text-xs text-sp-fern hover:underline">Re-sync</button>
                )}
                {node.health === 'offline' && (
                  <button className="text-xs text-[#e11d48] hover:underline flex items-center gap-1">
                    <WifiOff className="h-3 w-3" /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage settings */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Storage Settings</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-sp-parchment">Storage to share for friends&apos; chunks</label>
            <div className="flex gap-2 mt-2">
              {storageOptions.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => setStorageShared(i)}
                  className={
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors ' +
                    (storageShared === i ? 'bg-sp-fern text-sp-cream' : 'bg-sp-canopy/60 text-sp-parchment hover:bg-sp-moss/30')
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-sp-parchment">Current usage</span>
              <span className="text-sp-fern">2.3GB for 8 friends</span>
            </div>
            <div className="h-2 rounded-full bg-sp-moss/30 overflow-hidden">
              <div className="h-full w-[46%] rounded-full bg-sp-fern" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              onClick={() => setAutoBalance(!autoBalance)}
              className={`relative h-5 w-9 rounded-full transition-colors ${autoBalance ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${autoBalance ? 'translate-x-4' : ''}`} />
            </button>
            <span className="text-sm text-sp-cream">Auto-balance chunk distribution</span>
          </label>
        </div>
      </div>
    </div>
  )
})

export default ChunksBackupPanel
