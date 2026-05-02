import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  GripVertical, Settings, ChevronDown, X, Trash2, Lock,
  Undo2, Redo2, Eye, Save, LayoutGrid, MessageSquare,
  User, Image, Video, FileText, Link2, Quote, BarChart3,
  Radio, Users, Sofa, Music, Code2, Megaphone,
  Type, RotateCcw, Plus, Globe, UserCircle,
  EyeOff, ExternalLink, Play, Pause, PenLine,
  FolderPlus, FilePlus, DoorOpen, ChevronRight,
  Cog, Shield, BookOpen, Palette,
} from 'lucide-react'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type WidgetCategory = 'structure' | 'content' | 'social' | 'utility'

type WidgetType =
  | 'about' | 'photos' | 'videos' | 'blog' | 'wall' | 'links' | 'quote' | 'stats' | 'talkbox'
  | 'friends' | 'groups' | 'lounges'
  | 'music' | 'html' | 'ad' | 'status' | 'cssheader'

type LayoutMode = 'Classic' | 'Grid' | 'Wide' | 'Chaos'
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'none'
type Visibility = 'Public' | 'Friends' | 'Circle' | 'Private'
type TopicType = 'Normal' | 'Sticky' | 'Locked'
type Audience = 'Public' | 'Friends' | 'Circle' | 'Anonymous'
type SignatureMode = 'text' | 'html'
type GroupsMode = 'your+discover' | 'your' | 'discover'
type BgType = 'solid' | 'gradient' | 'image' | 'pattern'
type GradientDir = 'to right' | 'to bottom' | 'to bottom right' | 'to top'
type ImageMode = 'tile' | 'stretch' | 'cover'
type PatternType = 'none' | 'dots' | 'stripes' | 'grid'
type FontChoice = 'VT323' | 'Space Grotesk' | 'Inter' | 'JetBrains Mono'
type GroupsMaxShow = 3 | 5 | 10 | 'all'

type GroupedTopic = { name: string; memberCount?: number; category?: string }

interface Rank {
  code: string
  icon: string
  defaultName: string
  customName: string
  color: string
}

interface WidgetDef {
  type: WidgetType
  label: string
  icon: ReactNode
  category: WidgetCategory
  limit?: number
  limitKey?: 'groups' | 'topics' | 'lounges'
}

interface PlacedWidget {
  id: string
  type: WidgetType
  title: string
  collapsed: boolean
  settings: WidgetSettings
}

interface WidgetSettings {
  title: string
  borderStyle: BorderStyle
  background: string
  padding: number
  visibility: Visibility
  aboutText?: string
  photoGridCols?: 2 | 3 | 4
  videoUrl?: string
  blogShowCount?: 3 | 5 | 10
  wallAllowAnonymous?: boolean
  links?: { url: string; title: string }[]
  quoteText?: string
  quoteAuthor?: string
  friendsSort?: 'online' | 'all' | 'recent'
  groupsList?: GroupedTopic[]
  groupsMode?: GroupsMode
  groupsMaxShow?: GroupsMaxShow
  groupsShowTags?: boolean
  loungesList?: GroupedTopic[]
  musicUrl?: string
  musicAutoplay?: boolean
  htmlCode?: string
  adDimensions?: { w: number; h: number }
  statusText?: string
  cssCode?: string
  ranks?: Rank[]
}

interface Grouping {
  id: string
  name: string
  icon: string
  visibility: Visibility
  collapsed: boolean
}

interface Topic {
  id: string
  name: string
  groupingId: string
  type: TopicType
  audience: Audience
}

interface Lounge {
  id: string
  name: string
  password: string
  memberLimit?: number
}

interface Signature {
  text: string
  html: string
  mode: SignatureMode
}

interface ForumUsage {
  groups: number
  topics: number
  lounges: number
}

interface BuilderHistory {
  past: PlacedWidget[][]
  future: PlacedWidget[][]
}

interface ThemeSettings {
  bgType: BgType
  solidColor: string
  gradientFrom: string
  gradientTo: string
  gradientDir: GradientDir
  imageUrl: string
  imageMode: ImageMode
  pattern: PatternType
  contentOpacity: number
  borderStyle: BorderStyle
  borderColor: string
  headingFont: FontChoice
  bodyFont: FontChoice
  accentColor: string
}

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const WIDGET_DEFS: WidgetDef[] = [
  // Structure
  { type: 'lounges', label: 'Lounges', icon: <Sofa className="h-5 w-5" />, category: 'social', limit: 10, limitKey: 'lounges' },
  // Content
  { type: 'about', label: 'About Me', icon: <User className="h-5 w-5" />, category: 'content' },
  { type: 'groups', label: 'Groups', icon: <Users className="h-5 w-5" />, category: 'content', limit: 5, limitKey: 'groups' },
  { type: 'photos', label: 'Photo Album', icon: <Image className="h-5 w-5" />, category: 'content' },
  { type: 'videos', label: 'Video Feed', icon: <Video className="h-5 w-5" />, category: 'content' },
  { type: 'blog', label: 'Blog Posts', icon: <FileText className="h-5 w-5" />, category: 'content' },
  { type: 'wall', label: 'Comment Wall', icon: <MessageSquare className="h-5 w-5" />, category: 'content' },
  { type: 'links', label: 'Link List', icon: <Link2 className="h-5 w-5" />, category: 'content' },
  { type: 'quote', label: 'Quote Block', icon: <Quote className="h-5 w-5" />, category: 'content' },
  { type: 'stats', label: 'Forum Stats', icon: <BarChart3 className="h-5 w-5" />, category: 'content' },
  { type: 'talkbox', label: 'Talk Box', icon: <Radio className="h-5 w-5" />, category: 'content' },
  // Social (limited)
  { type: 'friends', label: 'Friends List', icon: <Users className="h-5 w-5" />, category: 'social' },
  // Utility
  { type: 'music', label: 'Music Player', icon: <Music className="h-5 w-5" />, category: 'utility' },
  { type: 'html', label: 'Custom HTML', icon: <Code2 className="h-5 w-5" />, category: 'utility' },
  { type: 'ad', label: 'Ad Block', icon: <Megaphone className="h-5 w-5" />, category: 'utility' },
  { type: 'status', label: 'Status', icon: <Type className="h-5 w-5" />, category: 'utility' },
  { type: 'cssheader', label: 'Custom CSS Header', icon: <Code2 className="h-5 w-5" />, category: 'utility' },
]

const BG_OPTIONS = [
  { label: 'Bark', value: 'rgba(62, 39, 35, 0.6)' },
  { label: 'Moss', value: 'rgba(45, 106, 79, 0.2)' },
  { label: 'Canopy', value: 'rgba(15, 41, 30, 0.8)' },
  { label: 'Void', value: 'rgba(26, 11, 46, 0.5)' },
  { label: 'Clear', value: 'transparent' },
]

const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  structure: 'Structure',
  content: 'Content',
  social: 'Social',
  utility: 'Utility',
}

const EMOJI_ICONS = ['💬', '📌', '🗞️', '🎵', '🌿', '🔒', '📢', '💡', '📷', '🎮']
const TOPIC_TYPES: TopicType[] = ['Normal', 'Sticky', 'Locked']
const AUDIENCES: Audience[] = ['Public', 'Friends', 'Circle', 'Anonymous']

const SIGNATURE_PRESETS = {
  marquee: `<div style="overflow:hidden;width:100%;height:24px;"><div style="white-space:nowrap;animation:marquee 8s linear infinite;">🌿 Willow's Grove ~ Super Admin ~ 1,247 Posts ~ 892 Seeds ~ </div><style>@keyframes marquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}</style></div>`,
  status: `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#52b788;"><span style="display:inline-block;width:8px;height:8px;background:#22c55e;border-radius:50%;animation:pulse 1.5s infinite;"></span> Online • 🎵 Solar Waves • 🌱 Seeding 47 chunks<style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}</style></div>`,
  stats: `<div style="display:flex;gap:12px;font-size:11px;font-family:monospace;color:#95d5b2;"><span>Posts: 1,247</span><span>Seeds: 892</span><span>Quality: 97%</span></div>`,
  custom: '',
}

const DEFAULT_RANKS: Rank[] = [
  { code: 'SA', icon: '🌿', defaultName: 'Super Admin', customName: 'Grove Keeper', color: '#d4a017' },
  { code: 'A', icon: '🍂', defaultName: 'Admin', customName: 'Branch Elder', color: '#52b788' },
  { code: 'SM', icon: '🛡️', defaultName: 'Super Mod', customName: 'Seed Guardian', color: '#7c3aed' },
  { code: 'M', icon: '🌱', defaultName: 'Mod', customName: 'Sprout Guide', color: '#95d5b2' },
  { code: 'U', icon: '👤', defaultName: 'User', customName: 'Seedling', color: '#e8e0cc' },
]

