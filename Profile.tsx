import { useState, useRef, useEffect, useCallback, createContext } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, Send, Lock, Pin, Users, MessageSquare,
  ArrowLeft,
  Cog, MessageCircle, Lightbulb, Leaf,
  Play,
} from 'lucide-react'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type Rank = 'SA' | 'A' | 'SM' | 'M' | 'U' | 'Banned'
type CurrencyType = 'M' | 'S' | 'I' | 'E'
type AudienceType = 'public' | 'friends' | 'greater-circle' | 'circle' | 'anonymous'

interface Wallet {
  M: number
  S: number
  I: number
  E: number
}

interface ReactionSet {
  M: number
  S: number
  I: number
  E: number
}

interface ForumPostData {
  id: string
  author: string
  displayNameBBCode: string
  handle: string
  avatar: string
  rank: Rank
  postCount: number
  seeds: number
  quality: number /* 1-5 */
  density: number /* 0-100 */
  wallet: Wallet
  content: string
  signature: string
  reactions: ReactionSet
  timestamp: string
  postNumber: number
}

interface ThreadData {
  id: string
  title: string
  category: string
  forumName: string
  sticky: boolean
  locked: boolean
  posts: ForumPostData[]
}

/* ─── Currency Context ─── */
interface CurrencyContextValue {
  wallet: Wallet
  addCurrency: (type: CurrencyType, amount: number) => void
}

const CurrencyContext = createContext<CurrencyContextValue>({
  wallet: { M: 0, S: 0, I: 0, E: 0 },
  addCurrency: () => {},
})

/* ═══════════════════════════════════════════
   CUSTOM RANKS
   ═══════════════════════════════════════════ */

const CUSTOM_RANKS: Record<Rank, { name: string; icon: string; color: string }> = {
  SA: { name: 'Grove Keeper', icon: '🌿', color: '#d4a017' },
  A:  { name: 'Branch Elder', icon: '🍂', color: '#52b788' },
  SM: { name: 'Seed Guardian', icon: '🛡️', color: '#7c3aed' },
  M:  { name: 'Sprout Guide', icon: '🌱', color: '#2d6a4f' },
  U:  { name: 'Seedling', icon: '👤', color: '#95d5b2' },
  Banned: { name: 'Banned', icon: '🚫', color: '#e11d48' },
}

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */

interface BackgroundStyle {
  type: 'solid' | 'gradient'
  value: string
  opacity: number
}

const OWNER = {
  name: 'Willow',
  handle: 'willow_03',
  forumTitle: "Willow's Grove",
  avatar: '/avatar-default.jpg',
  backgroundStyle: {
    type: 'gradient' as const,
    value: 'linear-gradient(135deg, #0f291e 0%, #1b4332 50%, #2d6a4f 100%)',
    opacity: 1,
  } satisfies BackgroundStyle,
}

const CURRENT_USER_WALLET: Wallet = {
  M: 890,
  S: 1247,
  I: 340,
  E: 45200,
}

const CURRENT_USER_SIGNATURE = "~ 🌿 Grove Keeper of Willow's Grove ~ P2P Seed Collector ~"

const MOCK_THREAD: ThreadData = {
  id: 'welcome-grove',
  title: 'Welcome to the Grove',
  category: 'General Discussion',
  forumName: "Willow's Grove",
  sticky: true,
  locked: false,
  posts: [
    {
      id: 'p1',
      author: 'Willow',
      displayNameBBCode: '[color=#52b788][b]Willow[/b][/color]',
      handle: 'willow_03',
      avatar: '/avatar-default.jpg',
      rank: 'SA',
      postCount: 1247,
      seeds: 892,
      quality: 5,
      density: 85,
      wallet: { M: 890, S: 1247, I: 340, E: 45200 },
      content:
        "Welcome everyone to my grove. This is a space for P2P enthusiasts, solarpunks, and digital gardeners. Here we share seeds, trade ideas, and build a mesh network of friends. No servers, only seeds. 🌱\n\nFeel free to introduce yourself in the General Discussion area. Check out the invisible lounges for private gatherings. And remember — every post you make plants a seed in the network.",
      signature: "~ 🌿 Grove Keeper of Willow's Grove ~ P2P Seed Collector ~",
      reactions: { M: 23, S: 5, I: 2, E: 12 },
      timestamp: 'EarthCycle 12, 08:42 UTC',
      postNumber: 1,
    },
    {
      id: 'p2',
      author: 'River',
      displayNameBBCode: '[color=#00bcd4][b]River[/b][/color]',
      handle: 'river_07',
      avatar: '/avatar-default.jpg',
      rank: 'A',
      postCount: 890,
      seeds: 567,
      quality: 4,
      density: 72,
      wallet: { M: 2340, S: 892, I: 567, E: 23100 },
      content:
        "Glad to be here! I've been working on a new chunk redistribution algorithm that should improve seed resilience by 40%. The key insight is using a gossip protocol with periodic entropy checks.\n\nI've tested it across 12 nodes in my local mesh and the results are promising. Will post the technical details in a follow-up thread once I clean up the code.",
      signature: "~ Branch Elder & Code Keeper ~ Check my work @ /river ~",
      reactions: { M: 18, S: 8, I: 0, E: 7 },
      timestamp: 'EarthCycle 12, 09:15 UTC',
      postNumber: 2,
    },
    {
      id: 'p3',
      author: 'Pine',
      displayNameBBCode: '[color=#95d5b2][b]Pine[/b][/color]',
      handle: 'pine_new',
      avatar: '/avatar-default.jpg',
      rank: 'U',
      postCount: 34,
      seeds: 12,
      quality: 2,
      density: 34,
      wallet: { M: 45, S: 12, I: 0, E: 340 },
      content:
        "Hi I'm new here. How does the seed thing work? Do I need to download something? I heard about P2P social from a friend and it sounds really cool but I'm not super technical. Can someone point me to a beginner's guide?",
      signature: "~ Newbie seedling ~ Just getting started ~",
      reactions: { M: 2, S: 0, I: 0, E: 1 },
      timestamp: 'EarthCycle 12, 11:03 UTC',
      postNumber: 3,
    },
  ],
}

/* ─── Forum Settings Mock ─── */
const FORUM_SETTINGS = {
  aiTolerance: 50,
  translation: {
    enabled: true,
    fromLanguage: 'Japanese',
  },
}

