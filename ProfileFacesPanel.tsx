import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Globe, Video, Ghost, ToggleLeft, ToggleRight, Edit3, Copy } from 'lucide-react'

const faceTypes = [
  { key: 'main', label: 'Main Profile', icon: Globe, color: 'text-sp-fern', desc: 'Your public identity' },
  { key: 'content', label: 'Content Profile', icon: Video, color: 'text-sp-honey', desc: 'Creator / publisher face' },
  { key: 'anonymous', label: 'Nickname Profile', icon: Ghost, color: 'text-crypt-purple', desc: 'Untraceable posts' },
] as const

const ProfileFacesPanel = memo(function ProfileFacesPanel() {
  const [activeFace, setActiveFace] = useState('main')
  const [faces, setFaces] = useState({
    main: { name: 'Jordan Seedling', handle: 'jordan.p2p', bio: 'Solar punk builder. Growing networks like gardens.', visible: true },
    content: { name: 'Jordan Creates', handle: 'jordan.creates', bio: 'Videos about p2p culture and digital autonomy.', visible: true },
    anonymous: { name: 'Fern_42', handle: 'fern.42', bio: 'Random thoughts, no trails.', visible: false },
  })

  const toggleFace = (key: string) => {
    setFaces(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof prev], visible: !prev[key as keyof typeof prev].visible } }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream">Your Three Faces</h2>
        <p className="mt-1 text-[15px] text-sp-parchment">
          Manage how the world sees you. Each face is a separate profile with its own settings.
        </p>
      </div>

      {/* Active face selector */}
      <div className="flex gap-2">
        {faceTypes.map((ft) => {
          const Icon = ft.icon
          const isActive = activeFace === ft.key
          return (
            <button
              key={ft.key}
              onClick={() => setActiveFace(ft.key)}
              className={
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ' +
                (isActive
                  ? 'bg-sp-moss text-sp-cream'
                  : 'bg-sp-moss/20 text-sp-parchment hover:bg-sp-moss/30')
              }
            >
              <Icon className={`h-4 w-4 ${ft.color}`} />
              {ft.label}
            </button>
          )
        })}
      </div>

      {/* Face cards */}
      <div className="space-y-5">
        {faceTypes.map((ft, idx) => {
          const Icon = ft.icon
          const data = faces[ft.key as keyof typeof faces]
          return (
            <motion.div
              key={ft.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rounded-lg p-5"
              style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${ft.color}`} />
                  <span className="font-display text-lg font-medium text-sp-cream">{ft.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="rounded-full p-1.5 text-sp-parchment hover:bg-sp-moss hover:text-sp-cream transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleFace(ft.key)}
                    className="text-sp-fern transition-colors hover:text-sp-sapling"
                  >
                    {data.visible ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-sp-parchment" />}
                  </button>
                </div>
              </div>

              {/* Avatar + fields */}
              <div className="flex gap-4 items-start">
                <div className="shrink-0">
                  <div className="h-20 w-20 overflow-hidden rounded-lg border border-sp-fern/20">
                    <img src="/avatar-default.jpg" alt="avatar" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 grid gap-3">
                  <div>
                    <label className="text-xs font-medium text-sp-parchment">Display Name</label>
                    <input
                      type="text"
                      value={data.name}
                      readOnly
                      className="mt-1 w-full rounded-md bg-sp-canopy/60 px-3 py-2 text-sm text-sp-cream border border-sp-fern/30 focus:border-sp-fern focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-sp-parchment">Handle</label>
                    <div className="mt-1 flex items-center rounded-md bg-sp-canopy/60 border border-sp-fern/30 px-3 py-2">
                      <span className="text-sp-parchment text-sm mr-1">@</span>
                      <span className="text-sm text-sp-cream">{data.handle}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-sp-parchment">Bio</label>
                    <textarea
                      value={data.bio}
                      readOnly
                      rows={2}
                      className="mt-1 w-full rounded-md bg-sp-canopy/60 px-3 py-2 text-sm text-sp-cream border border-sp-fern/30 focus:border-sp-fern focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* URL preview */}
              <div className="mt-4 flex items-center justify-between rounded-md bg-sp-canopy/40 px-3 py-2">
                <span className="text-[13px] text-sp-fern">socialcircle.p2p/@{data.handle}</span>
                <button className="rounded p-1 text-sp-parchment hover:text-sp-cream transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Visibility */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['Everyone', 'Friends', 'Circles', 'Nobody'].map((opt) => (
                  <span
                    key={opt}
                    className={
                      'rounded-full px-3 py-1 text-xs font-medium border transition-colors ' +
                      (opt === 'Everyone' && ft.key === 'main'
                        ? 'bg-sp-fern/20 border-sp-fern/40 text-sp-fern'
                        : 'border-sp-fern/20 text-sp-parchment')
                    }
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add new face */}
      <button className="w-full rounded-full border border-sp-fern px-6 py-3 text-sm font-medium text-sp-fern transition-colors hover:bg-sp-fern/10">
        + Create Additional Profile
      </button>
    </div>
  )
})

export default ProfileFacesPanel
