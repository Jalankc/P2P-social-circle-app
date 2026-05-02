import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  User, Shield, HardDrive, Users, Eye, Bell, Palette, Radio, Code, LogOut, Bot,
} from 'lucide-react'

export type TabKey =
  | 'profile-faces'
  | 'encryption'
  | 'chunks'
  | 'friends'
  | 'privacy'
  | 'notifications'
  | 'appearance'
  | 'network'
  | 'clawbot'
  | 'developer'

const tabs: { key: TabKey; label: string; icon: typeof User; badge?: string }[] = [
  { key: 'profile-faces', label: 'Profile Faces', icon: User },
  { key: 'encryption', label: 'Encryption', icon: Shield },
  { key: 'chunks', label: 'Chunks & Backup', icon: HardDrive, badge: '3 pending' },
  { key: 'friends', label: 'Friends & Circles', icon: Users },
  { key: 'privacy', label: 'Privacy', icon: Eye },
  { key: 'notifications', label: 'Notifications', icon: Bell, badge: '12' },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'network', label: 'Network & P2P', icon: Radio },
  { key: 'clawbot', label: 'Clawbot', icon: Bot },
  { key: 'developer', label: 'Developer', icon: Code },
]

interface SettingsNavProps {
  active: TabKey
  onChange: (key: TabKey) => void
}

const SettingsNav = memo(function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <>
      {/* Mobile tab bar */}
      <div className="md:hidden overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = active === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => { onChange(tab.key) }}
                className={
                  'flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ' +
                  (isActive
                    ? 'bg-sp-fern/15 text-sp-cream border-l-[3px] border-sp-fern'
                    : 'text-sp-parchment hover:bg-sp-fern/10 hover:text-sp-cream')
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-0.5 rounded-full bg-crypt-ember px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop sticky nav */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="hidden md:block sticky top-20 w-[240px] shrink-0 self-start"
      >
        {/* User summary card */}
        <div className="mb-4 rounded-lg p-3" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-sp-fern/30">
              <img src="/avatar-default.jpg" alt="avatar" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sp-cream truncate">Jordan Seedling</p>
              <p className="text-xs text-sp-fern truncate">@jordan.p2p</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sp-sapling opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sp-sapling" />
            </span>
            <span className="text-[11px] text-sp-fern">Connected · 8 peers</span>
          </div>
        </div>

        {/* Tab list */}
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = active === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={
                  'group relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all ' +
                  (isActive
                    ? 'bg-sp-fern/15 text-sp-cream'
                    : 'text-sp-parchment hover:bg-sp-fern/10 hover:text-sp-cream hover:translate-x-1')
                }
              >
                {isActive && (
                  <motion.span
                    layoutId="active-tab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-sp-fern"
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                  />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.badge && (
                  <span className="rounded-full bg-crypt-ember/90 px-2 py-0.5 text-[11px] font-medium text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sign out */}
        <button className="mt-4 flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#e11d48] transition-colors hover:bg-[#e11d48]/10">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </motion.aside>
    </>
  )
})

export default SettingsNav
