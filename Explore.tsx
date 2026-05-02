import { useState, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Leaf,
  UserPlus,
  Eye,
  EyeOff,
  Zap,
  Shuffle,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FilterType = 'all' | 'people' | 'posts' | 'tags' | 'local' | 'random'

interface Tag {
  label: string
  size: 'sm' | 'md' | 'lg'
  trending: boolean
  nsfw: boolean
  count: number
}

interface RandomProfile {
  id: string
  name: string
  handle: string
  avatar: string
  bio: string
  friends: number
  seeds: number
  active: string
  tags: string[]
}

interface Creator {
  id: string
  name: string
  handle: string
  avatar: string
  bio: string
  friends: number
  contentSeeds: number
  tags: string[]
  coverGradient: string
}

interface SearchResult {
  type: 'people' | 'tag' | 'post'
  title: string
  subtitle: string
  avatar?: string
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const TAGS: Tag[] = [
  { label: '#solarpunk', size: 'lg', trending: true, nsfw: false, count: 1243 },
  { label: '#retrocomputing', size: 'md', trending: true, nsfw: false, count: 876 },
  { label: '#digitalgarden', size: 'lg', trending: true, nsfw: false, count: 992 },
  { label: '#p2p', size: 'md', trending: false, nsfw: false, count: 756 },
  { label: '#myspacecore', size: 'md', trending: true, nsfw: false, count: 621 },
  { label: '#encrypted', size: 'sm', trending: false, nsfw: false, count: 432 },
  { label: '#chunklife', size: 'md', trending: false, nsfw: false, count: 534 },
  { label: '#localmusic', size: 'sm', trending: false, nsfw: false, count: 298 },
  { label: '#anonymous', size: 'sm', trending: false, nsfw: false, count: 367 },
  { label: '#webmaster', size: 'md', trending: false, nsfw: false, count: 445 },
  { label: '#plantposting', size: 'md', trending: false, nsfw: false, count: 512 },
  { label: '#nightwalks', size: 'sm', trending: false, nsfw: false, count: 234 },
  { label: '#opensource', size: 'lg', trending: true, nsfw: false, count: 1102 },
  { label: '#neocities', size: 'md', trending: false, nsfw: false, count: 678 },
  { label: '#zines', size: 'sm', trending: false, nsfw: false, count: 189 },
  { label: '#maker', size: 'md', trending: false, nsfw: false, count: 456 },
  { label: '#DIYnetwork', size: 'sm', trending: false, nsfw: false, count: 312 },
  { label: '#seedsharing', size: 'md', trending: false, nsfw: false, count: 543 },
  { label: '#bastardweb', size: 'sm', trending: false, nsfw: true, count: 156 },
  { label: '#forumcore', size: 'sm', trending: false, nsfw: false, count: 267 },
]

const RANDOM_PROFILES: RandomProfile[] = [
  {
    id: 'r1',
    name: 'Moss Walker',
    handle: '@mosswalker',
    avatar: '/avatar-default.jpg',
    bio: 'Growing digital gardens in the cracks of the old web. Solar punk, mesh networks, and compostable code.',
    friends: 34,
    seeds: 12,
    active: '6mo',
    tags: ['#solarpunk', '#digitalgarden', '#p2p'],
  },
  {
    id: 'r2',
    name: 'Amber Ray',
    handle: '@amberray',
    avatar: '/avatar-default.jpg',
    bio: 'DIY solar hardware hacker. My node runs off-grid.',
    friends: 89,
    seeds: 45,
    active: '2w',
    tags: ['#maker', '#DIYnetwork', '#seedsharing'],
  },
  {
    id: 'r3',
    name: 'Ghost Writer',
    handle: '@ghostwriter',
    avatar: '/avatar-default.jpg',
    bio: 'Encrypted poetry and disappearing prose. Identity is a verb.',
    friends: 12,
    seeds: 67,
    active: '1d',
    tags: ['#anonymous', '#encrypted', '#nightwalks'],
  },
  {
    id: 'r4',
    name: 'Cedar Wood',
    handle: '@cedarwood',
    avatar: '/avatar-default.jpg',
    bio: 'Retro web revivalist. Neocities archivist. P2P evangelist.',
    friends: 156,
    seeds: 23,
    active: '3mo',
    tags: ['#neocities', '#webmaster', '#retrocomputing'],
  },
]

const PEOPLE_YOU_MAY_KNOW = [
  { id: 'p1', name: 'River Song', avatar: '/avatar-default.jpg', reason: '4 mutual friends' },
  { id: 'p2', name: 'Luna Ray', avatar: '/avatar-default.jpg', reason: 'Shared tag: #solarpunk' },
  { id: 'p3', name: 'Sage Root', avatar: '/avatar-default.jpg', reason: '2 mutual friends' },
  { id: 'p4', name: 'Pine Sol', avatar: '/avatar-default.jpg', reason: 'Local proximity' },
  { id: 'p5', name: 'Fern Greene', avatar: '/avatar-default.jpg', reason: 'Shared tag: #p2p' },
  { id: 'p6', name: 'Cedar Wood', avatar: '/avatar-default.jpg', reason: '3 mutual friends' },
]

const CREATORS: Creator[] = [
  {
    id: 'c1',
    name: 'Moss Walker',
    handle: '@mosswalker',
    avatar: '/avatar-default.jpg',
    bio: 'Digital gardener, solar punk dreamer, mesh network architect.',
    friends: 892,
    contentSeeds: 47,
    tags: ['#solarpunk', '#p2p'],
    coverGradient: 'linear-gradient(135deg, rgba(45, 106, 79, 0.4) 0%, rgba(124, 58, 237, 0.2) 100%)',
  },
  {
    id: 'c2',
    name: 'Amber Ray',
    handle: '@amberray',
    avatar: '/avatar-default.jpg',
    bio: 'Off-grid hardware hacker. Building the future with solder and sunlight.',
    friends: 645,
    contentSeeds: 32,
    tags: ['#maker', '#DIYnetwork'],
    coverGradient: 'linear-gradient(135deg, rgba(212, 160, 23, 0.3) 0%, rgba(45, 106, 79, 0.3) 100%)',
  },
  {
    id: 'c3',
    name: 'River Song',
    handle: '@riversong',
    avatar: '/avatar-default.jpg',
    bio: 'Night walker, seed sharer, local mesh connector.',
    friends: 412,
    contentSeeds: 28,
    tags: ['#seedsharing', '#localmusic'],
    coverGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(45, 106, 79, 0.35) 100%)',
  },
  {
    id: 'c4',
    name: 'Cedar Wood',
    handle: '@cedarwood',
    avatar: '/avatar-default.jpg',
    bio: 'Neocities archivist. Retro web preservationist. P2P builder.',
    friends: 723,
    contentSeeds: 56,
    tags: ['#neocities', '#webmaster'],
    coverGradient: 'linear-gradient(135deg, rgba(62, 39, 35, 0.4) 0%, rgba(45, 106, 79, 0.3) 100%)',
  },
  {
    id: 'c5',
    name: 'Ghost Writer',
    handle: '@ghostwriter',
    avatar: '/avatar-default.jpg',
    bio: 'Encrypted poet. Identity is fluid. Words are seeds.',
    friends: 198,
    contentSeeds: 89,
    tags: ['#anonymous', '#encrypted'],
    coverGradient: 'linear-gradient(135deg, rgba(26, 11, 46, 0.5) 0%, rgba(124, 58, 237, 0.3) 100%)',
  },
  {
    id: 'c6',
    name: 'Luna Ray',
    handle: '@lunaray',
    avatar: '/avatar-default.jpg',
    bio: 'Zine maker, open source contributor, plant parent.',
    friends: 334,
    contentSeeds: 19,
    tags: ['#zines', '#opensource'],
    coverGradient: 'linear-gradient(135deg, rgba(45, 106, 79, 0.3) 0%, rgba(212, 160, 23, 0.2) 100%)',
  },
]

const SEARCH_RESULTS: SearchResult[] = [
  { type: 'people', title: 'Moss Walker', subtitle: '@mosswalker', avatar: '/avatar-default.jpg' },
  { type: 'people', title: 'Amber Ray', subtitle: '@amberray', avatar: '/avatar-default.jpg' },
  { type: 'tag', title: '#solarpunk', subtitle: '1,243 posts' },
  { type: 'tag', title: '#digitalgarden', subtitle: '892 posts' },
  { type: 'post', title: 'Just seeded my profile chunk...', subtitle: 'by @mosswalker' },
]

const RECENT_SEARCHES = ['#solarpunk', '@amberray', 'lighthouse', 'encrypted chat']

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'people', label: 'People' },
  { key: 'posts', label: 'Posts' },
  { key: 'tags', label: 'Tags' },
  { key: 'local', label: 'Local' },
  { key: 'random', label: 'Random' },
]

