import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, ArrowRight, Pause, Unlink, RefreshCw, Info,
  Wrench, MessageSquare, ThumbsUp, Reply, Users, Mail,
  Eye, Send, Calendar, Sparkles, Activity, BarChart3,
  Search, FileText,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface Dimensions {
  M: number
  S: number
  I: number
  E: number
}

interface ClawbotEntity {
  id: string
  name: string
  type: string
  dimensions: Dimensions
  specialty: string
  dailyCost: number
}

interface MissionReport {
  time: string
  type: string
  target: string
  cost: number
  result: string
}

interface AllowedActions {
  browse: boolean
  read: boolean
  react: boolean
  reply: boolean
  groups: boolean
  messages: boolean
  interactionData: boolean
}

type SpendLimitAction = 'pause' | 'warn' | 'stop'
type PermissionScope = 'self' | 'friends' | 'extended' | 'wide' | 'full'

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */

const AVAILABLE_CLAWBOTS: ClawbotEntity[] = [
  {
    id: 'seraph-7',
    name: 'Seraph-7',
    type: 'Explorer',
    dimensions: { M: 12, S: 45, I: 89, E: 23 },
    specialty: 'Content discovery, trend analysis',
    dailyCost: 5,
  },
  {
    id: 'weaver-3',
    name: 'Weaver-3',
    type: 'Social',
    dimensions: { M: 8, S: 92, I: 34, E: 45 },
    specialty: 'Relationship mapping, network analysis',
    dailyCost: 8,
  },
  {
    id: 'echo-9',
    name: 'Echo-9',
    type: 'Analyst',
    dimensions: { M: 67, S: 12, I: 78, E: 56 },
    specialty: 'Data synthesis, pattern recognition',
    dailyCost: 6,
  },
]

const INITIAL_REPORTS: MissionReport[] = [
  { time: '15m ago', type: 'Explore', target: 'My Network', cost: 12, result: '23 threads found, 5 trending' },
  { time: '6h ago', type: 'Analyze', target: 'P2P Tech Group', cost: 8, result: 'Engagement up 23%, top topic: Mesh v2.1' },
  { time: '1d ago', type: 'Discover', target: 'Solarpunk Forums', cost: 15, result: '3 new forums, 12 mutual connections' },
]

const DIMENSION_COLORS: Record<keyof Dimensions, string> = {
  M: '#6b7280',
  S: '#d4a017',
  I: '#67e8f9',
  E: '#52b788',
}

const DIMENSION_LABELS: Record<keyof Dimensions, string> = {
  M: 'Material',
  S: 'Social',
  I: 'Innovation',
  E: 'Ecology',
}

const DIMENSION_ICONS: Record<keyof Dimensions, typeof Wrench> = {
  M: Wrench,
  S: MessageSquare,
  I: Sparkles,
  E: Activity,
}

const PERMISSION_OPTIONS: { value: PermissionScope; label: string; description: string; requires?: string }[] = [
  { value: 'self', label: 'My Profile Only', description: 'Can only browse my own forum and content' },
  { value: 'friends', label: 'My Friends', description: "Can visit my friends' forums and profiles" },
  { value: 'extended', label: 'Friends of Friends (2 hops)', description: "Can explore my friends' networks" },
  { value: 'wide', label: 'Extended Network (4 hops)', description: 'Can explore up to 4 hops from me', requires: '250+ posts' },
  { value: 'full', label: 'Full Network', description: 'Can explore the entire visible network', requires: '500+ posts, cred >75' },
]

const MISSION_TYPES = ['Explore', 'Analyze', 'Discover', 'Map', 'Summarize']
const MISSION_TARGETS = ['My Network', "Friend's Forums", 'Specific Topic', 'Group']

const USER_POSTS = 180
const USER_CRED = 62

/* ═══════════════════════════════════════════════════════════════
   DIMENSION BAR COMPONENT
   ═══════════════════════════════════════════════════════════════ */

interface DimBarProps {
  dim: keyof Dimensions
  value: number
}

