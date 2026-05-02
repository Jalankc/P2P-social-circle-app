# SocialCircle.P2P — Master Build Plan

## Vision
A solarpunk-reimagined P2P social platform: the bastard child of MySpace, XMB forums, and Microsoft FrontPage. Users own their data, carry chunks of friends' data, and build custom profiles via a hybrid block+code builder. No central servers — the users are the beast.

## Platform Strategy
- **PWA (Progressive Web App)** — single codebase, installable on any device, instant updates, WebRTC-ready
- **Capacitor wrap** for app stores in Phase 2 (not in prototype)
- **React + TypeScript + Vite + Tailwind CSS + shadcn/ui** base stack

## Architecture Decisions
- **P2P**: WebRTC data channels for live peer mesh; IndexedDB for local storage; visual chunk dashboard simulates the distributed backup graph (production-grade chunk replication across social graph is Phase 2)
- **Lighthouse**: Minimal WebSocket signaling server for initial peer discovery; GPS/local proximity concept visualized in UI
- **Themes**: Dark ("Bioluminescent Forest") + Light ("Solar Meadow"), user-switchable
- **Builder**: Hybrid toggle — "Garden View" (blocks) and "Root View" (raw HTML/CSS with live preview)
- **Profiles**: 3 per user — Public Profile, Content Profile, Anonymous Profile
- **Chunking Logic**: Local backup → chunked to friends → friends redistribute to their friends. Offline = retrievable from the mesh.

## Build Stages

---

### Stage 1 — Design PRD & Architecture
**Orchestrator writes:**
- `/mnt/agents/output/design.md` — full visual design system, color tokens, typography, component specs, animations
- `/mnt/agents/output/architecture.md` — data models, state management, P2P flow, screen inventory

**Skill loaded:** `vibecoding-webapp-swarm`

---

### Stage 2 — Foundation & Shell
**Sub-agents build in parallel:**
- PWA scaffold (React + Vite + TS + Tailwind)
- Theme engine (dark/light solarpunk tokens)
- XMB-style crossbar navigation shell
- Routing & screen scaffold
- IndexedDB/local persistence layer
- PWA manifest + service worker

---

### Stage 3 — Core Screens (Parallel Swarm)
All screens built as functional, navigable, with simulated data:

**Agent A — Profile System & Builder**
- 3-profile creation/management
- Hybrid profile builder (Garden View + Root View)
- Profile viewing (public/content/anonymous)
- Photo albums, music player, video feed blocks

**Agent B — Social Graph & Feed**
- Friend requests, mutuals, circles
- Activity feed / global feed
- Comment walls
- Discovery (search, tags, "people you may know")

**Agent C — Forums & Communication**
- XMB-style forum boards + threads
- Encrypted DM UI (E2E visual treatment, key exchange animation)
- Group chat UI
- Message preferences (ephemeral vs persistent)

**Agent D — P2P Dashboard & Network**
- Network Pulse visualizer (mesh graph, seeders, leechers)
- Chunk dashboard (what you're hosting, what's backed up)
- Local/GPS discovery UI ("Lighthouse Beacon")
- Settings & preferences panel

---

### Stage 4 — P2P & Data Layer Integration
- WebRTC peer connection layer
- Simulated chunking engine (visualizes the friend-redistribution model)
- Local backup/restore flow
- Content moderation (NSFW toggle)
- User-curated ad block placeholders

---

### Stage 5 — Polish, Effects & Deploy
- Page transitions & animations
- Glow effects, bioluminescent accents (dark mode)
- Solar/golden accents (light mode)
- Sound effects for interactions (optional)
- Final integration testing
- Deploy to static hosting

---

## MVP Screen Inventory
1. **Welcome / Onboarding** — "Join the Circle" solarpunk intro
2. **Profile Creator** — choose profile type, pick theme
3. **Profile Builder** — hybrid block/code editor
4. **My Profile (Public)** — view as others see it
5. **Content Profile** — creator-focused view
6. **Anonymous Profile** — nickname-based posting identity
7. **XMB Home Dashboard** — crossbar nav landing
8. **Grove (Friends)** — friend list, circles, requests
9. **Feed** — global + friends activity
10. **Forums** — XMB-style boards & threads
11. **Messages** — encrypted DM list + chat view
12. **Network Pulse** — P2P mesh visualization
13. **Settings** — preferences, privacy, themes, encryption opts
14. **Discovery** — find users, tags, local beacon

## Key Design Principles
- **Every user is a node** — visualize this everywhere
- **Chaos is a feature** — allow sublime customization freedom
- **Privacy by design** — encryption visible, user controls everything
- **Solarpunk ≠ sterile** — lush, organic, warm, alive
- **Retro-future** — XMB/MySpace nostalgia reimagined with modern usability

## Output
- Deployed PWA URL
- Source code in `/mnt/agents/output/socialcircle-p2p/`