/* ------------------------------------------------------------------ */
/*  Floating Orbs (background decoration)                              */
/* ------------------------------------------------------------------ */

function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: i === 0 ? 400 : i === 1 ? 300 : 350,
            height: i === 0 ? 400 : i === 1 ? 300 : 350,
            background:
              i === 0
                ? 'rgba(45, 106, 79, 0.15)'
                : i === 1
                  ? 'rgba(212, 160, 23, 0.08)'
                  : 'rgba(124, 58, 237, 0.08)',
            left: `${20 + i * 30}%`,
            top: `${10 + i * 25}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 12 + i * 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 1 — Discovery Hero                                         */
/* ------------------------------------------------------------------ */

function DiscoveryHero() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowResults(e.target.value.length > 0)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowResults(false)
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches((prev) => [query.trim(), ...prev].slice(0, 5))
      }
    }
    if (e.key === 'Escape') {
      setShowResults(false)
    }
  }

  const clearRecent = () => setRecentSearches([])

  return (
    <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-4 py-24">
      <motion.h1
        className="font-display text-4xl md:text-5xl font-bold text-sp-cream text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        Find your circle.
      </motion.h1>

      <motion.p
        className="mt-4 text-center text-lg text-sp-parchment max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        Search by name. Browse by tag. Stumble randomly. Or let the lighthouse guide you to someone nearby.
      </motion.p>

      {/* Search Bar */}
      <motion.div
        className="relative mt-8 w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all"
          style={{
            background: 'rgba(15, 41, 30, 0.8)',
            border: focused ? '2px solid #52b788' : '2px solid rgba(82, 183, 136, 0.3)',
            boxShadow: focused ? '0 0 20px rgba(82, 183, 136, 0.15)' : 'none',
          }}
        >
          <Search className="h-6 w-6 text-sp-parchment flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            onFocus={() => { setFocused(true); if (query) setShowResults(true) }}
            onBlur={() => { setFocused(false); setTimeout(() => setShowResults(false), 200) }}
            onKeyDown={handleKeyDown}
            placeholder="Search people, tags, posts..."
            className="flex-1 bg-transparent text-lg text-sp-cream placeholder:text-sp-parchment/60 focus:outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowResults(false); inputRef.current?.focus() }} className="text-sp-parchment hover:text-sp-cream transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results Preview */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-30 mt-2 rounded-lg border border-sp-fern/20 p-3 shadow-xl"
              style={{ background: 'rgba(15, 41, 30, 0.95)' }}
            >
              <div className="mb-2 px-2 text-xs font-medium text-sp-parchment uppercase tracking-wider">Results</div>
              {SEARCH_RESULTS.filter((_, i) => i < 4).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-sp-fern/10 cursor-pointer"
                >
                  {r.avatar && <img src={r.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />}
                  {!r.avatar && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sp-moss/30">
                      {r.type === 'tag' ? <Leaf className="h-4 w-4 text-sp-fern" /> : <Search className="h-4 w-4 text-sp-fern" />}
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-sp-cream">{r.title}</div>
                    <div className="text-xs text-sp-parchment">{r.subtitle}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => { setQuery(term); setShowResults(true) }}
                className="rounded-full px-3 py-1 text-xs text-sp-parchment transition-colors hover:bg-sp-moss/30 hover:text-sp-cream"
                style={{ background: 'rgba(82, 183, 136, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}
              >
                {term}
              </button>
            ))}
            <button onClick={clearRecent} className="text-xs text-sp-parchment hover:text-sp-fern transition-colors ml-1">
              Clear
            </button>
          </div>
        )}
      </motion.div>

      {/* Filter Pills */}
      <motion.div
        className="mt-6 flex flex-wrap items-center justify-center gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        {FILTERS.map((f) => (
          <motion.button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-sp-moss text-sp-cream'
                : 'bg-transparent text-sp-parchment border border-sp-fern/30 hover:bg-sp-moss/20'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 2 — Tags Cloud                                             */
/* ------------------------------------------------------------------ */

function TagsCloud() {
  const [nsfwEnabled, setNsfwEnabled] = useState(false)

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-sp-cream">Browse by Tag</h2>
          <p className="mt-1 text-sm text-sp-parchment">See what&apos;s growing across the network</p>
        </div>
        <button
          onClick={() => setNsfwEnabled((v) => !v)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors"
          style={{
            background: nsfwEnabled ? 'rgba(225, 29, 72, 0.15)' : 'rgba(82, 183, 136, 0.15)',
            border: nsfwEnabled ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(82, 183, 136, 0.2)',
            color: nsfwEnabled ? '#e11d48' : '#52b788',
          }}
        >
          {nsfwEnabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {nsfwEnabled ? 'NSFW shown' : 'NSFW blurred'}
        </button>
      </div>

      <motion.div
        className="mt-6 flex flex-wrap gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03 } },
        }}
      >
        {TAGS.map((tag) => (
          <motion.button
            key={tag.label}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            whileHover={{ scale: 1.08 }}
            className={`rounded-full font-medium transition-all ${sizeClasses[tag.size]} ${
              tag.nsfw && !nsfwEnabled ? 'blur-sm hover:blur-0' : ''
            }`}
            style={{
              background: tag.trending ? 'rgba(212, 160, 23, 0.15)' : tag.nsfw ? 'rgba(225, 29, 72, 0.1)' : 'rgba(82, 183, 136, 0.15)',
              border: `1px solid ${tag.trending ? 'rgba(212, 160, 23, 0.3)' : tag.nsfw ? 'rgba(225, 29, 72, 0.3)' : 'rgba(82, 183, 136, 0.3)'}`,
              color: tag.trending ? '#f4d03f' : tag.nsfw ? '#e11d48' : '#52b788',
            }}
          >
            {tag.label}
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 3 — Random Discovery                                       */
/* ------------------------------------------------------------------ */

function RandomDiscovery() {
  const [index, setIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [direction, setDirection] = useState<'shuffle' | 'skip'>('shuffle')

  const profile = RANDOM_PROFILES[index]

  const shuffle = () => {
    if (flipping) return
    setDirection('shuffle')
    setFlipping(true)
    setTimeout(() => {
      setIndex((i) => (i + 1) % RANDOM_PROFILES.length)
      setTimeout(() => setFlipping(false), 300)
    }, 300)
  }

  const skip = () => {
    if (flipping) return
    setDirection('skip')
    setFlipping(true)
    setTimeout(() => {
      setIndex((i) => (i + 1) % RANDOM_PROFILES.length)
      setTimeout(() => setFlipping(false), 300)
    }, 300)
  }

  return (
    <section
      className="mx-auto max-w-[800px] rounded-xl p-8 md:p-12"
      style={{
        background: 'linear-gradient(135deg, rgba(45, 106, 79, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%)',
      }}
    >
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-sp-cream">Roll the Dice</h2>
        <p className="mt-1 text-sm text-sp-parchment">Find someone completely random. No algorithm. Just chaos.</p>
      </div>

      {/* Random Profile Card with 3D flip */}
      <div className="relative mx-auto max-w-md" style={{ perspective: 800 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={profile.id + (flipping ? '-flip' : '')}
            initial={direction === 'skip' ? { x: '100%', opacity: 0 } : { rotateY: 90, opacity: 0 }}
            animate={{ x: 0, rotateY: 0, opacity: 1 }}
            exit={direction === 'skip' ? { x: '-100%', opacity: 0 } : { rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="rounded-xl p-6"
            style={{
              background: 'rgba(15, 41, 30, 0.8)',
              border: '1px solid rgba(82, 183, 136, 0.2)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Corner decorations */}
            <div className="absolute -top-1 -left-1 h-3 w-3 border-t border-l border-sp-fern/40" />
            <div className="absolute -top-1 -right-1 h-3 w-3 border-t border-r border-sp-fern/40" />
            <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-sp-fern/40" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-sp-fern/40" />

            <div className="flex flex-col items-center text-center">
              <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-full object-cover border-2 border-sp-fern/30" />
              <h3 className="mt-4 font-display text-xl font-medium text-sp-cream">{profile.name}</h3>
              <p className="text-sm text-sp-fern">{profile.handle}</p>
              <p className="mt-2 text-sm text-sp-parchment max-w-xs line-clamp-2">{profile.bio}</p>

              <div className="mt-4 flex items-center gap-4 text-xs text-sp-parchment">
                <span>Friends: <span className="text-sp-fern font-medium">{profile.friends}</span></span>
                <span>Seeds: <span className="text-sp-fern font-medium">{profile.seeds}</span></span>
                <span>Active: <span className="text-sp-fern font-medium">{profile.active}</span></span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2.5 py-0.5 text-xs"
                    style={{ background: 'rgba(82, 183, 136, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)', color: '#52b788' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="rounded-full px-5 py-2 text-sm font-semibold text-sp-bark transition-all hover:scale-103" style={{ background: '#d4a017', boxShadow: '0 4px 20px rgba(212, 160, 23, 0.3)' }}>
                  Add Friend
                </button>
                <button className="rounded-full border border-sp-fern px-5 py-2 text-sm text-sp-fern transition-colors hover:bg-sp-fern/10">
                  View Profile
                </button>
                <button onClick={skip} className="text-sm text-sp-parchment hover:text-sp-fern transition-colors">
                  Skip &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shuffle Button */}
      <div className="mt-8 flex justify-center">
        <motion.button
          onClick={shuffle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-sp-bark transition-shadow"
          style={{ background: '#d4a017', boxShadow: '0 4px 20px rgba(212, 160, 23, 0.3)', width: 160 }}
        >
          <Shuffle className="h-5 w-5" />
          Shuffle
        </motion.button>
      </div>

      {/* People You May Know Strip */}
      <div className="mt-10">
        <div className="mb-4 text-center font-retro text-xs uppercase tracking-widest text-sp-fern">People You May Know</div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {PEOPLE_YOU_MAY_KNOW.map((person, i) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="flex-shrink-0 w-[140px] snap-start rounded-lg p-3 text-center"
              style={{ background: 'rgba(45, 106, 79, 0.12)', border: '1px solid rgba(82, 183, 136, 0.15)' }}
            >
              <img src={person.avatar} alt={person.name} className="mx-auto h-12 w-12 rounded-full object-cover" />
              <div className="mt-2 text-xs font-medium text-sp-cream truncate">{person.name}</div>
              <div className="mt-0.5 text-[10px] text-sp-parchment truncate">{person.reason}</div>
              <button className="mt-2 mx-auto flex items-center justify-center h-6 w-6 rounded-full border border-sp-fern/40 text-sp-fern hover:bg-sp-fern/10 transition-colors">
                <UserPlus className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 4 — Lighthouse Local Linking                                */
/* ------------------------------------------------------------------ */

function LighthouseMap() {
  const [enabled, setEnabled] = useState(false)
  const [peerCount, setPeerCount] = useState(0)

  const enable = () => {
    setEnabled(true)
    let count = 0
    const interval = setInterval(() => {
      count += 1
      setPeerCount(count)
      if (count >= 3) clearInterval(interval)
    }, 400)
  }

  const peers = [
    { x: 35, y: 30, name: 'Moss' },
    { x: 65, y: 35, name: 'Amber' },
    { x: 50, y: 65, name: 'River' },
  ]

  return (
    <section className="py-16">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <div className="font-retro text-sm uppercase tracking-widest text-sp-fern">Local Discovery</div>
          <h2 className="mt-2 font-display text-3xl font-bold text-sp-cream">The Lighthouse Effect</h2>
          <p className="mt-4 text-base text-sp-parchment leading-relaxed">
            Your first connection to SocialCircle doesn&apos;t need the internet. Enable local discovery, and your device becomes a lighthouse — broadcasting a signal that nearby seedlings can follow. Meet your neighbors. Share your chunk. Grow your circle from the ground up.
          </p>
          <ul className="mt-6 space-y-3">
            {['GPS-free local mesh linking', 'Your data chunks propagate through physical proximity', 'No central server needed for first contact'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-sp-parchment">
                <span className="h-1.5 w-1.5 rounded-full bg-sp-fern flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {!enabled ? (
              <motion.button
                onClick={enable}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-sp-bark"
                style={{ background: '#d4a017', boxShadow: '0 4px 20px rgba(212, 160, 23, 0.3)' }}
              >
                <Zap className="inline h-4 w-4 mr-2 -mt-0.5" />
                Enable Lighthouse
              </motion.button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sp-sapling opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sp-sapling" />
                </span>
                <span className="text-sm font-medium text-sp-sapling">Active — {peerCount} nearby</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right — Map Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative mx-auto aspect-square w-full max-w-[400px] rounded-xl overflow-hidden"
          style={{ background: 'rgba(15, 41, 30, 0.9)', border: '1px solid rgba(82, 183, 136, 0.2)' }}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 h-full w-full opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`v${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="#52b788" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="#52b788" strokeWidth="0.5" />
            ))}
          </svg>

          {/* Organic landmass shapes */}
          <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 400">
            <path
              d="M50,200 Q100,120 180,160 T320,140 Q360,180 340,240 T280,320 Q200,360 120,300 T50,200"
              fill="rgba(45, 106, 79, 0.3)"
              stroke="none"
            />
            <path
              d="M280,80 Q340,60 380,100 T360,180 Q300,200 280,160 T280,80"
              fill="rgba(45, 106, 79, 0.2)"
              stroke="none"
            />
          </svg>

          {/* Range ring */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
            style={{ width: 200, height: 200, borderColor: 'rgba(82, 183, 136, 0.2)' }}
          />

          {/* Center dot with pulse rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Concentric pulse rings */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-3 w-3">
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-full w-full rounded-full bg-sp-amber/60"
                style={{ animation: 'pulse-ring 2s ease-out infinite' }}
              />
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-full w-full rounded-full bg-sp-amber/40"
                style={{ animation: 'pulse-ring 2s ease-out infinite 0.6s' }}
              />
            </span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-sp-amber ring-2 ring-sp-amber/30" />
          </div>

          {/* Peer dots */}
          {peers.slice(0, enabled ? peerCount : 0).map((peer, i) => (
            <motion.div
              key={peer.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="absolute group"
              style={{ left: `${peer.x}%`, top: `${peer.y}%` }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-sp-fern/60"
                  style={{ animation: `pulse-ring ${2.5 + i * 0.3}s ease-out infinite` }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sp-fern" />
              </span>
              {/* Tooltip */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] text-sp-cream opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(15, 41, 30, 0.9)' }}>
                {peer.name}
              </div>
            </motion.div>
          ))}

          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            {enabled && peers.slice(0, peerCount).map((peer, i) => (
              <motion.line
                key={peer.name}
                x1="50%"
                y1="50%"
                x2={`${peer.x}%`}
                y2={`${peer.y}%`}
                stroke="rgba(45, 106, 79, 0.4)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 5 — Trending Profiles / Creators                           */
/* ------------------------------------------------------------------ */

function CreatorGrid() {
  return (
    <section className="py-12">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-bold text-sp-cream">Growing Voices</h2>
        <p className="mt-1 text-sm text-sp-parchment">Profiles gaining momentum across the network</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CREATORS.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              delay: Math.min(i * 0.1, 0.6),
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
            whileHover={{ y: -4 }}
            className="group relative rounded-lg overflow-hidden cursor-pointer"
            style={{
              background: 'rgba(45, 106, 79, 0.15)',
              border: '1px solid rgba(82, 183, 136, 0.2)',
            }}
          >
            {/* Cover */}
            <div className="relative h-[120px] overflow-hidden" style={{ background: creator.coverGradient }}>
              <motion.div
                className="h-full w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Avatar overlapping cover */}
            <div className="relative px-5">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="relative -mt-7 h-14 w-14 rounded-full object-cover border-[3px]"
                style={{ borderColor: '#0f291e' }}
              />
            </div>

            <div className="px-5 pb-5 pt-2">
              <h3 className="font-display text-lg font-medium text-sp-cream">{creator.name}</h3>
              <p className="text-xs text-sp-fern">{creator.handle}</p>
              <p className="mt-2 text-sm text-sp-parchment line-clamp-2">{creator.bio}</p>

              <div className="mt-3 flex items-center gap-3 text-xs text-sp-parchment">
                <span>Friends: <span className="text-sp-fern font-medium">{creator.friends.toLocaleString()}</span></span>
                <span>Content seeds: <span className="text-sp-fern font-medium">{creator.contentSeeds}</span></span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {creator.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{ background: 'rgba(82, 183, 136, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)', color: '#52b788' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="mt-4 w-full rounded-full border border-sp-fern/40 py-2 text-sm text-sp-fern transition-colors hover:bg-sp-fern/10">
                Connect
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Explore Page                                                  */
/* ------------------------------------------------------------------ */

export default function Explore() {
  return (
    <div className="relative min-h-[calc(100dvh-64px)]" style={{ background: 'var(--sp-canopy)' }}>
      <FloatingOrbs />
      <div className="relative mx-auto max-w-[1200px] px-4 py-16 md:px-6">
        <DiscoveryHero />
        <TagsCloud />
        <RandomDiscovery />
        <LighthouseMap />
        <CreatorGrid />
      </div>
    </div>
  )
}
