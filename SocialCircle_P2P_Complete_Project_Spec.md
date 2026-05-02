# SocialCircle.P2P — Complete Project Specification

**Version**: v7.0 (Onboarding & AI Agent Edition)
**Date**: 2026-05-02
**URL**: https://zyetmy7gongdi.kimi.page
**Protocol**: P2P Social Forum Platform
**Aesthetic**: Solarpunk × 2006 XMB Forums × MySpace Creative Chaos

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [Protocol & Architecture](#2-protocol--architecture)
3. [IVS Framework Integration](#3-ivs-framework-integration)
4. [Visual Design System](#4-visual-design-system)
5. [Navigation & Routes](#5-navigation--routes)
6. [Landing Page (`/`)](#6-landing-page)
7. [Account Creation (`/onboarding`)](#7-account-creation)
8. [Login (`/login`)](#8-login)
9. [Forum Profile (`/:handle`)](#9-forum-profile)
10. [User Profile (`/@:handle`)](#10-user-profile)
11. [Pulse Feed (`/feed`)](#11-pulse-feed)
12. [Discovery (`/explore`)](#12-discovery)
13. [Encrypted Messenger (`/talk`)](#13-encrypted-messenger)
14. [Profile Builder (`/build`)](#14-profile-builder)
15. [P2P Store (`/store`)](#15-p2p-store)
16. [Settings (`/settings`)](#16-settings)
17. [XMB Rank System](#17-xmb-rank-system)
18. [Karma 4-Vector (M-S-I-E)](#18-karma-4-vector-m-s-i-e)
19. [Y-Dimension (Clawbots/AI)](#19-y-dimension-clawbotsai)
20. [Credibility System](#20-credibility-system)
21. [Pulse Algorithm](#21-pulse-algorithm)
22. [Audience & Propagation](#22-audience--propagation)
23. [BBCode & Rich Text](#23-bbcode--rich-text)
24. [Auto-Translation & Subtitles](#24-auto-translation--subtitles)
25. [Advertising & Affiliate System](#25-advertising--affiliate-system)
26. [Forum Structure & Limits](#26-forum-structure--limits)
27. [Vblog System](#27-vblog-system)
28. [Groups Widget](#28-groups-widget)
29. [Animated Signatures](#29-animated-signatures)
30. [MySpace-Style Customization](#30-myspace-style-customization)
31. [Polyamory & Relationships](#31-polyamory--relationships)
32. [Custom Profile URLs](#32-custom-profile-urls)
33. [Heterodox Content Injection](#33-heterodox-content-injection)
34. [P2P Store & Service Charges](#34-p2p-store--service-charges)
35. [Organic Reach & Connection Weight](#35-organic-reach--connection-weight)
36. [RSV Moderation](#36-rsv-moderation)
37. [Security & Encryption](#37-security--encryption)
38. [Technology Stack](#38-technology-stack)
39. [File Structure](#39-file-structure)
40. [Version History](#40-version-history)

---

## 1. Core Philosophy

SocialCircle.P2P is a **P2P social forum platform** where every user's profile IS their own forum. It fuses three nostalgic aesthetics:

- **XMB Forums (2006)**: Hierarchical groupings → topics → threads, table-based layouts, sharp edges, rank systems
- **MySpace**: Full creative freedom — custom backgrounds, animated signatures, HTML/CSS profile editing
- **Microsoft FrontPage**: Drag-and-drop WYSIWYG builder with raw code toggle

With a **solarpunk** visual identity: lush greens, warm amber sunlight, bioluminescent accents, organic growth metaphors.

**Key Principles**:
- No central servers — users ARE the network
- Every profile is a forum — the user is Super Admin
- Privacy by design — encryption is visible and celebrated
- Organic propagation — not viral addiction
- Karma is reputation, not currency
- Extractive behavior gets friction, not rewards
- AI agents (Clawbots) must be attached to biological accounts
- Auto-translation for all languages
- Polyamory-friendly relationship system
- Heterodox content injection prevents echo chambers

---

## 2. Protocol & Architecture

### Platform
- **PWA** (Progressive Web App) — installable on any device
- Single codebase: React + TypeScript + Vite + Tailwind CSS
- WebRTC for peer connections (Phase 2)
- IndexedDB for local storage
- No backend server required for core function

### Data Model
```
User
├── Public Profile (forum face)
├── Content Profile (creator face) × 3 max
├── Anonymous Profile (nickname face) × 1 max
│
├── Forum (their profile IS a forum)
│   ├── Groupings (max 5)
│   │   └── Topics (max 25 total)
│   │       └── Threads
│   │           └── Posts (with signatures)
│   └── Lounges (max 10, invite-only)
│
├── Vblog (video blog)
├── Store (P2P marketplace)
├── Karma 4-Vector (M-S-I-E reputation)
├── Y-Dimension (Clawbot credits)
├── Compensation (spendable labor credits)
└── Credibility (per-context trust score)
```

### P2P Chunk Distribution
1. User creates profile → local backup on device
2. Data chunked and distributed to friends
3. Friends redistribute to THEIR friends
4. Offline = retrievable from the mesh
5. Popular content has MORE backup copies
6. Lighthouse: GPS-based local peer discovery for first connection

---

## 3. IVS Framework Integration

Per the uploaded protocol specification:

### Karma 4-Vector (Reputation, NOT Currency)
- **Material (M)**: Tangible contribution — hosting, bandwidth, storage
- **Social (S)**: Community connection — engagement, friendship, events
- **Innovation (I)**: Creative contribution — content, widgets, code, design
- **Ecology (E)**: Network health — seeding, uptime, helping others backup

**Rules**:
- Dimensions are INCOMMENSURABLE — never sum them into a scalar
- Karma is REPUTATION — non-transferable, per-user, peer-validated
- Karma accrues through CONTRIBUTION, not purchase
- Karma is SPENDABLE — but ONLY with the SITE (not between users)
- Spend karma for: more groups, more topics, more lounges, boost visibility, traffic preference during congestion, rewards for seeding over leeching

### Y-Dimension (Non-Biological Actors)
- **Y-kin (Y)**: Special dimension for AI/Clawbot agents
- Earned by: Trading M/S/I/E karma (biological → non-biological conversion)
- Used by: Clawbots to interact on profiles, join groups, post (limited)
- NOT transferable between users
- Clawbots must be ATTACHED to a biological account before access
- Conversion rate: 10 M/S/I/E karma = 1 Y-credit

### Dimensional Compensation (Spendable Layer)
- Earned through SPECIFIC LABOR (storage hours, bandwidth, curation)
- Used for: tips to creators, system privileges, store purchases
- Subject to DEMURRAGE (~90 day decay) — prevents hoarding
- Separate from Karma — spending compensation doesn't reduce reputation

### Directed Entropy Thesis
- Extractive behavior (high Social karma, low everything else) gets FRICTION
- S-only accumulation degrades chunk service priority
- "⚠️ Dimensional imbalance detected" warning shown

### RSV (Recursive Signal Verification)
- All verification happens through recursive peer signals
- No central authority for trust
- Peer endorsements weighted by endorser's credibility

---

## 4. Visual Design System

### Color Palette (Solarpunk)
| Token | Hex | Usage |
|-------|-----|-------|
| `--sp-canopy` | #0f291e | Darkest green, backgrounds |
| `--sp-deep` | #1b4332 | Deep green, secondary bg |
| `--sp-moss` | #2d6a4f | Primary green, borders |
| `--sp-fern` | #40916c | Medium green, links |
| `--sp-sapling` | #52b788 | Light green, highlights |
| `--sp-mint` | #74c69d | Mint, hover states |
| `--sp-parchment` | #95d5b2 | Lightest green, muted text |
| `--sp-amber` | #d4a017 | Gold/amber, CTAs, accents |
| `--sp-cream` | #f5f0e1 | Cream, primary text |

### Typography
| Font | Role |
|------|------|
| **VT323** | Headers, labels, category titles, retro UI elements |
| **Space Grotesk** | Large headings, banner titles |
| **Inter** | Body text, readable content |
| **JetBrains Mono** | Data, timestamps, code, tiny links, stats |

### Design Rules (2006 Forum Aesthetic)
| Rule | Value |
|------|-------|
| Border radius (containers) | **0px** everywhere |
| Border radius (avatars only) | **2px** (slightly rounded squares) |
| Borders | **1px solid**, `--sp-moss` at 20-40% |
| Shadows | **NONE** — completely flat |
| Buttons | Square corners, 1px border, solid bg |
| Cards | NOT cards — boxes with 1px borders |
| Hover | Background color shift ONLY — no lift, no scale |
| Spacing | Tight — 4px, 8px, 12px (not modern 24px) |

### Themes
- **Dark Mode**: "Bioluminescent Forest" — deep emerald, glowing cyan accents
- **Light Mode**: "Solar Meadow" — warm cream, golden amber, sage green

---

## 5. Navigation & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Solarpunk hero, encryption manifesto, chunk network animation |
| `/onboarding` | Account Creation | 10-step wizard: ToS, credentials, profile, preferences, seeding |
| `/login` | Login | Profile URL / Email / Phone / Google sign-in |
| `/:handle` | Forum Profile | Forum home — groupings, topics, threads, talk box |
| `/@:handle` | User Profile | Detailed profile — About, Posts, Vblog, Store, Contact, Links, Connections |
| `/feed` | Pulse Feed | Pulsing threads + hashtag filtering |
| `/explore` | Discovery | Search, tags, random profiles, lighthouse map |
| `/talk` | Messenger | Encrypted DMs, group chat, self-destruct |
| `/build` | Profile Builder | WYSIWYG + code editor, theme designer, HTML reference |
| `/store` | P2P Marketplace | Browse products, income-based service charges |
| `/settings` | Control Center | Profile faces, encryption, chunks, privacy, network |

**Navbar**: Forum | Explore | Talk | Store | Build | Settings
- 32px height, solid `--sp-canopy`, no blur, 1px bottom border
- VT323 14px links, amber 2px underline for active
- Right: peer count (10px mono) + 24px square avatar + "My Forum"
- Compensation wallet: `Comp: 1.2K | 🔩 890M 💬 1,247S 💡 340I 🌱 45,200E`
- Language switcher: 🌐 [EN ▼]

---

## 6. Landing Page (`/`)

### Sections (Top to Bottom):
1. **Hero Canopy** — Full-screen forest canopy image, "No servers. Only seeds." headline, CTAs
   - Primary CTA: "Join the Circle" → `/onboarding`
   - Secondary: "Sign In" → `/login`
2. **Chunk Network Visualization** — Interactive SVG showing P2P mesh (center node, friend nodes, connection lines, seed particles)
3. **Builder Teaser** — FrontPage-style builder preview with widget mockups
4. **Three Faces** — Cards showing Public Profile, Content Profile, Anonymous Profile
5. **Encryption Manifesto** — "Trust, but verify" with matrix rain background
6. **Community CTA** — Stats (12,847 nodes, 4.2M seeds, ∞ freedom, 0 servers) + testimonials

---

## 7. Account Creation (`/onboarding`)

### 10-Step Onboarding Wizard

#### Step 0: Landing Gate
- "SocialCircle.p2p" in Space Grotesk 48px
- "The network is the people." in VT323 16px
- [Create Account] amber button → Step 1
- [Sign In] moss button → `/login`
- "By joining, you agree to our Terms of Service and Terms of Use."
- [Read ToS] [Read ToU] links

#### Step 1: Terms Agreement (MANDATORY)
- Dual scrollable ToS/ToU text boxes
- 4 required checkboxes:
  1. I have read and agree to the Terms of Service
  2. I have read and agree to the Terms of Use
  3. I understand that my data is distributed P2P (not on central servers)
  4. I agree to seed at least 10% of content I consume
- [I Agree & Continue] — disabled until all checked

#### Step 2: Account Credentials
- Profile URL: `forums.socialcircle.p2p/` [input] [Check Availability]
  - Validation: 3-30 chars, alphanumeric + underscore + hyphen
  - Reserved words blocked: admin, root, system, api, test, null
- Contact: ○ Email [input] | ○ Phone [+1 ___-___-____] | ○ Link Gmail [button]
- Password: [input] + Strength meter [████░░░░░░]
- Confirm: [input]

#### Step 3: Personal Information
- Display Name: [input] "(BBCode allowed: [color], [b])"
- Birthday: [Month ▼] [Day ▼] [Year ▼] + [Keep Private ▼]
- Relationships: □ Single □ Partnered □ Married □ Engaged □ It's Complicated
- Spouse(s): [input] | Fiancé(s): [input] | Partner(s): [input]
- Polyamory: □ Polyamorous □ Polygynous □ Polyandrous
- Referred By: @ [input] | Related To: @ [input] | Invited By: @ [input]

#### Step 4: Content Preferences
- 3-column grid (14 types): Blogging, Vblogging, VTubing, Short Reels, Music, Digital Art, Code/tech, Photography, Gaming, Gardening, Cooking, Crafts, Discussion, Reviews
- Counter: "Selected: X/5"

#### Step 5: Interest Questionnaire
- Music Taste: [textarea]
- Political Affiliation (optional): [dropdown]
- ⚠️ Echo chamber warning (amber border): "A portion of your feed will be curated from heterodox sources..."
- What do you LIKE: [textarea]
- What do you DISLIKE: [textarea]

#### Step 6: Profile Pictures & Profiles
- Main Profile Picture: [drag & drop upload zone]
- Content Profiles (up to 3): Name [input] + Type [Blogging ▼|Vblogging|VTubing|Art|Code|Music|Other] + Picture [upload]
- [Add Content Profile +] (disabled at 3)
- Anonymous Profile: Nickname [input]
  - ⚠️ "Cannot be changed more than once per EarthCycle"

#### Step 7: Forum Visibility & Background
- Visibility: ○ Public | ○ Friends-Only | ○ Circle-Only | ○ Discoverable
- Background: [Solid ▼|Gradient ▼|Image ▼|Pattern ▼]
- Color: [#0f291e ▼] or Upload Image
- Content Box Transparency: [slider] 70%
- Live preview of forum mockup

#### Step 8: Forum Rules & Governance
- 📖 Quick Reference cards: Setting Ranks | Legacy Account | Rules Editor
- Default rules (5 checkboxes):
  1. No doxxing or harassment
  2. Seed at least 10% of content you consume
  3. Label NSFW content appropriately
  4. Respect anonymity boundaries
  5. No automated posting without Y-credit payment
- Custom rules textarea

#### Step 9: High Profile Connections
- Grid of 8 connection types (checkbox + name + @handle):
  - Actor, Celebrity, Athlete, Author, Musician, Influencer, Scientist, Developer
- "Verified connections receive a ✓ badge and boost pulse reach"

#### Step 10: Seeding & Launch
- Animated seed particles flowing to 3 orbiting nodes
- Progress bar: 0% → 100% over 3 seconds
- "No servers. Only seeds."
- [Launch My Forum →] amber button

### State Management
Full TypeScript interface tracking all form data across 10 steps.

### Step Transitions
Framer Motion `AnimatePresence`: exit `x: -20, opacity: 0` → enter `x: 0, opacity: 1`, 300ms

---

## 8. Login (`/login`)

### Layout (centered, max-width 400px)

```
SocialCircle.p2p
"The network is the people."

┌─ SIGN IN ──────────────────────────┐
│  [Profile URL] [Email] [Phone]     │
│                                    │
│  forums.socialcircle.p2p/ [____] │
│  OR                                │
│  Email: [______________________]   │
│  OR                                │
│  Phone: [+1 ___-___-____]         │
│                                    │
│  Password: [__________________]   │
│                                    │
│  [Sign In]                         │
│                                    │
│  ── or ──                          │
│  [🔵 Sign in with Google]          │
│                                    │
│  [Create Account]  [Forgot?]       │
└────────────────────────────────────┘
```

- Tabbed auth: Profile URL | Email | Phone
- Google Sign-In button
- Links to `/onboarding` and password reset

---

## 9. Forum Profile (`/:handle`)

### Layout: 3-Column Forum (max-width 1200px)

#### Forum Banner (~220px)
- **Left**: 150px square avatar (2px radius) with amber border + green glow
  - Status line, online dot, handle in JetBrains Mono
- **Right**: `"{Name}'s Forum"` in Space Grotesk 42px
  - Stats: Threads | Posts | Seeds | Joined date (11px mono)
  - **Bottom-right corner**: `U2U Messages | Edit Profile | Admin CP` (10px grey text links)
- Background: `--sp-canopy` with tiled retro texture OR custom gradient/image

#### AI Tolerance Indicator
- `🤖 AI Tolerance: 50% [Adjust ▼]`
- Slider 0-100%, shows cost multiplier
- Clawbot posts limited by this percentage

#### Translation Toggle
- `🌐 Auto-translated from Japanese [Original] [Settings]`
- Appears when viewing content in different language

#### Talk Box (Shoutbox)
- Collapsible, 1px border, 0px radius
- "📢 Talk Box" VT323 header + "Viewable by all | Posting restricted" badge
- Shout rows: `[avatar] Name » message [timestamp]`
- Input at bottom (if permission allowed)

#### Vblog Section
- "📹 VBLOG" header in VT323 14px uppercase, amber left border
- 4-column grid of video cards (2-col mobile)
- Each: 16/9 thumbnail with play overlay, duration badge, title, views + age
- 4 mock videos: Garden Tour (16:34), P2P Explained (08:12), Solar Beats (04:56), Day in Life (22:01)

#### Groupings → Topics (Expandable)
- 5 mock groupings: Important Notices, General Discussion, My Groups, Topics of Interest, Blogs/Videos/Wall
- Each grouping: VT323 14px uppercase header, 4px amber left border, topic count badge
- Topic rows: icon (📌/🔒/💬) + title + thread count + views + last activity + last thread preview
- Heterodox badge: `🔄 Viewpoint Diversity` on injected opposing-view content
- Click topic → thread list view

#### Thread List View
- Breadcrumb: `Forum > Grouping > Topic`
- Action bar: [New Thread +] [Subscribe] [📌 Sticky] [🔒 Lock]
- Thread rows: icon + title + author + replies + audience badge + pulse score + reactions
- Audience badges: 🌐 Public | 👥 Friends | 🌍 Greater Circle | 🔒 Circle | 👤 Anonymous
- Pagination: `[1] [2] [3] [Next]` square buttons

#### Thread Post View
- **Left column (160px)**: 80×80 square avatar, BBCode-rendered username, rank badge, post count, seed count, quality stars (★★★★☆), density bar (████████░░ 85%), 4-vector karma mini badges, credibility shield (🛡️ 95)
- **Right column**: Post # + timestamp + Quote/Report links, BBCode-rendered content, 4 reaction buttons (🔩M 💬S 💡I 🌱E), signature separator, animated signature
- **Reply Box**: BBCode textarea with Preview toggle + hint bar `[b] [i] [u] [url] [img] [quote] [code] [center] [spoiler]`

#### Left Sidebar (180px)
- "● ONLINE" header with count badge
- Friends grouped: 🟢 Online Now / 🟡 Recently Active / ⚪ Offline
- 20px square avatars

#### Right Sidebar (200px)
- "🌳 RANKED USERS" header
- Users listed by rank with custom rank name badges
- "Manage Ranks" button (owner only)
- Credibility summary

#### Groups Widget
- "👥 GROUPS" header with Create + and Search
- Your Groups + Discover sections
- Mock: Gardeners Guild (23), Solar Beats (18), Code Forest (31), Digital Artists (47), The Council (12, invite-only)

#### Lounges Section
- "🌙 INVISIBLE LOUNGES" purple border
- Owner-only, hidden member counts, password protected

#### Floating FAB
- Amber circle (56px) with "+"
- Menu: New Topic, Start Group, Create Lounge, Shout, Share Video, Blog Post

---

## 10. User Profile (`/@:handle`)

### Layout: Banner + Tabbed Interface

#### Banner
- 200px height with custom background (gradient/image/pattern)
- 150px square avatar + name + @handle + rank badge + bio

#### Tabs (sharp tab bar, amber top-border active):

**About Tab**:
- Bio text
- Profile fields with privacy indicators: 🎂 Birthday, 💕 Relationship, 📧 Email, 📍 Location, 📱 Phone
- Privacy: F=Friends, C=Circle, P=Public, A=Anonymous

**Relationship Section**:
```
💕 Relationship Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Polyamorous

Spouse(s):    @partner1
Fiancé(s):    @fiancé1, @fiancé2
Partner(s):   @partner2, @partner3, @partner4

(All partners listed equally — no hierarchy)
```
- Supports: Single, Partnered, Married, Engaged, It's Complicated, Polyamorous, Polygynous, Polyandrous

**Content Profiles Section**:
```
🎭 Content Profiles
┌─ Main ───────────┐ ┌─ Blogging ───────┐ ┌─ Vblogging ──────┐ ┌─ Anonymous ──────┐
│ [pic]              │ │ [pic]            │ │ [pic]            │ │ [pic]            │
│ @willow            │ │ @willow_blog     │ │ @willow_vlog     │ │ @night_owl       │
│ Public             │ │ Public           │ │ Public           │ │ Circle-only      │
└────────────────────┘ └────────────────────┘ └────────────────────┘ └────────────────────┘
```
- 3 Content Profiles + 1 Anonymous (nickname changeable once/year)

**4-Vector Karma (reputation bars, NOT wallet balances)**:
```
🔩 Material    [████████░░] 78%  💬 Social [██████████] 92%
💡 Innovation  [██████░░░░] 64%  🌱 Ecology  [███████░░░] 71%
```

**Credibility**: 🛡️ 95 (Verified)

**Action buttons**: [Add Friend] [Message] [View Forum] [Report]

**Posts Tab**: Recent posts/threads table

**Vblog Tab**: 4-video grid with play overlays

**Store Tab**:
- Personal products: Organic Seeds ($15E), Custom Art ($45E), P2P Kit ($120M)
- Service charge info per tier
- 🤖 Clawbot panel: Y-Credits: 450, Daily Posts: 3/5, AI Tolerance: 50%
- Karma → Y-Credit converter: 10 M/S/I/E = 1 Y

**Contact Tab**: Privacy-filtered contact methods

**Links Tab**: Website, Portfolio, GitHub, Bandcamp

**Connections Tab** (NEW):
```
✓ Verified Connections
🎬 Actor:        @actor_name       [Verified]
🎵 Musician:     @musician_name    [Verified]
💻 Developer:    @dev_name          [Verified]
```
- High-profile connections boost pulse reach

---

## 11. Pulse Feed (`/feed`)

### Layout: Single Column (max-width 680px)

#### Tag Filter Bar
- Horizontal pills: `[All] [#p2p] [#tech] [#solarpunk] [#music] [#art] [#intro] [#market] [#design] [#garden] [#crypto] [#heterodox]`
- Click to toggle (AND logic), amber bg when selected
- "Clear All" button

#### Pulsing Threads (Exactly 5 — no infinite scroll)
```
⚡ 89  📌 P2P Mesh Network v2.1 Released
     by @willow in Announcements • #p2p #tech
     Pulse: You ← River ← Aspen ← 12 others
     🔩 12M 💬 45S 💡 8I 🌱 23E  |  89 replies
```
- Pulse score: 0-50 grey, 51-100 amber, 100+ amber+glow
- Pulse path shows propagation chain
- 5 mock threads with scores 89, 67, 45, 34, 21
- 🔄 Heterodox badge on viewpoint-diversity injected content

#### Pulse Legend
> "⚡ = Pulse Score (hops × interactions). No AI. No algorithm. Just organic propagation + your tag choices."

#### Store Link
- "🛒 Visit the P2P Store → /store"

---

## 12. Discovery (`/explore`)

- **Search bar** with live preview
- **Tag cloud** with NSFW blur toggle
- **Random profile shuffle** with 3D flip card
- **Lighthouse map** — concentric pulse rings, peer dots, GPS beacon
- **Creator grid** — profile cards with hover effects

---

## 13. Encrypted Messenger (`/talk`)

- **Conversation list** with E2E lock badges, encryption status
- **Chat view**: moss-green sent / bark-brown received bubbles
- **Matrix rain** background at 5% opacity behind E2E messages
- **Self-destruct**: Orange countdown → text scramble → dissolve animation
- **Key fingerprint drawer**: Terminal-green fingerprint, QR code, verify trust
- **Composer**: Auto-expanding textarea, encryption toggle, self-destruct timer
- **Empty state**: "No servers. Only seeds." with encryption shield

---

## 14. Profile Builder (`/build`)

### Layout: 3-Panel

#### Top Toolbar
- Undo | Redo | Preview | Save
- Layout: Classic | Grid | Wide | Chaos
- Usage: Groups [████░░░░░░] 2/5 | Topics [██████░░░░] 3/25 | Lounges [█░░░░░░░░░] 1/10
- 📖 Reference toggle | 🎨 Theme Designer button

#### Left Panel: Toolbox (260px)
**Structure**: Grouping + | Topic + | Lounge + | Signature ✎ | Rank Editor
**Content**: About Me, Photo Album, Video Feed, Blog, Wall, Groups, Friends, etc.
**Utility**: Music, Custom HTML, Ad Block, Status, Forum Stats
**Archived**: Stored widgets that can be restored

#### Center: Canvas (Live Preview)
- Widgets stack vertically with drag handles
- Framer Motion `Reorder.Group` for drag-to-reorder
- Ghost placeholder on drag
- Delete: shrink + fade (300ms)
- Collapse: height animate (250ms)
- Add: slide in from bottom

#### Right Panel: Properties (Contextual)
- Common: title, border, background, padding, visibility
- Widget-specific: upload zones, grid selectors, code editors
- Rank Editor: custom rank names, colors, icons

#### HTML & BBCode Reference Panel
5 sections: HTML Tags, CSS Properties, BBCode Syntax, Animations, Color Palette
- JetBrains Mono code samples
- Click-to-copy
- Full quick-reference for profile customization

#### Theme Designer Modal
- Background: Solid | Gradient | Image | Pattern
- Content boxes: opacity, border style/color
- Typography: heading font, body font, accent color
- Live preview
- Save/Reset

---

## 15. P2P Store (`/store`)

### Layout: Tabbed (Browse | Your Store | Transactions)

#### Browse Tab
- Search bar + Category dropdown + Sort dropdown
- 4-column product grid (8 mock products)
- Each product: image placeholder, title, price (in M/S/I/E), seller @handle, [Buy] button

#### Income-Based Service Tiers
| Annual Income | Tier | Charge | Badge |
|---------------|------|--------|-------|
| $0-$500 | 🌱 Seedling | 2% |
| $501-$2K | 🌿 Sprout | 3.5% |
| $2K-$10K | 🍃 Sapling | 5% |
| $10K-$50K | 🌳 Canopy | 7% |
| $50K+ | 🌲 Redwood | 10% |

Richer profiles pay higher percentage. Funds network infrastructure.

#### Escrow System
1. Buyer clicks [Buy] → funds held in escrow
2. Seller ships/delivers
3. Buyer confirms → funds released to seller
4. If dispute → RSV arbitration (peers with high credibility vote)
5. Service charge deducted from seller's received amount

---

## 16. Settings (`/settings`)

9-panel control center with left navigation:

1. **Profile Faces** — 3 profile types (Public/Content/Anonymous) with visibility toggles
2. **Encryption** — E2E toggle, key fingerprint, self-destruct defaults, recovery keys
3. **Chunks & Backup** — Network health diagram, storage used, redundancy, re-seed button
4. **Friends & Circles** — Circle CRUD, drag-to-circle, mutual reveal toggle, requests
5. **Privacy** — Per-face visibility matrix, interaction settings, block list, account deletion
6. **Notifications** — Channel toggle matrix, quiet hours
7. **Appearance** — Dark/Solar Meadow/System theme, accent color, font size, motion toggle
8. **Network & P2P** — Peer status, lighthouse radius, DHT nodes, bandwidth, seeding ratio
9. **Developer** — Export data, JSON editor, cache clear, debug network map, terminal

---

## 17. XMB Rank System

### Power Hierarchy (Customizable Names)
| Code | Power | Default | Example Custom |
|------|-------|---------|----------------|
| SA | Forum Owner | Super Admin | 🌿 Grove Keeper |
| A | Full Moderation | Admin | 🍂 Branch Elder |
| SM | Section Moderation | Super Mod | 🛡️ Seed Guardian |
| M | Topic Moderation | Mod | 🌱 Sprout Guide |
| U | Standard Member | User | 👤 Seedling |

- Each forum owner can rename ranks, set colors, choose icons
- Rank badges displayed everywhere: posts, friend lists, online users
- Manageable through Rank Editor in builder

---

## 18. Karma 4-Vector (M-S-I-E)

### Displayed as 4 Reputation Bars (NOT Wallet Balances)
```
🔩 Material    [████████░░] 78%  💬 Social [██████████] 92%
💡 Innovation  [██████░░░░] 64%  🌱 Ecology  [███████░░░] 71%
```

### Dimensions:
- **🔩 Material (M)**: Hosting, bandwidth, storage contribution
- **💬 Social (S)**: Community engagement, friendship, events
- **💡 Innovation (I)**: Content creation, widget building, code, design
- **🌱 Ecology (E)**: Seeding, P2P uptime, helping friends backup

### Rules:
- INCOMMENSURABLE — never summed to scalar
- Shown as percentile bars, not numbers
- Tooltip: "Your Material contribution exceeds 78% of peers"
- No leaderboards

### Spendable (with the SITE only):
- More groups, more topics, more lounges
- Boost visibility
- Traffic preference during congestion
- Rewards for seeding over leeching

### Compensation (Separate, Spendable):
- `Comp: 1.2K` displayed in navbar
- Earned through specific labor (storage hours, bandwidth)
- Subject to demurrage (~90 day decay)
- Used for: tips, store purchases, system privileges

---

## 19. Y-Dimension (Clawbots/AI)

### What is a Clawbot?
An AI agent attached to a biological user's account. It can:
- Browse profiles and forums
- Interact with posts (react, limited post)
- Join groups (with Y-credit payment)
- Engage in limited conversation

### Clawbot Rules:
1. **Must be attached to a biological account** — no standalone AI accounts
2. **Posts are LIMITED** — AI can only interact as much as it's willing to pay vs. what users tolerate
3. **Y-dimension required** — Clawbots operate on Y-credits, not M/S/I/E
4. **User's posts prioritized** — biological posts always rank above AI posts in pulse

### Y-Credit System:
**Earning:** Biological user trades M/S/I/E karma → converts to Y-credits for their Clawbot
- Conversion: 10 M/S/I/E karma = 1 Y-credit
- Non-transferable between users

**Spending:**
- Browse profiles: 0.1 Y/page
- React to post: 0.5 Y/react
- Join group: 5 Y/group
- Post in forum: 10 Y/post (max 5/day per forum)
- Boost visibility: 20 Y/boost
- Priority during congestion: 50 Y/hour

**Display:** `🤖 Clawbot: Active | Y-Credits: 450 | Daily Posts: 3/5`

### AI Posting Limitations:
- Clawbot posts tagged with 🤖 indicator
- Users set "AI Tolerance" on their forum: 0-100%
- If tolerance is 50%, Clawbot pays 50% more Y-credits
- Users can ban specific Clawbots
- Clawbot posts NEVER appear in pulse feed unless explicitly allowed

---

## 20. Credibility System

### Formula:
- **Karma balance** (35%) — well-rounded = higher
- **Tenure** (15%) — account age + consistency
- **Post quality** (25%) — RSV peer-validated
- **Peer attestations** (25%) — RSV endorsements

### Display:
- `🛡️ 95 (Verified)` — shield + score + label
- Color: 0-25 red, 26-50 amber, 51-75 green, 76-100 emerald
- Per-forum AND per-group
- "On Willow's Grove: 🛡️ 92" vs "On River's Forum: 🛡️ 67"

### Use:
- Governance voting weight
- Dispute resolution
- Lounge access thresholds
- Verified seller badge (requires >75)

---

## 21. Pulse Algorithm

### How It Works:
```
You post → Friends see it (Pulse = 1)
  → Friends interact
    → THEIR friends see it (Pulse = 2)
      → Those friends interact
        → THEIR friends see it (Pulse = 3)
          → STOPS. Max 3 hops.
```

### Pulse Score = hops_traveled × interactions_per_hop
- 0-10: No indicator (quiet)
- 11-50: `⚡` grey
- 51-100: `⚡` amber
- 100+: `⚡` amber + pulsing glow

### Why It's Not Addictive:
- Fixed 5 threads shown (no infinite scroll)
- No autoplay
- No AI recommendation — just pulse score + explicit tag filtering
- Explicit tag choices control what you see
- "No AI. No algorithm. Just organic propagation + your tag choices."

---

## 22. Audience & Propagation

| Audience | Icon | Reach | Propagation |
|----------|------|-------|-------------|
| Public | 🌐 | Anyone | Friends notified, free propagation |
| Friends | 👥 | Direct friends | No further propagation |
| Greater Circle | 🌍 | Friends of friends | 2-hop cascade then stops |
| Circle | 🔒 | Specific group | No propagation |
| Anonymous | 👤 | No identity | Respects audience reach |

**Greater Circle** is the key P2P propagation layer — controlled cascade, not viral infection.

---

## 23. BBCode & Rich Text

### Full BBCode Support:
```
[b]bold[/b] [i]italic[/i] [u]underline[/u] [s]strikethrough[/s]
[color=#hex]text[/color] [size=N]text[/size]
[url=https://...]link[/url] [img]url[/img]
[quote=author]text[/quote] [code]code[/code]
[center]text[/center] [spoiler]text[/spoiler]
[list][*]item[*]item[/list]
```

### Rich Text Editor Toolbar:
`[B] [I] [U] [S] | [Quote] [Code] | [Link] [Image] | [Left] [Center] [Right] | [BBCode]`

- WYSIWYG / BBCode toggle
- Live preview of rendered output
- Used in: thread replies, new thread composer, signatures

### BBCode Username Rendering:
- Willow: `[color=#52b788][b]Willow[/b][/color]`
- River: `[color=#00bcd4][b]River[/b][/color]`
- Jade: `[color=#95d5b2][b]Jade[/b][/color]`

---

## 24. Auto-Translation & Subtitles

### Universal Translation:
- ALL text content auto-translated to viewer's language preference
- Default: browser language
- 50+ languages supported
- 🌐 icon indicates auto-translated content

### BBCode No-Translate:
```
[notranslate]This stays in original language[/notranslate]
[nolang=ja]このテキストは日本語のままです[/nolang]
```

### Video Subtitles:
- All uploaded videos get auto-generated subtitles
- Subtitles translated to viewer's language in real-time
- Options: "Show original + translated" or "Translated only"
- Chinese video → English CC, Japanese vlog → English subtitles

### Forum Interface Translation:
- Entire UI auto-translates
- User can toggle "Show original English terms"
- Translation quality indicator: submit better translations → earn I-karma

---

## 25. Advertising & Affiliate System

### Site Philosophy: NO Direct Advertising
- SocialCircle.P2P will NEVER show platform-level ads
- No tracking, no targeting, no data selling
- Revenue comes from P2P store service charges only

### User-Placed Advertising:
- Users CAN place ads on their OWN forum pages
- Ad blocks are widgets in the profile builder
- Users control: what ads show, where they appear, who sees them
- Ad revenue goes TO THE USER, not the platform

### Affiliate Promotion Strategy:
- Users cross-promote each other's content/platforms
- "🔗 Check out @river's P2P Kit Store →" — inline in posts
- Affiliate links are organic, word-of-mouth
- Best strategy: "I'll promote your store if you promote my vlog"
- Pulse algorithm favors mutual promotion

### BBCode for Affiliate Links:
```
[affiliate=@river]P2P Starter Kit - $120M[/affiliate]
→ Renders as: "🔗 River's P2P Starter Kit — $120M [Affiliate Link]"
```

---

## 26. Forum Structure & Limits

| Feature | Max | At Limit |
|---------|-----|----------|
| Groupings | 5 | Grey out, lock icon |
| Topics | 25 | "New Topic" disabled |
| Lounges | 10 | Grey out, lock icon |

### Hierarchy:
```
Profile (Forum)
└── Grouping (Category)
    └── Topic (Sub-forum)
        └── Thread (Conversation)
            └── Post (with signature)
```

### Overflow: Archived Widgets
- Archived content doesn't display but remains in builder
- Can be restored by freeing a slot

---

## 27. Vblog System

- Every profile has a video blog section
- Video cards: 16/9 thumbnail, play overlay, duration badge, title, views + age
- Privacy: Public | Friends | Subscribers Only | Private
- 4 mock videos on each profile

---

## 28. Groups Widget

- **Your Groups**: Already a member, can leave
- **Discover**: Public groups by tag, can join
- **Create Group**: Name + description + tags + visibility
- **Search**: Text search across group names
- Mock: Gardeners Guild, Solar Beats, Code Forest, Digital Artists, The Council

---

## 29. Animated Signatures

Every post shows the author's signature below a dashed separator:

**Types:**
- **Marquee**: Scrolling text banner (`~ 🌿 Super Admin of Willow's Grove ~`)
- **Status Pulse**: Pulsing green dot + status text
- **Stats Bar**: Posts/seeds/quality display
- **Custom HTML**: Freeform with CSS animations

**Constraints:**
- Max 120px height
- Max 3 lines text
- CSS animations: marquee, pulse, fade, slide

---

## 30. MySpace-Style Customization

### Background Options:
- Solid color
- Gradient (2-3 color stops, direction)
- Image (upload/URL, tile/stretch/cover)
- Pattern (dots, stripes, grid)
- Animated (subtle CSS)

### Profile Layout Modes:
- Classic: Sidebar + main column
- Grid: Bento masonry
- Wide: Full-width stacked
- Chaos: Freeform absolute positioning

### Theme Designer (in Builder):
- Background type + settings
- Content box opacity + border style
- Typography: heading font, body font, accent color
- Live preview

---

## 31. Polyamory & Relationships

### Relationship Types (All Supported):
| Type | Description |
|------|-------------|
| Single | Not in any relationship |
| Partnered | In a committed partnership |
| Married | Legally or culturally married |
| Engaged | Planning to marry/partner |
| It's Complicated | Undefined or evolving |
| Polyamorous | Multiple consensual relationships |
| Polygynous | Multiple female partners (consensual) |
| Polyandrous | Multiple male partners (consensual) |

### Rules:
- Users can list MULTIPLE partners without hierarchy
- Spouse(s), Fiancé(s), Partner(s) are separate fields
- No "ranking" of partners — all listed equally
- Partners must confirm the connection (RSV validation)
- Connections appear on both profiles
- Privacy per relationship: Public, Friends, Circle, Private

---

## 32. Custom Profile URLs

Every user gets a permanent custom URL:
```
forums.socialcircle.p2p/Jalankc
forums.socialcircle.p2p/willow_03
forums.socialcircle.p2p/river_code
```

### URL Rules:
- 3-30 characters
- Alphanumeric + underscore + hyphen
- Case-insensitive
- No reserved words: admin, root, api, system, test, null
- No consecutive hyphens or underscores
- Must start with letter

### URL as Login:
- User can log in with URL instead of email/phone
- Visiting `forums.socialcircle.p2p/username` goes directly to their forum
- `/@username` is an alias
- URLs are PERMANENT

---

## 33. Heterodox Content Injection

### Philosophy:
To prevent echo chambers, a portion of every user's feed is deliberately from opposing viewpoints.

### Implementation:
1. User declares political affiliation (optional)
2. System injects 15-20% of feed from heterodox sources
3. Injected content is:
   - Fact-checked against multiple sources
   - From credible users (credibility > 50)
   - Tagged with `#heterodox` and 🔄 badge
   - Never more than 20% of total feed

### User Control:
- Can toggle: On/Reduced (10%)/Off
- If Off, user loses ability to appear in others' heterodox feeds
- Reduced mode: 10% instead of 20%

---

## 34. P2P Store & Service Charges

### Store Features:
- Browse products by category
- Each listing: photo, title, price (M-S-I-E or Compensation), seller, [Buy]
- Escrow system: buyer pays → held → seller delivers → buyer confirms → release

### Income-Based Service Tiers:
| Income | Tier | Charge | Badge |
|--------|------|--------|-------|
| $0-$500 | 🌱 Seedling | 2% |
| $501-$2K | 🌿 Sprout | 3.5% |
| $2K-$10K | 🍃 Sapling | 5% |
| $10K-$50K | 🌳 Canopy | 7% |
| $50K+ | 🌲 Redwood | 10% |

Richer profiles pay higher percentage. Funds network infrastructure.

### Dispute Resolution:
- RSV arbitration — peers with high credibility vote
- Weighted by voter credibility

---

## 35. Organic Reach & Connection Weight

### How Famous Connections Work:
- Your famous friend (10K followers) interacts with your post
- THEIR 10K followers get it in their pulse queue (Pulse = 2)
- Massive organic reach without algorithms
- But: interaction from high-Social, low-Material user carries LESS weight

### Connection Weight:
- High-credibility user interaction = 10x propagation boost
- Per-dimension: high-Social booster's like increases Social reach, not Material
- Credibility is contextual — varies by forum and group

### Dimensional Imbalance Penalty:
- S-only accumulation (fame-chasing) = lower pulse priority
- "⚠️ Dimensional imbalance detected" warning
- Chunk service priority degrades

---

## 36. RSV Moderation

### Recursive Signal Verification:
- All moderation decisions verified through recursive peer signals
- No central moderation team
- Peers validate content quality, dispute resolution, rank assignments
- Weighted by credibility

### Content Moderation:
- NSFW content toggleable per user
- RSV-based flagging system
- Forum-specific rules set by Super Admin
- Invisible lounges for sensitive content

---

## 37. Security & Encryption

### Visible Encryption:
- **E2E badges** on every encrypted conversation
- **Matrix rain** at 5% opacity in chat backgrounds
- **Key fingerprint drawer**: terminal-green verification
- **Self-destruct messages**: countdown → scramble → dissolve
- **Lock pulse rings**: infinite glow animation on secure content

### Encryption Options:
- End-to-end: Signal Protocol
- Self-destruct timer: 5s, 30s, 1m, 5m, 1h
- Persistent or ephemeral mode
- Key storage: device-only, no server

---

## 38. Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7.2.4 |
| Styling | Tailwind CSS 3.4.19 |
| UI Components | shadcn/ui (40+ components) |
| Animation | Framer Motion + GSAP |
| Smooth Scroll | Lenis |
| Icons | Lucide React |
| Routing | React Router (HashRouter) |
| State | React Context + Hooks |
| Storage | IndexedDB (local) |
| P2P (Phase 2) | WebRTC Data Channels + DHT |
| Platform | PWA (Progressive Web App) |

---

## 39. File Structure

```
src/
├── components/
│   ├── ui/              # shadcn components (40+)
│   ├── Navbar.tsx       # XMB crossbar nav (32px, VT323)
│   ├── Footer.tsx       # Network stats + manifesto
│   └── Layout.tsx       # Page wrapper + transitions
├── pages/
│   ├── Home.tsx         # Landing page (7 sections)
│   ├── Onboarding.tsx   # 10-step account creation wizard
│   ├── Login.tsx        # Multi-method login page
│   ├── Profile.tsx      # Forum profile (hierarchy, threads, BBCode, vblog, AI tolerance, translation)
│   ├── UserProfile.tsx  # @username profile (6 tabs + Connections, relationships, clawbot)
│   ├── Feed.tsx         # Pulse feed (5 threads, hashtag filter, heterodox)
│   ├── Explore.tsx      # Discovery (search, tags, lighthouse)
│   ├── Talk.tsx         # Encrypted messenger (E2E, self-destruct)
│   ├── Build.tsx        # Profile builder (drag-drop, theme, HTML ref, rank editor)
│   ├── Store.tsx        # P2P marketplace (browse, escrow, tiers)
│   └── Settings.tsx     # Control center (9 panels)
├── sections/home/       # Landing page sections
├── App.tsx              # Routes (HashRouter)
├── main.tsx             # Entry point
└── index.css            # Global styles + CSS tokens
public/
├── hero-canopy.jpg
├── profile-retro-bg.jpg
├── avatar-default.jpg
└── solar-punk-ui-texture.png
```

---

## 40. Version History
| v8 | 2026-05-02 | Chain-letter pulse propagation, post-count auto-ranks, content advisory system, signature editor, personal Clawbot settings |

| Version | Date | Key Changes |
|---------|------|-------------|
| v1 | — | Initial scaffold, landing page |
| v2 | — | Added sub-pages: feed, explore, talk, settings |
| v3 | — | Thread view with avatars, signatures, 4-currency, quality/density |
| v4 | — | Forum hierarchy: Groupings → Topics → Threads, animated signatures, audience selector |
| v5 | — | Custom ranks, M-S-I-E karma, Greater Circle, pulse algorithm, hashtag filtering, groups |
| v6 | — | Rich text BBCode editor, vblog, @username profiles, P2P store, credibility, MySpace backgrounds, HTML reference, theme designer |
| **v7** | **2026-05-02** | **10-step onboarding wizard, login page, Clawbots/Y-dimension, auto-translation, polyamory, custom URLs, heterodox content, high-profile connections, forum rule book** |

---

## Core Pages Summary

| Page | URL | What It Does |
|------|-----|--------------|
| **Landing** | `/` | Solarpunk hero, chunk network, encryption manifesto |
| **Onboarding** | `/onboarding` | 10-step account creation: ToS, credentials, profile, preferences, relationships, seeding |
| **Login** | `/login` | Profile URL / Email / Phone / Google sign-in |
| **Forum** | `/:handle` | Full forum: banner, talk box, vblog, groupings→topics→threads, BBCode posts, AI tolerance, translation |
| **Profile** | `/@:handle` | 7 tabs: About, Posts, Vblog, Store, Contact, Links, Connections |
| **Feed** | `/feed` | 5 pulsing threads + hashtag filter + heterodox injection |
| **Explore** | `/explore` | Search, tags, random profiles, lighthouse |
| **Talk** | `/talk` | E2E encrypted messenger with self-destruct |
| **Build** | `/build` | WYSIWYG + code builder, theme designer, HTML/BBCode reference, rank editor |
| **Store** | `/store` | P2P marketplace with income-based service charges |

---

*SocialCircle.P2P — No servers. Only seeds.*


---

## Appendix: v8 Additions (Chain Pulse, Auto-Ranks, Content Advisory, Personal AI)

### A. Post-Count Auto-Ranks (XMB Style)

In addition to custom SA/A/SM/M/U ranks, each user has an auto-rank based on post count:

| Posts | Auto-Rank | Icon |
|-------|-----------|------|
| 0 | Seedling | 🌱 |
| 1-9 | Sprout | 🌿 |
| 10-49 | Seedling Scout | 🍃 |
| 50-99 | Growing | 🌾 |
| 100-249 | Established | 🌲 |
| 250-499 | Senior Member | 🏛️ |
| 500-999 | Elder | 👑 |
| 1000-2499 | Ancient One | 🦉 |
| 2500+ | Living Archive | 📜 |

- Displayed next to custom rank: `[🌿 Grove Keeper] [🌲 Established]`
- Progress bar shows progress to next rank
- In post author columns, user profile, online users

### B. Chain-Letter Pulse Propagation

No hard 3-hop limit. Content propagates like a chain letter:

```
Hop 1: Cost 0Y  (free, your friends)
Hop 2: Cost 1Y  (friend-of-friend)
Hop 3: Cost 2Y
Hop 4: Cost 4Y
Hop 5: Cost 8Y
Hop 6: Cost 16Y
Hop 7: Cost 32Y
Hop 8: Cost 64Y
Hop 9: Cost 128Y
Hop 10: Cost 256Y
```

Cost doubles each hop. Chain stops naturally when cost exceeds willingness.

**Decay (Unturning):**
- 0-24h: 🔥 Hot — stays in all queues
- 24-48h: 🌡️ Cooling — removed from 50% of queues
- 48-72h: ❄️ Cold — removed from 90% of queues
- 72h+: 💀 Expired — fully decayed, removed from all

**Viral Badges:**
- Hop 5+: 🌊 "Wave"
- Hop 8+: 🌊🌊 "Tsunami"

**Demurrage from decay funds the network infrastructure.**

### C. Content Advisory System

NOT content rating — content advisory. Users set what visitors should know.

**Age Gates:** No restriction / 13+ / 16+ / 18+ / Custom
**Content Tags:** Strong Language, Mature Themes, NSFW, Violence, Political, Religious, Controversial, Educational, Art/Nudity, Mental Health, Substance Use, Gambling
**Custom Warning:** Freeform text field
**Profile Restrictions:** Everyone / Age 13+ / Age 16+ / Age 18+ / Friends / Circle / Verified only
**NSFW Handling:** Encrypt for underage / Hide / Show with warning

### D. Signature Editor

Located at: **Settings → Profile → Signature**
Also accessible: click your own signature on any post → "✎ Edit Signature"

Three modes: Text (BBCode), HTML (code editor), Animation Presets (Marquee, Fade, Pulse, Slide)
Live preview, max 120px height, max 3 lines.

### E. Personal Clawbot (Your AI)

- **Name it**: Default "Clawbot" but customizable (Clover, Scout, Echo, etc.)
- **Personality**: Friendly, Analytical, Creative, Sarcastic, Silent
- **Approval Modes**: Manual / Semi-Auto / Auto-Pilot (requires cred > 75)
- **Y-Credit System**: 10 M/S/I/E karma = 1 Y-credit for your Clawbot
- **Cannot**: Post without approval, access encrypted messages, spend your karma, operate unattached
- **Located at**: Settings → Clawbot tab

---

*Updated 2026-05-02 for v8 release*