const RANK_COLORS = [
  { label: 'Amber', value: '#d4a017' },
  { label: 'Fern', value: '#52b788' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Sapling', value: '#95d5b2' },
  { label: 'Cream', value: '#e8e0cc' },
  { label: 'Honey', value: '#f4d03f' },
  { label: 'Moss', value: '#2d6a4f' },
  { label: 'Danger', value: '#e11d48' },
  { label: 'Terminal', value: '#00ff41' },
  { label: 'Ember', value: '#ff6b35' },
]

const MOCK_YOUR_GROUPS = [
  { name: 'Gardeners Guild', memberCount: 23, tags: ['solarpunk', 'garden'] },
  { name: 'Solar Beats', memberCount: 18, tags: ['music', 'solar'] },
]

const MOCK_DISCOVER_GROUPS = [
  { name: 'Code Forest', memberCount: 31, tags: ['tech', 'p2p'] },
  { name: 'Digital Artists', memberCount: 47, tags: ['art', 'crypto'] },
  { name: 'The Council', memberCount: 12, tags: ['private', 'admin'], inviteOnly: true },
]

const uid = () => Math.random().toString(36).slice(2, 9)

const defaultSettings = (type: WidgetType): WidgetSettings => {
  const base: WidgetSettings = {
    title: WIDGET_DEFS.find(w => w.type === type)?.label || 'Widget',
    borderStyle: 'solid',
    background: 'rgba(62, 39, 35, 0.6)',
    padding: 16,
    visibility: 'Public',
  }
  switch (type) {
    case 'about': return { ...base, aboutText: "i'm a digital gardener tending to files i forgot i planted." }
    case 'photos': return { ...base, photoGridCols: 3 }
    case 'videos': return { ...base, videoUrl: '' }
    case 'blog': return { ...base, blogShowCount: 5 }
    case 'wall': return { ...base, wallAllowAnonymous: true }
    case 'links': return { ...base, links: [{ url: '#', title: 'My Blog' }, { url: '#', title: 'GitHub' }] }
    case 'quote': return { ...base, quoteText: 'The old web had it right — chaos is freedom.', quoteAuthor: 'retroplanter' }
    case 'stats': return { ...base, ranks: JSON.parse(JSON.stringify(DEFAULT_RANKS)) as Rank[] }
    case 'talkbox': return { ...base }
    case 'friends': return { ...base, friendsSort: 'all' }
    case 'groups': return {
      ...base,
      groupsList: [{ name: 'Gardeners Guild', memberCount: 23 }, { name: 'Solar Beats', memberCount: 18 }],
      groupsMode: 'your+discover',
      groupsMaxShow: 5,
      groupsShowTags: true,
    }
    case 'lounges': return { ...base, loungesList: [{ name: 'The Back Room' }] }
    case 'music': return { ...base, musicUrl: '', musicAutoplay: false }
    case 'html': return { ...base, htmlCode: '<div style="color:#52b788;font-size:20px;">Hello World</div>' }
    case 'ad': return { ...base, adDimensions: { w: 468, h: 60 } }
    case 'status': return { ...base, statusText: 'feeling: overgrown • listening: aphex twin' }
    case 'cssheader': return { ...base, cssCode: '/* Custom CSS */\n.header { color: #52b788; }' }
    default: return base
  }
}

/* ═══════════════════════════════════════════
   WALLET DISPLAY
   ═══════════════════════════════════════════ */

function WalletDisplay() {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px]" style={{ color: 'var(--sp-parchment)' }}>
      <span className="text-sp-parchment/50 uppercase tracking-wider">Wallet:</span>
      <span className="flex items-center gap-1" title="Material">
        <span style={{ color: '#9ca3af' }}>🔩</span>
        <span style={{ color: '#9ca3af' }}>M:</span>
        <span className="text-sp-cream">890</span>
      </span>
      <span style={{ color: 'var(--sp-moss)' }}>|</span>
      <span className="flex items-center gap-1" title="Social">
        <span style={{ color: '#d4a017' }}>💬</span>
        <span style={{ color: '#d4a017' }}>S:</span>
        <span className="text-sp-cream">1,247</span>
      </span>
      <span style={{ color: 'var(--sp-moss)' }}>|</span>
      <span className="flex items-center gap-1" title="Innovation">
        <span style={{ color: '#22d3ee' }}>💡</span>
        <span style={{ color: '#22d3ee' }}>I:</span>
        <span className="text-sp-cream">340</span>
      </span>
      <span style={{ color: 'var(--sp-moss)' }}>|</span>
      <span className="flex items-center gap-1" title="Ecology">
        <span style={{ color: '#22c55e' }}>🌱</span>
        <span style={{ color: '#22c55e' }}>E:</span>
        <span className="text-sp-cream">45,200</span>
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════
   COPY TO CLIPBOARD
   ═══════════════════════════════════════════ */

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

/* ═══════════════════════════════════════════
   HTML REFERENCE PANEL
   ═══════════════════════════════════════════ */

interface CodeSampleProps {
  code: string
  description: string
}

function CodeSample({ code, description }: CodeSampleProps) {
  return (
    <button
      onClick={() => copyToClipboard(code)}
      className="flex items-start gap-3 w-full text-left px-2 py-1.5 transition-colors group"
      style={{ borderBottom: '1px solid rgba(45, 106, 79, 0.15)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.15)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      title="Click to copy"
    >
      <code
        className="font-mono text-xs whitespace-nowrap flex-shrink-0"
        style={{ color: 'var(--crypt-terminal)', minWidth: '180px' }}
      >
        {code}
      </code>
      <span className="text-[11px] text-sp-parchment/60">{description}</span>
    </button>
  )
}

function BBCodeSample({ code, description }: CodeSampleProps) {
  return (
    <button
      onClick={() => copyToClipboard(code)}
      className="flex items-start gap-3 w-full text-left px-2 py-1.5 transition-colors group"
      style={{ borderBottom: '1px solid rgba(45, 106, 79, 0.15)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.15)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      title="Click to copy"
    >
      <code
        className="font-mono text-xs whitespace-nowrap flex-shrink-0"
        style={{ color: 'var(--sp-amber)', minWidth: '200px' }}
      >
        {code}
      </code>
      <span className="text-[11px] text-sp-parchment/60">{description}</span>
    </button>
  )
}

function CSSSample({ code, description }: CodeSampleProps) {
  return (
    <button
      onClick={() => copyToClipboard(code)}
      className="flex items-start gap-3 w-full text-left px-2 py-1.5 transition-colors group"
      style={{ borderBottom: '1px solid rgba(45, 106, 79, 0.15)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.15)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      title="Click to copy"
    >
      <code
        className="font-mono text-xs whitespace-nowrap flex-shrink-0"
        style={{ color: 'var(--crypt-purple)', minWidth: '180px' }}
      >
        {code}
      </code>
      <span className="text-[11px] text-sp-parchment/60">{description}</span>
    </button>
  )
}

const COLOR_PALETTE: { hex: string; name: string }[] = [
  { hex: '#0f291e', name: 'canopy (darkest)' },
  { hex: '#1b4332', name: 'deep green' },
  { hex: '#2d6a4f', name: 'moss green' },
  { hex: '#40916c', name: 'fern' },
  { hex: '#52b788', name: 'sapling' },
  { hex: '#74c69d', name: 'light green' },
  { hex: '#95d5b2', name: 'parchment-ish' },
  { hex: '#d4a017', name: 'amber/gold' },
  { hex: '#f5f0e1', name: 'cream' },
  { hex: '#b7e4c7', name: 'mint' },
]

function HTMLReferencePanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="fixed right-0 top-8 z-40 h-[calc(100dvh-32px)] overflow-y-auto border-l"
      style={{
        width: '380px',
        background: 'rgba(15, 41, 30, 0.97)',
        borderColor: 'rgba(45, 106, 79, 0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-10 border-b sticky top-0 z-10"
        style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.95)' }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-sp-amber" />
          <h2 className="font-retro text-sm uppercase tracking-wider text-sp-amber">
            HTML &amp; BBCode Reference
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-sp-parchment transition-colors hover:text-sp-sapling"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Intro */}
        <p className="text-xs text-sp-parchment/60" style={{ fontFamily: 'Inter, sans-serif' }}>
          Quick reference for customizing your forum profile. Click any code sample to copy.
        </p>

        {/* HTML Tags */}
        <div
          className="border"
          style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.5)' }}
        >
          <div
            className="px-3 py-1.5 border-b"
            style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(45, 106, 79, 0.15)' }}
          >
            <h3 className="font-retro text-xs uppercase tracking-wider text-sp-fern">HTML Tags</h3>
          </div>
          <div className="py-1">
            <CodeSample code="&lt;div&gt;...&lt;/div&gt;" description="Container / block" />
            <CodeSample code="&lt;p&gt;...&lt;/p&gt;" description="Paragraph" />
            <CodeSample code="&lt;span&gt;...&lt;/span&gt;" description="Inline text element" />
            <CodeSample code="&lt;img src=&quot;...&quot;&gt;" description="Image with URL" />
            <CodeSample code="&lt;a href=&quot;...&quot;&gt;...&lt;/a&gt;" description="Hyperlink" />
            <CodeSample code="&lt;br&gt;" description="Line break" />
            <CodeSample code="&lt;hr&gt;" description="Horizontal rule" />
            <CodeSample code="&lt;h1&gt;...&lt;/h1&gt;" description="Large heading" />
          </div>
        </div>

        {/* CSS Properties */}
        <div
          className="border"
          style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.5)' }}
        >
          <div
            className="px-3 py-1.5 border-b"
            style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(45, 106, 79, 0.15)' }}
          >
            <h3 className="font-retro text-xs uppercase tracking-wider text-sp-fern">CSS Properties</h3>
          </div>
          <div className="py-1">
            <CSSSample code="color: #52b788;" description="Set text color (hex)" />
            <CSSSample code="background: #0f291e;" description="Set background color" />
            <CSSSample code="font-size: 14px;" description="Text size in pixels" />
            <CSSSample code="border: 1px solid #2d6a4f;" description="Add a border" />
            <CSSSample code="padding: 8px;" description="Inner spacing" />
            <CSSSample code="margin: 4px;" description="Outer spacing" />
            <CSSSample code="opacity: 0.85;" description="Transparency (0-1)" />
          </div>
        </div>

        {/* BBCode */}
        <div
          className="border"
          style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.5)' }}
        >
          <div
            className="px-3 py-1.5 border-b"
            style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(45, 106, 79, 0.15)' }}
          >
            <h3 className="font-retro text-xs uppercase tracking-wider text-sp-fern">BBCode</h3>
          </div>
          <div className="py-1">
            <BBCodeSample code="[b]bold[/b] [i]italic[/i] [u]underline[/u] [s]strikethrough[/s]" description="Text styles" />
            <BBCodeSample code="[color=#52b788]text[/color]" description="Colored text" />
            <BBCodeSample code="[size=16]text[/size]" description="Sized text" />
            <BBCodeSample code="[url=https://...]link[/url]" description="Hyperlink" />
            <BBCodeSample code="[img]url[/img]" description="Image embed" />
            <BBCodeSample code="[quote=author]text[/quote]" description="Quote block" />
            <BBCodeSample code="[code]code[/code]" description="Code block" />
            <BBCodeSample code="[center]text[/center]" description="Center align" />
            <BBCodeSample code="[spoiler]text[/spoiler]" description="Hidden spoiler" />
            <BBCodeSample code="[list][*]item 1[*]item 2[/list]" description="Bullet list" />
          </div>
        </div>

        {/* Animations */}
        <div
          className="border"
          style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.5)' }}
        >
          <div
            className="px-3 py-1.5 border-b"
            style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(45, 106, 79, 0.15)' }}
          >
            <h3 className="font-retro text-xs uppercase tracking-wider text-sp-fern">Animations</h3>
          </div>
          <div className="p-3">
            <pre
              className="font-mono text-[11px] leading-relaxed overflow-x-auto"
              style={{ color: 'var(--crypt-terminal)' }}
            >
{`@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.myElement {
  animation: fadeIn 2s infinite;
}`}
            </pre>
            <pre
              className="font-mono text-[11px] leading-relaxed overflow-x-auto mt-3"
              style={{ color: 'var(--crypt-terminal)' }}
            >
{`@keyframes slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50px); }
}`}
            </pre>
          </div>
        </div>

        {/* Color Palette */}
        <div
          className="border"
          style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.5)' }}
        >
          <div
            className="px-3 py-1.5 border-b"
            style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(45, 106, 79, 0.15)' }}
          >
            <h3 className="font-retro text-xs uppercase tracking-wider text-sp-fern">Color Palette</h3>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.hex}
                onClick={() => copyToClipboard(c.hex)}
                className="flex items-center gap-2 text-left transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                title="Click to copy hex"
              >
                <span
                  className="h-5 w-5 border flex-shrink-0"
                  style={{
                    background: c.hex,
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                />
                <code className="font-mono text-[10px]" style={{ color: 'var(--crypt-terminal)' }}>
                  {c.hex}
                </code>
                <span className="text-[10px] text-sp-parchment/50">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

/* ═══════════════════════════════════════════
   THEME DESIGNER MODAL
   ═══════════════════════════════════════════ */

const DEFAULT_THEME: ThemeSettings = {
  bgType: 'solid',
  solidColor: '#0f291e',
  gradientFrom: '#0f291e',
  gradientTo: '#52b788',
  gradientDir: 'to bottom right',
  imageUrl: '',
  imageMode: 'cover',
  pattern: 'none',
  contentOpacity: 70,
  borderStyle: 'solid',
  borderColor: '#2d6a4f',
  headingFont: 'VT323',
  bodyFont: 'Inter',
  accentColor: '#d4a017',
}

function ThemeDesigner({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME)
  const [previewMode, setPreviewMode] = useState(false)

  const update = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  const getBgStyle = (): string => {
    switch (theme.bgType) {
      case 'solid': return theme.solidColor
      case 'gradient': return `linear-gradient(${theme.gradientDir}, ${theme.gradientFrom}, ${theme.gradientTo})`
      case 'image': return theme.imageUrl ? `url(${theme.imageUrl})` : theme.solidColor
      case 'pattern':
        switch (theme.pattern) {
          case 'dots': return 'radial-gradient(circle, #2d6a4f 1px, transparent 1px)'
          case 'stripes': return 'repeating-linear-gradient(45deg, #1b4332, #1b4332 10px, #0f291e 10px, #0f291e 20px)'
          case 'grid': return 'linear-gradient(#2d6a4f 1px, transparent 1px), linear-gradient(90deg, #2d6a4f 1px, transparent 1px)'
          default: return theme.solidColor
        }
      default: return theme.solidColor
    }
  }

  const bgSize = theme.bgType === 'image'
    ? theme.imageMode === 'tile' ? '100px 100px'
      : theme.imageMode === 'stretch' ? '100% 100%'
        : 'cover'
    : theme.bgType === 'pattern' && theme.pattern === 'dots' ? '20px 20px'
      : theme.bgType === 'pattern' && theme.pattern === 'grid' ? '20px 20px'
        : 'auto'

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(15, 41, 30, 0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="w-full mx-4 overflow-hidden"
        style={{
          maxWidth: 580,
          background: 'var(--sp-canopy)',
          border: '1px solid rgba(45, 106, 79, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 h-10 border-b"
          style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.9)' }}
        >
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-sp-amber" />
            <h3 className="font-retro text-sm uppercase tracking-wider text-sp-amber">
              Theme Designer
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-sp-parchment hover:text-sp-sapling transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Background Type */}
          <div>
            <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-2">
              Background
            </label>
            <div className="flex gap-1">
              {(['solid', 'gradient', 'image', 'pattern'] as BgType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => update('bgType', t)}
                  className="px-3 py-1 text-xs border capitalize transition-colors"
                  style={{
                    borderColor: theme.bgType === t ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                    background: theme.bgType === t ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                    color: theme.bgType === t ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Solid */}
          {theme.bgType === 'solid' && (
            <div>
              <label className="font-mono text-[11px] text-sp-parchment block mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.solidColor}
                  onChange={(e) => update('solidColor', e.target.value)}
                  className="h-8 w-8 border-0 cursor-pointer"
                  style={{ padding: 0, background: 'transparent' }}
                />
                <code className="font-mono text-xs" style={{ color: 'var(--crypt-terminal)' }}>{theme.solidColor}</code>
              </div>
            </div>
          )}

          {/* Gradient */}
          {theme.bgType === 'gradient' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-sp-parchment">From</span>
                <input
                  type="color"
                  value={theme.gradientFrom}
                  onChange={(e) => update('gradientFrom', e.target.value)}
                  className="h-7 w-7 border-0 cursor-pointer"
                  style={{ padding: 0, background: 'transparent' }}
                />
                <code className="font-mono text-[11px]" style={{ color: 'var(--crypt-terminal)' }}>{theme.gradientFrom}</code>
                <span className="font-mono text-[11px] text-sp-parchment ml-2">To</span>
                <input
                  type="color"
                  value={theme.gradientTo}
                  onChange={(e) => update('gradientTo', e.target.value)}
                  className="h-7 w-7 border-0 cursor-pointer"
                  style={{ padding: 0, background: 'transparent' }}
                />
                <code className="font-mono text-[11px]" style={{ color: 'var(--crypt-terminal)' }}>{theme.gradientTo}</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-sp-parchment">Direction</span>
                <select
                  value={theme.gradientDir}
                  onChange={(e) => update('gradientDir', e.target.value as GradientDir)}
                  className="bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
                >
                  {(['to right', 'to bottom', 'to bottom right', 'to top'] as GradientDir[]).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Image */}
          {theme.bgType === 'image' && (
            <div className="space-y-2">
              <div>
                <label className="font-mono text-[11px] text-sp-parchment block mb-1">Image URL</label>
                <input
                  type="text"
                  value={theme.imageUrl}
                  onChange={(e) => update('imageUrl', e.target.value)}
                  placeholder="https://example.com/bg.jpg"
                  className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
                />
              </div>
              <div className="flex gap-1">
                {(['tile', 'stretch', 'cover'] as ImageMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => update('imageMode', m)}
                    className="px-3 py-1 text-xs border capitalize transition-colors"
                    style={{
                      borderColor: theme.imageMode === m ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                      background: theme.imageMode === m ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                      color: theme.imageMode === m ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pattern */}
          {theme.bgType === 'pattern' && (
            <div>
              <div className="flex gap-1">
                {(['none', 'dots', 'stripes', 'grid'] as PatternType[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => update('pattern', p)}
                    className="px-3 py-1 text-xs border capitalize transition-colors"
                    style={{
                      borderColor: theme.pattern === p ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                      background: theme.pattern === p ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                      color: theme.pattern === p ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-sp-moss/20" />

          {/* Content Boxes */}
          <div className="space-y-3">
            <h4 className="font-retro text-xs text-sp-fern uppercase tracking-wider">Content Boxes</h4>

            <div>
              <label className="font-mono text-[11px] text-sp-parchment block mb-1">
                Opacity: {theme.contentOpacity}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={theme.contentOpacity}
                onChange={(e) => update('contentOpacity', parseInt(e.target.value))}
                className="w-full accent-sp-fern"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-sp-parchment block mb-1">Border</label>
              <div className="flex gap-1">
                {(['solid', 'dashed', 'dotted', 'none'] as BorderStyle[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => update('borderStyle', b)}
                    className="px-3 py-1 text-xs border capitalize transition-colors"
                    style={{
                      borderColor: theme.borderStyle === b ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                      background: theme.borderStyle === b ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                      color: theme.borderStyle === b ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] text-sp-parchment block mb-1">Border Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.borderColor}
                  onChange={(e) => update('borderColor', e.target.value)}
                  className="h-7 w-7 border-0 cursor-pointer"
                  style={{ padding: 0, background: 'transparent' }}
                />
                <code className="font-mono text-xs" style={{ color: 'var(--crypt-terminal)' }}>{theme.borderColor}</code>
              </div>
            </div>
          </div>

          <div className="h-px bg-sp-moss/20" />

          {/* Typography */}
          <div className="space-y-3">
            <h4 className="font-retro text-xs text-sp-fern uppercase tracking-wider">Typography</h4>

            <div className="flex items-center gap-2">
              <label className="font-mono text-[11px] text-sp-parchment w-24">Heading</label>
              <select
                value={theme.headingFont}
                onChange={(e) => update('headingFont', e.target.value as FontChoice)}
                className="flex-1 bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
              >
                {(['VT323', 'Space Grotesk', 'Inter'] as FontChoice[]).map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-mono text-[11px] text-sp-parchment w-24">Body</label>
              <select
                value={theme.bodyFont}
                onChange={(e) => update('bodyFont', e.target.value as FontChoice)}
                className="flex-1 bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
              >
                {(['Inter', 'Space Grotesk', 'JetBrains Mono'] as FontChoice[]).map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-mono text-[11px] text-sp-parchment w-24">Accent</label>
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => update('accentColor', e.target.value)}
                className="h-7 w-7 border-0 cursor-pointer"
                style={{ padding: 0, background: 'transparent' }}
              />
              <code className="font-mono text-xs" style={{ color: 'var(--crypt-terminal)' }}>{theme.accentColor}</code>
            </div>
          </div>

          {/* Live Preview */}
          <AnimatePresence>
            {previewMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  className="border p-4"
                  style={{ borderColor: 'rgba(45, 106, 79, 0.3)' }}
                >
                  <h4 className="font-retro text-[10px] text-sp-fern uppercase tracking-wider mb-2">
                    Live Preview
                  </h4>
                  <div
                    className="p-4"
                    style={{
                      background: getBgStyle(),
                      backgroundSize: bgSize,
                      minHeight: '120px',
                    }}
                  >
                    <div
                      className="border p-3"
                      style={{
                        borderColor: theme.borderColor,
                        background: `rgba(15, 41, 30, ${theme.contentOpacity / 100})`,
                      }}
                    >
                      <h5 style={{ fontFamily: theme.headingFont, color: theme.accentColor, fontSize: '18px' }}>
                        Sample Heading
                      </h5>
                      <p style={{ fontFamily: theme.bodyFont, color: '#f5f0e1', fontSize: '14px', marginTop: '8px' }}>
                        This is sample body text in your chosen theme.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex-1 py-2 font-mono text-xs border transition-colors"
              style={{ borderColor: 'rgba(45, 106, 79, 0.4)', color: 'var(--sp-parchment)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {previewMode ? 'Hide Preview' : 'Preview'}
            </button>
            <button
              onClick={() => setTheme(DEFAULT_THEME)}
              className="flex-1 py-2 font-mono text-xs border transition-colors"
              style={{ borderColor: 'rgba(45, 106, 79, 0.4)', color: 'var(--sp-parchment)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 font-mono text-xs font-medium transition-colors"
              style={{
                background: 'var(--sp-amber)',
                color: 'var(--sp-bark)',
                border: '1px solid rgba(212, 160, 23, 0.5)',
              }}
            >
              Save Theme
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   USAGE BAR
   ═══════════════════════════════════════════ */

function UsageMeter({ label, current, max }: { label: string; current: number; max: number }) {
  const pct = Math.min(100, Math.round((current / max) * 100))
  const color = pct >= 100 ? '#e11d48' : pct >= 70 ? '#d4a017' : '#22c55e'
  const filled = Math.round((current / max) * 10)
  return (
    <div className="flex items-center gap-2 font-mono text-[11px]">
      <span className="text-sp-parchment whitespace-nowrap">{label}:</span>
      <span className="text-sp-cream" style={{ letterSpacing: '0.05em' }}>
        {'['}
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} style={{ color: i < filled ? color : 'rgba(232, 224, 204, 0.2)' }}>{i < filled ? '█' : '░'}</span>
        ))}
        {']'}
      </span>
      <span style={{ color }}>{current}/{max}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════
   RANK EDITOR COMPONENT
   ═══════════════════════════════════════════ */

function RankEditor({
  ranks,
  onChange,
}: {
  ranks: Rank[]
  onChange: (ranks: Rank[]) => void
}) {
  const [localRanks, setLocalRanks] = useState<Rank[]>(ranks)

  const updateRank = (index: number, updates: Partial<Rank>) => {
    const updated = localRanks.map((r, i) => (i === index ? { ...r, ...updates } : r))
    setLocalRanks(updated)
    onChange(updated)
  }

  const resetToDefaults = () => {
    const reset = JSON.parse(JSON.stringify(DEFAULT_RANKS)) as Rank[]
    setLocalRanks(reset)
    onChange(reset)
  }

  return (
    <div className="space-y-3">
      {/* Rank rows */}
      <div className="space-y-2">
        {localRanks.map((rank, i) => (
          <div
            key={rank.code}
            className="flex items-center gap-2 px-2 py-1.5 border"
            style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.5)' }}
          >
            <span className="text-base" title={rank.code}>{rank.icon}</span>
            <span className="font-mono text-[10px] text-sp-parchment/60 w-6">{rank.code}</span>
            <span className="text-[10px] text-sp-parchment/40 hidden sm:inline">—</span>
            <span className="text-[10px] text-sp-cream/70 hidden sm:inline w-20 truncate">{rank.customName || rank.defaultName}</span>
            <input
              type="text"
              value={rank.customName}
              onChange={(e) => updateRank(i, { customName: e.target.value })}
              placeholder={rank.defaultName}
              className="flex-1 min-w-0 bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <select
              value={rank.color}
              onChange={(e) => updateRank(i, { color: e.target.value })}
              className="bg-sp-canopy/60 border border-sp-moss/30 px-1 py-1 text-[10px] text-sp-cream focus:border-sp-fern focus:outline-none cursor-pointer"
              title="Badge color"
            >
              {RANK_COLORS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div>
        <label className="font-retro text-[10px] text-sp-fern uppercase tracking-wider block mb-1.5">Preview</label>
        <div className="flex flex-wrap gap-1.5">
          {localRanks.map((rank) => (
            <span
              key={rank.code}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono border"
              style={{
                borderColor: rank.color,
                color: rank.color,
                background: `${rank.color}15`,
              }}
            >
              {rank.icon} {rank.customName || rank.defaultName}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={resetToDefaults}
          className="px-3 py-1.5 border text-[10px] font-mono transition-colors hover:bg-sp-moss/20"
          style={{ borderColor: 'rgba(45, 106, 79, 0.4)', color: 'var(--sp-parchment)' }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => onChange(localRanks)}
          className="px-3 py-1.5 text-[10px] font-mono transition-colors"
          style={{ background: 'var(--sp-amber)', color: 'var(--sp-bark)', border: '1px solid rgba(212, 160, 23, 0.5)' }}
        >
          Save Rank Names
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MODAL COMPONENT
   ═══════════════════════════════════════════ */

function Modal({ open, onClose, title, children, maxWidth = 480 }: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: number
}) {
  if (!open) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(15, 41, 30, 0.85)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="w-full mx-4 overflow-hidden"
        style={{ maxWidth, background: 'var(--sp-canopy)', border: '1px solid rgba(45, 106, 79, 0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-10 border-b" style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.9)' }}>
          <h3 className="font-retro text-sm uppercase tracking-wider" style={{ color: 'var(--sp-fern)' }}>{title}</h3>
          <button onClick={onClose} className="text-sp-parchment/50 hover:text-sp-cream transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-4 max-h-[70dvh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   WIDGET PREVIEW RENDERER
   ═══════════════════════════════════════════ */

function WidgetPreview({ widget }: { widget: PlacedWidget }) {
  const { type, settings } = widget
  const p = settings.padding

  const contentStyle = { padding: `${p}px` }

  switch (type) {
    case 'about':
      return (
        <div style={contentStyle}>
          <p className="text-sm text-sp-parchment leading-relaxed">{settings.aboutText}</p>
          <div className="h-px bg-sp-moss/30 my-3" />
          <p className="text-xs italic text-sp-fern">feeling: overgrown</p>
        </div>
      )
    case 'photos':
      return (
        <div style={contentStyle}>
          <div className={`grid gap-1 ${settings.photoGridCols === 2 ? 'grid-cols-2' : settings.photoGridCols === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-square bg-sp-moss/20 flex items-center justify-center border border-sp-moss/20">
                <Image className="h-4 w-4 text-sp-parchment/30" />
              </div>
            ))}
          </div>
        </div>
      )
    case 'videos':
      return (
        <div style={contentStyle} className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-2 items-center">
              <div className="w-24 h-16 bg-sp-moss/20 flex items-center justify-center border border-sp-moss/20 flex-shrink-0">
                <Play className="h-5 w-5 text-sp-parchment/40" />
              </div>
              <div>
                <p className="text-xs text-sp-cream">Video {n}</p>
                <p className="text-[10px] text-sp-parchment">2:34</p>
              </div>
            </div>
          ))}
        </div>
      )
    case 'blog':
      return (
        <div style={contentStyle} className="space-y-2">
          {['P2P Gardening 101', 'Seed Networks Explained', 'Digital Permaculture'].slice(0, settings.blogShowCount === 10 ? 3 : settings.blogShowCount === 5 ? 3 : 2).map((t, i) => (
            <div key={i} className="border-b border-sp-moss/20 pb-2 last:border-0">
              <p className="text-sm text-sp-cream">{t}</p>
              <p className="text-[10px] text-sp-parchment">Jan {10 + i}, 2025</p>
            </div>
          ))}
        </div>
      )
    case 'wall':
      return (
        <div style={contentStyle} className="space-y-2">
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-sp-moss/30 border border-sp-moss/20 flex-shrink-0" />
            <div className="flex-1 h-6 bg-sp-canopy/50 border border-sp-moss/20 text-[10px] text-sp-parchment/50 flex items-center px-2">Leave a message...</div>
          </div>
          {['@cyberfern', '@retroplanter'].map((u, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-5 h-5 bg-sp-moss/30 border border-sp-moss/20 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-sp-cream">{u}</p>
                <p className="text-[10px] text-sp-parchment/70">love the layout!</p>
              </div>
            </div>
          ))}
          {settings.wallAllowAnonymous && <p className="text-[10px] text-sp-fern">Anonymous comments enabled</p>}
        </div>
      )
    case 'links':
      return (
        <div style={contentStyle} className="space-y-1">
          {(settings.links || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1 hover:bg-sp-fern/10 cursor-pointer group">
              <ExternalLink className="h-3 w-3 text-sp-parchment/40 group-hover:text-sp-fern" />
              <span className="text-sm text-sp-cream group-hover:text-sp-fern">{item.title}</span>
            </div>
          ))}
        </div>
      )
    case 'quote':
      return (
        <div style={contentStyle}>
          <div className="border-l-2 border-sp-amber pl-3">
            <p className="text-sm text-sp-cream italic">&ldquo;{settings.quoteText}&rdquo;</p>
            <p className="text-[11px] text-sp-parchment mt-1">— {settings.quoteAuthor}</p>
          </div>
        </div>
      )
    case 'stats':
      return (
        <div style={contentStyle}>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{ l: 'Posts', v: '1,247' }, { l: 'Friends', v: '89' }, { l: 'Seeds', v: '2.3K' }].map((s, i) => (
              <div key={i} className="bg-sp-canopy/40 border border-sp-moss/20 p-2">
                <p className="font-mono text-sm text-sp-amber">{s.v}</p>
                <p className="text-[10px] text-sp-parchment">{s.l}</p>
              </div>
            ))}
          </div>
          {/* Show rank badges if ranks are configured */}
          {settings.ranks && settings.ranks.length > 0 && (
            <div className="mt-3 pt-2 border-t border-sp-moss/20">
              <p className="text-[10px] text-sp-parchment/50 mb-1.5 font-mono uppercase">Rank Badges</p>
              <div className="flex flex-wrap gap-1">
                {settings.ranks.map((rank) => (
                  <span
                    key={rank.code}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono border"
                    style={{
                      borderColor: rank.color,
                      color: rank.color,
                      background: `${rank.color}15`,
                    }}
                  >
                    {rank.icon} {rank.customName || rank.defaultName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    case 'talkbox':
      return (
        <div style={contentStyle}>
          <div className="bg-sp-canopy/40 border border-sp-moss/20 p-2 flex items-center gap-2">
            <Radio className="h-4 w-4 text-sp-fern animate-pulse" />
            <span className="text-xs text-sp-cream">Live Talk Box — 4 listeners</span>
          </div>
        </div>
      )
    case 'friends':
      return (
        <div style={contentStyle}>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-sp-moss/20 border border-sp-moss/20" />
            ))}
          </div>
          <p className="text-[10px] text-sp-parchment mt-2">Sort: {settings.friendsSort}</p>
        </div>
      )
    case 'groups': {
      const mode = settings.groupsMode || 'your+discover'
      const maxShow = settings.groupsMaxShow || 5
      const showTags = settings.groupsShowTags !== false
      const yourGroups = MOCK_YOUR_GROUPS.slice(0, maxShow === 'all' ? undefined : maxShow)
      const discoverGroups = MOCK_DISCOVER_GROUPS.slice(0, maxShow === 'all' ? undefined : maxShow)

      return (
        <div style={contentStyle} className="space-y-3">
          {/* Your Groups */}
          {(mode === 'your+discover' || mode === 'your') && (
            <div>
              <p className="text-[10px] text-sp-parchment/50 font-mono uppercase mb-1.5">Your Groups</p>
              <div className="space-y-1">
                {yourGroups.map((g, i) => (
                  <div key={i} className="flex items-center justify-between bg-sp-canopy/40 border border-sp-moss/20 px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{i === 0 ? '🌿' : '🎵'}</span>
                      <span className="text-xs text-sp-cream">{g.name}</span>
                      {showTags && g.tags.map((t) => (
                        <span key={t} className="text-[9px] px-1 py-0.5 border border-sp-moss/20 text-sp-fern">{t}</span>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-sp-parchment">[{g.memberCount}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discover */}
          {(mode === 'your+discover' || mode === 'discover') && (
            <div>
              <p className="text-[10px] text-sp-parchment/50 font-mono uppercase mb-1.5">Discover</p>
              <div className="space-y-1">
                {discoverGroups.map((g, i) => (
                  <div key={i} className="flex items-center justify-between bg-sp-canopy/40 border border-sp-moss/20 px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{i === 0 ? '💻' : i === 1 ? '🎨' : '🔮'}</span>
                      <span className="text-xs text-sp-cream">{g.name}</span>
                      {'inviteOnly' in g && g.inviteOnly && (
                        <span className="text-[9px] text-crypt-glow">invite-only</span>
                      )}
                      {showTags && !g.inviteOnly && g.tags.map((t) => (
                        <span key={t} className="text-[9px] px-1 py-0.5 border border-sp-moss/20 text-sp-fern">{t}</span>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-sp-parchment">[{g.memberCount}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="flex gap-1">
            <div className="flex-1 bg-sp-canopy/50 border border-sp-moss/20 px-2 py-1 text-[10px] text-sp-parchment/50">
              Search groups...
            </div>
            <div className="px-2 py-1 border border-sp-moss/30 text-[10px] text-sp-cream bg-sp-moss/20">Join</div>
          </div>
        </div>
      )
    }
    case 'lounges':
      return (
        <div style={contentStyle} className="space-y-2">
          {(settings.loungesList || []).map((l, i) => (
            <div key={i} className="flex items-center justify-between bg-sp-canopy/40 border border-sp-moss/20 px-2 py-1">
              <span className="text-sm text-sp-cream">{l.name}</span>
              <span className="text-[10px] text-sp-fern">● Private</span>
            </div>
          ))}
        </div>
      )
    case 'music':
      return (
        <div style={contentStyle} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sp-moss/30 flex items-center justify-center border border-sp-moss/20">
              <Music className="h-4 w-4 text-sp-honey" />
            </div>
            <div>
              <p className="text-xs text-sp-cream">Aphex Twin — Alberto Balsalm</p>
              <p className="text-[10px] text-sp-parchment">Now Playing</p>
            </div>
          </div>
          <div className="h-1 bg-sp-fern/20 overflow-hidden">
            <div className="h-full w-1/3 bg-sp-honey" />
          </div>
          <div className="flex gap-1">
            <button className="p-1 text-sp-cream hover:bg-sp-moss/30"><Play className="h-3 w-3" /></button>
            <button className="p-1 text-sp-cream hover:bg-sp-moss/30"><Pause className="h-3 w-3" /></button>
          </div>
          {settings.musicAutoplay && <p className="text-[10px] text-sp-fern">Autoplay enabled</p>}
        </div>
      )
    case 'html':
      return (
        <div style={contentStyle}>
          <div className="bg-[#0d1117] border border-crypt-terminal/20 p-2 font-mono text-[11px] text-crypt-terminal overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: settings.htmlCode || '' }} />
          </div>
        </div>
      )
    case 'ad':
      return (
        <div style={contentStyle}>
          <div className="bg-sp-bark/40 p-2 text-center border border-sp-moss/20">
            <p className="text-[10px] text-sp-parchment/60 uppercase mb-1">Sponsored</p>
            <div className="h-12 bg-sp-moss/10 flex items-center justify-center">
              <Megaphone className="h-5 w-5 text-sp-parchment/20" />
            </div>
            <p className="text-[10px] text-sp-parchment mt-1">{settings.adDimensions?.w}x{settings.adDimensions?.h}</p>
          </div>
        </div>
      )
    case 'status':
      return (
        <div style={contentStyle} className="flex items-center gap-2">
          <span className="h-2 w-2 bg-sp-fern animate-pulse" />
          <p className="text-sm text-sp-parchment italic">{settings.statusText}</p>
        </div>
      )
    case 'cssheader':
      return (
        <div style={contentStyle}>
          <pre className="bg-[#0d1117] border border-crypt-terminal/20 p-2 font-mono text-[10px] text-crypt-terminal overflow-x-auto">
            {settings.cssCode}
          </pre>
        </div>
      )
    default:
      return <div style={contentStyle}><p className="text-xs text-sp-parchment">Widget preview</p></div>
  }
}

/* ═══════════════════════════════════════════
   STRUCTURE PREVIEW (CANVAS)
   ═══════════════════════════════════════════ */

function StructurePreview({
  groupings,
  topics,
  lounges,
  onToggleGrouping,
  onSelectTopic,
}: {
  groupings: Grouping[]
  topics: Topic[]
  lounges: Lounge[]
  onToggleGrouping: (id: string) => void
  onSelectTopic: (id: string) => void
}) {
  return (
    <div className="space-y-2 mb-4">
      {/* Groupings */}
      {groupings.map((g) => {
        const groupTopics = topics.filter((t) => t.groupingId === g.id)
        return (
          <div key={g.id} className="border" style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.6)' }}>
            {/* Grouping Header */}
            <div
              className="flex items-center justify-between px-3 h-9 cursor-pointer select-none"
              style={{ background: 'rgba(15, 41, 30, 0.9)', borderLeft: '4px solid var(--sp-amber)' }}
              onClick={() => onToggleGrouping(g.id)}
            >
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: g.collapsed ? -90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-3 w-3 text-sp-parchment/60" />
                </motion.div>
                <span className="font-retro text-sm uppercase tracking-wider" style={{ color: 'var(--sp-cream)', letterSpacing: '0.05em' }}>
                  {g.icon} {g.name}
                </span>
                <span className="font-mono text-[10px] text-sp-parchment/50">{groupTopics.length} topics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-sp-parchment/40 uppercase">{g.visibility}</span>
                {g.visibility !== 'Public' && <EyeOff className="h-3 w-3 text-sp-parchment/40" />}
              </div>
            </div>

            {/* Topics Table */}
            <AnimatePresence initial={false}>
              {!g.collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                  style={{ overflow: 'hidden' }}
                >
                  {groupTopics.length === 0 ? (
                    <div className="px-4 py-3 text-[11px] text-sp-parchment/40 italic">No topics yet. Add one from the toolbox.</div>
                  ) : (
                    <div>
                      {groupTopics.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between px-4 py-2 border-t cursor-pointer hover:bg-sp-fern/5 transition-colors"
                          style={{ borderColor: 'rgba(45, 106, 79, 0.2)' }}
                          onClick={() => onSelectTopic(t.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              {t.type === 'Sticky' ? '📌' : t.type === 'Locked' ? '🔒' : '💬'}
                            </span>
                            <span className="text-sm text-sp-cream">{t.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-sp-parchment/50">0 replies</span>
                            <span className="font-mono text-[10px] text-sp-parchment/50">0 views</span>
                            <span className="text-[10px] text-sp-parchment/40">{t.audience}</span>
                            <ChevronRight className="h-3 w-3 text-sp-parchment/30" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Lounges Section */}
      {lounges.length > 0 && (
        <div className="border" style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.6)' }}>
          <div
            className="flex items-center justify-between px-3 h-9"
            style={{ background: 'rgba(15, 41, 30, 0.9)', borderLeft: '4px solid var(--crypt-purple)' }}
          >
            <div className="flex items-center gap-2">
              <span className="font-retro text-sm uppercase tracking-wider" style={{ color: 'var(--sp-cream)', letterSpacing: '0.05em' }}>
                🔒 Lounges
              </span>
              <span className="font-mono text-[10px] text-sp-parchment/50">{lounges.length}/10</span>
            </div>
            <span className="text-[10px] text-crypt-glow uppercase">Invisible</span>
          </div>
          <div>
            {lounges.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between px-4 py-2 border-t"
                style={{ borderColor: 'rgba(45, 106, 79, 0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-3.5 w-3.5 text-crypt-glow" />
                  <span className="text-sm text-sp-cream">{l.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {l.memberLimit && <span className="font-mono text-[10px] text-sp-parchment/50">Limit: {l.memberLimit}</span>}
                  <span className="text-[10px] text-crypt-glow">Key required</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   PROPERTIES PANEL
   ═══════════════════════════════════════════ */

function PropertiesPanel({
  widget,
  onChange,
  usage,
  onArchive,
  onDelete,
}: {
  widget: PlacedWidget | null
  onChange: (w: PlacedWidget) => void
  usage: ForumUsage
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (!widget) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-sp-parchment/30">
        <LayoutGrid className="h-8 w-8 mb-2" />
        <p className="font-mono text-xs">Select a widget to edit</p>
      </div>
    )
  }

  const setSetting = <K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) => {
    onChange({ ...widget, settings: { ...widget.settings, [key]: value } })
  }

  const s = widget.settings

  const isRankedUsers = widget.type === 'stats' && s.title === 'Ranked Users'

  return (
    <div className="space-y-4">
      {/* Widget Title */}
      <div>
        <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Widget Title</label>
        <input
          type="text"
          value={s.title}
          onChange={(e) => setSetting('title', e.target.value)}
          className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      </div>

      {/* Border Style */}
      <div>
        <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Border Style</label>
        <select
          value={s.borderStyle}
          onChange={(e) => setSetting('borderStyle', e.target.value as BorderStyle)}
          className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
        >
          {(['solid', 'dashed', 'dotted', 'none'] as BorderStyle[]).map((b) => (
            <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Background */}
      <div>
        <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Background</label>
        <div className="flex gap-1 flex-wrap">
          {BG_OPTIONS.map((bg) => (
            <button
              key={bg.value}
              onClick={() => setSetting('background', bg.value)}
              className="px-2 py-1 text-[10px] border transition-colors"
              style={{
                borderColor: s.background === bg.value ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                background: s.background === bg.value ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                color: s.background === bg.value ? 'var(--sp-amber)' : 'var(--sp-parchment)',
              }}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Padding: {s.padding}px</label>
        <input
          type="range" min={0} max={32} step={4}
          value={s.padding}
          onChange={(e) => setSetting('padding', parseInt(e.target.value))}
          className="w-full accent-sp-fern"
        />
        <div className="flex justify-between text-[10px] text-sp-parchment font-mono"><span>0</span><span>32</span></div>
      </div>

      {/* Visibility */}
      <div>
        <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Visibility</label>
        <div className="flex gap-1 flex-wrap">
          {(['Public', 'Friends', 'Circle', 'Private'] as Visibility[]).map((v) => (
            <button
              key={v}
              onClick={() => setSetting('visibility', v)}
              className="px-2 py-1 text-[10px] border transition-colors flex items-center gap-1"
              style={{
                borderColor: s.visibility === v ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                background: s.visibility === v ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                color: s.visibility === v ? 'var(--sp-amber)' : 'var(--sp-parchment)',
              }}
            >
              {v === 'Public' && <Globe className="h-3 w-3" />}
              {v === 'Friends' && <Users className="h-3 w-3" />}
              {v === 'Circle' && <UserCircle className="h-3 w-3" />}
              {v === 'Private' && <EyeOff className="h-3 w-3" />}
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-sp-moss/20" />

      {/* ═══ RANK EDITOR for Ranked Users widget ═══ */}
      {isRankedUsers && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-sp-amber" />
            <h4 className="font-retro text-xs text-sp-amber uppercase tracking-widest">Rank Editor</h4>
          </div>
          <RankEditor
            ranks={s.ranks || JSON.parse(JSON.stringify(DEFAULT_RANKS)) as Rank[]}
            onChange={(newRanks) => setSetting('ranks', newRanks)}
          />
          <div className="h-px bg-sp-moss/20" />
        </div>
      )}

      {/* Widget-specific settings */}
      {widget.type === 'about' && (
        <div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">About Text</label>
          <textarea
            rows={4}
            value={s.aboutText || ''}
            onChange={(e) => setSetting('aboutText', e.target.value)}
            className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none resize-none"
          />
        </div>
      )}

      {widget.type === 'photos' && (
        <div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Grid Columns</label>
          <div className="flex gap-1">
            {[2, 3, 4].map((c) => (
              <button
                key={c}
                onClick={() => setSetting('photoGridCols', c as 2 | 3 | 4)}
                className="px-3 py-1 text-xs border"
                style={{
                  borderColor: s.photoGridCols === c ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                  background: s.photoGridCols === c ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                  color: s.photoGridCols === c ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                }}
              >
                {c}-col
              </button>
            ))}
          </div>
          <div className="mt-2 border border-dashed border-sp-moss/30 bg-sp-canopy/30 flex items-center justify-center py-4">
            <span className="text-[10px] text-sp-parchment">Upload placeholder zone</span>
          </div>
        </div>
      )}

      {widget.type === 'videos' && (
        <div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Embed URL</label>
          <input
            type="text"
            value={s.videoUrl || ''}
            onChange={(e) => setSetting('videoUrl', e.target.value)}
            placeholder="https://..."
            className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
          />
        </div>
      )}

      {widget.type === 'blog' && (
        <div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Show Recent</label>
          <div className="flex gap-1">
            {[3, 5, 10].map((c) => (
              <button
                key={c}
                onClick={() => setSetting('blogShowCount', c as 3 | 5 | 10)}
                className="px-3 py-1 text-xs border"
                style={{
                  borderColor: s.blogShowCount === c ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                  background: s.blogShowCount === c ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                  color: s.blogShowCount === c ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {widget.type === 'wall' && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anon"
            checked={s.wallAllowAnonymous || false}
            onChange={(e) => setSetting('wallAllowAnonymous', e.target.checked)}
            className="accent-sp-fern"
          />
          <label htmlFor="anon" className="text-xs text-sp-cream">Allow anonymous comments</label>
        </div>
      )}

      {widget.type === 'links' && (
        <div className="space-y-2">
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block">Links</label>
          {(s.links || []).map((link, i) => (
            <div key={i} className="flex gap-1">
              <input
                type="text"
                value={link.title}
                onChange={(e) => {
                  const newLinks = [...(s.links || [])]
                  newLinks[i] = { ...newLinks[i], title: e.target.value }
                  setSetting('links', newLinks)
                }}
                className="flex-1 bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
                placeholder="Title"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...(s.links || [])]
                  newLinks[i] = { ...newLinks[i], url: e.target.value }
                  setSetting('links', newLinks)
                }}
                className="flex-1 bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
                placeholder="URL"
              />
              <button
                onClick={() => {
                  const newLinks = (s.links || []).filter((_, idx) => idx !== i)
                  setSetting('links', newLinks)
                }}
                className="p-1 text-sp-parchment/50 hover:text-danger"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setSetting('links', [...(s.links || []), { url: '#', title: 'New Link' }])}
            className="text-xs text-sp-fern hover:text-sp-sapling flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Add link
          </button>
        </div>
      )}

      {widget.type === 'quote' && (
        <div className="space-y-2">
          <div>
            <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Quote</label>
            <textarea
              rows={3}
              value={s.quoteText || ''}
              onChange={(e) => setSetting('quoteText', e.target.value)}
              className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Author</label>
            <input
              type="text"
              value={s.quoteAuthor || ''}
              onChange={(e) => setSetting('quoteAuthor', e.target.value)}
              className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
            />
          </div>
        </div>
      )}

      {widget.type === 'friends' && (
        <div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Show</label>
          <select
            value={s.friendsSort || 'all'}
            onChange={(e) => setSetting('friendsSort', e.target.value as 'online' | 'all' | 'recent')}
            className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
          >
            <option value="online">Online first</option>
            <option value="all">All friends</option>
            <option value="recent">Recently active</option>
          </select>
        </div>
      )}

      {widget.type === 'groups' && (
        <div className="space-y-3">
          {/* Mode selector */}
          <div>
            <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Show Mode</label>
            <div className="flex gap-1 flex-wrap">
              {([
                { key: 'your+discover', label: 'Your Groups + Discover' },
                { key: 'your', label: 'Your Groups Only' },
                { key: 'discover', label: 'Discover Only' },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSetting('groupsMode', opt.key as GroupsMode)}
                  className="px-2 py-1 text-[10px] border transition-colors"
                  style={{
                    borderColor: s.groupsMode === opt.key ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                    background: s.groupsMode === opt.key ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                    color: s.groupsMode === opt.key ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max groups */}
          <div>
            <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Max Groups to Show</label>
            <div className="flex gap-1">
              {([3, 5, 10, 'all'] as GroupsMaxShow[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setSetting('groupsMaxShow', c)}
                  className="px-3 py-1 text-xs border"
                  style={{
                    borderColor: s.groupsMaxShow === c ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                    background: s.groupsMaxShow === c ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                    color: s.groupsMaxShow === c ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                  }}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Show tags toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showtags"
              checked={s.groupsShowTags !== false}
              onChange={(e) => setSetting('groupsShowTags', e.target.checked)}
              className="accent-sp-fern"
            />
            <label htmlFor="showtags" className="text-xs text-sp-cream">Show tags</label>
          </div>

          <div className="h-px bg-sp-moss/20" />

          {/* Group list */}
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block">Groups ({usage.groups}/5)</label>
          {(s.groupsList || []).map((g, i) => (
            <div key={i} className="flex items-center justify-between bg-sp-canopy/40 border border-sp-moss/20 px-2 py-1">
              <span className="text-xs text-sp-cream">{g.name}</span>
              <span className="font-mono text-[10px] text-sp-parchment">{g.memberCount}m</span>
            </div>
          ))}
          {usage.groups < 5 && (
            <button
              onClick={() => {
                const newGroups = [...(s.groupsList || []), { name: 'New Group', memberCount: 1 }]
                setSetting('groupsList', newGroups)
              }}
              className="text-xs text-sp-fern hover:text-sp-sapling flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Create New
            </button>
          )}
        </div>
      )}

      {widget.type === 'lounges' && (
        <div className="space-y-2">
          {/* Cost display */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-sp-parchment/50">
            <span>Cost:</span>
            <span style={{ color: '#d4a017' }}>50S</span>
            <span>+</span>
            <span style={{ color: '#22c55e' }}>30E</span>
          </div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block">Lounges ({usage.lounges}/10)</label>
          {(s.loungesList || []).map((l, i) => (
            <div key={i} className="flex items-center justify-between bg-sp-canopy/40 border border-sp-moss/20 px-2 py-1">
              <span className="text-xs text-sp-cream">{l.name}</span>
              <span className="text-[10px] text-sp-fern">●</span>
            </div>
          ))}
          {usage.lounges < 10 && (
            <button
              onClick={() => {
                const newLounges = [...(s.loungesList || []), { name: 'New Lounge' }]
                setSetting('loungesList', newLounges)
              }}
              className="text-xs text-sp-fern hover:text-sp-sapling flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Create New
            </button>
          )}
        </div>
      )}

      {widget.type === 'music' && (
        <div className="space-y-2">
          <div>
            <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Embed URL</label>
            <input
              type="text"
              value={s.musicUrl || ''}
              onChange={(e) => setSetting('musicUrl', e.target.value)}
              className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoplay"
              checked={s.musicAutoplay || false}
              onChange={(e) => setSetting('musicAutoplay', e.target.checked)}
              className="accent-sp-fern"
            />
            <label htmlFor="autoplay" className="text-xs text-sp-cream">Autoplay</label>
          </div>
        </div>
      )}

      {widget.type === 'html' && (
        <div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">HTML Code</label>
          <textarea
            rows={6}
            value={s.htmlCode || ''}
            onChange={(e) => setSetting('htmlCode', e.target.value)}
            className="w-full bg-[#0d1117] border border-crypt-terminal/20 px-2 py-1.5 font-mono text-xs text-crypt-terminal focus:border-crypt-terminal focus:outline-none resize-none"
          />
        </div>
      )}

      {widget.type === 'ad' && (
        <div className="space-y-2">
          <div className="border border-dashed border-sp-moss/30 bg-sp-canopy/30 flex items-center justify-center py-4">
            <span className="text-[10px] text-sp-parchment">Ad placeholder zone</span>
          </div>
          <div className="flex gap-2">
            <div>
              <label className="text-[10px] text-sp-parchment block">W</label>
              <input
                type="number"
                value={s.adDimensions?.w || 468}
                onChange={(e) => setSetting('adDimensions', { ...(s.adDimensions || { w: 468, h: 60 }), w: parseInt(e.target.value) })}
                className="w-16 bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-sp-parchment block">H</label>
              <input
                type="number"
                value={s.adDimensions?.h || 60}
                onChange={(e) => setSetting('adDimensions', { ...(s.adDimensions || { w: 468, h: 60 }), h: parseInt(e.target.value) })}
                className="w-16 bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1 text-xs text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {widget.type === 'status' && (
        <div>
          <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Status Message</label>
          <input
            type="text"
            value={s.statusText || ''}
            onChange={(e) => setSetting('statusText', e.target.value)}
            className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
          />
        </div>
      )}

      <div className="h-px bg-sp-moss/20" />

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => onArchive(widget.id)}
          className="w-full py-1.5 border border-sp-moss/30 text-xs text-sp-parchment hover:bg-sp-moss/20 transition-colors flex items-center justify-center gap-1"
        >
          <RotateCcw className="h-3 w-3" /> Archive Widget
        </button>
        <button
          onClick={() => onDelete(widget.id)}
          className="w-full py-1.5 border text-xs transition-colors flex items-center justify-center gap-1"
          style={{ borderColor: 'rgba(225, 29, 72, 0.4)', color: '#e11d48' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(225, 29, 72, 0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <Trash2 className="h-3 w-3" /> Delete Widget
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CANVAS WIDGET ITEM (Reorderable)
   ═══════════════════════════════════════════ */

function CanvasWidgetItem({
  widget,
  isSelected,
  onSelect,
  onToggleCollapse,
  onDelete,
  onUpdate,
}: {
  widget: PlacedWidget
  isSelected: boolean
  onSelect: () => void
  onToggleCollapse: () => void
  onDelete: () => void
  onUpdate: (w: PlacedWidget) => void
}) {
  const dragControls = useDragControls()
  const settings = widget.settings

  const borderStyle = settings.borderStyle === 'none' ? 'none' : `1px ${settings.borderStyle} rgba(45, 106, 79, 0.4)`

  return (
    <Reorder.Item
      value={widget}
      dragListener={false}
      dragControls={dragControls}
      className="mb-2"
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{
        scaleY: 1,
        opacity: 1,
        borderColor: isSelected ? 'var(--sp-amber)' : undefined,
      }}
      exit={{ scaleY: 0, opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
      style={{
        border: isSelected ? '2px solid var(--sp-amber)' : borderStyle,
        background: settings.background || 'rgba(62, 39, 35, 0.6)',
        listStyle: 'none',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-2 h-7 cursor-pointer select-none"
        style={{ background: 'rgba(45, 106, 79, 0.2)', borderBottom: isSelected ? '2px solid var(--sp-amber)' : '1px solid rgba(45, 106, 79, 0.2)' }}
        onClick={onSelect}
      >
        <div className="flex items-center gap-1.5">
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="cursor-grab active:cursor-grabbing p-0.5 text-sp-parchment/40 hover:text-sp-parchment"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
          <span className="font-retro text-xs text-sp-parchment" style={{ letterSpacing: '0.02em' }}>
            {settings.title}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onUpdate({ ...widget, settings: { ...widget.settings } }) }}
            className="p-0.5 text-sp-parchment/40 hover:text-sp-amber transition-colors"
          >
            <Settings className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCollapse() }}
            className="p-0.5 text-sp-parchment/40 hover:text-sp-cream transition-colors"
          >
            <motion.div animate={{ rotate: widget.collapsed ? -90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-0.5 text-sp-parchment/40 hover:text-danger transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!widget.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            style={{ overflow: 'hidden' }}
          >
            <WidgetPreview widget={widget} />
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  )
}

/* ═══════════════════════════════════════════
   MAIN BUILD PAGE
   ═══════════════════════════════════════════ */

export default function Build() {
  // ── Widgets ──
  const [widgets, setWidgets] = useState<PlacedWidget[]>([
    { id: uid(), type: 'stats', title: 'Banner', collapsed: false, settings: { ...defaultSettings('stats'), title: 'Banner' } },
    { id: uid(), type: 'talkbox', title: 'Talk Box', collapsed: false, settings: { ...defaultSettings('talkbox'), title: 'Talk Box' } },
    { id: uid(), type: 'blog', title: 'Announcements', collapsed: false, settings: { ...defaultSettings('blog'), title: 'Announcements', blogShowCount: 3 } },
    { id: uid(), type: 'wall', title: 'General Discussion', collapsed: false, settings: { ...defaultSettings('wall'), title: 'General Discussion' } },
    { id: uid(), type: 'friends', title: 'Friends List', collapsed: false, settings: { ...defaultSettings('friends'), title: 'Friends List' } },
    { id: uid(), type: 'stats', title: 'Ranked Users', collapsed: false, settings: { ...defaultSettings('stats'), title: 'Ranked Users' } },
  ])

  const [archivedWidgets, setArchivedWidgets] = useState<PlacedWidget[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [layout, setLayout] = useState<LayoutMode>('Classic')
  const [layoutOpen, setLayoutOpen] = useState(false)
  const [history, setHistory] = useState<BuilderHistory>({ past: [], future: [] })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // ── Structure ──
  const [groupings, setGroupings] = useState<Grouping[]>([
    { id: uid(), name: 'Important Notices', icon: '📌', visibility: 'Public', collapsed: false },
    { id: uid(), name: 'General Discussion', icon: '💬', visibility: 'Public', collapsed: false },
  ])
  const [topics, setTopics] = useState<Topic[]>([
    { id: uid(), name: 'Announcements', groupingId: groupings[0]?.id || '', type: 'Normal', audience: 'Public' },
    { id: uid(), name: 'Rules', groupingId: groupings[0]?.id || '', type: 'Sticky', audience: 'Public' },
    { id: uid(), name: 'Open Chat', groupingId: groupings[1]?.id || '', type: 'Normal', audience: 'Friends' },
  ])
  const [lounges, setLounges] = useState<Lounge[]>([
    { id: uid(), name: 'The Back Room', password: 'seed-42', memberLimit: 20 },
  ])
  const [signature, setSignature] = useState<Signature>({
    text: "~ 🌿 Super Admin of Willow's Grove ~",
    html: SIGNATURE_PRESETS.marquee,
    mode: 'text',
  })

  // ── Modals ──
  const [modal, setModal] = useState<'grouping' | 'topic' | 'lounge' | 'signature' | 'rankeditor' | 'theme' | null>(null)
  const [showReference, setShowReference] = useState(false)

  // ── Modal form state ──
  const [groupingForm, setGroupingForm] = useState({ name: '', icon: '💬', visibility: 'Public' as Visibility })
  const [topicForm, setTopicForm] = useState({ name: '', groupingId: '', type: 'Normal' as TopicType, audience: 'Public' as Audience })
  const [loungeForm, setLoungeForm] = useState({ name: '', password: '', memberLimit: '' })
  const [sigTab, setSigTab] = useState<SignatureMode>('text')
  const [sigPreviewHtml, setSigPreviewHtml] = useState(signature.html)

  const layoutRef = useRef<HTMLDivElement>(null)

  // Derived usage
  const usage: ForumUsage = {
    groups: groupings.length,
    topics: topics.length,
    lounges: lounges.length,
  }

  // Push current state to history before mutating
  const pushHistory = useCallback((currentWidgets: PlacedWidget[]) => {
    setHistory((h) => ({
      past: [...h.past, currentWidgets],
      future: [],
    }))
  }, [])

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h
      const prev = h.past[h.past.length - 1]
      const newPast = h.past.slice(0, -1)
      setWidgets(prev)
      return { past: newPast, future: [widgets, ...h.future] }
    })
  }, [widgets])

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h
      const next = h.future[0]
      const newFuture = h.future.slice(1)
      setWidgets(next)
      return { past: [...h.past, widgets], future: newFuture }
    })
  }, [widgets])

  const addWidget = useCallback((type: WidgetType) => {
    pushHistory(widgets)
    const def = WIDGET_DEFS.find((w) => w.type === type)!
    const newWidget: PlacedWidget = {
      id: uid(),
      type,
      title: def.label,
      collapsed: false,
      settings: defaultSettings(type),
    }
    setWidgets((prev) => [...prev, newWidget])
    setSelectedId(newWidget.id)
    setSaved(false)
  }, [widgets, pushHistory])

  const removeWidget = useCallback((id: string) => {
    pushHistory(widgets)
    setWidgets((prev) => prev.filter((w) => w.id !== id))
    setSelectedId((sid) => (sid === id ? null : sid))
    setSaved(false)
  }, [widgets, pushHistory])

  const archiveWidget = useCallback((id: string) => {
    pushHistory(widgets)
    const w = widgets.find((x) => x.id === id)
    if (!w) return
    setWidgets((prev) => prev.filter((x) => x.id !== id))
    setArchivedWidgets((prev) => [...prev, w])
    setSelectedId((sid) => (sid === id ? null : sid))
    setSaved(false)
  }, [widgets, pushHistory])

  const restoreWidget = useCallback((w: PlacedWidget) => {
    pushHistory(widgets)
    setArchivedWidgets((prev) => prev.filter((x) => x.id !== w.id))
    setWidgets((prev) => [...prev, w])
    setSelectedId(w.id)
    setSaved(false)
  }, [widgets, pushHistory])

  const updateWidget = useCallback((updated: PlacedWidget) => {
    setWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
    setSaved(false)
  }, [])

  const toggleCollapse = useCallback((id: string) => {
    setWidgets((prev) => prev.map((w) => w.id === id ? { ...w, collapsed: !w.collapsed } : w))
  }, [])

  const handleReorder = useCallback((newOrder: PlacedWidget[]) => {
    setWidgets(newOrder)
    setSaved(false)
  }, [])

  const handleSave = useCallback(() => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 800)
  }, [])

  const selectedWidget = widgets.find((w) => w.id === selectedId) || null

  // ── Structure actions ──
  const createGrouping = () => {
    if (groupings.length >= 5) return
    const g: Grouping = {
      id: uid(),
      name: groupingForm.name || 'New Grouping',
      icon: groupingForm.icon,
      visibility: groupingForm.visibility,
      collapsed: false,
    }
    setGroupings((prev) => [...prev, g])
    setGroupingForm({ name: '', icon: '💬', visibility: 'Public' })
    setModal(null)
    setSaved(false)
  }

  const createTopic = () => {
    if (topics.length >= 25 || !topicForm.groupingId) return
    const t: Topic = {
      id: uid(),
      name: topicForm.name || 'New Topic',
      groupingId: topicForm.groupingId,
      type: topicForm.type,
      audience: topicForm.audience,
    }
    setTopics((prev) => [...prev, t])
    setTopicForm({ name: '', groupingId: groupings[0]?.id || '', type: 'Normal', audience: 'Public' })
    setModal(null)
    setSaved(false)
  }

  const createLounge = () => {
    if (lounges.length >= 10) return
    const l: Lounge = {
      id: uid(),
      name: loungeForm.name || 'New Lounge',
      password: loungeForm.password || 'seed-key',
      memberLimit: loungeForm.memberLimit ? parseInt(loungeForm.memberLimit) : undefined,
    }
    setLounges((prev) => [...prev, l])
    setLoungeForm({ name: '', password: '', memberLimit: '' })
    setModal(null)
    setSaved(false)
  }

  const toggleGrouping = (id: string) => {
    setGroupings((prev) => prev.map((g) => g.id === id ? { ...g, collapsed: !g.collapsed } : g))
  }

  const selectTopic = (_id: string) => {
    // Could navigate to thread list in future
    setSelectedId(null)
  }

  const saveSignature = () => {
    setSignature((prev) => ({ ...prev, [sigTab]: sigTab === 'text' ? prev.text : sigPreviewHtml, mode: sigTab }))
    setModal(null)
    setSaved(false)
  }

  // Check limits for locking widgets
  const isLocked = (def: WidgetDef) => {
    if (def.limitKey === 'groups' && usage.groups >= 5) return true
    if (def.limitKey === 'lounges' && usage.lounges >= 10) return true
    return false
  }

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex flex-col h-[calc(100dvh-32px)] overflow-hidden" style={{ background: 'var(--sp-canopy)', marginTop: '32px' }}>
      {/* ═══ TOP TOOLBAR ═══ */}
      <div
        className="flex-shrink-0 border-b flex flex-col"
        style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(15, 41, 30, 0.95)' }}
      >
        {/* Row 1: Actions */}
        <div className="flex items-center justify-between px-3 h-9">
          {/* Left: Undo | Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={history.past.length === 0}
              className="flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:text-sp-sapling"
              style={{ color: 'var(--sp-parchment)' }}
            >
              <Undo2 className="h-3 w-3" /> Undo
            </button>
            <button
              onClick={redo}
              disabled={history.future.length === 0}
              className="flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:text-sp-sapling"
              style={{ color: 'var(--sp-parchment)' }}
            >
              <Redo2 className="h-3 w-3" /> Redo
            </button>
          </div>

          {/* Center: Preview | Save */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/#/feed', '_blank')}
              className="flex items-center gap-1 px-3 py-0.5 border font-mono text-[11px] transition-colors hover:bg-sp-moss/20"
              style={{ borderColor: 'rgba(45, 106, 79, 0.4)', color: 'var(--sp-parchment)' }}
            >
              <Eye className="h-3 w-3" /> Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-0.5 font-mono text-[11px] font-medium transition-colors"
              style={{
                background: saving ? 'rgba(45, 106, 79, 0.3)' : 'var(--sp-amber)',
                color: saving ? 'var(--sp-parchment)' : 'var(--sp-bark)',
                border: '1px solid rgba(212, 160, 23, 0.5)',
              }}
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : <><Save className="h-3 w-3" /> Save</>}
            </button>
          </div>

          {/* Reference toggle */}
          <button
            onClick={() => setShowReference((v) => !v)}
            className="flex items-center gap-1 px-2 py-0.5 border font-mono text-[11px] transition-colors"
            style={{
              borderColor: showReference ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.4)',
              background: showReference ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
              color: showReference ? 'var(--sp-amber)' : 'var(--sp-parchment)',
            }}
          >
            <BookOpen className="h-3 w-3" /> Reference
          </button>

          {/* Right: Layout dropdown */}
          <div className="relative" ref={layoutRef}>
            <button
              onClick={() => setLayoutOpen(!layoutOpen)}
              className="flex items-center gap-1 px-2 py-0.5 border font-mono text-[11px] transition-colors hover:bg-sp-moss/20"
              style={{ borderColor: 'rgba(45, 106, 79, 0.4)', color: 'var(--sp-parchment)' }}
            >
              Layout: {layout} <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {layoutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 z-50 border py-1 min-w-[120px]"
                  style={{ background: 'var(--sp-canopy)', borderColor: 'rgba(45, 106, 79, 0.4)' }}
                >
                  {(['Classic', 'Grid', 'Wide', 'Chaos'] as LayoutMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setLayout(m); setLayoutOpen(false) }}
                      className="w-full text-left px-3 py-1 font-mono text-[11px] transition-colors hover:bg-sp-moss/20"
                      style={{ color: layout === m ? 'var(--sp-amber)' : 'var(--sp-parchment)' }}
                    >
                      {m}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Row 2: Wallet + Usage meter */}
        <div className="flex items-center justify-between px-3 h-7 border-t" style={{ borderColor: 'rgba(45, 106, 79, 0.2)' }}>
          <WalletDisplay />
          <div className="flex items-center gap-4">
            <UsageMeter label="Groupings" current={usage.groups} max={5} />
            <span className="text-sp-moss/30">|</span>
            <UsageMeter label="Topics" current={usage.topics} max={25} />
            <span className="text-sp-moss/30">|</span>
            <UsageMeter label="Lounges" current={usage.lounges} max={10} />
          </div>
        </div>
      </div>

      {/* ═══ 3-PANEL LAYOUT ═══ */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Toolbox (260px) */}
        <aside
          className="flex-shrink-0 overflow-y-auto border-r hidden lg:block"
          style={{ width: '260px', background: 'rgba(15, 41, 30, 0.95)', borderColor: 'rgba(45, 106, 79, 0.3)' }}
        >
          {/* Structure Section */}
          <div className="p-3 border-b" style={{ borderColor: 'rgba(45, 106, 79, 0.3)' }}>
            <h3 className="font-retro text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--sp-amber)' }}>
              Structure
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => { if (groupings.length < 5) { setModal('grouping'); setGroupingForm({ name: '', icon: '💬', visibility: 'Public' }) } }}
                disabled={groupings.length >= 5}
                className="flex items-center gap-2.5 w-full px-2 py-2 border transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderColor: groupings.length >= 5 ? 'rgba(45, 106, 79, 0.15)' : 'rgba(45, 106, 79, 0.3)',
                  background: groupings.length >= 5 ? 'rgba(45, 106, 79, 0.05)' : 'rgba(45, 106, 79, 0.1)',
                  height: '40px',
                }}
                onMouseEnter={(e) => { if (groupings.length < 5) { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)' } }}
                onMouseLeave={(e) => { if (groupings.length < 5) { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.1)'; e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)' } }}
              >
                <FolderPlus className="h-5 w-5" style={{ color: groupings.length >= 5 ? 'var(--sp-parchment)' : 'var(--sp-honey)' }} />
                <span className="text-xs flex-1" style={{ color: 'var(--sp-cream)' }}>Grouping</span>
                <span className="font-mono text-[10px] text-sp-parchment/50">{groupings.length}/5</span>
              </button>

              <button
                onClick={() => { if (topics.length < 25 && groupings.length > 0) { setModal('topic'); setTopicForm({ name: '', groupingId: groupings[0]?.id || '', type: 'Normal', audience: 'Public' }) } }}
                disabled={topics.length >= 25 || groupings.length === 0}
                className="flex items-center gap-2.5 w-full px-2 py-2 border transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderColor: topics.length >= 25 ? 'rgba(45, 106, 79, 0.15)' : 'rgba(45, 106, 79, 0.3)',
                  background: topics.length >= 25 ? 'rgba(45, 106, 79, 0.05)' : 'rgba(45, 106, 79, 0.1)',
                  height: '40px',
                }}
                onMouseEnter={(e) => { if (topics.length < 25) { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)' } }}
                onMouseLeave={(e) => { if (topics.length < 25) { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.1)'; e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)' } }}
              >
                <FilePlus className="h-5 w-5" style={{ color: topics.length >= 25 ? 'var(--sp-parchment)' : 'var(--sp-honey)' }} />
                <span className="text-xs flex-1" style={{ color: 'var(--sp-cream)' }}>Topic</span>
                <span className="font-mono text-[10px] text-sp-parchment/50">{topics.length}/25</span>
              </button>

              <button
                onClick={() => { if (lounges.length < 10) { setModal('lounge'); setLoungeForm({ name: '', password: '', memberLimit: '' }) } }}
                disabled={lounges.length >= 10}
                className="flex items-center gap-2.5 w-full px-2 py-2 border transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderColor: lounges.length >= 10 ? 'rgba(45, 106, 79, 0.15)' : 'rgba(45, 106, 79, 0.3)',
                  background: lounges.length >= 10 ? 'rgba(45, 106, 79, 0.05)' : 'rgba(45, 106, 79, 0.1)',
                  height: '40px',
                }}
                onMouseEnter={(e) => { if (lounges.length < 10) { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)' } }}
                onMouseLeave={(e) => { if (lounges.length < 10) { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.1)'; e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)' } }}
              >
                <DoorOpen className="h-5 w-5" style={{ color: lounges.length >= 10 ? 'var(--sp-parchment)' : 'var(--sp-honey)' }} />
                <span className="text-xs flex-1" style={{ color: 'var(--sp-cream)' }}>Lounge</span>
                <span className="font-mono text-[10px] text-sp-parchment/50">{lounges.length}/10</span>
              </button>

              <button
                onClick={() => { setModal('signature'); setSigTab(signature.mode); setSigPreviewHtml(signature.html) }}
                className="flex items-center gap-2.5 w-full px-2 py-2 border transition-all text-left"
                style={{
                  borderColor: 'rgba(45, 106, 79, 0.3)',
                  background: 'rgba(45, 106, 79, 0.1)',
                  height: '40px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.1)'; e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)' }}
              >
                <PenLine className="h-5 w-5" style={{ color: 'var(--sp-honey)' }} />
                <span className="text-xs flex-1" style={{ color: 'var(--sp-cream)' }}>Signature</span>
              </button>

              {/* Rank Editor button */}
              <button
                onClick={() => setModal('rankeditor')}
                className="flex items-center gap-2.5 w-full px-2 py-2 border transition-all text-left"
                style={{
                  borderColor: 'rgba(45, 106, 79, 0.3)',
                  background: 'rgba(45, 106, 79, 0.1)',
                  height: '40px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.1)'; e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)' }}
              >
                <Cog className="h-5 w-5" style={{ color: 'var(--sp-honey)' }} />
                <span className="text-xs flex-1" style={{ color: 'var(--sp-cream)' }}>Rank Editor</span>
              </button>

              {/* Theme Designer button */}
              <button
                onClick={() => setModal('theme')}
                className="flex items-center gap-2.5 w-full px-2 py-2 border transition-all text-left"
                style={{
                  borderColor: 'rgba(45, 106, 79, 0.3)',
                  background: 'rgba(45, 106, 79, 0.1)',
                  height: '40px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.1)'; e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)' }}
              >
                <Palette className="h-5 w-5" style={{ color: 'var(--sp-honey)' }} />
                <span className="text-xs flex-1" style={{ color: 'var(--sp-cream)' }}>Theme Designer</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          {(['content', 'social', 'utility'] as WidgetCategory[]).map((cat) => (
            <div key={cat} className="p-3">
              <h3 className="font-retro text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--sp-fern)' }}>
                {CATEGORY_LABELS[cat]}
              </h3>
              <div className="space-y-1">
                {WIDGET_DEFS.filter((w) => w.category === cat).map((def) => {
                  const locked = isLocked(def)
                  return (
                    <button
                      key={def.type}
                      onClick={() => !locked && addWidget(def.type)}
                      disabled={locked}
                      className="flex items-center gap-2.5 w-full px-2 py-2 border transition-all text-left"
                      style={{
                        borderColor: locked ? 'rgba(45, 106, 79, 0.15)' : 'rgba(45, 106, 79, 0.3)',
                        background: locked ? 'rgba(45, 106, 79, 0.05)' : 'rgba(45, 106, 79, 0.1)',
                        opacity: locked ? 0.4 : 1,
                        cursor: locked ? 'not-allowed' : 'pointer',
                        height: '40px',
                      }}
                      onMouseEnter={(e) => {
                        if (!locked) {
                          e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'
                          e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!locked) {
                          e.currentTarget.style.background = 'rgba(45, 106, 79, 0.1)'
                          e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)'
                        }
                      }}
                    >
                      <span style={{ color: locked ? 'var(--sp-parchment)' : 'var(--sp-honey)' }}>{def.icon}</span>
                      <span className="text-xs flex-1" style={{ color: 'var(--sp-cream)' }}>{def.label}</span>
                      {locked && <Lock className="h-3 w-3 text-sp-parchment/50" />}
                      {def.limit && !locked && (
                        <span className="font-mono text-[10px] text-sp-parchment/50">
                          {usage[def.limitKey || 'groups']}/{def.limit}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Archived section */}
          {archivedWidgets.length > 0 && (
            <div className="p-3 border-t" style={{ borderColor: 'rgba(45, 106, 79, 0.3)' }}>
              <h3 className="font-retro text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--sp-parchment)' }}>
                Archived
              </h3>
              <div className="space-y-1">
                {archivedWidgets.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between px-2 py-1.5 border"
                    style={{ borderColor: 'rgba(45, 106, 79, 0.2)', background: 'rgba(15, 41, 30, 0.5)' }}
                  >
                    <span className="text-xs text-sp-parchment">{w.settings.title}</span>
                    <button
                      onClick={() => restoreWidget(w)}
                      className="font-mono text-[10px] px-2 py-0.5 border transition-colors hover:bg-sp-moss/20"
                      style={{ borderColor: 'rgba(45, 106, 79, 0.3)', color: 'var(--sp-fern)' }}
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* CENTER: Canvas */}
        <main className="flex-1 overflow-y-auto relative" style={{ background: 'var(--sp-canopy)' }}>
          <div className="min-h-full flex justify-center py-4 px-4">
            <div
              className="w-full max-w-[720px]"
              style={{
                border: '1px solid rgba(45, 106, 79, 0.3)',
                background: 'rgba(15, 41, 30, 0.6)',
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null) }}
            >
              {/* Forum chrome */}
              <div
                className="flex items-center justify-between px-3 h-8 border-b"
                style={{ background: 'rgba(15, 41, 30, 0.9)', borderColor: 'rgba(45, 106, 79, 0.3)' }}
              >
                <span className="font-mono text-[10px] text-sp-parchment/60">socialcircle.p2p / @grove</span>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-sp-sapling" />
                  <span className="font-mono text-[10px] text-sp-fern">4 peers</span>
                </div>
              </div>

              {/* Forum Content */}
              <div className="p-3">
                {/* Structure Preview */}
                <StructurePreview
                  groupings={groupings}
                  topics={topics}
                  lounges={lounges}
                  onToggleGrouping={toggleGrouping}
                  onSelectTopic={selectTopic}
                />

                {/* Draggable Widgets */}
                {widgets.length === 0 ? (
                  <button
                    onClick={() => addWidget('about')}
                    className="flex flex-col items-center justify-center gap-2 w-full py-12 border transition-colors hover:border-sp-fern/60"
                    style={{ borderStyle: 'dashed', borderColor: 'rgba(45, 106, 79, 0.4)' }}
                  >
                    <GripVertical className="h-6 w-6 text-sp-parchment/30" />
                    <p className="font-mono text-xs text-sp-parchment">Drag widgets here to build your forum</p>
                  </button>
                ) : (
                  <Reorder.Group axis="y" values={widgets} onReorder={handleReorder} className="list-none p-0 m-0">
                    <AnimatePresence mode="popLayout">
                      {widgets.map((widget) => (
                        <CanvasWidgetItem
                          key={widget.id}
                          widget={widget}
                          isSelected={selectedId === widget.id}
                          onSelect={() => setSelectedId(widget.id)}
                          onToggleCollapse={() => toggleCollapse(widget.id)}
                          onDelete={() => removeWidget(widget.id)}
                          onUpdate={updateWidget}
                        />
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: Properties (280px) */}
        <aside
          className="flex-shrink-0 overflow-y-auto border-l hidden lg:block"
          style={{ width: '280px', background: 'rgba(15, 41, 30, 0.95)', borderColor: 'rgba(45, 106, 79, 0.3)' }}
        >
          <div className="p-3">
            <h3 className="font-retro text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--sp-fern)' }}>
              Properties
            </h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId || 'empty'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <PropertiesPanel
                  widget={selectedWidget}
                  onChange={updateWidget}
                  usage={usage}
                  onArchive={archiveWidget}
                  onDelete={removeWidget}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>

      {/* HTML Reference Panel (slide-in) */}
      <AnimatePresence>
        {showReference && <HTMLReferencePanel onClose={() => setShowReference(false)} />}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
         MODALS
         ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {/* Theme Designer Modal */}
        <ThemeDesigner open={modal === 'theme'} onClose={() => setModal(null)} />

        {/* Grouping Modal */}
        <Modal open={modal === 'grouping'} onClose={() => setModal(null)} title="Create New Grouping">
          <div className="space-y-4">
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Name</label>
              <input
                type="text"
                value={groupingForm.name}
                onChange={(e) => setGroupingForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. General Discussion"
                className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setGroupingForm((f) => ({ ...f, icon: emoji }))}
                    className="w-9 h-9 border text-lg flex items-center justify-center transition-colors"
                    style={{
                      borderColor: groupingForm.icon === emoji ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                      background: groupingForm.icon === emoji ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Visibility</label>
              <div className="flex gap-1 flex-wrap">
                {(['Public', 'Friends', 'Circle', 'Private'] as Visibility[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setGroupingForm((f) => ({ ...f, visibility: v }))}
                    className="px-3 py-1 text-[11px] border transition-colors"
                    style={{
                      borderColor: groupingForm.visibility === v ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                      background: groupingForm.visibility === v ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                      color: groupingForm.visibility === v ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={createGrouping}
                disabled={!groupingForm.name.trim() || groupings.length >= 5}
                className="w-full py-2 font-mono text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: !groupingForm.name.trim() || groupings.length >= 5 ? 'rgba(45, 106, 79, 0.2)' : 'var(--sp-amber)',
                  color: !groupingForm.name.trim() || groupings.length >= 5 ? 'var(--sp-parchment)' : 'var(--sp-bark)',
                  border: '1px solid rgba(212, 160, 23, 0.5)',
                }}
              >
                Create
              </button>
              {groupings.length >= 5 && <p className="text-[10px] text-danger mt-1 text-center">Maximum 5 groupings reached</p>}
            </div>
          </div>
        </Modal>

        {/* Topic Modal */}
        <Modal open={modal === 'topic'} onClose={() => setModal(null)} title="Create New Topic">
          <div className="space-y-4">
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Name</label>
              <input
                type="text"
                value={topicForm.name}
                onChange={(e) => setTopicForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Announcements"
                className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Parent Grouping</label>
              <select
                value={topicForm.groupingId}
                onChange={(e) => setTopicForm((f) => ({ ...f, groupingId: e.target.value }))}
                className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              >
                {groupings.map((g) => (
                  <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Type</label>
              <div className="flex gap-1 flex-wrap">
                {TOPIC_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopicForm((f) => ({ ...f, type: t }))}
                    className="px-3 py-1 text-[11px] border transition-colors"
                    style={{
                      borderColor: topicForm.type === t ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                      background: topicForm.type === t ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                      color: topicForm.type === t ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                    }}
                  >
                    {t === 'Sticky' ? '📌 Sticky' : t === 'Locked' ? '🔒 Locked' : '💬 Normal'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Default Audience</label>
              <div className="flex gap-1 flex-wrap">
                {AUDIENCES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setTopicForm((f) => ({ ...f, audience: a }))}
                    className="px-3 py-1 text-[11px] border transition-colors"
                    style={{
                      borderColor: topicForm.audience === a ? 'var(--sp-amber)' : 'rgba(45, 106, 79, 0.3)',
                      background: topicForm.audience === a ? 'rgba(212, 160, 23, 0.1)' : 'transparent',
                      color: topicForm.audience === a ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={createTopic}
                disabled={!topicForm.name.trim() || topics.length >= 25 || !topicForm.groupingId}
                className="w-full py-2 font-mono text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: !topicForm.name.trim() || topics.length >= 25 ? 'rgba(45, 106, 79, 0.2)' : 'var(--sp-amber)',
                  color: !topicForm.name.trim() || topics.length >= 25 ? 'var(--sp-parchment)' : 'var(--sp-bark)',
                  border: '1px solid rgba(212, 160, 23, 0.5)',
                }}
              >
                Create
              </button>
              {topics.length >= 25 && <p className="text-[10px] text-danger mt-1 text-center">Maximum 25 topics reached</p>}
            </div>
          </div>
        </Modal>

        {/* Lounge Modal */}
        <Modal open={modal === 'lounge'} onClose={() => setModal(null)} title="Create Invisible Lounge">
          <div className="space-y-4">
            {/* Cost */}
            <div className="flex items-center gap-2 px-2 py-1.5 border" style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(45, 106, 79, 0.1)' }}>
              <span className="text-[10px] text-sp-parchment/50">Cost:</span>
              <span className="text-[10px] font-mono" style={{ color: '#d4a017' }}>50S</span>
              <span className="text-[10px] text-sp-parchment/50">+</span>
              <span className="text-[10px] font-mono" style={{ color: '#22c55e' }}>30E</span>
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Name</label>
              <input
                type="text"
                value={loungeForm.name}
                onChange={(e) => setLoungeForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. The Back Room"
                className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Password / Invite Key</label>
              <input
                type="text"
                value={loungeForm.password}
                onChange={(e) => setLoungeForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="seed-key-123"
                className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Member Limit (optional)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={loungeForm.memberLimit}
                onChange={(e) => setLoungeForm((f) => ({ ...f, memberLimit: e.target.value }))}
                placeholder="Unlimited"
                className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none"
              />
            </div>
            <div className="pt-2">
              <button
                onClick={createLounge}
                disabled={!loungeForm.name.trim() || lounges.length >= 10}
                className="w-full py-2 font-mono text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: !loungeForm.name.trim() || lounges.length >= 10 ? 'rgba(45, 106, 79, 0.2)' : 'var(--sp-amber)',
                  color: !loungeForm.name.trim() || lounges.length >= 10 ? 'var(--sp-parchment)' : 'var(--sp-bark)',
                  border: '1px solid rgba(212, 160, 23, 0.5)',
                }}
              >
                Create
              </button>
              {lounges.length >= 10 && <p className="text-[10px] text-danger mt-1 text-center">Maximum 10 lounges reached</p>}
            </div>
          </div>
        </Modal>

        {/* Signature Editor Modal */}
        <Modal open={modal === 'signature'} onClose={() => setModal(null)} title="Signature Editor" maxWidth={560}>
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-0 border-b" style={{ borderColor: 'rgba(45, 106, 79, 0.3)' }}>
              {(['text', 'html'] as SignatureMode[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSigTab(tab)}
                  className="px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                  style={{
                    borderBottom: sigTab === tab ? '2px solid var(--sp-amber)' : '2px solid transparent',
                    color: sigTab === tab ? 'var(--sp-amber)' : 'var(--sp-parchment)',
                  }}
                >
                  {tab} Mode
                </button>
              ))}
            </div>

            {/* Cost for custom animated signature */}
            {sigTab === 'html' && (
              <div className="flex items-center gap-2 px-2 py-1.5 border" style={{ borderColor: 'rgba(45, 106, 79, 0.3)', background: 'rgba(45, 106, 79, 0.1)' }}>
                <span className="text-[10px] text-sp-parchment/50">Custom animated signature cost:</span>
                <span className="text-[10px] font-mono" style={{ color: '#22d3ee' }}>20I</span>
                <span className="text-[10px] text-sp-parchment/50">+</span>
                <span className="text-[10px] font-mono" style={{ color: '#22c55e' }}>10E</span>
              </div>
            )}

            {/* Editor */}
            {sigTab === 'text' ? (
              <div>
                <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Plain Text Signature</label>
                <textarea
                  rows={4}
                  value={signature.text}
                  onChange={(e) => setSignature((s) => ({ ...s, text: e.target.value }))}
                  placeholder="~ 🌿 Super Admin of Willow's Grove ~"
                  className="w-full bg-sp-canopy/60 border border-sp-moss/30 px-2 py-1.5 text-sm text-sp-cream focus:border-sp-fern focus:outline-none resize-none"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">HTML Signature</label>
                <textarea
                  rows={6}
                  value={sigPreviewHtml}
                  onChange={(e) => setSigPreviewHtml(e.target.value)}
                  className="w-full bg-[#0d1117] border border-crypt-terminal/20 px-2 py-1.5 font-mono text-xs text-crypt-terminal focus:border-crypt-terminal focus:outline-none resize-none"
                />
                {/* Presets */}
                <div className="flex gap-2 flex-wrap">
                  {([
                    { key: 'marquee', label: 'Marquee' },
                    { key: 'status', label: 'Status Pulse' },
                    { key: 'stats', label: 'Stats Bar' },
                    { key: 'custom', label: 'Custom' },
                  ] as const).map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => setSigPreviewHtml(SIGNATURE_PRESETS[preset.key])}
                      className="px-2 py-1 text-[10px] border transition-colors"
                      style={{
                        borderColor: 'rgba(45, 106, 79, 0.3)',
                        color: 'var(--sp-parchment)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45, 106, 79, 0.2)'; e.currentTarget.style.borderColor = 'rgba(82, 183, 136, 0.4)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(45, 106, 79, 0.3)' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Preview */}
            <div>
              <label className="font-retro text-xs text-sp-fern uppercase tracking-wider block mb-1">Live Preview</label>
              <div
                className="border bg-sp-canopy/40 p-3 overflow-hidden"
                style={{ borderColor: 'rgba(45, 106, 79, 0.3)', maxHeight: '120px' }}
              >
                {sigTab === 'text' ? (
                  <p className="text-sm text-sp-cream">{signature.text}</p>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: sigPreviewHtml }} />
                )}
              </div>
              <p className="text-[10px] text-sp-parchment/50 mt-1">Max height: 120px (enforced)</p>
            </div>

            <div className="pt-2">
              <button
                onClick={saveSignature}
                className="w-full py-2 font-mono text-xs font-medium transition-colors"
                style={{
                  background: 'var(--sp-amber)',
                  color: 'var(--sp-bark)',
                  border: '1px solid rgba(212, 160, 23, 0.5)',
                }}
              >
                Save Signature
              </button>
            </div>
          </div>
        </Modal>

        {/* Rank Editor Modal */}
        <Modal open={modal === 'rankeditor'} onClose={() => setModal(null)} title="Rank Editor" maxWidth={520}>
          <div className="space-y-4">
            <p className="text-[11px] text-sp-parchment/60">
              Customize the rank names and colors for your forum. These will be displayed on user badges.
            </p>
            <RankEditor
              ranks={selectedWidget?.settings.ranks || JSON.parse(JSON.stringify(DEFAULT_RANKS)) as Rank[]}
              onChange={(newRanks) => {
                // If a widget is selected and it's the Ranked Users widget, update it directly
                if (selectedWidget && selectedWidget.type === 'stats' && selectedWidget.settings.title === 'Ranked Users') {
                  updateWidget({
                    ...selectedWidget,
                    settings: { ...selectedWidget.settings, ranks: newRanks },
                  })
                }
              }}
            />
            <div className="pt-2">
              <button
                onClick={() => setModal(null)}
                className="w-full py-2 font-mono text-xs font-medium transition-colors"
                style={{
                  background: 'var(--sp-amber)',
                  color: 'var(--sp-bark)',
                  border: '1px solid rgba(212, 160, 23, 0.5)',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      </AnimatePresence>
    </div>
  )
}