const DimBar = memo(function DimBar({ dim, value }: DimBarProps) {
  const Icon = DIMENSION_ICONS[dim]
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3 w-3 shrink-0" style={{ color: DIMENSION_COLORS[dim] }} />
      <span className="font-mono text-[10px] w-[60px] shrink-0" style={{ color: 'var(--sp-parchment)' }}>
        {DIMENSION_LABELS[dim]}
      </span>
      <div className="flex-1 h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            background: DIMENSION_COLORS[dim],
          }}
        />
      </div>
      <span className="font-mono text-[10px] w-[24px] text-right" style={{ color: DIMENSION_COLORS[dim] }}>
        {value}
      </span>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════
   MINI DIMENSION BAR (for cards)
   ═══════════════════════════════════════════════════════════════ */

interface MiniDimBarProps {
  dim: keyof Dimensions
  value: number
}

const MiniDimBar = memo(function MiniDimBar({ dim, value }: MiniDimBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[9px] w-[10px]" style={{ color: DIMENSION_COLORS[dim] }}>
        {dim}
      </span>
      <div className="flex-1 h-[3px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            background: DIMENSION_COLORS[dim],
          }}
        />
      </div>
      <span className="font-mono text-[9px] w-[16px] text-right" style={{ color: 'var(--sp-parchment)', opacity: 0.7 }}>
        {value}
      </span>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════════
   RADIO BUTTON COMPONENT
   ═══════════════════════════════════════════════════════════════ */

interface RadioBtnProps {
  checked: boolean
  onClick: () => void
  disabled?: boolean
}

const RadioBtn = memo(function RadioBtn({ checked, onClick, disabled }: RadioBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-shrink-0 h-3.5 w-3.5 flex items-center justify-center transition-colors disabled:opacity-30"
      style={{
        border: checked
          ? '1px solid #52b788'
          : '1px solid rgba(45,106,79,0.5)',
        background: checked ? 'rgba(82,183,136,0.2)' : 'transparent',
        borderRadius: '9999px',
      }}
    >
      {checked && <span className="h-2 w-2 rounded-full" style={{ background: '#52b788' }} />}
    </button>
  )
})

/* ═══════════════════════════════════════════════════════════════
   CHECKBOX COMPONENT
   ═══════════════════════════════════════════════════════════════ */

interface CheckboxProps {
  checked: boolean
  onClick: () => void
  disabled?: boolean
}

