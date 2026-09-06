# MONSTER LEGACY — Runtime Architecture v0.7

## Goal
v0.7 unifies the previously separated presentation build and first-fusion Vertical Slice into one continuous runtime while moving the codebase toward an engine-style architecture.

## Player flow
STORY → BOSS 1 → HUNT → JOIN → PARTY → FUSION → NEW SPECIES TEST → BOSS REPLAY

## Runtime layers
### Presentation / Scene layer
- `index.html`
- `styles/app.css`
- scene ids: `home`, `story`, `hunt`, `party`, `fusion`, `test`, `boss`

### Domain systems
- `src/battle.js` — boss turn rules, VOLTAGE banding, mastery evaluation
- `src/fusion.js` — deterministic recipe preview/execution, two-parent HERITAGE, lineage history
- `src/test_battle.js` — post-fusion combat validation rules

### Data
- `src/data.js` — runtime Vertical Slice data
- `data/MONSTER_LEGACY_game_data_v4.1.json` — wider content schema / migration source

### Persistence
- `src/storage.js` — save state, equipment loadout, fusion record, test completion

### Presentation services
- `src/audio.js` — adaptive audio buses and events
- `src/playtest.js` — local-only test telemetry
- `src/app.js` — scene orchestration and DOM presentation

## Locked gameplay contract
- Portrait 9:16
- party size 3
- exactly 2 COMMAND each turn
- unselected unit becomes STANCE
- NEXT ACTION locks at turn start and only refreshes after resolution
- fusion result is deterministic
- one HERITAGE from each parent
- parents are consumed; equipment / LEGACY CORE are returned
- growth echo ratio remains 0.6

## v0.7 integration boundary
The domain systems are now separated enough that a future Unity client can replace the DOM presentation without redesigning Fusion / Test / Battle rules.
