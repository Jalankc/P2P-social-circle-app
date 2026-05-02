import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Ban, Download, Trash2, AlertTriangle } from 'lucide-react'

const faces = ['Main Profile', 'Content Profile', 'Anonymous']
const audiences = ['Public', 'Friends', 'Circles', 'Private']

const initialMatrix: Record<string, Record<string, string>> = {
  'Main Profile': { Public: 'friends', Friends: 'friends', Circles: 'circles', Private: 'private' },
  'Content Profile': { Public: 'public', Friends: 'friends', Circles: 'circles', Private: 'private' },
  'Anonymous': { Public: 'private', Friends: 'private', Circles: 'private', Private: 'private' },
}

const visibilityOptions = ['public', 'friends', 'circles', 'private']

const PrivacyPanel = memo(function PrivacyPanel() {
  const [matrix, setMatrix] = useState(initialMatrix)
  const [whoCanComment, setWhoCanComment] = useState('friends')
  const [whoCanMessage, setWhoCanMessage] = useState('friends')
  const [nsfwFilter, setNsfwFilter] = useState(true)
  const [showReadReceipts, setShowReadReceipts] = useState(true)
  const [blockList] = useState([
    { name: 'Troll_99', reason: 'Harassment', date: '2024-01-15' },
    { name: 'SpamBot_X', reason: 'Spam', date: '2024-02-03' },
  ])
  const [deleteStep, setDeleteStep] = useState(0)
  const [confirmHandle, setConfirmHandle] = useState('')

  const setVisibility = (face: string, audience: string, value: string) => {
    setMatrix(prev => ({ ...prev, [face]: { ...prev[face], [audience]: value } }))
  }

  const cellColor = (value: string) => {
    switch (value) {
      case 'public': return 'bg-sp-honey/30 border-sp-honey/50 text-sp-honey'
      case 'friends': return 'bg-sp-fern/20 border-sp-fern/40 text-sp-fern'
      case 'circles': return 'bg-crypt-purple/20 border-crypt-purple/40 text-crypt-glow'
      case 'private': return 'bg-sp-moss/30 border-sp-moss/40 text-sp-parchment'
      default: return 'bg-sp-canopy/40 border-sp-fern/20 text-sp-parchment'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream">Privacy Controls</h2>
      </div>

      {/* Visibility matrix */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Profile Visibility Matrix</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 text-xs text-sp-parchment font-medium">Profile Face</th>
                {audiences.map(a => (
                  <th key={a} className="text-center p-2 text-xs text-sp-parchment font-medium">{a}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faces.map(face => (
                <tr key={face}>
                  <td className="p-2 text-sp-cream font-medium">{face}</td>
                  {audiences.map(audience => (
                    <td key={audience} className="p-2">
                      <select
                        value={matrix[face][audience]}
                        onChange={(e) => setVisibility(face, audience, e.target.value)}
                        className={`w-full rounded-md border px-2 py-1 text-xs font-medium cursor-pointer focus:outline-none ${cellColor(matrix[face][audience])}`}
                      >
                        {visibilityOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-sp-canopy text-sp-cream">
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interaction settings */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Interaction Settings</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-sp-parchment">Who can comment</label>
            <select
              value={whoCanComment}
              onChange={(e) => setWhoCanComment(e.target.value)}
              className="mt-1 w-full rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
            >
              <option>public</option>
              <option>friends</option>
              <option>circles</option>
              <option>private</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-sp-parchment">Who can message</label>
            <select
              value={whoCanMessage}
              onChange={(e) => setWhoCanMessage(e.target.value)}
              className="mt-1 w-full rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
            >
              <option>public</option>
              <option>friends</option>
              <option>circles</option>
              <option>private</option>
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-sp-cream">NSFW content filter</span>
            <button
              onClick={() => setNsfwFilter(!nsfwFilter)}
              className={`relative h-5 w-9 rounded-full transition-colors ${nsfwFilter ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${nsfwFilter ? 'translate-x-4' : ''}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-sp-cream">Show read receipts</span>
            <button
              onClick={() => setShowReadReceipts(!showReadReceipts)}
              className={`relative h-5 w-9 rounded-full transition-colors ${showReadReceipts ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${showReadReceipts ? 'translate-x-4' : ''}`} />
            </button>
          </label>
        </div>
      </div>

      {/* Block list */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Block List</p>
        <div className="space-y-2">
          {blockList.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between rounded-md bg-sp-canopy/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-[#e11d48]" />
                <div>
                  <p className="text-sm text-sp-cream">{entry.name}</p>
                  <p className="text-xs text-sp-parchment">{entry.reason} · {entry.date}</p>
                </div>
              </div>
              <button className="text-xs text-sp-parchment hover:text-[#e11d48] transition-colors">Unblock</button>
            </div>
          ))}
        </div>
      </div>

      {/* Data controls */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Data Controls</p>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-full border border-sp-fern px-5 py-2.5 text-sm font-medium text-sp-fern hover:bg-sp-fern/10 transition-colors">
            <Download className="h-4 w-4" />
            Download all my data
          </button>
          <button
            onClick={() => setDeleteStep(1)}
            className="flex items-center gap-2 rounded-full border border-[#e11d48] px-5 py-2.5 text-sm font-medium text-[#e11d48] hover:bg-[#e11d48]/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>

        {/* Delete flow */}
        {deleteStep > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-md bg-[#e11d48]/10 p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-[#e11d48]">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium text-sm">Account Deletion</span>
            </div>
            {deleteStep === 1 && (
              <>
                <p className="text-sm text-sp-cream">Step 1: Type your handle to confirm</p>
                <input
                  type="text"
                  placeholder="@jordan.p2p"
                  value={confirmHandle}
                  onChange={(e) => setConfirmHandle(e.target.value)}
                  className="w-full rounded-md bg-sp-canopy/60 border border-[#e11d48]/30 px-3 py-2 text-sm text-sp-cream focus:border-[#e11d48] focus:outline-none"
                />
                <button
                  onClick={() => setDeleteStep(2)}
                  className="rounded-full bg-[#e11d48] px-4 py-2 text-xs font-semibold text-white"
                >
                  Confirm handle
                </button>
              </>
            )}
            {deleteStep === 2 && (
              <>
                <p className="text-sm text-sp-cream">Step 2: Confirm chunk redistribution to friends</p>
                <p className="text-xs text-sp-parchment">Your data chunks will be redistributed across your friend network before deletion.</p>
                <button
                  onClick={() => setDeleteStep(3)}
                  className="rounded-full bg-[#e11d48] px-4 py-2 text-xs font-semibold text-white"
                >
                  Confirm redistribution
                </button>
              </>
            )}
            {deleteStep === 3 && (
              <>
                <p className="text-sm text-sp-cream">Step 3: 7-day waiting period initiated</p>
                <p className="text-xs text-sp-parchment">You can cancel this deletion at any time before the 7 days pass.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteStep(4)}
                    className="rounded-full bg-[#e11d48] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Proceed
                  </button>
                  <button
                    onClick={() => { setDeleteStep(0); setConfirmHandle('') }}
                    className="rounded-full border border-sp-fern px-4 py-2 text-xs font-medium text-sp-fern"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {deleteStep === 4 && (
              <>
                <p className="text-sm text-sp-cream font-medium">Final Step: This cannot be undone.</p>
                <p className="text-xs text-sp-parchment">Your account and all associated data will be permanently deleted.</p>
                <button className="rounded-full bg-[#e11d48] px-4 py-2 text-xs font-semibold text-white hover:bg-[#be123c]">
                  Permanently delete my account
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
})

export default PrivacyPanel
