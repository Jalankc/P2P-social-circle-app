import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Heart, Mail, MapPin, Phone, Calendar,
  Shield, Play, ShoppingCart, MessageSquare, UserPlus,
  Flag, ExternalLink, Github, Briefcase, Music,
  Bot, Check, Star, ChevronDown, AlertTriangle,
} from 'lucide-react'

/* ═══════════════════════════════════════════
   AUTO-RANK DATA (XMB Style)
   ═══════════════════════════════════════════ */

interface AutoRank {
  name: string
  badge: string
  min: number
  max: number
}

const AUTO_RANKS: AutoRank[] = [
  { name: 'Seedling', badge: '\u{1F331}', min: 0, max: 0 },
  { name: 'Sprout', badge: '\u{1F33F}', min: 1, max: 9 },
  { name: 'Seedling Scout', badge: '\u{1F343}', min: 10, max: 49 },
  { name: 'Growing', badge: '\u{1F33E}', min: 50, max: 99 },
  { name: 'Established', badge: '\u{1F332}', min: 100, max: 249 },
  { name: 'Senior Member', badge: '\u{1F3DB}', min: 250, max: 499 },
  { name: 'Elder', badge: '\u{1F451}', min: 500, max: 999 },
  { name: 'Ancient One', badge: '\u{1F989}', min: 1000, max: 2499 },
  { name: 'Living Archive', badge: '\u{1F4DC}', min: 2500, max: Infinity },
]

function getAutoRank(postCount: number): AutoRank {
  return AUTO_RANKS.find((r) => postCount >= r.min && postCount <= r.max) || AUTO_RANKS[0]
}

function getNextAutoRank(postCount: number): AutoRank | null {
  const currentIndex = AUTO_RANKS.findIndex((r) => postCount >= r.min && postCount <= r.max)
  if (currentIndex === -1 || currentIndex >= AUTO_RANKS.length - 1) return null
  return AUTO_RANKS[currentIndex + 1]
}

function getRankProgress(postCount: number): { percent: number; remaining: number } {
  const current = getAutoRank(postCount)
  const next = getNextAutoRank(postCount)
  if (!next) return { percent: 100, remaining: 0 }
  const range = next.min - current.min
  const progress = postCount - current.min
  const percent = Math.round((progress / range) * 100)
  return { percent, remaining: next.min - postCount }
}

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type TabId = 'about' | 'posts' | 'vblog' | 'store' | 'contact' | 'links' | 'connections'
type PrivacyLevel = 'F' | 'C' | 'P' | 'A'

interface KarmaVector {
  M: number
  S: number
  I: number
  E: number
}

interface ProfileField {
  icon: React.ReactNode
  label: string
  value: string
  privacy: PrivacyLevel
}

interface VblogVideo {
  id: string
  title: string
  duration: string
  views: string
  age: string
}

interface Product {
  id: string
  title: string
  price: string
  seller: string
  sellerHandle: string
}

interface UserLink {
  id: string
  icon: React.ReactNode
  label: string
  url: string
}

interface UserPost {
  id: string
  title: string
  forum: string
  replies: number
  views: string
  age: string
}

/* ─── v7 New Types ─── */
interface RelationshipData {
  status: string[]
  spouses: string[]
  fiances: string[]
  partners: string[]
  polyType: string
  privacy: PrivacyLevel
}

interface ContentProfile {
  name: string
  handle: string
  type: string
  pic: string
}

interface HighProfileConnection {
  type: string
  name: string
  handle: string
  verified: boolean
}

interface ClawbotData {
  active: boolean
  yCredits: number
  dailyPostsUsed: number
  dailyPostsMax: number
  aiTolerance: number
}

/* ═══════════════════════════════════════════
   MOCK DATA — Willow
   ═══════════════════════════════════════════ */

const USER_PROFILE = {
  name: 'Willow',
  handle: 'willow_03',
  displayHandle: 'willow',
  rank: 'Grove Keeper',
  rankIcon: '\u{1F33F}',
  bio: 'Cultivating digital gardens since EarthCycle 12 \u{1F331}',
  avatar: '/avatar-default.jpg',
  banner: '/profile-retro-bg.jpg',
  credibility: 95,
  credibilityTier: 'Verified Trust',
  karma: { M: 78, S: 92, I: 64, E: 71 } as KarmaVector,
  serviceCharge: 5,
  serviceTier: 'Seedling',
  postCount: 147,
}

