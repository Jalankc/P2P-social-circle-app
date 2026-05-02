import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, KeyRound, Flame, Lock, Unlock, ChevronDown } from 'lucide-react'
import MatrixRain from './MatrixRain'

const devices = [
  { name: 'MacBook Pro M3', fingerprint: 'a3:f7:9c:2b:e1:4d:88:12:5f:aa:01', verified: true },
  { name: 'iPhone 15', fingerprint: 'b8:12:ee:45:99:0a:7c:33:d1:6f:bb', verified: true },
  { name: 'Linux Workstation', fingerprint: 'c9:55:ff:11:22:ab:3d:88:ee:00:cc', verified: false },
]

const timers = ['5s', '30s', '1m', '5m', '1h', '24h']
const protocols = ['Signal', 'Double Ratchet', 'OTR', 'Custom']
const exchangeMethods = ['P2P direct', 'Lighthouse relay', 'Manual']

const EncryptionPanel = memo(function EncryptionPanel() {
  const [e2eEnabled, setE2eEnabled] = useState(true)
  const [mode, setMode] = useState<'persistent' | 'self-destruct'>('persistent')
  const [timer, setTimer] = useState('1m')
  const [showBadge, setShowBadge] = useState(true)
  const [visibleUI, setVisibleUI] = useState(true)
  const [confirmDestruct, setConfirmDestruct] = useState(false)
  const [protocol, setProtocol] = useState('Signal')
  const [exchange, setExchange] = useState('P2P direct')

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(26, 11, 46, 0.25)', border: '1px solid rgba(82, 183, 136, 0.15)' }}>
      <MatrixRain opacity={0.04} />
      <div className="relative z-10 p-6 space-y-6">
        <div>
          <h2 className="font-display text-[28px] font-bold text-sp-cream">Encryption & Security</h2>
          <p className="mt-1 text-[15px] text-sp-parchment">Your keys. Your control. No servers.</p>
        </div>

        {/* Status dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Messages Encrypted', value: '\u221e', sub: 'All time', icon: CheckCircle, color: 'text-[#22c55e]' },
            { label: 'Active Keys', value: '3', sub: 'Devices', icon: KeyRound, color: 'text-sp-fern' },
            { label: 'Self-Destructed', value: '128', sub: 'Messages burned', icon: Flame, color: 'text-crypt-ember' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="rounded-lg p-4 text-center"
                style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="font-display text-2xl font-bold text-sp-cream">{stat.value}</p>
                <p className="text-xs text-sp-parchment mt-0.5">{stat.label}</p>
                <p className="text-[11px] text-sp-fern">{stat.sub}</p>
              </motion.div>
            )
          })}
        </div>

        {/* E2E toggle */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {e2eEnabled ? <Lock className="h-5 w-5 text-crypt-glow" /> : <Unlock className="h-5 w-5 text-sp-parchment" />}
                {e2eEnabled && <span className="absolute -inset-1 rounded-full border border-crypt-glow/40 animate-pulse-ring" />}
              </div>
              <div>
                <p className="text-sm font-medium text-sp-cream">End-to-End Encryption</p>
                <p className="text-xs text-sp-parchment">All messages encrypted with your keys</p>
              </div>
            </div>
            <button
              onClick={() => setE2eEnabled(!e2eEnabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${e2eEnabled ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-sp-cream shadow transition-transform ${e2eEnabled ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Default message mode */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <p className="font-display text-lg font-medium text-sp-cream mb-3">Default Message Mode</p>
          <div className="flex gap-2 mb-4">
            {(['persistent', 'self-destruct'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ' +
                  (mode === m
                    ? 'bg-sp-moss text-sp-cream'
                    : 'bg-sp-canopy/60 text-sp-parchment hover:bg-sp-moss/30')
                }
              >
                {m === 'persistent' ? 'Persistent' : 'Self-Destruct'}
              </button>
            ))}
          </div>

          {mode === 'self-destruct' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
              <div>
                <label className="text-xs text-sp-parchment">Default Timer</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {timers.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimer(t)}
                      className={
                        'rounded-md px-3 py-1 text-xs font-medium transition-colors ' +
                        (timer === t ? 'bg-crypt-ember text-white' : 'bg-sp-canopy/60 text-sp-parchment hover:bg-sp-moss/30')
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={confirmDestruct} onChange={(e) => setConfirmDestruct(e.target.checked)} className="h-4 w-4 accent-sp-fern" />
                <span className="text-sm text-sp-cream">Require confirmation before sending self-destruct</span>
              </label>
            </motion.div>
          )}
        </div>

        {/* Key management */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <p className="font-display text-lg font-medium text-sp-cream mb-3">Your Keys</p>
          <div className="space-y-3">
            {devices.map((dev) => (
              <div key={dev.name} className="flex items-center justify-between rounded-md bg-sp-canopy/40 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-sp-cream">{dev.name}</p>
                  <p className="font-mono text-xs text-crypt-terminal">{dev.fingerprint}</p>
                </div>
                <div className="flex items-center gap-2">
                  {dev.verified ? (
                    <span className="text-xs text-[#22c55e] font-medium">Verified</span>
                  ) : (
                    <button className="rounded-md bg-sp-fern/20 px-2 py-1 text-xs font-medium text-sp-fern hover:bg-sp-fern/30">Verify</button>
                  )}
                  <button className="text-xs text-[#e11d48] hover:underline">Revoke</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-full border border-sp-fern px-4 py-2 text-sm font-medium text-sp-fern hover:bg-sp-fern/10 transition-colors">
              Export Key Backup
            </button>
            <button className="rounded-full border border-[#e11d48] px-4 py-2 text-sm font-medium text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors">
              Rotate All Keys
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="rounded-lg p-4 space-y-3" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-sp-cream">Show encryption badge on all messages</span>
            <button
              onClick={() => setShowBadge(!showBadge)}
              className={`relative h-5 w-9 rounded-full transition-colors ${showBadge ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${showBadge ? 'translate-x-4' : ''}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-sp-cream">Visible encryption UI (matrix rain, lock pulses)</span>
            <button
              onClick={() => setVisibleUI(!visibleUI)}
              className={`relative h-5 w-9 rounded-full transition-colors ${visibleUI ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${visibleUI ? 'translate-x-4' : ''}`} />
            </button>
          </label>
        </div>

        {/* Advanced */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <p className="font-display text-lg font-medium text-sp-cream mb-3">Advanced</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-sp-parchment">Custom encryption protocol</label>
              <div className="relative mt-1">
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  className="w-full appearance-none rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
                >
                  {protocols.map((p) => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-sp-parchment pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-sp-parchment">Key exchange method</label>
              <div className="relative mt-1">
                <select
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                  className="w-full appearance-none rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
                >
                  {exchangeMethods.map((m) => <option key={m}>{m}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-sp-parchment pointer-events-none" />
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 mt-3 cursor-pointer opacity-60">
            <input type="checkbox" checked readOnly className="h-4 w-4 accent-sp-fern" />
            <span className="text-sm text-sp-cream">Perfect forward secrecy (locked)</span>
          </label>
        </div>
      </div>
    </div>
  )
})

export default EncryptionPanel
