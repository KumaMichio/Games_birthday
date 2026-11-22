# A Street Full of Memories

A personalized, browser-based 3D narrative adventure built with React Three
Fiber. Full design document: `a_street_full_of_memories_GDD_v1.1.md`.

## Status

**Week 1 milestone — playable character in a 3D environment.** ✅
**Vertical slice (GDD §15) — one complete quest loop.** ✅

- Vite + React + R3F + Rapier scaffold; greybox street with entrance,
  shops, plaza, hidden garden, and hill; third-person ecctrl character
  with drag-to-rotate orbit camera (no pointer lock, per GDD §10.11)
- Interaction system: proximity targeting + `[E]` prompt (registry in
  `src/systems/InteractionSystem.js`)
- Data-driven dialogue trees with branching choices, conditional entry
  rules per NPC, and side-effect actions (`src/data/dialogues.json`)
- Quest system with objectives, duplicate-reward guards, journal UI
- Inventory + collectibles (the little blue flower in the hidden garden)
- Memory system: discovery card overlay + memory album with locked slots
- Full slice playable: meet Lily → accept quest → find flower → return →
  quest complete → memory discovered → album updated

All memory/personal text is **placeholder** pending real content (GDD §18).

Next: save system, more NPCs + quests, chapter progression, real assets
(see GDD §12 roadmap and §17.2 implementation order).

## Requirements

- Node.js 20+ (developed on Node 24)
- A WebGL2-capable desktop browser (Chrome, Edge, Firefox, Safari)

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server (prints a local URL)
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Controls

| Input | Action |
|---|---|
| W / A / S / D or arrows | Move |
| Shift (hold) | Run |
| Space | Jump |
| Left-drag mouse | Rotate camera |
| Scroll wheel | Zoom camera |

## Project structure

Follows GDD §10.3:

```
src/
  app/        App shell (menu ↔ game phases)
  game/       Canvas, scene composition, shared config
  world/      Street greybox, lighting
  entities/   Player (ecctrl + follow camera)
  systems/    (Week 3+) interaction, quests, dialogue, saves
  stores/     Zustand game state
  ui/         Menu, HUD (later: dialogue, journal, album)
  styles/     CSS
```

## Conventions

- All personal/memory content uses **clearly labeled placeholders** until the
  real content is supplied (GDD §17.1.10, §18).
- Third-party assets must be logged in `ASSETS.md` (GDD §10.6).
- One physics world (`@react-three/rapier`); no hand-rolled collision
  (GDD §10.8).
- Game state lives in Zustand stores, not in visual components (GDD §17.3).