const PROFILE_FIELDS: ProfileField[] = [
  { icon: <Calendar className="h-3.5 w-3.5" />, label: 'Birthday', value: 'Spring Equinox (March 20)', privacy: 'F' },
  { icon: <Heart className="h-3.5 w-3.5" />, label: 'Relationship', value: 'Partnered with @river', privacy: 'P' },
  { icon: <Mail className="h-3.5 w-3.5" />, label: 'Email', value: 'willow@grove.p2p', privacy: 'C' },
  { icon: <MapPin className="h-3.5 w-3.5" />, label: 'Location', value: 'Pacific Northwest', privacy: 'P' },
  { icon: <Phone className="h-3.5 w-3.5" />, label: 'Number', value: '***-***-8921', privacy: 'F' },
]

const RELATIONSHIPS: RelationshipData = {
  status: ['Partnered', 'Polyamorous'],
  spouses: ['@partner1'],
  fiances: ['@fiancé1', '@fiancé2'],
  partners: ['@partner2', '@partner3', '@partner4'],
  polyType: 'Polyamorous',
  privacy: 'P',
}

const CONTENT_PROFILES: ContentProfile[] = [
  { name: 'Main', handle: '@willow', type: 'Public', pic: '/avatar-default.jpg' },
  { name: 'Blogging', handle: '@willow_blog', type: 'Blogging', pic: '/avatar-default.jpg' },
  { name: 'Vblogging', handle: '@willow_vlog', type: 'Vblogging', pic: '/avatar-default.jpg' },
  { name: 'Anonymous', handle: '@night_owl', type: 'Circle-only', pic: '/avatar-default.jpg' },
]

const CONNECTIONS: HighProfileConnection[] = [
  { type: 'Actor', name: 'Actor Name', handle: '@actor_name', verified: true },
  { type: 'Musician', name: 'Musician Name', handle: '@musician_name', verified: true },
  { type: 'Developer', name: 'Dev Name', handle: '@dev_name', verified: true },
]

const CLAWBOT: ClawbotData = {
  active: true,
  yCredits: 450,
  dailyPostsUsed: 3,
  dailyPostsMax: 5,
  aiTolerance: 50,
}

const VBLOG_VIDEOS: VblogVideo[] = [
  { id: '1', title: 'My Garden Tour', duration: '16:34', views: '1.2K', age: '2d' },
  { id: '2', title: 'P2P Explained', duration: '08:12', views: '3.4K', age: '5d' },
  { id: '3', title: 'Solar Beats', duration: '04:56', views: '890', age: '1w' },
  { id: '4', title: 'Day in the Life', duration: '22:01', views: '456', age: '2w' },
]

const USER_PRODUCTS: Product[] = [
  { id: '1', title: 'Organic Seeds', price: '$15E', seller: 'Willow', sellerHandle: 'willow_03' },
  { id: '2', title: 'Custom Art', price: '$45E', seller: 'Willow', sellerHandle: 'willow_03' },
  { id: '3', title: 'P2P Kit', price: '$120M', seller: 'Willow', sellerHandle: 'willow_03' },
]

const USER_LINKS: UserLink[] = [
  { id: '1', icon: <Globe className="h-4 w-4" />, label: 'Personal Website', url: 'https://willow.grove.p2p' },
  { id: '2', icon: <Briefcase className="h-4 w-4" />, label: 'Portfolio', url: 'https://willow.design' },
  { id: '3', icon: <Github className="h-4 w-4" />, label: 'GitHub', url: 'https://github.com/willow-code' },
  { id: '4', icon: <Music className="h-4 w-4" />, label: 'Bandcamp', url: 'https://solar-beats.bandcamp.com' },
]

const USER_POSTS: UserPost[] = [
  { id: '1', title: 'Welcome to the Grove', forum: "Willow's Grove", replies: 89, views: '2.3K', age: '2d ago' },
  { id: '2', title: 'Forum Rules & Seed Etiquette', forum: "Willow's Grove", replies: 156, views: '4.1K', age: '5d ago' },
  { id: '3', title: 'Gardening Tips for Digital Natives', forum: 'General Discussion', replies: 34, views: '1.1K', age: '1w ago' },
  { id: '4', title: 'P2P Mesh Network Guide', forum: 'Tech Talk', replies: 67, views: '2.8K', age: '2w ago' },
  { id: '5', title: 'Solar Beats — New Mixtape', forum: 'Music Share', replies: 23, views: '890', age: '3w ago' },
]

/* ═══════════════════════════════════════════
   PRIVACY MAP
   ═══════════════════════════════════════════ */

const PRIVACY_LABELS: Record<PrivacyLevel, string> = {
  F: 'Friends',
  C: 'Circle',
  P: 'Public',
  A: 'Anonymous-only',
}

