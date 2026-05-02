import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Lock, Timer, X, Shield } from 'lucide-react'
import type { Conversation, FilterTab } from './types'

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'encrypted', label: 'Encrypted' },
  { key: 'groups', label: 'Groups' },
  { key: 'requests', label: 'Requests' },
]

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchFocused, setSearchFocused] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const filtered = useMemo(() => {
    let result = conversations.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.handle.toLowerCase().includes(search.toLowerCase())
      if (!matchesSearch) return false

      if (activeTab === 'encrypted') return c.encrypted
      if (activeTab === 'groups') return c.peerCount > 1
      if (activeTab === 'requests') return c.messages.length === 0
      return true
    })
    // Sort: active first, then by unread
    return result.sort((a, b) => {
      if (a.online && !b.online) return -1
      if (!a.online && b.online) return 1
      return b.unreadCount - a.unreadCount
    })
  }, [conversations, search, activeTab])

  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="flex h-full w-full flex-col border-r border-sp-moss/15 sm:w-[320px] sm:flex-shrink-0"
      style={{ background: 'rgba(15, 41, 30, 0.8)' }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-sp-cream">Talk</h2>
          <button
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-sp-bark transition-transform hover:scale-105"
            style={{ background: 'var(--sp-amber)' }}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sp-parchment/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Find someone..."
              className="w-full rounded-md py-2 pl-9 pr-3 text-sm text-sp-cream placeholder:text-sp-parchment/60 transition-all outline-none"
              style={{
                background: 'rgba(15, 41, 30, 0.6)',
                border: `1px solid ${searchFocused ? 'var(--sp-fern)' : 'rgba(82, 183, 136, 0.3)'}`,
                boxShadow: searchFocused ? '0 0 0 3px rgba(82, 183, 136, 0.15)' : 'none',
                width: searchFocused ? '100%' : '200px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Encryption banner */}
      <AnimatePresence>
        {!bannerDismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mx-4 mb-3 flex items-center gap-2 overflow-hidden rounded-md px-3 py-2"
            style={{ background: 'rgba(124, 58, 237, 0.15)' }}
          >
            <Shield className="h-4 w-4 flex-shrink-0 text-crypt-glow" />
            <span className="flex-1 text-xs text-crypt-glow">
              All conversations are end-to-end encrypted
            </span>
            <button onClick={() => setBannerDismissed(true)} className="text-crypt-glow/60 hover:text-crypt-glow">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-1 px-4 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            style={{
              background: activeTab === tab.key ? 'rgba(82, 183, 136, 0.2)' : 'transparent',
              color: activeTab === tab.key ? 'var(--sp-fern)' : 'var(--sp-parchment)',
              border: activeTab === tab.key ? '1px solid rgba(82, 183, 136, 0.3)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Shield className="h-10 w-10 text-sp-moss/40 mb-3" />
            <p className="text-sm text-sp-parchment mb-1">No conversations yet</p>
            <p className="text-xs text-sp-parchment/60">Start a conversation with someone in your circles</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((conv, idx) => (
              <motion.button
                key={conv.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(idx * 0.04, 0.6),
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                onClick={() => onSelect(conv.id)}
                className="flex items-center gap-3 px-4 py-3 text-left transition-colors w-full"
                style={{
                  background:
                    selectedId === conv.id
                      ? 'rgba(82, 183, 136, 0.15)'
                      : 'transparent',
                  borderLeft:
                    selectedId === conv.id
                      ? '3px solid var(--sp-fern)'
                      : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== conv.id) {
                    e.currentTarget.style.background = 'rgba(82, 183, 136, 0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== conv.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="h-12 w-12 rounded-full object-cover"
                    style={{
                      border: `2px solid ${conv.online ? 'var(--sp-fern)' : 'rgba(232, 224, 204, 0.3)'}`,
                    }}
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sp-canopy bg-sp-sapling" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sp-cream truncate">
                      {conv.name}
                    </span>
                    <span className="text-[11px] text-sp-parchment flex-shrink-0 ml-2">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {conv.encrypted && (
                      <Lock className="h-3 w-3 flex-shrink-0 text-crypt-glow" />
                    )}
                    {conv.selfDestruct && (
                      <Timer className="h-3 w-3 flex-shrink-0 text-crypt-ember" />
                    )}
                    <span className="text-[13px] text-sp-parchment truncate max-w-[140px]">
                      {conv.lastMessage}
                    </span>
                  </div>
                </div>

                {/* Unread */}
                {conv.unreadCount > 0 && (
                  <span
                    className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold flex-shrink-0"
                    style={{ background: 'var(--sp-amber)', color: 'var(--sp-bark)' }}
                  >
                    {conv.unreadCount}
                  </span>
                )}

                {/* Encryption badge */}
                {conv.encrypted && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
                    <Lock className="h-3 w-3 text-crypt-glow" />
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
