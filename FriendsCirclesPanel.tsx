import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Ban, Plus, MessageCircle, Eye, ChevronDown, ChevronUp, Trash2, Edit2, Move } from 'lucide-react'

interface Friend {
  id: string
  name: string
  handle: string
  online: boolean
  circles: string[]
}

interface Circle {
  id: string
  name: string
  color: string
  members: string[]
  privacy: 'open' | 'closed' | 'secret'
}

interface Request {
  id: string
  name: string
  handle: string
  message: string
}

const initialCircles: Circle[] = [
  { id: 'c1', name: 'Close Friends', color: '#22c55e', members: ['f1', 'f2'], privacy: 'closed' },
  { id: 'c2', name: 'Creators', color: '#d4a017', members: ['f3'], privacy: 'open' },
  { id: 'c3', name: 'Family', color: '#7c3aed', members: [], privacy: 'secret' },
]

const initialFriends: Friend[] = [
  { id: 'f1', name: 'Alex Root', handle: 'alex.p2p', online: true, circles: ['c1'] },
  { id: 'f2', name: 'Moss Chen', handle: 'moss.p2p', online: false, circles: ['c1'] },
  { id: 'f3', name: 'Sage Park', handle: 'sage.p2p', online: true, circles: ['c2'] },
  { id: 'f4', name: 'Fern Diaz', handle: 'fern.p2p', online: true, circles: [] },
  { id: 'f5', name: 'Ivy Loam', handle: 'ivy.p2p', online: false, circles: [] },
]

const initialRequests: Request[] = [
  { id: 'r1', name: 'Reed Oak', handle: 'reed.p2p', message: 'Hey, loved your post on p2p gardening!' },
  { id: 'r2', name: 'Pine Silva', handle: 'pine.p2p', message: 'We met at the Lighthouse meetup.' },
]

const privacyLabels = { open: 'Open', closed: 'Closed', secret: 'Secret' }

