import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Pin,
  X,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ThreadReactions {
  M: number
  S: number
  I: number
  E: number
}

interface PulsingThread {
  id: string
  title: string
  author: string
  topic: string
  tags: string[]
  pulse: number
  pulsePath: string
  reactions: ThreadReactions
  replies: number
  sticky?: boolean
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const ALL_TAGS = [
  'p2p',
  'tech',
  'solarpunk',
  'music',
  'art',
  'intro',
  'market',
  'design',
  'garden',
  'crypto',
] as const

const PULSING_THREADS: PulsingThread[] = [
  {
    id: '1',
    title: 'P2P Mesh Network v2.1 Released',
    author: '@willow',
    topic: 'Announcements',
    tags: ['p2p', 'tech'],
    pulse: 89,
    pulsePath: 'You \u2190 River \u2190 Aspen \u2190 12 others',
    reactions: { M: 12, S: 45, I: 8, E: 23 },
    replies: 89,
    sticky: true,
  },
  {
    id: '2',
    title: 'Solar Garden Build-Off Results',
    author: '@river',
    topic: 'General Discussion',
    tags: ['solarpunk', 'garden'],
    pulse: 67,
    pulsePath: 'You \u2190 Jade \u2022 3 hops',
    reactions: { M: 3, S: 67, I: 12, E: 45 },
    replies: 34,
  },
  {
    id: '3',
    title: 'New Chunk Redesign is Live',
    author: '@jade',
    topic: 'Topics of Interest',
    tags: ['p2p', 'design'],
    pulse: 45,
    pulsePath: 'Direct \u2022 2 hops',
    reactions: { M: 0, S: 23, I: 34, E: 12 },
    replies: 56,
  },
  {
    id: '4',
    title: 'Music Thread: Post Your Beats',
    author: '@aspen',
    topic: 'Blogs, Videos & Wall',
    tags: ['music'],
    pulse: 34,
    pulsePath: 'You \u2190 Pine \u2022 3 hops',
    reactions: { M: 1, S: 34, I: 5, E: 8 },
    replies: 89,
  },
  {
    id: '5',
    title: 'Introduce Yourself! [April]',
    author: '@pine',
    topic: 'Introductions',
    tags: ['intro'],
    pulse: 21,
    pulsePath: 'Direct \u2022 1 hop',
    reactions: { M: 0, S: 21, I: 2, E: 15 },
    replies: 203,
  },
]

/* ------------------------------------------------------------------ */
/*  BBCode Renderer                                                    */
/* ------------------------------------------------------------------ */

function renderBBCode(input: string): string {
  if (!input) return ''
  let html = input
    // Escape HTML first to prevent injection
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // [b]bold[/b]
    .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
    // [i]italic[/i]
    .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
    // [u]underline[/u]
    .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
    // [s]strikethrough[/s]
    .replace(/\[s\](.*?)\[\/s\]/g, '<s>$1</s>')
    // [color=#hex]text[/color]
    .replace(/\[color=([^\]]+)\](.*?)\[\/color\]/g, '<span style="color:$1">$2</span>')
    // [size=N]text[/size]
    .replace(/\[size=(\d+)\](.*?)\[\/size\]/g, '<span style="font-size:$1px">$2</span>')
    // [url=link]text[/url]
    .replace(/\[url=([^\]]+)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--sp-fern);text-decoration:underline">$2</a>')
    // [url]link[/url]
    .replace(/\[url\](.*?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--sp-fern);text-decoration:underline">$1</a>')
    // [img]url[/img]
    .replace(/\[img\](.*?)\[\/img\]/g, '<img src="$1" alt="" style="max-width:100%;display:block;margin:4px 0;" />')
    // [quote=author]text[/quote]
    .replace(/\[quote=([^\]]*)\](.*?)\[\/quote\]/g, '<blockquote style="border-left:2px solid var(--sp-amber);padding-left:8px;margin:4px 0;color:var(--sp-parchment)"><em style="font-size:11px;color:var(--sp-amber)">$1 wrote:</em><br/>$2</blockquote>')
    // [quote]text[/quote]
    .replace(/\[quote\](.*?)\[\/quote\]/g, '<blockquote style="border-left:2px solid var(--sp-amber);padding-left:8px;margin:4px 0;color:var(--sp-parchment)">$1</blockquote>')
    // [code]text[/code]
    .replace(/\[code\](.*?)\[\/code\]/g, '<code style="font-family:JetBrains Mono,monospace;font-size:12px;background:rgba(45,106,79,0.2);padding:2px 4px;color:var(--crypt-terminal)">$1</code>')
    // [center]text[/center]
    .replace(/\[center\](.*?)\[\/center\]/g, '<div style="text-align:center">$1</div>')
    // [spoiler]text[/spoiler]
    .replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '<span style="background:var(--sp-parchment);color:var(--sp-parchment);padding:0 2px;cursor:pointer" onclick="this.style.color=\'var(--sp-cream)\';this.style.background=\'transparent\'">$1</span>')
    // [list][*]...[/list]
    .replace(/\[list\](.*?)\[\/list\]/gs, (_m, content: string) => {
      const items = content.split('[*]').filter((s: string) => s.trim()).map((s: string) => `<li style="margin-left:16px;font-size:14px;color:var(--sp-cream)">${s.trim()}</li>`).join('')
      return `<ul style="list-style-type:disc;padding-left:8px">${items}</ul>`
    })
    // Line breaks
    .replace(/\n/g, '<br/>')

  return html
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function pulseColor(pulse: number): string {
  if (pulse >= 100) return 'var(--sp-amber)'
  if (pulse >= 51) return 'var(--sp-amber)'
  return 'var(--sp-parchment)'
}

