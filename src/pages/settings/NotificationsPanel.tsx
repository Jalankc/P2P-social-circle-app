import { useState, memo } from 'react'
import { Bell, Moon, MessageSquare, UserPlus, Heart, ShieldAlert, Radio, DollarSign, Clock } from 'lucide-react'

interface NotificationSetting {
  id: string
  label: string
  icon: typeof Bell
  inApp: boolean
  push: boolean
  email: boolean
}

const initialSettings: NotificationSetting[] = [
  { id: 'friend_requests', label: 'Friend requests', icon: UserPlus, inApp: true, push: true, email: false },
  { id: 'messages', label: 'Direct messages', icon: MessageSquare, inApp: true, push: true, email: true },
  { id: 'reactions', label: 'Post reactions', icon: Heart, inApp: true, push: false, email: false },
  { id: 'chunk_sync', label: 'Chunk sync alerts', icon: Radio, inApp: true, push: false, email: false },
  { id: 'lighthouse', label: 'Lighthouse nearby', icon: Radio, inApp: true, push: true, email: false },
  { id: 'revenue', label: 'Ad revenue events', icon: DollarSign, inApp: true, push: false, email: true },
  { id: 'security', label: 'Security alerts', icon: ShieldAlert, inApp: true, push: true, email: true },
]

const NotificationsPanel = memo(function NotificationsPanel() {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings)
  const [quietStart, setQuietStart] = useState('22:00')
  const [quietEnd, setQuietEnd] = useState('08:00')
  const [quietSecurity, setQuietSecurity] = useState(false)

  const toggle = (id: string, channel: 'inApp' | 'push' | 'email') => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, [channel]: !s[channel] } : s))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream">Notifications</h2>
      </div>

      {/* Channel matrix */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 text-xs text-sp-parchment font-medium">Event Type</th>
                <th className="text-center p-2 text-xs text-sp-parchment font-medium">In-App</th>
                <th className="text-center p-2 text-xs text-sp-parchment font-medium">Push</th>
                <th className="text-center p-2 text-xs text-sp-parchment font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((s) => {
                const Icon = s.icon
                return (
                  <tr key={s.id} className="border-t border-sp-fern/10">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-sp-fern" />
                        <span className="text-sp-cream">{s.label}</span>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => toggle(s.id, 'inApp')}
                        className={`h-4 w-4 rounded border transition-colors ${s.inApp ? 'bg-sp-fern border-sp-fern' : 'border-sp-parchment/40'}`}
                      >
                        {s.inApp && <span className="block text-[10px] text-sp-cream leading-none">✓</span>}
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => toggle(s.id, 'push')}
                        className={`h-4 w-4 rounded border transition-colors ${s.push ? 'bg-sp-fern border-sp-fern' : 'border-sp-parchment/40'}`}
                      >
                        {s.push && <span className="block text-[10px] text-sp-cream leading-none">✓</span>}
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => toggle(s.id, 'email')}
                        className={`h-4 w-4 rounded border transition-colors ${s.email ? 'bg-sp-fern border-sp-fern' : 'border-sp-parchment/40'}`}
                      >
                        {s.email && <span className="block text-[10px] text-sp-cream leading-none">✓</span>}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiet hours */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Moon className="h-5 w-5 text-sp-fern" />
          <p className="font-display text-lg font-medium text-sp-cream">Quiet Hours</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-sp-parchment">Start</label>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-sp-parchment" />
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-sp-parchment">End</label>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-sp-parchment" />
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <button
            onClick={() => setQuietSecurity(!quietSecurity)}
            className={`relative h-5 w-9 rounded-full transition-colors ${quietSecurity ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
          >
            <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${quietSecurity ? 'translate-x-4' : ''}`} />
          </button>
          <span className="text-sm text-sp-cream">Disable all except security alerts during quiet hours</span>
        </label>
      </div>
    </div>
  )
})

export default NotificationsPanel
