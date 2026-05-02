import { useState, useEffect, useRef, memo } from 'react'
import { Terminal, Copy, Download, FlaskConical, Code, Trash2, Wifi, Zap } from 'lucide-react'
import MatrixRain from './MatrixRain'

const initialLogs = [
  { time: '14:32:01', level: 'info', message: 'Peer connected: reed.p2p (latency 45ms)' },
  { time: '14:31:55', level: 'info', message: 'Chunk transfer: block #8821 → fern.p2p (128KB)' },
  { time: '14:31:42', level: 'warn', message: 'Handshake timeout: bootstrap2.p2p, retrying...' },
  { time: '14:31:30', level: 'info', message: 'Encryption handshake complete with moss.p2p' },
  { time: '14:31:12', level: 'info', message: 'DHT lookup: resolved 3 peers for hashtag #solar-punk' },
  { time: '14:30:58', level: 'error', message: 'Chunk hash mismatch: #7742 on ivy.p2p, requesting repair' },
  { time: '14:30:45', level: 'info', message: 'Lighthouse beacon: 2 nearby peers within 250m' },
  { time: '14:30:22', level: 'info', message: 'Key rotation completed: new fingerprint a3:f7:9c...' },
]

const DeveloperPanel = memo(function DeveloperPanel() {
  const [apiKey] = useState('sc_dev_••••••••••••••••••••••••••••••••')
  const [logs, setLogs] = useState(initialLogs)
  const [experimental, setExperimental] = useState(false)
  const [customCSS, setCustomCSS] = useState(false)
  const [perfProfiling, setPerfProfiling] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookEvent, setWebhookEvent] = useState('friend.request')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const addLog = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const messages = [
      'Peer handshake initiated',
      'Chunk repair request sent',
      'DHT routing table updated',
      'New bootstrap node accepted',
      'Bandwidth throttle applied',
    ]
    setLogs(prev => [...prev, { time, level: 'info', message: messages[Math.floor(Math.random() * messages.length)] }])
  }

  const clearCache = () => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString('en-GB'), level: 'warn', message: 'Local cache cleared. 47 chunks removed.' }])
  }

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(26, 11, 46, 0.25)', border: '1px solid rgba(82, 183, 136, 0.15)' }}>
      <MatrixRain opacity={0.03} />
      <div className="relative z-10 p-6 space-y-6">
        <div>
          <h2 className="font-display text-[28px] font-bold text-sp-cream">Developer Tools</h2>
        </div>

        {/* API Access */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-5 w-5 text-sp-fern" />
            <p className="font-display text-lg font-medium text-sp-cream">API Access</p>
          </div>
          <div className="rounded-md bg-[#0d1117] border border-crypt-terminal/20 p-3">
            <div className="flex items-center justify-between">
              <code className="font-mono text-sm text-crypt-terminal">{apiKey}</code>
              <button className="rounded p-1 text-sp-parchment hover:text-sp-cream transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-sp-parchment mt-1">Rate limit: 1000 req/hour</p>
          </div>
          <button className="mt-3 rounded-full border border-sp-fern px-4 py-2 text-sm font-medium text-sp-fern hover:bg-sp-fern/10 transition-colors">
            Regenerate key
          </button>
        </div>

        {/* Webhooks */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <p className="font-display text-lg font-medium text-sp-cream mb-3">Webhooks</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="https://..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="sm:col-span-2 rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream placeholder:text-sp-parchment/60 focus:border-sp-fern focus:outline-none"
            />
            <select
              value={webhookEvent}
              onChange={(e) => setWebhookEvent(e.target.value)}
              className="rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
            >
              <option>friend.request</option>
              <option>message.received</option>
              <option>chunk.sync</option>
              <option>post.reaction</option>
            </select>
          </div>
          <button className="mt-3 rounded-full bg-sp-amber px-4 py-2 text-xs font-semibold text-sp-bark shadow-cta">
            Test webhook
          </button>
        </div>

        {/* Console */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-crypt-terminal" />
              <p className="font-display text-lg font-medium text-sp-cream">Console</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addLog}
                className="rounded-full p-1.5 text-sp-parchment hover:bg-sp-moss hover:text-sp-cream transition-colors"
                title="Add test log"
              >
                <Zap className="h-3.5 w-3.5" />
              </button>
              <button className="flex items-center gap-1.5 rounded-full border border-sp-fern px-3 py-1.5 text-xs font-medium text-sp-fern hover:bg-sp-fern/10 transition-colors">
                <Download className="h-3.5 w-3.5" />
                Export logs
              </button>
            </div>
          </div>
          <div
            ref={terminalRef}
            className="rounded-md bg-[#0d1117] border border-crypt-terminal/20 p-3 h-48 overflow-y-auto font-mono text-xs space-y-1"
          >
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-sp-parchment/40 shrink-0">{log.time}</span>
                <span
                  className={`uppercase shrink-0 w-12 ${
                    log.level === 'error' ? 'text-[#e11d48]' :
                    log.level === 'warn' ? 'text-[#f59e0b]' :
                    'text-crypt-terminal'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-sp-parchment">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Debug network map */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="h-5 w-5 text-sp-fern" />
            <p className="font-display text-lg font-medium text-sp-cream">Debug Network Map</p>
          </div>
          <div className="rounded-md bg-sp-canopy/40 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: 'Peers connected', value: '8' },
                { label: 'Active chunks', value: '47' },
                { label: 'Pending repairs', value: '1' },
                { label: 'Avg latency', value: '42ms' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-md bg-sp-canopy/60 p-2">
                  <p className="font-mono text-lg font-bold text-sp-cream">{stat.value}</p>
                  <p className="text-[10px] text-sp-parchment">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced toggles */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="h-5 w-5 text-sp-fern" />
            <p className="font-display text-lg font-medium text-sp-cream">Advanced</p>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-sp-cream">Enable experimental features</span>
              <button
                onClick={() => setExperimental(!experimental)}
                className={`relative h-5 w-9 rounded-full transition-colors ${experimental ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${experimental ? 'translate-x-4' : ''}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-sp-cream">Custom bootstrap CSS for profile</span>
              <button
                onClick={() => setCustomCSS(!customCSS)}
                className={`relative h-5 w-9 rounded-full transition-colors ${customCSS ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${customCSS ? 'translate-x-4' : ''}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-sp-cream">Performance profiling</span>
              <button
                onClick={() => setPerfProfiling(!perfProfiling)}
                className={`relative h-5 w-9 rounded-full transition-colors ${perfProfiling ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${perfProfiling ? 'translate-x-4' : ''}`} />
              </button>
            </label>
          </div>
        </div>

        {/* Clear local cache */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="h-5 w-5 text-[#e11d48]" />
            <p className="font-display text-lg font-medium text-sp-cream">Local Cache</p>
          </div>
          <p className="text-xs text-sp-parchment mb-3">Clear all locally cached chunks, avatars, and settings. Data will be re-fetched from the network.</p>
          <button
            onClick={clearCache}
            className="flex items-center gap-2 rounded-full border border-[#e11d48] px-5 py-2.5 text-sm font-medium text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear local cache
          </button>
        </div>
      </div>
    </div>
  )
})

export default DeveloperPanel
