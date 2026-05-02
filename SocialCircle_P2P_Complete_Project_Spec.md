# SocialCircle.P2P — Complete Project Specification

**Version**: v6.0 (Pulse Economy Edition)
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
7. [Forum Profile (`/:handle`)](#7-forum-profile)
8. [User Profile (`/@:handle`)](#8-user-profile)
9. [Pulse Feed (`/feed`)](#9-pulse-feed)
10. [Discovery (`/explore`)](#10-discovery)
11. [Encrypted Messenger (`/talk`)](#11-encrypted-messenger)
12. [Profile Builder (`/build`)](#12-profile-builder)
13. [P2P Store (`/store`)](#13-p2p-store)
14. [Settings (`/settings`)](#14-settings)
15. [XMB Rank System](#15-xmb-rank-system)
16. [Karma 4-Vector (M-S-I-E)](#16-karma-4-vector-m-s-i-e)
17. [Credibility System](#17-credibility-system)
18. [Pulse Algorithm](#18-pulse-algorithm)
19. [Audience & Propagation](#19-audience--propagation)
20. [BBCode & Rich Text](#20-bbcode--rich-text)
21. [Four-Currency Economy (Deprecated)](#21-four-currency-economy-deprecated)
22. [Forum Structure & Limits](#22-forum-structure--limits)
23. [Vblog System](#23-vblog-system)
24. [Groups Widget](#24-groups-widget)
25. [Animated Signatures](#25-animated-signatures)
26. [MySpace-Style Customization](#26-myspace-style-customization)
27. [P2P Store & Service Charges](#27-p2p-store--service-charges)
28. [Organic Reach & Connection Weight](#28-organic-reach--connection-weight)
29. [RSV Moderation](#29-rsv-moderation)
30. [Security & Encryption](#30-security--encryption)
31. [Technology Stack](#31-technology-stack)
32. [File Structure](#32-file-structure)
33. [Version History](#33-version-history)

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
├── Content Profile (creator face)
├── Anonymous Profile (nickname face)
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
- **Material** (M): Tangible contribution — hosting, bandwidth, storage
- **Social** (S): Community connection — engagement, friendship, events
- **Innovation** (I): Creative contribution — content, widgets, code, design
- **Ecology** (E): Network health — seeding, uptime, helping others backup

**Rules**:
- Dimensions are INCOMMENSURABLE — never sum them into a scalar
- Karma is REPUTATION — non-transferable, per-user, peer-validated
- Karma accrues through CONTRIBUTION, not purchase

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
| `/:handle` | Forum Profile | Forum home — groupings, topics, threads, talk box |
| `/@:handle` | User Profile | Detailed profile — About, Posts, Vblog, Store, Contact, Links |
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

---

## 6. Landing Page (`/`)

### Sections (Top to Bottom):
1. **Hero Canopy** — Full-screen forest canopy image, "No servers. Only seeds." headline, CTAs
2. **Chunk Network Visualization** — Interactive SVG showing P2P mesh (center node, friend nodes, connection lines, seed particles)
3. **Builder Teaser** — FrontPage-style builder preview with widget mockups
4. **Three Faces** — Cards showing Public Profile, Content Profile, Anonymous Profile
5. **Encryption Manifesto** — "Trust, but verify" with matrix rain background
6. **Community CTA** — Stats (12,847 nodes, 4.2M seeds, ∞ freedom, 0 servers) + testimonials

---

## 7. Forum Profile (`/:handle`)

### Layout: 3-Column Forum (max-width 1200px)

#### Forum Banner (~220px)
- **Left**: 150px square avatar (2px radius) with amber border + green glow
  - Status line, online dot, handle in JetBrains Mono
- **Right**: `"{Name}'s Forum"` in Space Grotesk 42px
  - Stats: Threads | Posts | Seeds | Joined date (11px mono)
  - **Bottom-right corner**: `U2U Messages | Edit Profile | Admin CP` (10px grey text links)
- Background: `--sp-canopy` with tiled retro texture

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
- **Reply Box**: BBCode textarea with Preview toggle + hint bar

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

## 8. User Profile (`/@:handle`)

### Layout: Banner + Tabbed Interface

#### Banner
- 200px height with custom background
- 150px square avatar + name + @handle + rank badge + bio

#### Tabs (sharp tab bar, amber top-border active):

**About Tab**:
- Bio text
- Profile fields with privacy indicators: 🎂 Birthday, 💕 Relationship, 📧 Email, 📍 Location, 📱 Phone
- Privacy: F=Friends, C=Circle, P=Public, A=Anonymous
- 4-Vector Karma bars (reputation, NOT spendable)
- Credibility score: 🛡️ 95 (Verified)
- Action buttons: [Add Friend] [Message] [View Forum] [Report]

**Posts Tab**: Recent posts/threads table

**Vblog Tab**: 4-video grid with play overlays

**Store Tab**:
- Personal products: Organic Seeds ($15E), Custom Art ($45E), P2P Kit ($120M)
- Service charge info per tier

**Contact Tab**: Privacy-filtered contact methods

**Links Tab**: Affiliated links — Website, Portfolio, GitHub, Bandcamp

---

## 9. Pulse Feed (`/feed`)

### Layout: Single Column (max-width 680px)

#### Tag Filter Bar
- Horizontal pills: `[All] [#p2p] [#tech] [#solarpunk] [#music] [#art] [#intro] [#market] [#design] [#garden] [#crypto]`
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

#### Pulse Legend
> "⚡ = Pulse Score (hops × interactions). No AI. No algorithm. Just organic propagation + your tag choices."

#### Store Link
- "🛒 Visit the P2P Store → /store"

---

## 10. Discovery (`/explore`)

- **Search bar** with live preview
- **Tag cloud** with NSFW blur toggle
- **Random profile shuffle** with 3D flip card
- **Lighthouse map** — concentric pulse rings, peer dots, GPS beacon
- **Creator grid** — profile cards with hover effects

---

## 11. Encrypted Messenger (`/talk`)

- **Conversation list** with E2E lock badges, encryption status
- **Chat view**: moss-green sent / bark-brown received bubbles
- **Matrix rain** background at 5% opacity behind E2E messages
- **Self-destruct**: Orange countdown → text scramble → dissolve animation
- **Key fingerprint drawer**: Terminal-green fingerprint, QR code, verify trust
- **Composer**: Auto-expanding textarea, encryption toggle, self-destruct timer
- **Empty state**: "No servers. Only seeds." with encryption shield

---

## 12. Profile Builder (`/build`)

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

## 13. P2P Store (`/store`)

### Layout: Tabbed (Browse | Your Store | Transactions)

#### Browse Tab
- Search bar + Category dropdown + Sort dropdown
- 4-column product grid (8 mock products)
- Each product: image placeholder, title, price (in M/S/I/E), seller @handle, [Buy] button

#### Income-Based Service Tiers
| Annual Income | Tier | Charge | Badge |
|---------------|------|--------|-------|
| $0-$500 | Seedling | 2% | 🌱 |
| $501-$2K | Sprout | 3.5% | 🌿 |
| $2K-$10K | Sapling | 5% | 🍃 |
| $10K-$50K | Canopy | 7% | 🌳 |
| $50K+ | Redwood | 10% | 🌲 |

Richer profiles pay higher percentage. Funds network infrastructure.

---

## 14. Settings (`/settings`)

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

## 15. XMB Rank System

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

## 16. Karma 4-Vector (M-S-I-E)

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

### Compensation (Separate, Spendable):
- `Comp: 1.2K` displayed in navbar
- Earned through specific labor (storage hours, bandwidth)
- Subject to demurrage (~90 day decay)
- Used for: tips, store purchases, system privileges

---

## 17. Credibility System

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

## 18. Pulse Algorithm

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

## 19. Audience & Propagation

| Audience | Icon | Reach | Propagation |
|----------|------|-------|-------------|
| Public | 🌐 | Anyone | Friends notified, free propagation |
| Friends | 👥 | Direct friends | No further propagation |
| Greater Circle | 🌍 | Friends of friends | 2-hop cascade then stops |
| Circle | 🔒 | Specific group | No propagation |
| Anonymous | 👤 | No identity | Respects audience reach |

**Greater Circle** is the key P2P propagation layer — organic, controlled, 2-hop maximum.

---

## 20. BBCode & Rich Text

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

## 21. Four-Currency Economy (Deprecated in v5+)

The original 🌱 Support / 😜 Prank / 🛒 Trade / ✨ Digital system was replaced in v5+ by the IVS-aligned **Karma 4-Vector (M-S-I-E)** as reputation + **Compensation** as spendable layer.

---

## 22. Forum Structure & Limits

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

## 23. Vblog System

- Every profile has a video blog section
- Video cards: 16/9 thumbnail, play overlay, duration badge, title, views + age
- Privacy: Public | Friends | Subscribers Only | Private
- 4 mock videos on each profile

---

## 24. Groups Widget

- **Your Groups**: Already a member, can leave
- **Discover**: Public groups by tag, can join
- **Create Group**: Name + description + tags + visibility
- **Search**: Text search across group names
- Mock: Gardeners Guild, Solar Beats, Code Forest, Digital Artists, The Council

---

## 25. Animated Signatures

Every post shows the author's signature below a dashed separator:

**Types:**
- **Marquee**: Scrolling text banner (`~ 🌿 Super Admin of Willow's Grove ~`)
- **Status Pulse**: Pulsing green dot + status text
- **Stats Bar**: Posts/seeds/quality display
- **Custom HTML**: Freeform with CSS animations

**Constraints:**
- Max 120px height
- Max 3 lines text
- CSS animations allowed: marquee, pulse, fade, slide

---

## 26. MySpace-Style Customization

### Background Options:
- Solid color
- Gradient (2-3 color stops, direction)
- Image (upload/URL, tile/stretch/cover)
- Pattern (dots, stripes, grid)
- Animated (subtle CSS)

### Profile Layout Modes:
- **Classic**: Sidebar + main column
- **Grid**: Bento masonry
- **Wide**: Full-width stacked
- **Chaos**: Freeform absolute positioning

### Theme Designer (in Builder):
- Background type + settings
- Content box opacity + border style
- Typography: heading font, body font, accent color
- Live preview

---

## 27. P2P Store & Service Charges

### Store Features:
- Browse products by category
- Each listing: photo, title, price (M-S-I-E or Compensation), seller, [Buy]
- Escrow system: buyer pays → held in escrow → seller delivers → buyer confirms → release

### Service Tiers (Progressive — richer pay more):
| Income | Tier | Charge |
|--------|------|--------|
| $0-$500 | 🌱 Seedling | 2% |
| $501-$2K | 🌿 Sprout | 3.5% |
| $2K-$10K | 🍃 Sapling | 5% |
| $10K-$50K | 🌳 Canopy | 7% |
| $50K+ | 🌲 Redwood | 10% |

### Dispute Resolution:
- RSV arbitration — peers with high credibility vote
- Weighted by voter credibility

---

## 28. Organic Reach & Connection Weight

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

## 29. RSV Moderation

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

## 30. Security & Encryption

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

## 31. Technology Stack

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

## 32. File Structure

```
src/
├── components/
│   ├── ui/              # shadcn components (40+)
│   ├── Navbar.tsx       # XMB crossbar nav (32px, VT323)
│   ├── Footer.tsx       # Network stats + manifesto
│   └── Layout.tsx       # Page wrapper + transitions
├── pages/
│   ├── Home.tsx         # Landing page (7 sections)
│   ├── Profile.tsx      # Forum profile (hierarchy, threads, BBCode, vblog)
│   ├── UserProfile.tsx  # @username profile (6 tabs, store, karma)
│   ├── Feed.tsx         # Pulse feed (5 threads, hashtag filter)
│   ├── Explore.tsx      # Discovery (search, tags, lighthouse)
│   ├── Talk.tsx         # Encrypted messenger (E2E, self-destruct)
│   ├── Build.tsx        # Profile builder (drag-drop, theme, HTML ref)
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

## 33. Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v1 | — | Initial scaffold, landing page |
| v2 | — | Added sub-pages: feed, explore, talk, settings |
| v3 | — | Thread view with avatars, signatures, 4-currency, quality/density |
| v4 | — | Forum hierarchy: Groupings → Topics → Threads, animated signatures, audience selector |
| v5 | — | Custom ranks, M-S-I-E karma, Greater Circle, pulse algorithm, hashtag filtering, groups |
| **v6** | **2026-05-02** | **Rich text BBCode editor, vblog, @username profiles, P2P store, credibility, MySpace backgrounds, HTML reference, theme designer, organic reach** |

---

## Core Pages Summary

| Page | URL | What It Does |
|------|-----|--------------|
| **Landing** | `/` | Solarpunk hero, chunk network, encryption manifesto |
| **Forum** | `/:handle` | Full forum: banner, talk box, vblog, groupings→topics→threads, BBCode posts, animated signatures |
| **Profile** | `/@:handle` | About, Posts, Vblog, Store, Contact, Links tabs with karma bars and credibility |
| **Feed** | `/feed` | 5 pulsing threads + hashtag filter, no infinite scroll |
| **Explore** | `/explore` | Search, tags, random profiles, lighthouse map |
| **Talk** | `/talk` | E2E encrypted messenger with self-destruct |
| **Build** | `/build` | WYSIWYG + code builder, theme designer, HTML/BBCode reference |
| **Store** | `/store` | P2P marketplace with income-based service charges |
| **Settings** | `/settings` | 9-panel control center |

---

*SocialCircle.P2P — No servers. Only seeds.*