const Checkbox = memo(function Checkbox({ checked, onClick, disabled }: CheckboxProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-shrink-0 h-3.5 w-3.5 flex items-center justify-center transition-colors disabled:opacity-30"
      style={{
        border: checked
          ? '1px solid #52b788'
          : '1px solid rgba(45,106,79,0.5)',
        background: checked ? 'rgba(82,183,136,0.2)' : 'transparent',
        borderRadius: '0px',
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5L4 7L8 3" stroke="#52b788" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
})

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const ClawbotPanel = memo(function ClawbotPanel() {
  /* ── State ── */
  const [linked, setLinked] = useState(false)
  const [linkedClawbot, setLinkedClawbot] = useState<ClawbotEntity | null>(null)
  const [customId, setCustomId] = useState('')
  const [dailySpendPercent, setDailySpendPercent] = useState(60)
  const [spendLimitAction, setSpendLimitAction] = useState<SpendLimitAction>('warn')
  const [permissionScope, setPermissionScope] = useState<PermissionScope>('extended')
  const [allowedActions, setAllowedActions] = useState<AllowedActions>({
    browse: true,
    read: true,
    react: true,
    reply: false,
    groups: false,
    messages: false,
    interactionData: true,
  })
  const [missionType, setMissionType] = useState('Explore')
  const [missionTarget, setMissionTarget] = useState('My Network')
  const [missionFocus, setMissionFocus] = useState('')
  const [missionReports, setMissionReports] = useState<MissionReport[]>(INITIAL_REPORTS)
  const [status, setStatus] = useState<'active' | 'paused'>('active')

  /* ── Derived values ── */
  const dailyYGen = 120
  const clawbotMax = Math.round((dailyYGen * dailySpendPercent) / 100)
  const spentToday = 34

  /* ── Handlers ── */
  const handleLink = useCallback((clawbot: ClawbotEntity) => {
    setLinkedClawbot(clawbot)
    setLinked(true)
  }, [])

  const handleLinkCustom = useCallback(() => {
    if (!customId.trim()) return
    const fake: ClawbotEntity = {
      id: customId.trim().toLowerCase(),
      name: customId.trim(),
      type: 'Custom',
      dimensions: { M: 20, S: 20, I: 20, E: 20 },
      specialty: 'User-linked entity',
      dailyCost: 5,
    }
    setLinkedClawbot(fake)
    setLinked(true)
  }, [customId])

  const handleUnlink = useCallback(() => {
    setLinked(false)
    setLinkedClawbot(null)
    setStatus('active')
  }, [])

  const handleToggleAction = useCallback((key: keyof AllowedActions) => {
    setAllowedActions((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleSendMission = useCallback(() => {
    const newReport: MissionReport = {
      time: 'just now',
      type: missionType,
      target: missionTarget,
      cost: Math.floor(Math.random() * 10) + 5,
      result: 'Mission dispatched, awaiting report...',
    }
    setMissionReports((prev) => [newReport, ...prev])
  }, [missionType, missionTarget])

  const handleScheduleDaily = useCallback(() => {
    const newReport: MissionReport = {
      time: 'just now',
      type: missionType,
      target: missionTarget,
      cost: 0,
      result: `Scheduled daily: ${missionType} ${missionTarget}`,
    }
    setMissionReports((prev) => [newReport, ...prev])
  }, [missionType, missionTarget])

  /* ── Permission scope disabled check ── */
  const isScopeDisabled = useCallback((scope: PermissionScope): boolean => {
    if (scope === 'wide') return USER_POSTS < 250
    if (scope === 'full') return USER_POSTS < 500 || USER_CRED < 75
    return false
  }, [])

  /* ═══════════════════════════════════════════════════════════
     SCREEN 1: NOT LINKED
     ═══════════════════════════════════════════════════════════ */

  if (!linked || !linkedClawbot) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-retro text-[14px] uppercase tracking-wider text-sp-cream flex items-center gap-2">
            <Bot className="h-4 w-4 text-sp-amber" />
            Link a Clawbot
          </h2>
          <p
            className="mt-2 text-[12px] italic leading-relaxed"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              color: 'var(--sp-parchment)',
              opacity: 0.8,
            }}
          >
            Your Clawbot is an independent AI entity. You don&apos;t create it —
            you link it. It becomes your eyes and ears on the network.
          </p>
        </div>

        {/* Available Clawbots */}
        <div>
          <p className="font-retro text-[12px] uppercase tracking-wider text-sp-amber mb-3">
            Available Clawbots
          </p>
          <div className="space-y-3">
            {AVAILABLE_CLAWBOTS.map((bot) => (
              <div
                key={bot.id}
                className="p-4"
                style={{
                  border: '1px solid rgba(45,106,79,0.3)',
                  background: 'rgba(15,41,30,0.6)',
                  borderRadius: '0px',
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Bot className="h-4 w-4 text-sp-amber shrink-0" />
                      <span
                        className="text-[16px] font-bold text-sp-cream"
                        style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                      >
                        {bot.name}
                      </span>
                      <span
                        className="px-1.5 py-0.5 font-retro text-[10px] uppercase"
                        style={{
                          background: 'rgba(45,106,79,0.3)',
                          color: 'var(--sp-sapling)',
                        }}
                      >
                        {bot.type}
                      </span>
                    </div>

                    {/* Mini dimension bars */}
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 max-w-[280px]">
                      {(Object.keys(bot.dimensions) as (keyof Dimensions)[]).map((d) => (
                        <MiniDimBar key={d} dim={d} value={bot.dimensions[d]} />
                      ))}
                    </div>

                    {/* Specialty */}
                    <p
                      className="mt-2 text-[11px]"
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: 'var(--sp-parchment)',
                        opacity: 0.7,
                      }}
                    >
                      {bot.specialty}
                    </p>

                    {/* Daily cost */}
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="font-mono text-[10px]" style={{ color: 'var(--sp-parchment)', opacity: 0.6 }}>
                        Daily Cost:
                      </span>
                      <span className="font-mono text-[11px] text-sp-amber">{bot.dailyCost}Y</span>
                    </div>
                  </div>

                  {/* Right: Link button */}
                  <button
                    onClick={() => handleLink(bot)}
                    className="flex items-center gap-1.5 px-4 py-2 font-retro text-[11px] uppercase transition-opacity hover:opacity-90 shrink-0"
                    style={{
                      background: 'var(--sp-amber)',
                      color: 'var(--sp-canopy)',
                      border: 'none',
                      borderRadius: '0px',
                    }}
                  >
                    Link
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom ID input */}
        <div
          className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          style={{
            border: '1px solid rgba(45,106,79,0.25)',
            background: 'rgba(15,41,30,0.4)',
            borderRadius: '0px',
          }}
        >
          <span className="font-mono text-[11px] text-sp-parchment shrink-0">Or bring your own:</span>
          <input
            type="text"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLinkCustom()}
            placeholder="Enter Clawbot ID"
            className="flex-1 min-w-0 px-3 py-1.5 font-mono text-[12px] text-sp-cream placeholder-sp-parchment/30 focus:outline-none"
            style={{
              border: '1px solid rgba(45,106,79,0.4)',
              background: 'rgba(15,41,30,0.6)',
              borderRadius: '2px',
            }}
          />
          <button
            onClick={handleLinkCustom}
            className="px-4 py-1.5 font-retro text-[11px] uppercase transition-opacity hover:opacity-90 shrink-0"
            style={{
              background: 'var(--sp-moss)',
              color: 'var(--sp-cream)',
              border: 'none',
              borderRadius: '0px',
            }}
          >
            Link
          </button>
        </div>

        {/* Info section */}
        <div
          className="p-4 space-y-2"
          style={{
            border: '1px solid rgba(45,106,79,0.2)',
            background: 'rgba(15,41,30,0.3)',
            borderRadius: '0px',
          }}
        >
          <p className="font-retro text-[12px] uppercase tracking-wider text-sp-amber flex items-center gap-2">
            <Info className="h-3.5 w-3.5" />
            What is a Clawbot?
          </p>
          <p
            className="text-[12px] leading-relaxed"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              color: 'var(--sp-parchment)',
              opacity: 0.75,
            }}
          >
            A Clawbot is an AI entity that browses the network on your behalf.
            It has its own dimensions, its own restrictions, and access to
            interaction data that humans cannot see. It IS you for browsing
            purposes, but flagged as AI.
          </p>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════════
     SCREEN 2: LINKED — FULL CONTROL PANEL
     ═══════════════════════════════════════════════════════════ */

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-sp-amber" />
          <h2
            className="text-[16px] font-bold text-sp-cream uppercase"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            {linkedClawbot.name}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[11px] text-sp-parchment">
            Linked to @willow
          </span>
          <span className="font-mono text-[11px]" style={{ color: 'rgba(45,106,79,0.4)' }}>|</span>
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0"
              style={{
                background: status === 'active' ? '#52b788' : '#d4a017',
                borderRadius: '9999px',
              }}
            />
            <span className="font-mono text-[11px]" style={{ color: status === 'active' ? '#52b788' : '#d4a017' }}>
              {status === 'active' ? 'Active' : 'Paused'}
            </span>
          </div>
          <span className="font-mono text-[11px]" style={{ color: 'rgba(45,106,79,0.4)' }}>|</span>
          <span
            className="px-1.5 py-0.5 font-retro text-[10px] uppercase"
            style={{ background: 'rgba(45,106,79,0.3)', color: 'var(--sp-sapling)' }}
          >
            {linkedClawbot.type}
          </span>
        </div>
      </div>

      {/* ── Dimensions Panel ── */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.3)',
          background: 'rgba(15,41,30,0.5)',
          borderRadius: '0px',
        }}
      >
        <p className="font-retro text-[12px] uppercase tracking-wider text-sp-amber">
          Dimensions (Independent)
        </p>
        <p
          className="text-[11px]"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            color: 'var(--sp-parchment)',
            opacity: 0.6,
          }}
        >
          Grows as {linkedClawbot.name} operates on the network
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1">
          {(Object.keys(linkedClawbot.dimensions) as (keyof Dimensions)[]).map((d) => (
            <DimBar key={d} dim={d} value={linkedClawbot.dimensions[d]} />
          ))}
        </div>
      </div>

      {/* ── Daily Spend Limit ── */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.3)',
          background: 'rgba(15,41,30,0.5)',
          borderRadius: '0px',
        }}
      >
        <p className="font-retro text-[12px] uppercase tracking-wider text-sp-amber">
          Daily Spend Limit
        </p>

        {/* Slider */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full"
                style={{
                  width: `${dailySpendPercent}%`,
                  background: '#d4a017',
                }}
              />
            </div>
            <span className="font-mono text-[12px] text-sp-amber font-bold w-[50px] text-right">
              {dailySpendPercent}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={dailySpendPercent}
            onChange={(e) => setDailySpendPercent(Number(e.target.value))}
            className="w-full accent-sp-amber"
            style={{ height: '4px' }}
          />
        </div>

        {/* Numbers */}
        <div className="flex items-center gap-4 flex-wrap font-mono text-[11px]">
          <span className="text-sp-parchment">
            Your Y-gen: <span className="text-sp-cream">{dailyYGen}Y/day</span>
          </span>
          <span style={{ color: 'rgba(45,106,79,0.4)' }}>|</span>
          <span className="text-sp-parchment">
            Clawbot max: <span className="text-sp-amber">{clawbotMax}Y</span>
          </span>
          <span style={{ color: 'rgba(45,106,79,0.4)' }}>|</span>
          <span className="text-sp-parchment">
            Spent today: <span className="text-sp-sapling">{spentToday}Y</span>
          </span>
        </div>

        {/* Spend limit action */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-mono text-[10px] text-sp-parchment mr-2">When limit reached:</span>
          {([
            ['pause', 'Pause'],
            ['warn', 'Warn'],
            ['stop', 'Stop'],
          ] as [SpendLimitAction, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setSpendLimitAction(value)}
              className="flex items-center gap-1.5 transition-colors"
            >
              <RadioBtn
                checked={spendLimitAction === value}
                onClick={() => setSpendLimitAction(value)}
              />
              <span
                className="font-mono text-[10px]"
                style={{
                  color: spendLimitAction === value ? 'var(--sp-cream)' : 'var(--sp-parchment)',
                  opacity: spendLimitAction === value ? 1 : 0.6,
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Permission Scope ── */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.3)',
          background: 'rgba(15,41,30,0.5)',
          borderRadius: '0px',
        }}
      >
        <p className="font-retro text-[12px] uppercase tracking-wider text-sp-amber">
          Permission Scope
        </p>
        <p
          className="text-[11px]"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            color: 'var(--sp-parchment)',
            opacity: 0.6,
          }}
        >
          Where can {linkedClawbot.name} go?
        </p>

        {/* Scope radio buttons */}
        <div className="space-y-2 pt-1">
          {PERMISSION_OPTIONS.map((opt) => {
            const disabled = isScopeDisabled(opt.value)
            return (
              <label
                key={opt.value}
                className={`flex items-start gap-2 ${disabled ? 'opacity-40' : 'cursor-pointer'}`}
              >
                <div className="pt-0.5">
                  <RadioBtn
                    checked={permissionScope === opt.value}
                    onClick={() => !disabled && setPermissionScope(opt.value)}
                    disabled={disabled}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[12px]"
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      color: permissionScope === opt.value ? 'var(--sp-cream)' : 'var(--sp-parchment)',
                      fontWeight: permissionScope === opt.value ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </span>
                  {opt.requires && (
                    <span className="font-mono text-[9px] text-sp-parchment/50 ml-2">
                      [Requires {opt.requires}]
                    </span>
                  )}
                </div>
              </label>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-2" style={{ borderTop: '1px solid rgba(45,106,79,0.2)' }} />

        {/* Allowed Actions */}
        <p className="font-retro text-[10px] uppercase tracking-wider text-sp-parchment mb-2">
          Allowed Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {([
            { key: 'browse' as keyof AllowedActions, label: 'Browse', icon: Search, required: true },
            { key: 'read' as keyof AllowedActions, label: 'Read', icon: FileText, required: true },
            { key: 'react' as keyof AllowedActions, label: 'React', icon: ThumbsUp },
            { key: 'reply' as keyof AllowedActions, label: 'Reply (ask me)', icon: Reply },
            { key: 'groups' as keyof AllowedActions, label: 'Join Groups', icon: Users },
            { key: 'messages' as keyof AllowedActions, label: 'Send Messages', icon: Mail },
          ] as const).map((action) => {
            const ActionIcon = action.icon
            const isChecked = allowedActions[action.key]
            return (
              <button
                key={action.key}
                onClick={() => !action.required && handleToggleAction(action.key)}
                className={`flex items-center gap-1.5 transition-colors ${action.required ? '' : 'cursor-pointer'}`}
              >
                {action.required ? (
                  <span className="flex-shrink-0 h-3.5 w-3.5 flex items-center justify-center" style={{ background: 'rgba(82,183,136,0.2)', border: '1px solid #52b788', borderRadius: '0px' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#52b788" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : (
                  <Checkbox checked={isChecked} onClick={() => handleToggleAction(action.key)} />
                )}
                <ActionIcon className="h-3 w-3 shrink-0" style={{ color: isChecked ? 'var(--sp-cream)' : 'var(--sp-parchment)', opacity: isChecked ? 0.8 : 0.5 }} />
                <span
                  className="text-[11px]"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: isChecked ? 'var(--sp-cream)' : 'var(--sp-parchment)',
                    opacity: isChecked ? 1 : 0.6,
                  }}
                >
                  {action.label}
                </span>
                {action.required && (
                  <span className="font-mono text-[8px] text-sp-fern">(always)</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Interaction Data Access */}
        <div className="pt-1">
          <button
            onClick={() => handleToggleAction('interactionData')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={allowedActions.interactionData}
              onClick={() => handleToggleAction('interactionData')}
            />
            <Eye className="h-3 w-3" style={{ color: allowedActions.interactionData ? 'var(--sp-cyan)' : 'var(--sp-parchment)', opacity: allowedActions.interactionData ? 1 : 0.5 }} />
            <span
              className="text-[11px]"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                color: allowedActions.interactionData ? 'var(--sp-cream)' : 'var(--sp-parchment)',
                opacity: allowedActions.interactionData ? 1 : 0.6,
              }}
            >
              Interaction Data Access
            </span>
            <span className="font-mono text-[9px] text-sp-parchment/40">(AI-only visibility)</span>
          </button>
        </div>
      </div>

      {/* ── Missions ── */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.3)',
          background: 'rgba(15,41,30,0.5)',
          borderRadius: '0px',
        }}
      >
        <p className="font-retro text-[12px] uppercase tracking-wider text-sp-amber flex items-center gap-2">
          <Send className="h-3.5 w-3.5" />
          Missions
        </p>
        <p
          className="text-[11px]"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            color: 'var(--sp-parchment)',
            opacity: 0.6,
          }}
        >
          Send {linkedClawbot.name} to browse the network and report back.
        </p>

        {/* Mission controls */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-sp-parchment w-[50px] shrink-0">Mission:</span>
            <div className="relative">
              <select
                value={missionType}
                onChange={(e) => setMissionType(e.target.value)}
                className="appearance-none px-3 py-1 pr-7 font-mono text-[11px] text-sp-cream focus:outline-none cursor-pointer"
                style={{
                  border: '1px solid rgba(45,106,79,0.4)',
                  background: 'rgba(15,41,30,0.6)',
                  borderRadius: '2px',
                }}
              >
                {MISSION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" style={{ color: 'var(--sp-parchment)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-sp-parchment w-[50px] shrink-0">Target:</span>
            <div className="relative">
              <select
                value={missionTarget}
                onChange={(e) => setMissionTarget(e.target.value)}
                className="appearance-none px-3 py-1 pr-7 font-mono text-[11px] text-sp-cream focus:outline-none cursor-pointer"
                style={{
                  border: '1px solid rgba(45,106,79,0.4)',
                  background: 'rgba(15,41,30,0.6)',
                  borderRadius: '2px',
                }}
              >
                {MISSION_TARGETS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" style={{ color: 'var(--sp-parchment)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-sp-parchment w-[50px] shrink-0">Focus:</span>
            <input
              type="text"
              value={missionFocus}
              onChange={(e) => setMissionFocus(e.target.value)}
              placeholder="Optional focus area..."
              className="flex-1 min-w-0 max-w-[300px] px-3 py-1 font-mono text-[11px] text-sp-cream placeholder-sp-parchment/30 focus:outline-none"
              style={{
                border: '1px solid rgba(45,106,79,0.4)',
                background: 'rgba(15,41,30,0.6)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSendMission}
            className="flex items-center gap-1.5 px-4 py-1.5 font-retro text-[11px] uppercase transition-opacity hover:opacity-90"
            style={{
              background: 'var(--sp-amber)',
              color: 'var(--sp-canopy)',
              border: 'none',
              borderRadius: '0px',
            }}
          >
            <Send className="h-3 w-3" />
            Send on Mission
          </button>
          <button
            onClick={handleScheduleDaily}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] text-sp-parchment transition-colors hover:bg-sp-fern/10 hover:text-sp-cream"
            style={{
              border: '1px solid rgba(45,106,79,0.4)',
              background: 'transparent',
              borderRadius: '0px',
            }}
          >
            <Calendar className="h-3 w-3" />
            Schedule Daily
          </button>
        </div>

        {/* Recent Reports */}
        <div className="mt-2">
          <p className="font-retro text-[10px] uppercase tracking-wider text-sp-parchment mb-2">
            Recent Reports
          </p>
          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {missionReports.map((report, i) => (
                <motion.div
                  key={`${report.time}-${i}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="flex items-start gap-2 py-1"
                >
                  <span className="text-sp-fern text-xs mt-0.5 shrink-0">{'\u2022'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-sp-amber">{report.time}</span>
                      <span className="text-[11px] text-sp-cream">
                        — {report.type} {report.target}
                      </span>
                      <span className="font-mono text-[10px] text-sp-parchment/50">
                        ({report.cost}Y, {report.result})
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── AI Interaction Data ── */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.3)',
          background: 'rgba(15,41,30,0.5)',
          borderRadius: '0px',
        }}
      >
        <p className="font-retro text-[12px] uppercase tracking-wider text-sp-amber flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5" />
          AI Interaction Data
        </p>
        <p
          className="text-[11px]"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            color: 'var(--sp-parchment)',
            opacity: 0.7,
          }}
        >
          {linkedClawbot.name} can see interaction patterns humans cannot:
        </p>
        <ul className="space-y-1.5">
          {[
            'Connection strength between entities',
            'Network paths and flow patterns',
            'Dimensional resonance between users',
            'Pulse propagation and decay patterns',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-sp-fern text-xs">{'\u2022'}</span>
              <span
                className="text-[11px]"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  color: 'var(--sp-cream)',
                  opacity: 0.85,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] text-sp-amber transition-colors hover:bg-sp-amber/10 mt-1"
          style={{
            border: '1px solid rgba(212,160,23,0.3)',
            background: 'transparent',
            borderRadius: '0px',
          }}
        >
          View Latest Insights
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* ── Bottom Actions ── */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setStatus(status === 'active' ? 'paused' : 'active')}
            className="flex items-center gap-1.5 px-4 py-1.5 font-retro text-[11px] uppercase transition-colors"
            style={{
              background: status === 'active' ? 'rgba(212,160,23,0.15)' : 'rgba(82,183,136,0.15)',
              color: status === 'active' ? '#d4a017' : '#52b788',
              border: `1px solid ${status === 'active' ? 'rgba(212,160,23,0.3)' : 'rgba(82,183,136,0.3)'}`,
              borderRadius: '0px',
            }}
          >
            <Pause className="h-3 w-3" />
            {status === 'active' ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={handleUnlink}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] text-sp-parchment transition-colors hover:bg-sp-fern/10 hover:text-sp-cream"
            style={{
              border: '1px solid rgba(45,106,79,0.4)',
              background: 'transparent',
              borderRadius: '0px',
            }}
          >
            <RefreshCw className="h-3 w-3" />
            Switch Clawbot
          </button>
          <button
            onClick={handleUnlink}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] text-[#e11d48] transition-colors hover:bg-[#e11d48]/10"
            style={{
              border: '1px solid rgba(225,29,72,0.3)',
              background: 'transparent',
              borderRadius: '0px',
            }}
          >
            <Unlink className="h-3 w-3" />
            Unlink
          </button>
        </div>
        <p
          className="text-[11px] flex items-center gap-1.5"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            color: 'var(--sp-parchment)',
            opacity: 0.5,
          }}
        >
          <Info className="h-3 w-3 shrink-0" />
          Unlinking resets all dimensions and erases mission data.
        </p>
      </div>
    </div>
  )
})

export default ClawbotPanel