function pulseTextShadow(pulse: number): string {
  if (pulse >= 100) return '0 0 8px rgba(212, 160, 23, 0.4)'
  return 'none'
}

function pulseIconFilter(pulse: number): string {
  if (pulse >= 100) return 'drop-shadow(0 0 4px rgba(212, 160, 23, 0.6))'
  return 'none'
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TagPill({
  tag,
  selected,
  onClick,
}: {
  tag: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="border font-retro text-xs uppercase tracking-wider px-3 py-1 transition-colors"
      style={{
        borderRadius: '0px',
        borderColor: selected ? 'var(--sp-amber)' : 'rgba(82, 183, 136, 0.4)',
        backgroundColor: selected ? 'var(--sp-amber)' : 'transparent',
        color: selected ? 'var(--sp-bark)' : 'var(--sp-fern)',
      }}
    >
      #{tag}
    </button>
  )
}

function ThreadRow({
  thread,
  index,
}: {
  thread: PulsingThread
  index: number
}) {
  const pColor = pulseColor(thread.pulse)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="group flex items-stretch border"
      style={{
        borderRadius: '0px',
        borderColor: 'rgba(45, 106, 79, 0.3)',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.backgroundColor = 'rgba(82, 183, 136, 0.08)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.backgroundColor = 'transparent'
      }}
    >
      {/* Pulse indicator - left */}
      <div
        className="flex flex-col items-center justify-center px-4 py-4 md:px-6 md:py-5 border-r"
        style={{
          borderColor: 'rgba(45, 106, 79, 0.3)',
          minWidth: '80px',
        }}
      >
        <div className="flex items-center gap-1">
          <Zap
            className="h-4 w-4 md:h-5 md:w-5"
            style={{
              color: pColor,
              filter: pulseIconFilter(thread.pulse),
            }}
          />
          <span
            className="font-display text-xl md:text-2xl font-bold"
            style={{
              color: pColor,
              textShadow: pulseTextShadow(thread.pulse),
            }}
          >
            {thread.pulse}
          </span>
        </div>
      </div>

      {/* Thread info - right */}
      <div className="flex-1 px-4 py-3 md:px-5 md:py-4 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2 flex-wrap">
          {thread.sticky && (
            <Pin className="h-3.5 w-3.5 text-sp-amber flex-shrink-0" />
          )}
          <h3
            className="text-base text-sp-cream truncate"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500 }}
            dangerouslySetInnerHTML={{ __html: renderBBCode(thread.title) }}
          />
        </div>

        {/* Meta row */}
        <p className="mt-1 font-mono text-[11px] text-sp-parchment">
          by{' '}
          <span className="text-sp-fern">{thread.author}</span>
          {' in '}
          {thread.topic}
          {' \u2022 '}
          {thread.tags.map((t) => `#${t}`).join(' ')}
        </p>

        {/* Pulse path */}
        <p className="mt-1.5 font-mono text-[11px] text-sp-parchment/70">
          {'Pulse: '}
          {thread.pulsePath}
        </p>

        {/* Reactions + replies */}
        <div className="mt-2 flex items-center gap-3 flex-wrap font-mono text-[11px] text-sp-parchment">
          <span title="Material">
            <span className="text-sp-cream">{'\u2699\uFE0F'}</span>
            {' '}
            {thread.reactions.M}M
          </span>
          <span title="Social">
            <span className="text-sp-cream">{'\uD83D\uDCAC'}</span>
            {' '}
            {thread.reactions.S}S
          </span>
          <span title="Innovation">
            <span className="text-sp-cream">{'\uD83D\uDCA1'}</span>
            {' '}
            {thread.reactions.I}I
          </span>
          <span title="Ecology">
            <span className="text-sp-cream">{'\uD83C\uDF31'}</span>
            {' '}
            {thread.reactions.E}E
          </span>
          <span style={{ color: 'rgba(45, 106, 79, 0.5)' }}>|</span>
          <span>{thread.replies} replies</span>
        </div>
      </div>
    </motion.div>
  )
}

