import { useState, memo } from 'react'
import { AlertTriangle, Save } from 'lucide-react'

/* ═══════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════ */

type AgeGate = 'none' | '13' | '16' | '18' | 'custom'
type ProfileRestriction = 'everyone' | '13' | '16' | '18' | 'friends' | 'circles' | 'verified'
type NsfwHandling = 'encrypt' | 'hide' | 'warn'

interface ContentTag {
  id: string
  label: string
}

const CONTENT_TAGS: ContentTag[] = [
  { id: 'strong-language', label: 'Strong Language' },
  { id: 'mature-themes', label: 'Mature Themes' },
  { id: 'nsfw', label: 'NSFW' },
  { id: 'violence', label: 'Violence' },
  { id: 'political', label: 'Political' },
  { id: 'religious', label: 'Religious' },
  { id: 'controversial', label: 'Controversial' },
  { id: 'educational', label: 'Educational' },
  { id: 'art-nudity', label: 'Art/Nudity' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'substance-use', label: 'Substance Use' },
  { id: 'gambling', label: 'Gambling' },
]

const AGE_GATE_OPTIONS: { value: AgeGate; label: string }[] = [
  { value: 'none', label: 'No restriction' },
  { value: '13', label: '13+ (mild language, discussion)' },
  { value: '16', label: '16+ (strong language, mature themes)' },
  { value: '18', label: '18+ (adult content, NSFW)' },
  { value: 'custom', label: 'Custom:' },
]

const PROFILE_RESTRICTION_OPTIONS: { value: ProfileRestriction; label: string }[] = [
  { value: 'everyone', label: 'Everyone (public)' },
  { value: '13', label: 'Age 13+ only' },
  { value: '16', label: 'Age 16+ only' },
  { value: '18', label: 'Age 18+ only' },
  { value: 'friends', label: 'Friends only' },
  { value: 'circles', label: 'Circle members only' },
  { value: 'verified', label: 'Verified accounts only (credibility > 50)' },
]

const NSFW_HANDLING_OPTIONS: { value: NsfwHandling; label: string }[] = [
  { value: 'encrypt', label: 'Encrypt for underage viewers (recommended)' },
  { value: 'hide', label: 'Hide from underage viewers' },
  { value: 'warn', label: 'Show with warning' },
]

const ContentAdvisoryPanel = memo(function ContentAdvisoryPanel() {
  const [ageGate, setAgeGate] = useState<AgeGate>('16')
  const [customAge, setCustomAge] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>(['strong-language', 'mature-themes'])
  const [customWarning, setCustomWarning] = useState('This forum contains unfiltered opinions and spicy takes.')
  const [profileRestriction, setProfileRestriction] = useState<ProfileRestriction>('16')
  const [nsfwHandling, setNsfwHandling] = useState<NsfwHandling>('encrypt')

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-sp-amber" />
          {'\u26A0'} Content Advisory
        </h2>
        <p className="text-sm text-sp-parchment mt-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          This is NOT a rating — it&apos;s a heads-up for visitors.
        </p>
      </div>

      {/* Age Gate */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <p className="font-retro text-[12px] uppercase text-sp-amber">Age Gate</p>
        <div className="space-y-2">
          {AGE_GATE_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
              <span
                className="flex-shrink-0 h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-colors"
                style={{
                  borderColor: ageGate === option.value ? '#52b788' : 'rgba(45,106,79,0.5)',
                  background: ageGate === option.value ? 'rgba(82,183,136,0.2)' : 'transparent',
                }}
                onClick={() => setAgeGate(option.value)}
              >
                {ageGate === option.value && (
                  <span className="h-2 w-2 rounded-full" style={{ background: '#52b788' }} />
                )}
              </span>
              <span className="text-sm text-sp-cream group-hover:text-sp-fern transition-colors">
                {option.label}
              </span>
              {option.value === 'custom' && ageGate === 'custom' && (
                <input
                  type="text"
                  value={customAge}
                  onChange={(e) => setCustomAge(e.target.value)}
                  placeholder="__"
                  className="w-16 px-2 py-0.5 font-mono text-[12px] text-sp-cream bg-sp-canopy/60 focus:outline-none"
                  style={{ border: '1px solid rgba(45,106,79,0.4)', borderRadius: '0px' }}
                />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Content Tags */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <p className="font-retro text-[12px] uppercase text-sp-amber">Content Tags (check all that apply)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONTENT_TAGS.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 cursor-pointer group">
              <span
                className="flex-shrink-0 h-3.5 w-3.5 flex items-center justify-center transition-colors"
                style={{
                  border: selectedTags.includes(tag.id) ? '1px solid #52b788' : '1px solid rgba(45,106,79,0.5)',
                  background: selectedTags.includes(tag.id) ? 'rgba(82,183,136,0.2)' : 'transparent',
                  borderRadius: '0px',
                }}
                onClick={() => toggleTag(tag.id)}
              >
                {selectedTags.includes(tag.id) && (
                  <span className="text-[10px] text-sp-fern">{'\u2713'}</span>
                )}
              </span>
              <span className="text-sm text-sp-cream group-hover:text-sp-fern transition-colors">
                {tag.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Warning */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <p className="font-retro text-[12px] uppercase text-sp-amber">Custom Warning</p>
        <textarea
          value={customWarning}
          onChange={(e) => setCustomWarning(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-sm text-sp-cream placeholder-sp-parchment/50 bg-sp-canopy/60 focus:outline-none resize-none"
          style={{
            border: '1px solid rgba(45,106,79,0.4)',
            borderRadius: '0px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        />
      </div>

      {/* Profile Viewing Restrictions */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <p className="font-retro text-[12px] uppercase text-sp-amber">Profile Viewing Restrictions</p>
        <div className="space-y-2">
          {PROFILE_RESTRICTION_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
              <span
                className="flex-shrink-0 h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-colors"
                style={{
                  borderColor: profileRestriction === option.value ? '#52b788' : 'rgba(45,106,79,0.5)',
                  background: profileRestriction === option.value ? 'rgba(82,183,136,0.2)' : 'transparent',
                }}
                onClick={() => setProfileRestriction(option.value)}
              >
                {profileRestriction === option.value && (
                  <span className="h-2 w-2 rounded-full" style={{ background: '#52b788' }} />
                )}
              </span>
              <span className="text-sm text-sp-cream group-hover:text-sp-fern transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* NSFW Handling */}
      <div
        className="p-4 space-y-3"
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <p className="font-retro text-[12px] uppercase text-sp-amber">NSFW Handling</p>
        <div className="space-y-2">
          {NSFW_HANDLING_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
              <span
                className="flex-shrink-0 h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-colors"
                style={{
                  borderColor: nsfwHandling === option.value ? '#52b788' : 'rgba(45,106,79,0.5)',
                  background: nsfwHandling === option.value ? 'rgba(82,183,136,0.2)' : 'transparent',
                }}
                onClick={() => setNsfwHandling(option.value)}
              >
                {nsfwHandling === option.value && (
                  <span className="h-2 w-2 rounded-full" style={{ background: '#52b788' }} />
                )}
              </span>
              <span className="text-sm text-sp-cream group-hover:text-sp-fern transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        className="flex items-center gap-2 px-4 py-1.5 font-retro text-[11px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80"
        style={{ background: 'var(--sp-moss)', border: 'none', borderRadius: '0px' }}
      >
        <Save className="h-3.5 w-3.5" />
        Save Advisory
      </button>
    </div>
  )
})

export default ContentAdvisoryPanel