/* ═══════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════ */

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ─── BBCode Rendering ─── */
function renderBBCode(bbcode: string): string {
  if (!bbcode) return ''
  return bbcode
    .replace(/\[b\](.+?)\[\/b\]/g, '<strong>$1</strong>')
    .replace(/\[i\](.+?)\[\/i\]/g, '<em>$1</em>')
    .replace(/\[u\](.+?)\[\/u\]/g, '<u>$1</u>')
    .replace(/\[s\](.+?)\[\/s\]/g, '<s>$1</s>')
    .replace(/\[color=(.+?)\](.+?)\[\/color\]/g, '<span style="color:$1">$2</span>')
    .replace(/\[size=(\d+)\](.+?)\[\/size\]/g, '<span style="font-size:$1px">$2</span>')
    .replace(/\[url=(.+?)\](.+?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noopener" style="color:#52b788;text-decoration:underline">$2</a>')
    .replace(/\[url\](.+?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noopener" style="color:#52b788;text-decoration:underline">$1</a>')
    .replace(/\[img\](.+?)\[\/img\]/g, '<img src="$1" style="max-width:100%;border:1px solid rgba(82,183,136,0.3)" />')
    .replace(/\[quote=(.+?)\](.+?)\[\/quote\]/g, '<blockquote style="border-left:3px solid #d4a017;padding-left:8px;margin:4px 0;color:#f5f0e1"><cite style="color:#95d5b2;font-size:11px">$1 wrote:</cite><br/>$2</blockquote>')
    .replace(/\[quote\](.+?)\[\/quote\]/g, '<blockquote style="border-left:3px solid #d4a017;padding-left:8px;margin:4px 0;color:#f5f0e1">$1</blockquote>')
    .replace(/\[code\](.+?)\[\/code\]/g, '<pre style="background:rgba(6,32,21,0.8);color:#52b788;font-family:JetBrains Mono,monospace;padding:8px;border:1px solid rgba(82,183,136,0.3);overflow-x:auto;font-size:12px">$1</pre>')
    .replace(/\[center\](.+?)\[\/center\]/g, '<div style="text-align:center">$1</div>')
    .replace(/\[left\](.+?)\[\/left\]/g, '<div style="text-align:left">$1</div>')
    .replace(/\[right\](.+?)\[\/right\]/g, '<div style="text-align:right">$1</div>')
    .replace(/\[spoiler\](.+?)\[\/spoiler\]/g, '<span class="spoiler-text" style="background:#0f291e;color:#0f291e;cursor:pointer" onclick="this.style.color=\'#f5f0e1\'">$1</span>')
}

function BBCodeHtml({ bbcode, className }: { bbcode: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderBBCode(bbcode) }} />
}

function formatCurrency(n: number): string {
  if (n >= 10000) return (n / 1000).toFixed(1) + 'K'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════ */

function RankBadge({ rank }: { rank: Rank }) {
  const config = CUSTOM_RANKS[rank] || CUSTOM_RANKS.U
  return (
    <span
      className="inline-flex items-center px-1 py-0 font-retro text-[9px] uppercase tracking-wider"
      style={{
        background: config.color + '22',
        color: config.color,
        border: `1px solid ${config.color}44`,
        borderRadius: '2px',
        lineHeight: 1,
      }}
    >
      [{config.icon} {config.name}]
    </span>
  )
}

function QualityStars({ quality }: { quality: number }) {
  const filled = '★'
  const empty = '☆'
  const stars = filled.repeat(quality) + empty.repeat(5 - quality)
  const colorMap: Record<number, string> = {
    5: '#d4a017', /* amber */
    4: '#52b788', /* green */
    3: '#95d5b2', /* sapling */
    2: '#e8e0cc', /* parchment */
    1: '#e11d48', /* red */
  }
  const color = colorMap[quality] || colorMap[2]
  return (
    <span className="font-mono text-[12px]" style={{ color }}>
      {stars}
    </span>
  )
}

function DensityBar({ density }: { density: number }) {
  const filled = Math.round(density / 10)
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)
  return (
    <span className="font-mono text-[11px] text-sp-parchment">
      Density: {bar} {density}%
    </span>
  )
}

function CredibilityBadge({ score, showLabel }: { score: number; showLabel?: boolean }) {
  const color = score >= 76 ? '#52b788' : score >= 51 ? '#74c69d' : score >= 26 ? '#d4a017' : '#dc2626'
  const label = score >= 76 ? 'Verified' : score >= 51 ? 'Trusted' : score >= 26 ? 'Building' : 'New'
  return (
    <span className="inline-flex items-center gap-1" style={{ color, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
      <span style={{ fontSize: 10 }}>🛡️</span>
      <span>{score}</span>
      {showLabel && <span style={{ opacity: 0.7 }}>({label})</span>}
    </span>
  )
}

function CurrencyMiniBadge({ type, amount }: { type: CurrencyType; amount: number }) {
  const config: Record<CurrencyType, { icon: string; color: string }> = {
    M: { icon: '🔩', color: '#95a5a6' },
    S: { icon: '💬', color: '#d4a017' },
    I: { icon: '💡', color: '#00bcd4' },
    E: { icon: '🌱', color: '#52b788' },
  }
  const c = config[type]
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-[11px]" style={{ color: c.color }}>
      <span>{c.icon}</span>
      <span>{formatCurrency(amount)}</span>
    </span>
  )
}

function CurrencyMiniBadges({ wallet }: { wallet: Wallet }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
      <CurrencyMiniBadge type="M" amount={wallet.M} />
      <CurrencyMiniBadge type="S" amount={wallet.S} />
      <CurrencyMiniBadge type="I" amount={wallet.I} />
      <CurrencyMiniBadge type="E" amount={wallet.E} />
    </div>
  )
}

/* ─── Reaction Button with Animation ─── */
function ReactionButton({
  type,
  count,
  active,
  onReact,
}: {
  type: CurrencyType
  count: number
  active: boolean
  onReact: () => void
}) {
  const config: Record<CurrencyType, { label: string; icon: React.ReactNode; color: string; bgHover: string }> = {
    M: {
      label: 'M-aterial',
      icon: <Cog className="h-3.5 w-3.5" />,
      color: '#95a5a6',
      bgHover: 'rgba(149,165,166,0.15)',
    },
    S: {
      label: 'S-ocial',
      icon: <MessageCircle className="h-3.5 w-3.5" />,
      color: '#d4a017',
      bgHover: 'rgba(212,160,23,0.15)',
    },
    I: {
      label: 'I-nnovation',
      icon: <Lightbulb className="h-3.5 w-3.5" />,
      color: '#00bcd4',
      bgHover: 'rgba(0,188,212,0.15)',
    },
    E: {
      label: 'E-cology',
      icon: <Leaf className="h-3.5 w-3.5" />,
      color: '#52b788',
      bgHover: 'rgba(82,183,136,0.15)',
    },
  }
  const c = config[type]

  return (
    <motion.button
      onClick={onReact}
      className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] transition-colors"
      style={{
        border: `1px solid ${active ? c.color : 'rgba(45,106,79,0.4)'}`,
        background: active ? c.bgHover : 'transparent',
        color: active ? c.color : '#e8e0cc',
        borderRadius: '0px',
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span style={{ color: c.color }}>{c.icon}</span>
      <span>{c.label}</span>
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="ml-0.5"
      >
        {count}
      </motion.span>
    </motion.button>
  )
}

/* ─── Floating +1 Animation ─── */
function FloatingPlus({
  type,
  onDone,
}: {
  type: CurrencyType
  onDone: () => void
}) {
  const icons: Record<CurrencyType, string> = {
    M: '🔩',
    S: '💬',
    I: '💡',
    E: '🌱',
  }
  return (
    <motion.div
      className="pointer-events-none absolute font-mono text-[13px] font-bold z-50"
      style={{ color: '#52b788' }}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    >
      +1 {icons[type]}
    </motion.div>
  )
}

/* ─── Audience Selector ─── */
const AUDIENCE_OPTIONS: { value: AudienceType; label: string; icon: string; desc: string }[] = [
  { value: 'public', label: 'Public', icon: '🌐', desc: 'Anyone can see. Friends notified. Propagates freely.' },
  { value: 'friends', label: 'Friends', icon: '👥', desc: 'Your friends see it. Their interactions do not propagate further.' },
  { value: 'greater-circle', label: 'Greater Circle', icon: '🌍', desc: 'Friends of friends — your friends see it, then THEIR friends see it. 2-hop propagation.' },
  { value: 'circle', label: 'Circle', icon: '🔒', desc: 'Only members of selected circle. No propagation.' },
  { value: 'anonymous', label: 'Anonymous', icon: '👤', desc: 'Post as nickname. Still respects audience reach.' },
]

function AudienceSelector({
  selected,
  onChange,
}: {
  selected: AudienceType
  onChange: (a: AudienceType) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedOpt = AUDIENCE_OPTIONS.find((a) => a.value === selected) || AUDIENCE_OPTIONS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] transition-colors"
        style={{
          border: '1px solid rgba(45,106,79,0.4)',
          background: 'rgba(15,41,30,0.6)',
          borderRadius: '0px',
          color: '#e8e0cc',
        }}
      >
        <span>{selectedOpt.icon}</span>
        <span>{selectedOpt.label}</span>
        <ChevronRight className="h-3 w-3 text-sp-parchment" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 z-50"
              style={{
                width: '280px',
                background: 'var(--sp-canopy)',
                border: '1px solid rgba(45,106,79,0.5)',
                borderRadius: '0px',
              }}
            >
              {AUDIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className="w-full flex items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-sp-fern/10"
                  style={{
                    borderBottom: '1px solid rgba(45,106,79,0.15)',
                    background: selected === opt.value ? 'rgba(82,183,136,0.1)' : 'transparent',
                  }}
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{opt.icon}</span>
                  <div>
                    <span className="font-mono text-[12px] text-sp-cream block">{opt.label}</span>
                    <span className="font-mono text-[10px] text-sp-parchment leading-tight">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   POST COMPONENTS
   ═══════════════════════════════════════════ */

function PostAuthorColumn({ post }: { post: ForumPostData }) {
  const rankBorderColor: Record<Rank, string> = {
    SA: '#d4a017',
    A: '#52b788',
    SM: '#7c3aed',
    M: '#2d6a4f',
    U: '#95d5b2',
    Banned: '#e11d48',
  }

  return (
    <div
      className="flex-shrink-0 p-3 flex flex-col items-center gap-2"
      style={{
        width: '160px',
        background: 'rgba(15,41,30,0.5)',
        borderRight: '1px solid rgba(45,106,79,0.25)',
      }}
    >
      {/* Avatar */}
      <div
        className="h-20 w-20 overflow-hidden"
        style={{
          border: `2px solid ${rankBorderColor[post.rank] || '#95d5b2'}`,
          borderRadius: '2px',
        }}
      >
        <img src={post.avatar} alt={post.author} className="h-full w-full object-cover" />
      </div>

      {/* Username */}
      <BBCodeHtml
        bbcode={post.displayNameBBCode || post.author}
        className="text-sm font-bold text-sp-cream"
      />

      {/* Rank Badge */}
      <RankBadge rank={post.rank} />

      {/* Stats */}
      <div className="flex flex-col items-center gap-0.5 mt-1">
        <span className="font-mono text-[11px] text-sp-parchment">
          Posts: {post.postCount.toLocaleString()}
        </span>
        <span className="font-mono text-[11px] text-sp-parchment">
          Seeds: {post.seeds.toLocaleString()}
        </span>
      </div>

      {/* Quality */}
      <div className="flex items-center gap-1">
        <span className="font-mono text-[11px] text-sp-parchment">Rep:</span>
        <QualityStars quality={post.quality} />
      </div>

      {/* Density */}
      <DensityBar density={post.density} />

      {/* Credibility */}
      <CredibilityBadge score={Math.min(100, post.quality * 20)} showLabel />

      {/* Currencies */}
      <div className="mt-1 pt-1" style={{ borderTop: '1px solid rgba(45,106,79,0.2)', width: '100%' }}>
        <CurrencyMiniBadges wallet={post.wallet} />
      </div>
    </div>
  )
}

function PostContentColumn({
  post,
  onReact,
  userReactions,
  floatingAnim,
}: {
  post: ForumPostData
  onReact: (postId: string, type: CurrencyType) => void
  userReactions: Record<string, Record<CurrencyType, boolean>>
  floatingAnim: { id: string; type: CurrencyType } | null
}) {
  return (
    <div className="flex-1 min-w-0 p-3 flex flex-col">
      {/* Post header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-sp-parchment">
            Post #{post.postNumber}
          </span>
          <span className="font-mono text-[10px] text-sp-parchment">|</span>
          <span className="font-mono text-[10px] text-sp-parchment">{post.timestamp}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="font-mono text-[10px] text-sp-fern hover:text-sp-cream transition-colors">
            Quote
          </button>
          <button className="font-mono text-[10px] text-sp-parchment hover:text-sp-amber transition-colors">
            Report
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm text-sp-cream whitespace-pre-wrap leading-relaxed"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.6 }}
        >
          {post.content}
        </p>
      </div>

      {/* Reactions */}
      <div className="mt-3 pt-2 flex items-center gap-2 relative" style={{ borderTop: '1px solid rgba(45,106,79,0.2)' }}>
        <ReactionButton
          type="M"
          count={post.reactions.M}
          active={!!userReactions[post.id]?.M}
          onReact={() => onReact(post.id, 'M')}
        />
        <ReactionButton
          type="S"
          count={post.reactions.S}
          active={!!userReactions[post.id]?.S}
          onReact={() => onReact(post.id, 'S')}
        />
        <ReactionButton
          type="I"
          count={post.reactions.I}
          active={!!userReactions[post.id]?.I}
          onReact={() => onReact(post.id, 'I')}
        />
        <ReactionButton
          type="E"
          count={post.reactions.E}
          active={!!userReactions[post.id]?.E}
          onReact={() => onReact(post.id, 'E')}
        />

        {/* Floating animation */}
        <AnimatePresence>
          {floatingAnim && floatingAnim.id === post.id && (
            <FloatingPlus
              type={floatingAnim.type}
              onDone={() => {}}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Signature */}
      {post.signature && (
        <>
          <div className="mt-2 mb-1.5" style={{ borderTop: '1px dashed rgba(45,106,79,0.3)' }} />
          <p className="text-xs italic text-sp-parchment leading-relaxed" style={{ maxHeight: '54px', overflow: 'hidden' }}>
            {post.signature}
          </p>
        </>
      )}
    </div>
  )
}

function ForumPostRow({
  post,
  onReact,
  userReactions,
  floatingAnim,
}: {
  post: ForumPostData
  onReact: (postId: string, type: CurrencyType) => void
  userReactions: Record<string, Record<CurrencyType, boolean>>
  floatingAnim: { id: string; type: CurrencyType } | null
}) {
  return (
    <div
      className="flex"
      style={{
        borderBottom: '1px solid rgba(45,106,79,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <PostAuthorColumn post={post} />
      <PostContentColumn
        post={post}
        onReact={onReact}
        userReactions={userReactions}
        floatingAnim={floatingAnim}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════
   THREAD HEADER
   ═══════════════════════════════════════════ */

function ThreadHeader({
  thread,
  onBack,
}: {
  thread: ThreadData
  onBack: () => void
}) {
  const [subscribed, setSubscribed] = useState(false)

  return (
    <div
      style={{
        border: '1px solid rgba(45,106,79,0.3)',
        background: 'rgba(15,41,30,0.6)',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-3 py-1.5" style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-1 font-mono text-[11px] text-sp-fern hover:text-sp-cream transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </button>
        <ChevronRight className="h-3 w-3 text-sp-parchment" />
        <span className="font-mono text-[11px] text-sp-parchment">{thread.forumName}</span>
        <ChevronRight className="h-3 w-3 text-sp-parchment" />
        <span className="font-mono text-[11px] text-sp-fern">{thread.category}</span>
        <ChevronRight className="h-3 w-3 text-sp-parchment" />
        <span className="font-mono text-[11px] text-sp-cream truncate">{thread.title}</span>
      </div>

      {/* Title & Actions */}
      <div className="flex items-center justify-between px-3 py-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h1
            className="font-display text-[28px] font-bold text-sp-cream"
            style={{ letterSpacing: '-0.005em', lineHeight: 1.25 }}
          >
            {thread.title}
          </h1>
          {thread.sticky && (
            <span className="flex items-center gap-1 font-retro text-[9px] uppercase text-sp-amber px-1 py-0" style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)' }}>
              <Pin className="h-3 w-3" /> Sticky
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 font-retro text-[11px] uppercase transition-colors"
            style={{
              background: '#d4a017',
              color: '#0f291e',
              border: 'none',
              borderRadius: '0px',
            }}
          >
            Reply
          </button>
          <button
            onClick={() => setSubscribed(!subscribed)}
            className="px-3 py-1 font-mono text-[11px] transition-colors"
            style={{
              background: subscribed ? 'rgba(45,106,79,0.3)' : 'transparent',
              color: subscribed ? '#95d5b2' : '#e8e0cc',
              border: '1px solid rgba(45,106,79,0.4)',
              borderRadius: '0px',
            }}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
          <button
            className="px-3 py-1 font-mono text-[11px] text-sp-parchment transition-colors hover:text-sp-cream"
            style={{
              background: 'transparent',
              border: '1px solid rgba(45,106,79,0.4)',
              borderRadius: '0px',
            }}
          >
            Lock
          </button>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1 px-3 py-1.5" style={{ borderTop: '1px solid rgba(45,106,79,0.2)' }}>
        <span className="font-mono text-[10px] text-sp-parchment mr-2">Pages:</span>
        <button
          className="px-2 py-0.5 font-mono text-[10px] text-sp-cream transition-colors"
          style={{
            background: 'rgba(45,106,79,0.3)',
            border: '1px solid rgba(45,106,79,0.5)',
            borderRadius: '0px',
          }}
        >
          1
        </button>
        <button
          className="px-2 py-0.5 font-mono text-[10px] text-sp-parchment hover:text-sp-cream transition-colors"
          style={{
            background: 'transparent',
            border: '1px solid rgba(45,106,79,0.3)',
            borderRadius: '0px',
          }}
        >
          2
        </button>
        <button
          className="px-2 py-0.5 font-mono text-[10px] text-sp-parchment hover:text-sp-cream transition-colors"
          style={{
            background: 'transparent',
            border: '1px solid rgba(45,106,79,0.3)',
            borderRadius: '0px',
          }}
        >
          3
        </button>
        <button
          className="px-2 py-0.5 font-mono text-[10px] text-sp-fern hover:text-sp-cream transition-colors"
          style={{
            background: 'transparent',
            border: '1px solid rgba(45,106,79,0.3)',
            borderRadius: '0px',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   REPLY BOX
   ═══════════════════════════════════════════ */

function ReplyBox({ userSignature }: { userSignature: string }) {
  const [text, setText] = useState('')
  const [audience, setAudience] = useState<AudienceType>('public')
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div
      style={{
        border: '1px solid rgba(45,106,79,0.3)',
        background: 'rgba(15,41,30,0.6)',
      }}
    >
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}>
        <span className="font-retro text-xs uppercase text-sp-amber">Post a Reply</span>
        <AudienceSelector selected={audience} onChange={setAudience} />
      </div>
      <div className="p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your reply..."
          rows={5}
          className="w-full resize-none p-3 text-sm text-sp-cream placeholder-sp-parchment/60 bg-sp-canopy/60 focus:outline-none transition-colors"
          style={{
            border: '1px solid rgba(45,106,79,0.3)',
            borderRadius: '0px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        />

        {/* BBCode Preview */}
        <AnimatePresence>
          {showPreview && text.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div
                className="mt-2 p-3 text-sm text-sp-cream"
                style={{
                  border: '1px solid rgba(45,106,79,0.3)',
                  background: 'rgba(6,32,21,0.4)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  lineHeight: 1.6,
                }}
              >
                <span className="font-mono text-[9px] uppercase text-sp-parchment block mb-1">Preview:</span>
                <BBCodeHtml bbcode={text} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-1.5 font-retro text-[11px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80"
              style={{
                background: 'var(--sp-moss)',
                borderRadius: '0px',
              }}
            >
              Post Reply
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 font-mono text-[10px] text-sp-parchment transition-colors hover:text-sp-cream"
              style={{
                background: showPreview ? 'rgba(45,106,79,0.3)' : 'transparent',
                border: '1px solid rgba(45,106,79,0.3)',
                borderRadius: '0px',
                color: showPreview ? '#95d5b2' : '#e8e0cc',
              }}
            >
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
          </div>
          <span className="font-mono text-[10px] text-sp-parchment">
            {text.length} chars
          </span>
        </div>

        {/* BBCode hint */}
        <p className="mt-1 font-mono text-[10px] text-sp-parchment" style={{ opacity: 0.6 }}>
          BBCode: [b] [i] [u] [url] [img] [quote] [code] [center] [spoiler]
        </p>

        {/* Signature preview */}
        <div className="mt-2 pt-2" style={{ borderTop: '1px dashed rgba(45,106,79,0.3)' }}>
          <span className="font-mono text-[9px] uppercase text-sp-parchment">Signature Preview:</span>
          <p className="text-xs italic text-sp-parchment mt-0.5">{userSignature}</p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   THREAD VIEW (Main)
   ═══════════════════════════════════════════ */

function ThreadView({ thread, onBack }: { thread: ThreadData; onBack: () => void }) {
  const [posts, setPosts] = useState(thread.posts)
  const [userReactions, setUserReactions] = useState<Record<string, Record<CurrencyType, boolean>>>({})
  const [floatingAnim, setFloatingAnim] = useState<{ id: string; type: CurrencyType } | null>(null)

  const handleReact = useCallback((postId: string, type: CurrencyType) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const alreadyReacted = userReactions[postId]?.[type]
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [type]: alreadyReacted ? Math.max(0, p.reactions[type] - 1) : p.reactions[type] + 1,
          },
        }
      })
    )

    setUserReactions((prev) => {
      const postReactions = prev[postId] || {}
      const alreadyReacted = postReactions[type]
      return {
        ...prev,
        [postId]: {
          ...postReactions,
          [type]: !alreadyReacted,
        },
      }
    })

    setFloatingAnim({ id: postId, type })
  }, [userReactions])

  return (
    <div className="space-y-3">
      <ThreadHeader thread={thread} onBack={onBack} />

      {/* Posts */}
      <div
        style={{
          border: '1px solid rgba(45,106,79,0.3)',
        }}
      >
        {posts.map((post) => (
          <ForumPostRow
            key={post.id}
            post={post}
            onReact={handleReact}
            userReactions={userReactions}
            floatingAnim={floatingAnim?.id === post.id ? floatingAnim : null}
          />
        ))}
      </div>

      {/* Bottom pagination */}
      <div className="flex items-center justify-between px-3 py-2" style={{ border: '1px solid rgba(45,106,79,0.3)', background: 'rgba(15,41,30,0.4)' }}>
        <span className="font-mono text-[10px] text-sp-parchment">
          Showing 1-{posts.length} of {posts.length} posts
        </span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-sp-parchment mr-2">Pages:</span>
          <button className="px-2 py-0.5 font-mono text-[10px] text-sp-cream" style={{ background: 'rgba(45,106,79,0.3)', border: '1px solid rgba(45,106,79,0.5)', borderRadius: '0px' }}>1</button>
          <button className="px-2 py-0.5 font-mono text-[10px] text-sp-parchment hover:text-sp-cream transition-colors" style={{ background: 'transparent', border: '1px solid rgba(45,106,79,0.3)', borderRadius: '0px' }}>2</button>
          <button className="px-2 py-0.5 font-mono text-[10px] text-sp-fern hover:text-sp-cream transition-colors" style={{ background: 'transparent', border: '1px solid rgba(45,106,79,0.3)', borderRadius: '0px' }}>Next →</button>
        </div>
      </div>

      {/* Reply Box */}
      <ReplyBox userSignature={CURRENT_USER_SIGNATURE} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   FORUM HOME VIEW (Fallback)
   ═══════════════════════════════════════════ */

/* ─── CatHeader ─── */
function CatHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between px-3"
      style={{
        height: '36px',
        background: 'var(--sp-canopy)',
        borderBottom: '1px solid rgba(82,183,136,0.2)',
      }}
    >
      <span className="font-retro text-sm uppercase text-sp-amber" style={{ letterSpacing: '0.08em' }}>
        {title}
      </span>
      {action && <div>{action}</div>}
    </div>
  )
}

/* ─── Shout types ─── */
interface Shout { id: string; author: string; avatar: string; message: string; time: string }

const MOCK_SHOUTS: Shout[] = [
  { id: '1', author: 'cyberfern', avatar: '/avatar-default.jpg', message: 'hey everyone, just seeded my new chunk!', time: '2m ago' },
  { id: '2', author: 'glitchmoss', avatar: '/avatar-default.jpg', message: 'the mesh is strong today', time: '5m ago' },
  { id: '3', author: 'solar-root', avatar: '/avatar-default.jpg', message: 'anyone up for a late night sync session?', time: '12m ago' },
  { id: '4', author: 'neon-leaf', avatar: '/avatar-default.jpg', message: 'new blog post is up, check it out!', time: '20m ago' },
]

/* ─── TalkBox ─── */
function TalkBox({ isOwner }: { isOwner: boolean }) {
  const [shouts, setShouts] = useState(MOCK_SHOUTS)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [shouts])

  const send = () => {
    if (!input.trim()) return
    setShouts((s) => [...s, { id: Date.now().toString(), author: 'You', avatar: '/avatar-default.jpg', message: input.trim(), time: 'now' }])
    setInput('')
  }

  return (
    <div style={{ border: '1px solid var(--sp-moss)', borderRadius: '0px', background: 'rgba(45,106,79,0.1)' }}>
      <div className="flex items-center justify-between px-3" style={{ height: '28px', background: 'var(--sp-canopy)' }}>
        <div className="flex items-center gap-2">
          <span className="font-retro text-xs uppercase text-sp-amber">Talk Box</span>
        </div>
        <span className="font-mono text-[10px] text-sp-parchment">Viewable by all | Posting restricted</span>
      </div>

      <div ref={scrollRef} className="px-3 py-2 space-y-1.5 max-h-[160px] overflow-y-auto">
        {shouts.map((s) => (
          <div key={s.id} className="flex items-start gap-2">
            <img src={s.avatar} alt="" className="h-5 w-5 object-cover flex-shrink-0 mt-0.5" style={{ borderRadius: '2px' }} />
            <div className="min-w-0">
              <span className="font-mono text-[10px] text-sp-sapling font-bold">{s.author}</span>
              <span className="font-mono text-[10px] text-sp-parchment ml-1.5">{s.time}</span>
              <p className="text-xs text-sp-cream break-words">{s.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5" style={{ borderTop: '1px solid rgba(82,183,136,0.2)' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={isOwner ? 'Shout something...' : 'Login to post...'}
          disabled={!isOwner}
          className="flex-1 bg-transparent text-xs text-sp-cream placeholder-sp-parchment/60 focus:outline-none disabled:opacity-50"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        />
        <button onClick={send} disabled={!isOwner} className="text-sp-fern hover:text-sp-cream transition-colors disabled:opacity-30">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

/* ─── Topic types with Pulse ─── */
interface Topic {
  id: string
  title: string
  author: string
  replies: number
  views: string
  lastPost: string
  sticky?: boolean
  locked?: boolean
  pulse: number
  hashtags: string[]
  heterodox?: boolean
}

const MOCK_TOPICS: Topic[] = [
  { id: '1', title: 'Welcome to the Grove', author: '@willow_03', replies: 89, views: '2.3K', lastPost: '2m ago', sticky: true, pulse: 89, hashtags: ['#welcome', '#intro'] },
  { id: '2', title: 'Forum Rules & Seed Etiquette', author: '@willow_03', replies: 156, views: '4.1K', lastPost: '5m ago', sticky: true, pulse: 12, hashtags: ['#rules', '#community'] },
  { id: '3', title: 'P2P Network Update v2.1 Released', author: '@cyberfern', replies: 47, views: '1.2K', lastPost: '12m ago', pulse: 45, hashtags: ['#p2p', '#tech'] },
  { id: '4', title: 'Introduce Yourself!', author: '@neon-leaf', replies: 203, views: '5.7K', lastPost: '1h ago', pulse: 67, hashtags: ['#intro', '#community'] },
  { id: '5', title: "What's Your P2P Setup?", author: '@solar-root', replies: 67, views: '1.8K', lastPost: '3h ago', pulse: 34, hashtags: ['#p2p', '#hardware'] },
  { id: '6', title: 'Read-Only: Archive of Old Growth', author: '@admin', replies: 12, views: '340', lastPost: '3d ago', locked: true, pulse: 3, hashtags: ['#archive'] },
  { id: '7', title: 'Are Centralized Platforms Actually Better for Privacy?', author: '@contrarian_daisy', replies: 34, views: '1.1K', lastPost: '1h ago', pulse: 22, hashtags: ['#heterodox', '#privacy'], heterodox: true },
]

/* ─── Pulse Indicator ─── */
function PulseIndicator({ score }: { score: number }) {
  if (score <= 10) return null

  const isAmber = score > 50
  const isPulsing = score > 100

  return (
    <span
      className="inline-flex items-center gap-0.5 font-mono text-[11px] flex-shrink-0"
      style={{
        color: isAmber ? '#d4a017' : '#e8e0cc',
        textShadow: isAmber ? '0 0 6px rgba(212,160,23,0.4)' : 'none',
        animation: isPulsing ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
      }}
    >
      <span>⚡</span>
      <span>{score}</span>
    </span>
  )
}

/* ─── Heterodox Badge ─── */
function HeterodoxBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.5"
      style={{
        border: '1px solid rgba(212,160,23,0.4)',
        color: '#d4a017',
        background: 'rgba(212,160,23,0.1)',
        borderRadius: '2px',
      }}
    >
      <span>🔄</span> Viewpoint Diversity
    </span>
  )
}

/* ─── TopicRow ─── */
function TopicRow({ topic, index, isLast, onClick }: { topic: Topic; index: number; isLast: boolean; onClick?: () => void }) {
  const iconMap = {
    sticky: { icon: <Pin className="h-4 w-4 text-sp-amber" />, color: 'text-sp-amber' },
    locked: { icon: <Lock className="h-4 w-4 text-sp-parchment" />, color: 'text-sp-parchment' },
    normal: { icon: <MessageSquare className="h-4 w-4 text-sp-fern" />, color: 'text-sp-cream' },
  }
  const type = topic.sticky ? 'sticky' : topic.locked ? 'locked' : 'normal'
  const { icon, color } = iconMap[type]

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-sp-fern/10"
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(82,183,136,0.15)',
        background: index % 2 === 0 ? 'transparent' : 'rgba(15,41,30,0.3)',
      }}
    >
      <div className="flex-shrink-0 w-8 flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <PulseIndicator score={topic.pulse} />
          <p className={cn('text-sm font-medium truncate hover:underline', color)}>{topic.title}</p>
          {topic.heterodox && <HeterodoxBadge />}
        </div>
        <p className="font-mono text-[11px] text-sp-parchment">
          by {topic.author} • {topic.lastPost}
          {topic.hashtags.length > 0 && (
            <span className="ml-2 text-sp-fern">{topic.hashtags.join(' ')}</span>
          )}
        </p>
      </div>
      <div className="hidden sm:flex items-center text-center flex-shrink-0" style={{ width: '60px' }}>
        <div>
          <p className="font-display text-sm text-sp-sapling">{topic.replies}</p>
          <p className="font-mono text-[9px] uppercase text-sp-parchment">replies</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center text-center flex-shrink-0" style={{ width: '60px' }}>
        <div>
          <p className="font-display text-sm text-sp-sapling">{topic.views}</p>
          <p className="font-mono text-[9px] uppercase text-sp-parchment">views</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-1 flex-shrink-0" style={{ width: '100px' }}>
        <span className="font-mono text-[11px] text-sp-parchment">{topic.lastPost}</span>
        <ChevronRight className="h-3 w-3 text-sp-parchment" />
      </div>
    </div>
  )
}

/* ─── Translation Toggle ─── */
function TranslationToggle() {
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    <div
      className="flex items-center justify-between px-3 py-1.5"
      style={{
        border: '1px solid rgba(45,106,79,0.3)',
        background: 'rgba(15,41,30,0.6)',
        borderRadius: '0px',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sp-parchment">🌐</span>
        <span className="font-mono text-[11px] text-sp-parchment">
          Auto-translated from {FORUM_SETTINGS.translation.fromLanguage}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="px-2 py-0.5 font-mono text-[10px] transition-colors"
          style={{
            border: '1px solid rgba(45,106,79,0.4)',
            background: showOriginal ? 'rgba(45,106,79,0.3)' : 'transparent',
            color: showOriginal ? '#95d5b2' : '#e8e0cc',
            borderRadius: '0px',
          }}
        >
          {showOriginal ? 'Show Translation' : 'Original'}
        </button>
        <button
          className="px-2 py-0.5 font-mono text-[10px] text-sp-parchment hover:text-sp-cream transition-colors"
          style={{
            border: '1px solid rgba(45,106,79,0.3)',
            background: 'transparent',
            borderRadius: '0px',
          }}
        >
          Settings
        </button>
      </div>
    </div>
  )
}

/* ─── AI Tolerance Indicator ─── */
function AIToleranceIndicator({ tolerance }: { tolerance: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[11px] transition-colors"
        style={{
          border: '1px solid rgba(45,106,79,0.4)',
          background: 'rgba(15,41,30,0.6)',
          borderRadius: '0px',
          color: '#e8e0cc',
        }}
      >
        <span>🤖</span>
        <span>AI Tolerance: {tolerance}%</span>
        <ChevronRight className="h-3 w-3 text-sp-parchment" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 z-50"
              style={{
                width: '260px',
                background: 'var(--sp-canopy)',
                border: '1px solid rgba(45,106,79,0.5)',
                borderRadius: '0px',
              }}
            >
              <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}>
                <span className="font-retro text-xs uppercase text-sp-amber">AI Tolerance</span>
                <p className="font-mono text-[10px] text-sp-parchment mt-1">
                  How much AI posting is allowed on this forum.
                </p>
              </div>
              <div className="px-3 py-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-sp-parchment">0% — No AI</span>
                  <span className="font-mono text-[11px] text-sp-parchment">100% — Full AI</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={tolerance}
                  className="w-full"
                  style={{ accentColor: '#52b788' }}
                />
                <p className="font-mono text-[10px] text-sp-parchment" style={{ opacity: 0.6 }}>
                  Current: {tolerance}% — AI pays {(tolerance > 0 ? (tolerance / 10).toFixed(1) : '0')}x Y-credits
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── ForumBanner ─── */
function ForumBanner({ isOwner }: { isOwner: boolean }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'var(--sp-canopy)', border: '1px solid var(--sp-moss)', borderRadius: '0px', minHeight: '220px' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'url(/profile-retro-bg.jpg) repeat', opacity: 0.08 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(15,41,30,0.85) 0%, rgba(15,41,30,0.6) 100%)' }} />
      <div className="relative flex flex-col md:flex-row gap-4 p-4 md:p-6">
        <div className="flex flex-col items-center md:items-start gap-2 md:w-[40%]">
          <div className="relative">
            <div className="absolute inset-0" style={{ boxShadow: '0 0 30px rgba(82,183,136,0.3)', borderRadius: '2px' }} />
            <div className="relative h-[150px] w-[150px] overflow-hidden" style={{ border: '3px solid var(--sp-amber)', borderRadius: '2px' }}>
              <img src={OWNER.avatar} alt="avatar" className="h-full w-full object-cover" />
            </div>
          </div>
          <p className="text-xs italic text-sp-sapling" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Cultivating digital gardens since the dawn of P2P
          </p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: '#22c55e', opacity: 0.75 }} />
              <span className="relative inline-flex h-full w-full rounded-full" style={{ background: '#22c55e' }} />
            </span>
            <span className="font-mono text-[11px] text-sp-sapling">● Online</span>
          </div>
          <p className="font-mono text-xs text-sp-parchment">@{OWNER.handle}</p>
        </div>
        <div className="flex flex-col items-center md:items-end justify-between md:w-[60%] text-center md:text-right gap-3">
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[42px] font-bold text-sp-cream" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {OWNER.forumTitle}
              </h1>
              <RankBadge rank="SA" />
            </div>
            <p className="font-retro text-sm text-sp-fern">[Forum]</p>
            <p className="font-mono text-[11px] text-sp-parchment mt-1">Threads: 47 | Posts: 1.2K | Seeds: 89 | Joined: EarthCycle 12</p>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: 'rgba(149,213,178,0.5)' }}>
            <Link to="/talk" className="font-mono text-[10px] hover:text-sp-sapling transition-colors" style={{ color: 'inherit' }}>U2U Messages</Link>
            <span className="font-mono text-[10px]">|</span>
            <Link to="/build" className="font-mono text-[10px] hover:text-sp-sapling transition-colors" style={{ color: 'inherit' }}>Edit Profile</Link>
            {isOwner && (
              <>
                <span className="font-mono text-[10px]">|</span>
                <Link to="/settings" className="font-mono text-[10px] hover:text-sp-sapling transition-colors" style={{ color: 'inherit' }}>Admin CP</Link>
              </>
            )}
          </div>
          {/* AI Tolerance */}
          <div className="flex items-center justify-center md:justify-end w-full">
            <AIToleranceIndicator tolerance={FORUM_SETTINGS.aiTolerance} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── LeftSidebar ─── */
function LeftSidebar() {
  const onlineNow = 12
  const onlineToday = 47
  return (
    <aside className="hidden lg:block flex-shrink-0" style={{ width: '180px' }}>
      <div className="sticky top-20 space-y-3">
        <div style={{ border: '1px solid rgba(82,183,136,0.25)', borderRadius: '0px', background: 'rgba(15,41,30,0.6)' }}>
          <div className="flex items-center justify-between px-3" style={{ height: '36px', background: 'var(--sp-canopy)', borderBottom: '1px solid rgba(82,183,136,0.2)' }}>
            <span className="font-retro text-xs uppercase text-sp-amber">Online Now</span>
            <span className="font-mono text-[10px] text-sp-sapling">{onlineNow}</span>
          </div>
          <div className="p-3 space-y-1">
            {['cyberfern', 'glitchmoss', 'solar-root', 'neon-leaf', 'chunked'].map((name) => (
              <div key={name} className="flex items-center gap-2 cursor-pointer hover:bg-sp-fern/10 transition-colors py-0.5">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
                <span className="text-xs text-sp-cream hover:text-sp-fern transition-colors">{name}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 flex items-center gap-2" style={{ borderTop: '1px solid rgba(82,183,136,0.15)' }}>
            <Users className="h-3.5 w-3.5 text-sp-parchment" />
            <span className="font-mono text-[10px] text-sp-parchment">{onlineToday} today</span>
          </div>
        </div>

        {/* M-S-I-E Currency */}
        <div style={{ border: '1px solid rgba(82,183,136,0.25)', borderRadius: '0px', background: 'rgba(15,41,30,0.6)' }}>
          <div className="px-3 py-1.5" style={{ borderBottom: '1px solid rgba(82,183,136,0.2)' }}>
            <span className="font-retro text-xs uppercase text-sp-amber">Currency</span>
          </div>
          <div className="p-2 space-y-1">
            {[
              { icon: '🔩', label: 'M-aterial', key: 'M' as const, value: formatCurrency(CURRENT_USER_WALLET.M), color: '#95a5a6' },
              { icon: '💬', label: 'S-ocial', key: 'S' as const, value: formatCurrency(CURRENT_USER_WALLET.S), color: '#d4a017' },
              { icon: '💡', label: 'I-nnovation', key: 'I' as const, value: formatCurrency(CURRENT_USER_WALLET.I), color: '#00bcd4' },
              { icon: '🌱', label: 'E-cology', key: 'E' as const, value: formatCurrency(CURRENT_USER_WALLET.E), color: '#52b788' },
            ].map((c) => (
              <div key={c.key} className="flex items-center justify-between py-0.5">
                <span className="font-mono text-[10px]" style={{ color: c.color }}>{c.icon} {c.label}</span>
                <span className="font-mono text-[10px] text-sp-cream">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ─── CenterContent ─── */
function CenterContent({ isOwner: _isOwner, onOpenThread }: { isOwner: boolean; onOpenThread: () => void }) {
  return (
    <div className="flex-1 min-w-0 space-y-3">
      <div style={{ border: '1px solid rgba(82,183,136,0.25)', borderRadius: '0px' }}>
        <CatHeader
          title="Announcements & General Info"
          action={<button className="font-mono text-[10px] text-sp-fern hover:text-sp-cream hover:underline transition-colors">New Topic +</button>}
        />
        {MOCK_TOPICS.filter((t) => t.sticky).map((t, i, arr) => (
          <TopicRow
            key={t.id}
            topic={t}
            index={i}
            isLast={i === arr.length - 1 && !MOCK_TOPICS.find((x) => x.id === '3')}
            onClick={t.id === '1' ? onOpenThread : undefined}
          />
        ))}
        {MOCK_TOPICS.filter((t) => !t.sticky && t.id === '3').map((t, i, arr) => (
          <TopicRow key={t.id} topic={t} index={i + 2} isLast={i === arr.length - 1} />
        ))}
      </div>

      <div style={{ border: '1px solid rgba(82,183,136,0.25)', borderRadius: '0px' }}>
        <CatHeader
          title="General Discussion"
          action={<button className="font-mono text-[10px] text-sp-fern hover:text-sp-cream hover:underline transition-colors">New Topic +</button>}
        />
        {MOCK_TOPICS.filter((t) => !t.sticky && t.id !== '3').map((t, i, arr) => (
          <TopicRow key={t.id} topic={t} index={i} isLast={i === arr.length - 1} />
        ))}
      </div>
    </div>
  )
}

/* ─── RightSidebar ─── */
interface RankedUser { id: string; name: string; avatar: string; rank: Rank }

const MOCK_RANKED: RankedUser[] = [
  { id: '1', name: 'Willow', avatar: '/avatar-default.jpg', rank: 'SA' },
  { id: '2', name: 'River', avatar: '/avatar-default.jpg', rank: 'A' },
  { id: '3', name: 'Jade', avatar: '/avatar-default.jpg', rank: 'SM' },
  { id: '4', name: 'Aspen', avatar: '/avatar-default.jpg', rank: 'M' },
  { id: '5', name: 'Pine', avatar: '/avatar-default.jpg', rank: 'U' },
]

function RightSidebar({ isOwner }: { isOwner: boolean }) {
  return (
    <aside className="hidden xl:block flex-shrink-0" style={{ width: '200px' }}>
      <div className="sticky top-20" style={{ border: '1px solid var(--sp-moss)', borderRadius: '0px', background: 'rgba(15,41,30,0.6)' }}>
        <div className="flex items-center px-2 py-1.5" style={{ borderBottom: '1px solid rgba(82,183,136,0.2)' }}>
          <span className="font-retro text-xs uppercase text-sp-amber">Ranked Users</span>
        </div>
        <div className="px-2 py-1 space-y-1">
          {MOCK_RANKED.map((u) => (
            <div key={u.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-sp-fern/10 transition-colors">
              <img src={u.avatar} alt="" className="h-6 w-6 object-cover flex-shrink-0" style={{ borderRadius: '2px' }} />
              <span className="text-xs text-sp-cream hover:text-sp-fern transition-colors">{u.name}</span>
              <RankBadge rank={u.rank} />
            </div>
          ))}
        </div>
        {isOwner && (
          <div className="px-2 py-2" style={{ borderTop: '1px solid rgba(82,183,136,0.15)' }}>
            <button
              className="w-full font-retro text-[10px] uppercase text-sp-cream hover:text-sp-fern transition-colors"
              style={{ background: 'var(--sp-moss)', border: '1px solid var(--sp-moss)', borderRadius: '0px', padding: '4px 8px' }}
            >
              Manage Ranks
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════
   GROUPS WIDGET
   ═══════════════════════════════════════════ */

interface Group {
  id: string
  name: string
  icon: string
  members: number
  tags: string[]
  isMember: boolean
  isInviteOnly: boolean
  lastActivity: string
}

const MOCK_GROUPS: Group[] = [
  { id: '1', name: 'Gardeners Guild', icon: '🌿', members: 23, tags: ['solarpunk', 'garden'], isMember: true, isInviteOnly: false, lastActivity: '2m ago' },
  { id: '2', name: 'Solar Beats', icon: '🎵', members: 18, tags: ['music', 'solar'], isMember: true, isInviteOnly: false, lastActivity: '5m ago' },
  { id: '3', name: 'Code Forest', icon: '💻', members: 31, tags: ['tech', 'p2p'], isMember: false, isInviteOnly: false, lastActivity: '1m ago' },
  { id: '4', name: 'Digital Artists', icon: '🎨', members: 47, tags: ['art', 'crypto'], isMember: false, isInviteOnly: false, lastActivity: '8m ago' },
  { id: '5', name: 'The Council', icon: '🔮', members: 12, tags: ['private', 'admin'], isMember: false, isInviteOnly: true, lastActivity: '1d ago' },
]

function GroupsWidget() {
  const [groups] = useState(MOCK_GROUPS)
  const yourGroups = groups.filter((g) => g.isMember)
  const discoverGroups = groups.filter((g) => !g.isMember)

  return (
    <div style={{ border: '1px solid rgba(82,183,136,0.25)', borderRadius: '0px', background: 'rgba(15,41,30,0.6)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3"
        style={{ height: '36px', background: 'var(--sp-canopy)', borderBottom: '1px solid rgba(82,183,136,0.2)' }}
      >
        <span className="font-retro text-sm uppercase text-sp-amber" style={{ letterSpacing: '0.08em' }}>
          👥 Groups
        </span>
        <div className="flex items-center gap-2">
          <button className="font-mono text-[10px] text-sp-fern hover:text-sp-cream hover:underline transition-colors">
            Create +
          </button>
          <div className="flex items-center" style={{ border: '1px solid rgba(45,106,79,0.3)', background: 'rgba(15,41,30,0.4)' }}>
            <span className="px-1.5 font-mono text-[9px] text-sp-parchment">Search</span>
            <input
              placeholder="..."
              className="w-16 bg-transparent text-[10px] text-sp-cream placeholder-sp-parchment/50 focus:outline-none px-1 py-0.5"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Your Groups */}
      {yourGroups.length > 0 && (
        <div>
          <div className="px-3 py-1" style={{ background: 'rgba(45,106,79,0.15)', borderBottom: '1px solid rgba(82,183,136,0.15)' }}>
            <span className="font-mono text-[10px] uppercase text-sp-parchment">Your Groups</span>
          </div>
          {yourGroups.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-sp-fern/10"
              style={{ borderBottom: '1px solid rgba(82,183,136,0.1)' }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">{g.icon}</span>
                <span className="text-sm text-sp-cream font-medium">{g.name}</span>
                <span className="font-mono text-[10px] text-sp-sapling">[{g.members}]</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-[10px] text-sp-parchment">Last: {g.lastActivity}</span>
                <button
                  className="px-2 py-0.5 font-mono text-[9px] uppercase text-sp-parchment hover:text-sp-cream transition-colors"
                  style={{ border: '1px solid rgba(45,106,79,0.3)', borderRadius: '0px', background: 'transparent' }}
                >
                  Leave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discover */}
      <div>
        <div className="px-3 py-1" style={{ background: 'rgba(45,106,79,0.15)', borderBottom: '1px solid rgba(82,183,136,0.15)', borderTop: yourGroups.length > 0 ? 'none' : undefined }}>
          <span className="font-mono text-[10px] uppercase text-sp-parchment">Discover</span>
        </div>
        {discoverGroups.map((g) => (
          <div
            key={g.id}
            className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-sp-fern/10"
            style={{ borderBottom: '1px solid rgba(82,183,136,0.1)' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base">{g.icon}</span>
              <span className="text-sm text-sp-cream font-medium">{g.name}</span>
              <span className="font-mono text-[10px] text-sp-sapling">[{g.members}]</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {g.isInviteOnly ? (
                <span className="font-mono text-[10px] text-sp-amber">🔒 Invite Only</span>
              ) : (
                <>
                  <span className="font-mono text-[10px] text-sp-parchment">Tags: {g.tags.map((t) => `#${t}`).join(' ')}</span>
                  <button
                    className="px-2 py-0.5 font-mono text-[9px] uppercase text-sp-cream hover:text-sp-fern transition-colors"
                    style={{ border: '1px solid var(--sp-moss)', borderRadius: '0px', background: 'rgba(45,106,79,0.3)' }}
                  >
                    Join
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   VBLOG WIDGET
   ═══════════════════════════════════════════ */

const VBLOG_VIDEOS = [
  { id: '1', title: 'My Garden Tour', duration: '16:34', views: '1.2K', age: '2d' },
  { id: '2', title: 'P2P Explained for Newbies', duration: '08:12', views: '3.4K', age: '5d' },
  { id: '3', title: 'Solar Beats Live Session', duration: '04:56', views: '890', age: '1w' },
  { id: '4', title: 'Day in the Life of a Seeder', duration: '22:01', views: '456', age: '2w' },
]

function VblogWidget() {
  return (
    <div style={{ border: '1px solid rgba(82,183,136,0.25)', borderRadius: '0px', background: 'rgba(15,41,30,0.6)' }}>
      {/* Header */}
      <div
        className="flex items-center px-3"
        style={{ height: '36px', background: 'var(--sp-canopy)', borderBottom: '1px solid rgba(82,183,136,0.2)', borderLeft: '3px solid #d4a017' }}
      >
        <span className="font-retro text-sm uppercase text-sp-amber" style={{ letterSpacing: '0.08em' }}>
          VBLOG
        </span>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
        {VBLOG_VIDEOS.map((v) => (
          <div
            key={v.id}
            className="cursor-pointer transition-colors hover:bg-sp-fern/10"
            style={{ border: '1px solid rgba(45,106,79,0.3)', borderRadius: '0px' }}
          >
            {/* Thumbnail */}
            <div
              className="relative flex items-center justify-center"
              style={{ background: 'rgba(82,183,136,0.2)', aspectRatio: '16/9' }}
            >
              <Play className="h-6 w-6" style={{ color: '#f5f0e1' }} />
              {/* Duration badge */}
              <span
                className="absolute font-mono text-[10px] px-1 py-0.5"
                style={{
                  bottom: '4px',
                  right: '4px',
                  background: 'var(--sp-canopy)',
                  color: '#e8e0cc',
                  borderRadius: '0px',
                }}
              >
                {v.duration}
              </span>
            </div>
            {/* Info */}
            <div className="p-1.5">
              <p className="text-xs font-medium text-sp-cream truncate" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500 }}>
                {v.title}
              </p>
              <p className="font-mono text-[10px] text-sp-parchment" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {v.views} views &bull; {v.age}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PULSE KEYFRAME ANIMATION (injected)
   ═══════════════════════════════════════════ */

function PulseStyles() {
  return (
    <style>{`
      @keyframes pulse-glow {
        0%, 100% { opacity: 1; text-shadow: 0 0 6px rgba(212,160,23,0.4); }
        50% { opacity: 0.7; text-shadow: 0 0 14px rgba(212,160,23,0.7); }
      }
    `}</style>
  )
}

/* ═══════════════════════════════════════════
   FORUM HOME VIEW WRAPPER
   ═══════════════════════════════════════════ */

function ForumHomeView({ isOwner, onOpenThread }: { isOwner: boolean; onOpenThread: () => void }) {
  return (
    <div className="flex gap-3 items-start">
      <PulseStyles />
      <LeftSidebar />
      <div className="flex-1 min-w-0 space-y-3">
        <TranslationToggle />
        <ForumBanner isOwner={isOwner} />
        <TalkBox isOwner={isOwner} />
        <VblogWidget />
        <GroupsWidget />
        <CenterContent isOwner={isOwner} onOpenThread={onOpenThread} />
      </div>
      <RightSidebar isOwner={isOwner} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PROFILE PAGE
   ═══════════════════════════════════════════ */

export default function Profile() {
  const { handle } = useParams<{ handle: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const isOwner = handle === 'demo' || !handle

  /* Thread mode: ?topic=... triggers thread view */
  const topicParam = searchParams.get('topic')
  const isThreadView = topicParam === 'welcome-grove'

  const openThread = () => {
    setSearchParams({ topic: 'welcome-grove' })
  }

  const closeThread = () => {
    setSearchParams({})
  }

  /* Currency state */
  const [wallet, setWallet] = useState<Wallet>(CURRENT_USER_WALLET)

  const addCurrency = useCallback((type: CurrencyType, amount: number) => {
    setWallet((prev) => ({ ...prev, [type]: prev[type] + amount }))
  }, [])

  return (
    <CurrencyContext.Provider value={{ wallet, addCurrency }}>
      <div
        className="min-h-[calc(100dvh-64px)]"
        style={{ background: OWNER.backgroundStyle.value }}
      >
        <div className="mx-auto max-w-[1200px] px-3 py-4">
          {isThreadView ? (
            <ThreadView thread={MOCK_THREAD} onBack={closeThread} />
          ) : (
            <ForumHomeView isOwner={isOwner} onOpenThread={openThread} />
          )}
        </div>
      </div>
    </CurrencyContext.Provider>
  )
}