function FilterPanel({
  selectedTags,
  onToggleTag,
  onClearAll,
}: {
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  onClearAll: () => void
}) {
  return (
    <div
      className="border p-4 md:p-5"
      style={{
        borderRadius: '0px',
        borderColor: 'rgba(45, 106, 79, 0.3)',
        backgroundColor: 'rgba(15, 41, 30, 0.5)',
      }}
    >
      {/* Header */}
      <h2 className="font-retro text-sm uppercase tracking-wider text-sp-amber mb-3">
        {'\uD83C\uDFF7\uFE0F Filter by Tag'}
      </h2>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => (
          <TagPill
            key={tag}
            tag={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => onToggleTag(tag)}
          />
        ))}
      </div>

      {/* Active filters */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="mt-3 flex items-center gap-3 overflow-hidden"
          >
            <span className="font-mono text-[11px] text-sp-parchment">
              Active: {selectedTags.map((t) => `#${t}`).join(' ')}
            </span>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 font-mono text-[11px] text-sp-fern hover:text-sp-cream transition-colors"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ThreadsPanel({
  threads,
}: {
  threads: PulsingThread[]
}) {
  return (
    <div
      className="border p-4 md:p-5"
      style={{
        borderRadius: '0px',
        borderColor: 'rgba(45, 106, 79, 0.3)',
        backgroundColor: 'rgba(15, 41, 30, 0.5)',
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-retro text-sm uppercase tracking-wider text-sp-amber">
          {'\u26A1 Pulsing Threads'}
        </h2>
        <p className="font-mono text-[11px] text-sp-parchment mt-1">
          {'Organic propagation \u2014 highest pulse from your network'}
        </p>
      </div>

      {/* Thread rows */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {threads.map((thread, index) => (
            <ThreadRow key={thread.id} thread={thread} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {threads.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <p className="font-mono text-sm text-sp-parchment">
            No threads match your selected tags.
          </p>
          <p className="font-mono text-[11px] text-sp-parchment/60 mt-1">
            Try different tag combinations.
          </p>
        </motion.div>
      )}
    </div>
  )
}

function LegendPanel() {
  return (
    <div
      className="border p-4 md:p-5"
      style={{
        borderRadius: '0px',
        borderColor: 'rgba(45, 106, 79, 0.3)',
        backgroundColor: 'rgba(15, 41, 30, 0.3)',
      }}
    >
      <h3 className="font-retro text-sm uppercase tracking-wider text-sp-amber mb-2">
        {'\uD83D\uDCCA Pulse Legend'}
      </h3>
      <div className="font-mono text-[11px] text-sp-parchment leading-relaxed space-y-1">
        <p>
          <span className="text-sp-amber">{'\u26A1'}</span>
          {' = Pulse Score (hops \u00d7 interactions)'}
        </p>
        <p>
          {'Pulse shows how far a thread has traveled through friend networks'}
        </p>
        <p>
          {'No AI. No algorithm. Just organic propagation + your tag choices.'}
        </p>
        <div className="h-px bg-sp-moss/20 my-2" />
        <p>
          <a
            href="/#/store"
            className="text-sp-fern hover:text-sp-sapling transition-colors"
            style={{ textDecoration: 'none' }}
          >
            {'\u{1F6D2} Visit the P2P Store \u2192 /store'}
          </a>
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Feed Component                                                */
/* ------------------------------------------------------------------ */

export default function Feed() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearAll = () => setSelectedTags([])

  // AND logic: thread must have ALL selected tags
  const filteredThreads = useMemo(() => {
    if (selectedTags.length === 0) return PULSING_THREADS
    return PULSING_THREADS.filter((thread) =>
      selectedTags.every((tag) => thread.tags.includes(tag))
    )
  }, [selectedTags])

  return (
    <div
      className="min-h-[calc(100dvh-64px)] px-4 py-6 md:px-6 md:py-8"
      style={{
        background: 'var(--sp-canopy)',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(45, 106, 79, 0.15) 0%, transparent 70%)',
      }}
    >
      <div className="mx-auto max-w-[900px] space-y-5">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <h1 className="font-retro text-lg md:text-xl uppercase tracking-wider text-sp-amber">
            {'\uD83C\uDF10 Pulse Feed \u2014 Organic Propagation'}
          </h1>
        </motion.div>

        {/* Tag filter */}
        <FilterPanel
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClearAll={clearAll}
        />

        {/* Pulsing threads */}
        <ThreadsPanel threads={filteredThreads} />

        {/* Legend */}
        <LegendPanel />
      </div>
    </div>
  )
}
