import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Wifi, Radio, Download, Upload, Settings2, Plus, Trash2 } from 'lucide-react'

const initialBootstraps = [
  'bootstrap.socialcircle.p2p',
  'seed1.p2pnetwork.io',
  'lighthouse.local.mesh',
]

const bandwidthMarks = [0.5, 1, 2, 5, 10, 50, 100, 'Unlimited']

const NetworkP2PPanel = memo(function NetworkP2PPanel() {
  const [connected, setConnected] = useState(true)
  const [peerCount] = useState(8)
  const [mode, setMode] = useState<'full' | 'lighthouse' | 'offline'>('full')
  const [bootstraps, setBootstraps] = useState(initialBootstraps)
  const [newBootstrap, setNewBootstrap] = useState('')
  const [lighthouseEnabled, setLighthouseEnabled] = useState(true)
  const [radius, setRadius] = useState(250)
  const [autoLink, setAutoLink] = useState(false)
  const [showOnMap, setShowOnMap] = useState(false)
  const [uploadLimit, setUploadLimit] = useState(5)
  const [downloadLimit, setDownloadLimit] = useState(10)

  const radiusOptions = [50, 100, 250, 500, 1000]

  const addBootstrap = () => {
    if (!newBootstrap.trim()) return
    setBootstraps(prev => [...prev, newBootstrap.trim()])
    setNewBootstrap('')
  }

  const removeBootstrap = (idx: number) => {
    setBootstraps(prev => prev.filter((_, i) => i !== idx))
  }

  // Simple sparkline data
  const sparkData = [12, 18, 15, 22, 28, 35, 30, 25, 38, 42, 36, 30, 28, 32, 40, 45, 38, 30, 25, 20, 18, 22, 28, 35]
  const maxSpark = Math.max(...sparkData)
  const sparkPoints = sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 100},${100 - (v / maxSpark) * 100}`).join(' ')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream">Network & P2P</h2>
      </div>

      {/* Connection status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg p-5"
        style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Wifi className={`h-6 w-6 ${connected ? 'text-sp-fern' : 'text-sp-parchment'}`} />
            {connected && (
              <>
                <span className="absolute -inset-1 rounded-full border border-sp-fern/30 animate-pulse-ring" />
                <span className="absolute -inset-2 rounded-full border border-sp-fern/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </div>
          <div>
            <p className="font-display text-lg font-medium text-sp-cream">
              {connected ? 'Connected to the mesh' : 'Offline mode'}
            </p>
            <p className="text-xs text-sp-parchment">
              {connected ? `${peerCount} peers · 24.5 MB up · 67.2 MB down · 3d 4h uptime` : 'Operating from local cache'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {([
            { key: 'full' as const, label: 'Full P2P' },
            { key: 'lighthouse' as const, label: 'Lighthouse fallback' },
            { key: 'offline' as const, label: 'Offline cache' },
          ]).map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setConnected(m.key !== 'offline') }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m.key
                  ? 'bg-sp-moss text-sp-cream'
                  : 'bg-sp-canopy/60 text-sp-parchment hover:bg-sp-moss/30'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bootstrap nodes */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Bootstrap Nodes</p>
        <div className="space-y-2">
          {bootstraps.map((node, i) => (
            <div key={i} className="flex items-center justify-between rounded-md bg-sp-canopy/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-sp-fern" />
                <span className="font-mono text-xs text-sp-cream">{node}</span>
              </div>
              <button
                onClick={() => removeBootstrap(i)}
                className="rounded p-1 text-sp-parchment hover:text-[#e11d48] transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Add bootstrap node..."
            value={newBootstrap}
            onChange={(e) => setNewBootstrap(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBootstrap()}
            className="flex-1 rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream placeholder:text-sp-parchment/60 focus:border-sp-fern focus:outline-none"
          />
          <button
            onClick={addBootstrap}
            className="rounded-full p-2 bg-sp-fern/20 text-sp-fern hover:bg-sp-fern hover:text-sp-cream transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lighthouse settings */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Settings2 className="h-5 w-5 text-sp-fern" />
          <p className="font-display text-lg font-medium text-sp-cream">Lighthouse Settings</p>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-sp-cream">Enable local discovery</span>
            <button
              onClick={() => setLighthouseEnabled(!lighthouseEnabled)}
              className={`relative h-5 w-9 rounded-full transition-colors ${lighthouseEnabled ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${lighthouseEnabled ? 'translate-x-4' : ''}`} />
            </button>
          </label>
          {lighthouseEnabled && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
              <div>
                <label className="text-xs text-sp-parchment">Discovery radius</label>
                <div className="flex gap-2 mt-1">
                  {radiusOptions.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRadius(r)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                        radius === r ? 'bg-sp-moss text-sp-cream' : 'bg-sp-canopy/60 text-sp-parchment hover:bg-sp-moss/30'
                      }`}
                    >
                      {r}m
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-sp-cream">Auto-link on proximity</span>
                <button
                  onClick={() => setAutoLink(!autoLink)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${autoLink ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${autoLink ? 'translate-x-4' : ''}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-sp-cream">Show me on local map</span>
                <button
                  onClick={() => setShowOnMap(!showOnMap)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${showOnMap ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${showOnMap ? 'translate-x-4' : ''}`} />
                </button>
              </label>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bandwidth */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Bandwidth</p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Upload className="h-4 w-4 text-sp-fern" />
              <label className="text-xs text-sp-parchment">Max upload for chunk sharing</label>
              <span className="text-xs text-sp-fern">{bandwidthMarks[uploadLimit]} MB/s</span>
            </div>
            <input
              type="range"
              min={0}
              max={bandwidthMarks.length - 1}
              step={1}
              value={uploadLimit}
              onChange={(e) => setUploadLimit(Number(e.target.value))}
              className="w-full accent-sp-fern"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Download className="h-4 w-4 text-sp-fern" />
              <label className="text-xs text-sp-parchment">Max download for chunk retrieval</label>
              <span className="text-xs text-sp-fern">{bandwidthMarks[downloadLimit]} MB/s</span>
            </div>
            <input
              type="range"
              min={0}
              max={bandwidthMarks.length - 1}
              step={1}
              value={downloadLimit}
              onChange={(e) => setDownloadLimit(Number(e.target.value))}
              className="w-full accent-sp-fern"
            />
          </div>
          {/* Sparkline */}
          <div>
            <label className="text-xs text-sp-parchment mb-1 block">24h usage</label>
            <div className="h-16 w-full">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                <polyline
                  points={sparkPoints}
                  fill="none"
                  stroke="var(--sp-fern)"
                  strokeWidth="1.5"
                  opacity={0.7}
                />
                <polygon
                  points={`0,100 ${sparkPoints} 100,100`}
                  fill="var(--sp-fern)"
                  opacity={0.1}
                />
              </svg>
            </div>
          </div>
          <div className="flex justify-between text-xs text-sp-parchment">
            <span>Seeding ratio: 2.4</span>
            <span className="text-sp-fern">Good citizen</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default NetworkP2PPanel