const PRIVACY_COLORS: Record<PrivacyLevel, string> = {
  F: '#52b788',
  C: '#d4a017',
  P: '#95d5b2',
  A: '#7c3aed',
}

/* ═══════════════════════════════════════════
   TAB CONFIG
   ═══════════════════════════════════════════ */

const TABS: { id: TabId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'posts', label: 'Posts' },
  { id: 'vblog', label: 'Vblog' },
  { id: 'store', label: 'Store' },
  { id: 'connections', label: 'Connections' },
  { id: 'contact', label: 'Contact' },
  { id: 'links', label: 'Links' },
]

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function KarmaBar({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: number
  color: string
}) {
  const filled = Math.round(value / 10)
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled)
  return (
    <div className="flex items-center gap-2 font-mono text-[12px]">
      <span className="flex-shrink-0" style={{ width: '100px' }}>
        <span>{icon}</span>{' '}
        <span className="text-sp-parchment">{label}</span>
      </span>
      <span style={{ color }}>{bar}</span>
      <span className="text-sp-cream ml-1">{value}%</span>
    </div>
  )
}

function VideoCard({ video }: { video: VblogVideo }) {
  return (
    <div
      className="group cursor-pointer transition-colors hover:bg-sp-fern/10"
      style={{
        border: '1px solid rgba(45,106,79,0.3)',
        background: 'rgba(15,41,30,0.5)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: '120px',
          background: 'rgba(15,41,30,0.8)',
          borderBottom: '1px solid rgba(45,106,79,0.3)',
        }}
      >
        <Play className="h-8 w-8 text-sp-fern group-hover:text-sp-cream transition-colors" />
        <span
          className="absolute bottom-1.5 right-1.5 font-mono text-[10px] px-1 py-0.5"
          style={{
            background: 'rgba(15,41,30,0.85)',
            color: '#e8e0cc',
          }}
        >
          {video.duration}
        </span>
      </div>
      {/* Info */}
      <div className="p-2">
        <p className="text-sm text-sp-cream font-medium truncate group-hover:text-sp-fern transition-colors">
          {video.title}
        </p>
        <p className="font-mono text-[10px] text-sp-parchment mt-0.5">
          {video.views} views &bull; {video.age}
        </p>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className="transition-colors hover:bg-sp-fern/10"
      style={{
        border: '1px solid rgba(45,106,79,0.3)',
        background: 'rgba(15,41,30,0.5)',
      }}
    >
      {/* Photo placeholder */}
      <div
        className="flex items-center justify-center"
        style={{
          height: '140px',
          background: 'rgba(15,41,30,0.8)',
          borderBottom: '1px solid rgba(45,106,79,0.3)',
        }}
      >
        <ShoppingCart className="h-8 w-8 text-sp-moss" />
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm text-sp-cream font-medium">{product.title}</p>
        <p className="font-mono text-[12px] text-sp-amber mt-1">{product.price}</p>
        <p className="font-mono text-[10px] text-sp-parchment mt-0.5">
          <Link to={`/@${product.sellerHandle}`} className="text-sp-fern hover:text-sp-cream transition-colors hover:underline">
            @{product.sellerHandle}
          </Link>
        </p>
        <button
          className="mt-2 w-full px-3 py-1 font-retro text-[11px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80"
          style={{
            background: 'var(--sp-moss)',
            border: 'none',
            borderRadius: '0px',
          }}
        >
          Buy
        </button>
      </div>
    </div>
  )
}