const FriendsCirclesPanel = memo(function FriendsCirclesPanel() {
  const [circles, setCircles] = useState<Circle[]>(initialCircles)
  const [friends, setFriends] = useState<Friend[]>(initialFriends)
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [expandedCircle, setExpandedCircle] = useState<string | null>(null)
  const [showNewCircle, setShowNewCircle] = useState(false)
  const [newCircleName, setNewCircleName] = useState('')
  const [newCircleColor, setNewCircleColor] = useState('#22c55e')
  const [search, setSearch] = useState('')

  const acceptRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const declineRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const createCircle = () => {
    if (!newCircleName.trim()) return
    setCircles(prev => [...prev, {
      id: `c${Date.now()}`,
      name: newCircleName,
      color: newCircleColor,
      members: [],
      privacy: 'closed',
    }])
    setNewCircleName('')
    setShowNewCircle(false)
  }

  const deleteCircle = (id: string) => {
    setCircles(prev => prev.filter(c => c.id !== id))
    setFriends(prev => prev.map(f => ({ ...f, circles: f.circles.filter(c => c !== id) })))
  }

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.handle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream">Friends & Circles</h2>
      </div>

      {/* Friend requests */}
      {requests.length > 0 && (
        <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
          <p className="font-display text-lg font-medium text-sp-cream mb-3">
            Friend Requests ({requests.length})
          </p>
          <div className="space-y-2">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between rounded-md bg-sp-canopy/40 px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-sp-fern/20">
                      <img src="/avatar-default.jpg" alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-sp-cream">{req.name}</p>
                      <p className="text-xs text-sp-parchment">@{req.handle}</p>
                      <p className="text-xs text-sp-fern mt-0.5">&ldquo;{req.message}&rdquo;</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="rounded-full p-2 bg-sp-fern/20 text-sp-fern hover:bg-sp-fern hover:text-sp-cream transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => declineRequest(req.id)}
                      className="rounded-full p-2 bg-[#e11d48]/10 text-[#e11d48] hover:bg-[#e11d48] hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button className="rounded-full p-2 text-sp-parchment hover:bg-sp-moss/30 transition-colors">
                      <Ban className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Circles management */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-lg font-medium text-sp-cream">Circles</p>
          <button
            onClick={() => setShowNewCircle(!showNewCircle)}
            className="flex items-center gap-1.5 rounded-full border border-sp-fern px-3 py-1.5 text-xs font-medium text-sp-fern hover:bg-sp-fern/10 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> New Circle
          </button>
        </div>

        <AnimatePresence>
          {showNewCircle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="rounded-md bg-sp-canopy/40 p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Circle name"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  className="w-full rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
                />
                <div className="flex gap-2">
                  {['#22c55e', '#d4a017', '#7c3aed', '#e11d48', '#52b788'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewCircleColor(c)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${newCircleColor === c ? 'border-white' : 'border-transparent'}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <button
                  onClick={createCircle}
                  className="rounded-full bg-sp-amber px-4 py-1.5 text-xs font-semibold text-sp-bark shadow-cta"
                >
                  Create
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {circles.map((circle) => {
            const isExpanded = expandedCircle === circle.id
            const circleFriends = friends.filter(f => f.circles.includes(circle.id))
            return (
              <div key={circle.id} className="rounded-md bg-sp-canopy/40 overflow-hidden">
                <button
                  onClick={() => setExpandedCircle(isExpanded ? null : circle.id)}
                  className="flex w-full items-center justify-between px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: circle.color }} />
                    <span className="text-sm font-medium text-sp-cream">{circle.name}</span>
                    <span className="text-xs text-sp-parchment">{circleFriends.length} members · {privacyLabels[circle.privacy]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="rounded p-1 text-sp-parchment hover:text-sp-cream transition-colors">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCircle(circle.id) }}
                      className="rounded p-1 text-sp-parchment hover:text-[#e11d48] transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-sp-parchment" /> : <ChevronDown className="h-4 w-4 text-sp-parchment" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-2 space-y-1">
                        {circleFriends.length === 0 && (
                          <p className="text-xs text-sp-parchment py-1">No members yet</p>
                        )}
                        {circleFriends.map((f) => (
                          <div key={f.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 overflow-hidden rounded-full border border-sp-fern/20">
                                <img src="/avatar-default.jpg" alt="" className="h-full w-full object-cover" />
                              </div>
                              <span className="text-xs text-sp-cream">{f.name}</span>
                            </div>
                            <button className="text-[10px] text-sp-parchment hover:text-[#e11d48]">Remove</button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Friend list */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-lg font-medium text-sp-cream">Friends ({friends.length})</p>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-1.5 text-xs text-sp-cream placeholder:text-sp-parchment/60 focus:border-sp-fern focus:outline-none w-40"
          />
        </div>
        <div className="space-y-2">
          {filteredFriends.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-md bg-sp-canopy/40 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-9 w-9 overflow-hidden rounded-full border border-sp-fern/20">
                    <img src="/avatar-default.jpg" alt="" className="h-full w-full object-cover" />
                  </div>
                  {f.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sp-canopy bg-[#22c55e]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-sp-cream">{f.name}</p>
                  <p className="text-xs text-sp-parchment">@{f.handle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {f.circles.map((cid) => {
                    const c = circles.find(x => x.id === cid)
                    if (!c) return null
                    return (
                      <span key={cid} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ background: c.color }}>
                        {c.name}
                      </span>
                    )
                  })}
                  {f.circles.length === 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-sp-moss/20 px-2 py-0.5 text-[10px] text-sp-parchment">
                      <Move className="h-3 w-3" /> Unsorted
                    </span>
                  )}
                </div>
                <button className="rounded p-1 text-sp-parchment hover:bg-sp-moss hover:text-sp-cream transition-colors">
                  <MessageCircle className="h-3.5 w-3.5" />
                </button>
                <button className="rounded p-1 text-sp-parchment hover:bg-sp-moss hover:text-sp-cream transition-colors">
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default FriendsCirclesPanel