function ActionButton({
  children,
  variant = 'primary',
  onClick,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
}) {
  const styles = {
    primary: {
      bg: 'var(--sp-moss)',
      color: '#f5f0e1',
      border: '1px solid var(--sp-moss)',
    },
    secondary: {
      bg: 'transparent',
      color: '#e8e0cc',
      border: '1px solid rgba(45,106,79,0.4)',
    },
    danger: {
      bg: 'transparent',
      color: '#e11d48',
      border: '1px solid rgba(225,29,72,0.4)',
    },
  }
  const s = styles[variant]
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 font-retro text-[11px] uppercase transition-colors"
      style={{
        background: s.bg,
        color: s.color,
        border: s.border,
        borderRadius: '0px',
      }}
    >
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════
   TAB CONTENT COMPONENTS
   ═══════════════════════════════════════════ */

function AboutTab() {
  return (
    <div className="space-y-5">
      {/* Bio */}
      <div>
        <h3 className="font-retro text-sm uppercase text-sp-amber mb-2" style={{ letterSpacing: '0.05em' }}>
          Bio
        </h3>
        <p className="text-sm text-sp-cream leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {USER_PROFILE.bio}
        </p>
      </div>

      {/* Profile Fields */}
      <div
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <div
          className="px-3 py-1.5"
          style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
        >
          <span className="font-retro text-xs uppercase text-sp-amber">Details</span>
        </div>
        <div className="divide-y divide-sp-moss/15">
          {PROFILE_FIELDS.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-sp-fern/5"
            >
              <div className="flex items-center gap-2">
                <span className="text-sp-fern">{field.icon}</span>
                <span className="font-mono text-[11px] text-sp-parchment">{field.label}:</span>
                <span className="text-sm text-sp-cream">{field.value}</span>
              </div>
              <span
                className="font-mono text-[9px] uppercase px-1.5 py-0.5"
                style={{
                  border: `1px solid ${PRIVACY_COLORS[field.privacy]}44`,
                  color: PRIVACY_COLORS[field.privacy],
                  background: `${PRIVACY_COLORS[field.privacy]}11`,
                  borderRadius: '2px',
                }}
              >
                {PRIVACY_LABELS[field.privacy]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Status */}
      <div
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <div
          className="px-3 py-1.5"
          style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
        >
          <span className="font-retro text-xs uppercase text-sp-amber">Relationship Status</span>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-sp-amber" />
            <span className="font-mono text-[11px] text-sp-parchment">Status:</span>
            <span className="text-sm text-sp-cream">{RELATIONSHIPS.status.join(', ')}</span>
          </div>
          {RELATIONSHIPS.spouses.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-sp-amber" />
              <span className="font-mono text-[11px] text-sp-parchment" style={{ width: '80px' }}>Spouse(s):</span>
              <span className="text-sm text-sp-cream">{RELATIONSHIPS.spouses.join(', ')}</span>
            </div>
          )}
          {RELATIONSHIPS.fiances.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-sp-amber" />
              <span className="font-mono text-[11px] text-sp-parchment" style={{ width: '80px' }}>Fiancé(s):</span>
              <span className="text-sm text-sp-cream">{RELATIONSHIPS.fiances.join(', ')}</span>
            </div>
          )}
          {RELATIONSHIPS.partners.length > 0 && (
            <div className="flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-sp-fern" />
              <span className="font-mono text-[11px] text-sp-parchment" style={{ width: '80px' }}>Partner(s):</span>
              <span className="text-sm text-sp-cream">{RELATIONSHIPS.partners.join(', ')}</span>
            </div>
          )}
          <p className="font-mono text-[10px] text-sp-parchment mt-1" style={{ opacity: 0.7 }}>
            (All partners listed equally — no hierarchy)
          </p>
        </div>
      </div>

      {/* Content Profiles */}
      <div
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <div
          className="px-3 py-1.5"
          style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
        >
          <span className="font-retro text-xs uppercase text-sp-amber">Content Profiles</span>
        </div>
        <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONTENT_PROFILES.map((profile) => (
            <div
              key={profile.name}
              className="transition-colors hover:bg-sp-fern/10"
              style={{
                border: '1px solid rgba(45,106,79,0.3)',
                background: 'rgba(15,41,30,0.5)',
              }}
            >
              <div
                className="px-2 py-1"
                style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
              >
                <span className="font-retro text-[11px] uppercase text-sp-amber">{profile.name}</span>
              </div>
              <div className="p-2 flex flex-col items-center gap-1.5">
                <div
                  className="h-12 w-12 overflow-hidden"
                  style={{ border: '1px solid rgba(45,106,79,0.4)', borderRadius: '2px' }}
                >
                  <img src={profile.pic} alt={profile.handle} className="h-full w-full object-cover" />
                </div>
                <span className="text-sm text-sp-cream font-medium">{profile.handle}</span>
                <span
                  className="font-mono text-[9px] uppercase px-1.5 py-0.5"
                  style={{
                    border: '1px solid rgba(149,213,178,0.3)',
                    color: '#95d5b2',
                    background: 'rgba(149,213,178,0.1)',
                    borderRadius: '2px',
                  }}
                >
                  {profile.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Vector Karma */}
      <div
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <div
          className="px-3 py-1.5"
          style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
        >
          <span className="font-retro text-xs uppercase text-sp-amber">4-Vector Karma</span>
        </div>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <KarmaBar icon="\u{1F527}" label="Material" value={USER_PROFILE.karma.M} color="#95a5a6" />
          <KarmaBar icon="\u{1F4AC}" label="Social" value={USER_PROFILE.karma.S} color="#d4a017" />
          <KarmaBar icon="\u{1F4A1}" label="Innovation" value={USER_PROFILE.karma.I} color="#00bcd4" />
          <KarmaBar icon="\u{1F331}" label="Ecology" value={USER_PROFILE.karma.E} color="#52b788" />
        </div>
      </div>

      {/* Credibility */}
      <div
        className="flex items-center gap-3 px-3 py-2"
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <Shield className="h-4 w-4 text-sp-amber" />
        <span className="font-mono text-[12px] text-sp-parchment">
          Credibility on THIS forum:
        </span>
        <span className="font-mono text-[12px] text-sp-amber font-bold">
          {'\u{1F6E1}'} {USER_PROFILE.credibility}
        </span>
        <span
          className="font-mono text-[10px] uppercase px-1.5 py-0.5"
          style={{
            border: '1px solid rgba(212,160,23,0.4)',
            color: '#d4a017',
            background: 'rgba(212,160,23,0.1)',
            borderRadius: '2px',
          }}
        >
          {USER_PROFILE.credibilityTier}
        </span>
      </div>

      {/* Auto-Rank */}
      <AutoRankDisplay />

      {/* Content Advisory */}
      <ContentAdvisoryDisplay />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <ActionButton variant="primary">
          <span className="flex items-center gap-1"><UserPlus className="h-3 w-3" /> Add Friend</span>
        </ActionButton>
        <ActionButton variant="secondary">
          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Message</span>
        </ActionButton>
        <Link to={`/@${USER_PROFILE.handle}`}>
          <ActionButton variant="secondary">
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> View Forum</span>
          </ActionButton>
        </Link>
        <ActionButton variant="danger">
          <span className="flex items-center gap-1"><Flag className="h-3 w-3" /> Report</span>
        </ActionButton>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AUTO-RANK DISPLAY (in About tab)
   ═══════════════════════════════════════════ */

function AutoRankDisplay() {
  const rank = getAutoRank(USER_PROFILE.postCount)
  const nextRank = getNextAutoRank(USER_PROFILE.postCount)
  const progress = getRankProgress(USER_PROFILE.postCount)
  const filled = Math.round(progress.percent / 5)
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(20 - filled)

  return (
    <div
      style={{
        border: '1px solid rgba(45,106,79,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <div
        className="px-3 py-1.5"
        style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
      >
        <span className="font-retro text-xs uppercase text-sp-amber">Rank</span>
      </div>
      <div className="p-3 space-y-2">
        {/* Custom Rank */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-sp-parchment">Rank:</span>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 font-retro text-[9px] uppercase"
            style={{
              background: 'rgba(212,160,23,0.15)',
              border: '1px solid rgba(212,160,23,0.3)',
              color: '#d4a017',
              borderRadius: '2px',
            }}
          >
            {USER_PROFILE.rankIcon} {USER_PROFILE.rank}
          </span>
          <span className="font-mono text-[10px] text-sp-parchment" style={{ opacity: 0.6 }}>
            (Custom — set by forum owner)
          </span>
        </div>

        {/* Auto-Rank */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-sp-parchment">Auto-Rank:</span>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 font-retro text-[9px] uppercase"
            style={{
              background: 'rgba(82,183,136,0.15)',
              border: '1px solid rgba(82,183,136,0.3)',
              color: '#52b788',
              borderRadius: '2px',
            }}
          >
            {rank.badge} {rank.name}
          </span>
          <span className="font-mono text-[10px] text-sp-parchment" style={{ opacity: 0.6 }}>
            — {USER_PROFILE.postCount} posts
          </span>
        </div>

        {/* Progress Bar */}
        {nextRank && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <span style={{ color: '#52b788' }}>{bar}</span>
              <span className="text-sp-cream ml-1">{progress.percent}%</span>
            </div>
            <p className="font-mono text-[10px] text-sp-parchment" style={{ opacity: 0.6 }}>
              ({progress.remaining} to {nextRank.name})
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CONTENT ADVISORY DISPLAY (in About tab)
   ═══════════════════════════════════════════ */

function ContentAdvisoryDisplay() {
  return (
    <div
      style={{
        border: '1px solid rgba(212,160,23,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <div
        className="px-3 py-1.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(212,160,23,0.2)' }}
      >
        <AlertTriangle className="h-3.5 w-3.5 text-sp-amber" />
        <span className="font-retro text-xs uppercase text-sp-amber">Content Advisory</span>
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm text-sp-cream">
          <span className="font-mono text-[11px] text-sp-parchment">Age:</span>{' '}
          <span className="font-bold">16+</span>
          {' | '}
          <span className="font-mono text-[11px] text-sp-parchment">Tags:</span>{' '}
          Strong Language, Mature Themes
        </p>
        <p className="text-sm text-sp-parchment italic" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          &ldquo;This forum contains unfiltered opinions and spicy takes.&rdquo;
        </p>
      </div>
    </div>
  )
}

function PostsTab() {
  return (
    <div
      style={{
        border: '1px solid rgba(45,106,79,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
      >
        <span className="font-retro text-xs uppercase text-sp-amber">Recent Posts</span>
        <span className="font-mono text-[10px] text-sp-parchment">{USER_POSTS.length} posts</span>
      </div>
      <div className="divide-y divide-sp-moss/15">
        {USER_POSTS.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-sp-fern/10 cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-sp-cream font-medium truncate hover:text-sp-fern transition-colors">
                {post.title}
              </p>
              <p className="font-mono text-[10px] text-sp-parchment mt-0.5">
                in {post.forum} &bull; {post.age}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <div className="text-center" style={{ width: '50px' }}>
                <p className="font-mono text-[11px] text-sp-sapling">{post.replies}</p>
                <p className="font-mono text-[9px] uppercase text-sp-parchment">replies</p>
              </div>
              <div className="text-center" style={{ width: '50px' }}>
                <p className="font-mono text-[11px] text-sp-sapling">{post.views}</p>
                <p className="font-mono text-[9px] uppercase text-sp-parchment">views</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VblogTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-retro text-sm uppercase text-sp-amber" style={{ letterSpacing: '0.05em' }}>
          {'\u{1F4F9}'} Vblog
        </h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 font-retro text-[10px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80" style={{ background: 'var(--sp-moss)', borderRadius: '0px' }}>
            New Vlog +
          </button>
          <button className="px-3 py-1 font-mono text-[10px] text-sp-parchment transition-colors hover:text-sp-cream" style={{ border: '1px solid rgba(45,106,79,0.4)', borderRadius: '0px', background: 'transparent' }}>
            Subscribe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {VBLOG_VIDEOS.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}

function ClawbotPanel() {
  const [karmaType, setKarmaType] = useState<'M' | 'S' | 'I' | 'E'>('M')
  const [amount, setAmount] = useState('')

  const karmaLabels: Record<'M' | 'S' | 'I' | 'E', { icon: string; color: string }> = {
    M: { icon: '\u{1F527}', color: '#95a5a6' },
    S: { icon: '\u{1F4AC}', color: '#d4a017' },
    I: { icon: '\u{1F4A1}', color: '#00bcd4' },
    E: { icon: '\u{1F331}', color: '#52b788' },
  }

  return (
    <div
      style={{
        border: '1px solid rgba(45,106,79,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <div
        className="px-3 py-1.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
      >
        <Bot className="h-4 w-4 text-sp-amber" />
        <span className="font-retro text-xs uppercase text-sp-amber">Clawbot (AI Agent)</span>
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-sp-parchment">Status:</span>
          <span className="font-mono text-[11px]" style={{ color: CLAWBOT.active ? '#52b788' : '#e11d48' }}>
            {CLAWBOT.active ? 'Active' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-sp-parchment">Y-Credits:</span>
          <span className="font-mono text-[11px] text-sp-amber font-bold">{CLAWBOT.yCredits}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-sp-parchment">Daily Posts:</span>
          <span className="font-mono text-[11px] text-sp-cream">
            {CLAWBOT.dailyPostsUsed}/{CLAWBOT.dailyPostsMax} used
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-sp-parchment">AI Tolerance on Your Forum:</span>
          <span className="font-mono text-[11px] text-sp-sapling font-bold">{CLAWBOT.aiTolerance}%</span>
        </div>

        {/* Conversion */}
        <div
          className="p-2"
          style={{ borderTop: '1px solid rgba(45,106,79,0.2)', background: 'rgba(15,41,30,0.3)' }}
        >
          <p className="font-retro text-[11px] uppercase text-sp-amber mb-2">Convert Karma → Y-Credits</p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={karmaType}
                onChange={(e) => setKarmaType(e.target.value as 'M' | 'S' | 'I' | 'E')}
                className="appearance-none px-3 py-1 pr-7 font-mono text-[11px] text-sp-cream bg-sp-canopy/60 focus:outline-none"
                style={{ border: '1px solid rgba(45,106,79,0.4)', borderRadius: '0px' }}
              >
                <option value="M">{karmaLabels.M.icon} Material</option>
                <option value="S">{karmaLabels.S.icon} Social</option>
                <option value="I">{karmaLabels.I.icon} Innovation</option>
                <option value="E">{karmaLabels.E.icon} Ecology</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-sp-parchment pointer-events-none" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-24 px-2 py-1 font-mono text-[11px] text-sp-cream placeholder-sp-parchment/50 bg-sp-canopy/60 focus:outline-none"
              style={{ border: '1px solid rgba(45,106,79,0.4)', borderRadius: '0px' }}
            />
            <button
              className="px-3 py-1 font-retro text-[11px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80"
              style={{ background: 'var(--sp-moss)', border: 'none', borderRadius: '0px' }}
            >
              Convert →
            </button>
          </div>
          <p className="font-mono text-[10px] text-sp-parchment mt-1.5" style={{ opacity: 0.6 }}>
            Rate: 10 M/S/I/E karma = 1 Y-credit
          </p>
        </div>
      </div>
    </div>
  )
}

function StoreTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-retro text-sm uppercase text-sp-amber" style={{ letterSpacing: '0.05em' }}>
          {'\u{1F6D2}'} {USER_PROFILE.name}&apos;s Grove Store
        </h3>
        <Link
          to="/store"
          className="font-mono text-[10px] text-sp-fern hover:text-sp-cream transition-colors hover:underline"
        >
          Visit Marketplace →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {USER_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          border: '1px solid rgba(45,106,79,0.2)',
          background: 'rgba(15,41,30,0.3)',
        }}
      >
        <span className="font-mono text-[10px] text-sp-parchment">
          Service Charge: {USER_PROFILE.serviceCharge}% ({USER_PROFILE.serviceTier} tier)
        </span>
      </div>

      {/* Clawbot Panel */}
      <ClawbotPanel />
    </div>
  )
}

function ConnectionsTab() {
  const typeIcons: Record<string, string> = {
    Actor: '\u{1F3AC}',
    Musician: '\u{1F3B5}',
    Developer: '\u{1F4BB}',
  }

  return (
    <div className="space-y-4">
      <div
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <div
          className="px-3 py-1.5 flex items-center gap-2"
          style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
        >
          <Check className="h-4 w-4 text-sp-fern" />
          <span className="font-retro text-xs uppercase text-sp-amber">Verified Connections</span>
        </div>
        <div className="divide-y divide-sp-moss/15">
          {CONNECTIONS.map((conn) => (
            <div
              key={conn.handle}
              className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-sp-fern/10"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-sp-parchment text-base">{typeIcons[conn.type] || '\u{1F4BC}'}</span>
                <span className="font-mono text-[11px] text-sp-parchment" style={{ width: '80px' }}>{conn.type}:</span>
                <span className="text-sm text-sp-cream font-medium">{conn.handle}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.5"
                  style={{
                    border: '1px solid rgba(82,183,136,0.4)',
                    color: '#52b788',
                    background: 'rgba(82,183,136,0.1)',
                    borderRadius: '2px',
                  }}
                >
                  <Check className="h-3 w-3" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="px-3 py-2"
        style={{
          border: '1px solid rgba(45,106,79,0.2)',
          background: 'rgba(15,41,30,0.3)',
        }}
      >
        <p className="font-mono text-[10px] text-sp-parchment">
          These connections boost pulse reach by connecting networks.
        </p>
      </div>
    </div>
  )
}

function ContactTab() {
  const availableMethods = PROFILE_FIELDS.filter(
    (f) => f.privacy === 'P' || f.privacy === 'C'
  )

  return (
    <div className="space-y-4">
      <h3 className="font-retro text-sm uppercase text-sp-amber" style={{ letterSpacing: '0.05em' }}>
        Contact Methods
      </h3>

      <div
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <div
          className="px-3 py-1.5"
          style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
        >
          <span className="font-retro text-xs uppercase text-sp-amber">Available to You</span>
        </div>
        <div className="divide-y divide-sp-moss/15">
          {availableMethods.map((method) => (
            <div
              key={method.label}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              <span className="text-sp-fern">{method.icon}</span>
              <div>
                <p className="font-mono text-[10px] text-sp-parchment">{method.label}</p>
                <p className="text-sm text-sp-cream">{method.value}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <MessageSquare className="h-3.5 w-3.5 text-sp-fern" />
            <div>
              <p className="font-mono text-[10px] text-sp-parchment">P2P Message</p>
              <p className="text-sm text-sp-cream">
                <Link to="/talk" className="text-sp-fern hover:text-sp-cream transition-colors hover:underline">
                  Send encrypted message →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-3 py-2"
        style={{
          border: '1px solid rgba(45,106,79,0.2)',
          background: 'rgba(15,41,30,0.3)',
        }}
      >
        <p className="font-mono text-[10px] text-sp-parchment">
          <Shield className="h-3 w-3 inline mr-1 text-sp-fern" />
          Some contact methods are hidden based on privacy settings. Add as a friend to see more.
        </p>
      </div>
    </div>
  )
}

function LinksTab() {
  return (
    <div className="space-y-4">
      <h3 className="font-retro text-sm uppercase text-sp-amber" style={{ letterSpacing: '0.05em' }}>
        {'\u{1F517}'} Affiliated Links
      </h3>

      <div
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        <div className="divide-y divide-sp-moss/15">
          {USER_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-sp-fern/10 group"
            >
              <span className="text-sp-fern group-hover:text-sp-cream transition-colors">
                {link.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-sp-parchment">{link.label}</p>
                <p className="text-sm text-sp-cream truncate group-hover:text-sp-fern transition-colors">
                  {link.url}
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-sp-parchment group-hover:text-sp-cream transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      <button
        className="px-3 py-1 font-mono text-[10px] text-sp-fern hover:text-sp-cream transition-colors"
        style={{
          border: '1px solid rgba(45,106,79,0.4)',
          background: 'transparent',
          borderRadius: '0px',
        }}
      >
        Add Link +
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════
   TAB CONTENT ROUTER
   ═══════════════════════════════════════════ */

function TabContent({ activeTab }: { activeTab: TabId }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'posts' && <PostsTab />}
        {activeTab === 'vblog' && <VblogTab />}
        {activeTab === 'store' && <StoreTab />}
        {activeTab === 'connections' && <ConnectionsTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'links' && <LinksTab />}
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function UserProfile() {
  const { handle } = useParams<{ handle: string }>()
  const [activeTab, setActiveTab] = useState<TabId>('about')

  // Use the handle from the URL or fall back to willow
  const userHandle = handle || 'willow'
  const displayName = USER_PROFILE.name

  return (
    <div className="min-h-[calc(100dvh-64px)]" style={{ background: 'var(--sp-canopy)' }}>
      <div className="mx-auto max-w-[1000px] px-3 py-4">
        {/* Banner */}
        <div
          className="relative overflow-hidden"
          style={{
            height: '200px',
            border: '1px solid rgba(45,106,79,0.4)',
            background: 'var(--sp-canopy)',
            borderRadius: '0px',
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'url(/profile-retro-bg.jpg) repeat', opacity: 0.1 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(15,41,30,0.7) 0%, rgba(15,41,30,0.4) 100%)',
            }}
          />
        </div>

        {/* Profile Header */}
        <div
          className="relative flex flex-col sm:flex-row gap-4 px-4 pb-4 -mt-[75px]"
          style={{
            border: '1px solid rgba(45,106,79,0.3)',
            borderTop: 'none',
            background: 'rgba(15,41,30,0.6)',
            borderRadius: '0px',
          }}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className="h-[150px] w-[150px] overflow-hidden"
              style={{
                border: '3px solid var(--sp-amber)',
                borderRadius: '2px',
                marginTop: '-75px',
              }}
            >
              <img
                src={USER_PROFILE.avatar}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Name + Info */}
          <div className="flex flex-col justify-end pb-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="font-display text-[32px] font-bold text-sp-cream"
                style={{ letterSpacing: '-0.015em', lineHeight: 1.1 }}
              >
                {displayName}
              </h1>
              <span className="font-mono text-sm text-sp-parchment">@{userHandle}</span>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 font-retro text-[9px] uppercase"
                style={{
                  background: 'rgba(212,160,23,0.15)',
                  border: '1px solid rgba(212,160,23,0.3)',
                  color: '#d4a017',
                  borderRadius: '2px',
                }}
              >
                {USER_PROFILE.rankIcon} {USER_PROFILE.rank}
              </span>
            </div>
            <p
              className="text-sm text-sp-parchment mt-1 italic"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {USER_PROFILE.bio}
            </p>
          </div>
        </div>

        {/* Tab Bar */}
        <div
          className="mt-3 flex overflow-x-auto"
          style={{
            border: '1px solid rgba(45,106,79,0.3)',
            background: 'rgba(15,41,30,0.5)',
            borderRadius: '0px',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 py-2 font-retro text-[13px] uppercase transition-colors whitespace-nowrap flex-shrink-0"
              style={{
                color: activeTab === tab.id ? '#d4a017' : '#e8e0cc',
                background: activeTab === tab.id ? 'rgba(45,106,79,0.2)' : 'transparent',
                borderTop: activeTab === tab.id ? '2px solid #d4a017' : '2px solid transparent',
                letterSpacing: '0.05em',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-3">
          <TabContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}
