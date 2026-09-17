# MONSTER LEGACY — Godot Pixel Vertical Slice

This directory is a **parallel Godot prototype**. The canonical public Web runtime remains at repository root and is not replaced by this work.

## Goal
Build a portrait-first 2D monster RPG vertical slice with the warmth/readability of the GBA era while preserving MONSTER LEGACY's own identity, systems, Art Lock, and mobile-first controls.

Current target slice:

`FIELD -> TALL GRASS -> ENCOUNTER -> BATTLE -> RETURN`

## Engine baseline
- Godot 4.x
- Base viewport: `390 x 844` portrait
- Stretch mode: `viewport` + `keep`
- Pixel-friendly nearest filtering on the root CanvasItem
- Compatibility renderer first for broad Android/Web export coverage

## Current v0.5
- Main scene: `scenes/main.tscn`
- Active runtime: `scripts/main_v05.gd`
- Prior prototype layers retained as `main.gd`, `main_v03.gd`, `main_v04.gd`
- QA: `QA_V05.md`
- Keyboard: arrows / WASD
- Touch: lower-left D-pad plus battle buttons
- Animated code-drawn field with route, side path, pond/bridge landmark, shrine, trees and tall grass
- Placeholder protagonist walking cadence and directional read
- Grass and foliage sway
- Deterministic grass dwell -> encounter transition
- Battle intro slide-in, idle motion, HP bars, impact pause, shake, particles and KO presentation
- Two COMMAND points per turn
- STANCE guard reducing the next enemy strike
- NEXT TURN enemy action + turn reset
- RUN returns to the field

## Locked battle identities now integrated
### SP-011 火トカゲ — enemy
Godot mirrors the exact canonical runtime rasters under `godot/assets/fire/`:
- idle
- attack
- hit
- danger
- stance

`assets/fire/SOURCE_LOCK.json` records governing paths/hashes. The enemy uses exact governed rasters and runtime translation/hover only. Its canonical attack presentation is aligned to the 140 ms idle -> 170 ms attack -> 250 ms settle contract. DANGER uses reduced hover amplitude with no body scale pulse.

### SP-031 風コウモリ — party lead
Godot mirrors the exact canonical runtime rasters under `godot/assets/wind_bat/`:
- idle
- attack
- hit
- danger
- stance

`assets/wind_bat/SOURCE_LOCK.json` records governing paths/hashes. COMMAND, hit, STANCE and DANGER states now draw the governed character rasters instead of the old temporary blue block monster.

The v0.5 teaching attack still preserves the earlier 340 ms prototype action window. The canonical SP-031 500 ms attack contract is intentionally not claimed exact until the project is run in Godot and the feel/import behavior is verified.

## Current playable prototype loop
`FIELD MOVEMENT -> TALL GRASS -> ENCOUNTER -> SP-031 vs SP-011 -> COMMAND / STANCE / NEXT -> KO -> RETURN`

## Art boundary
The two battle monsters above now use locked MONSTER LEGACY assets. The **field protagonist and environment are still code-drawn placeholders**, so this is not yet a finished pixel-art slice and should not be described as Ruby/Sapphire-level visual completion.

Do not redraw, recolor, reinterpret, change eyes/silhouettes, or synthesize new anatomy frames for locked species. Runtime translation, hover and small recoil are permitted only where their motion specs allow them.

## Next implementation order
1. Run v0.5 in Godot 4.x and fix parser/import/runtime issues before promotion.
2. Replace programmatic environment blocks with a real TileMap/TileSet pipeline.
3. Create/approve a true protagonist Pixel Master + 4-direction walk sheet.
4. Tune SP-031 timing to its exact motion contract after first runtime feel pass.
5. Split field and battle into dedicated scenes.
6. Expand battle from the single-lead teaching mock toward the canonical three-monster presentation while preserving `2 COMMAND + remaining 1 STANCE`.
7. Bind existing SFX/BGM through Godot AudioStreamPlayer nodes after visual timing is verified.
8. Add RESONANCE/JOIN only when canonical progression authority allows it.
9. Add save adapter only after an explicit migration contract is approved.
10. Add Android export profile and physical-device QA.

## Asset pipeline
`Concept -> Official Design Sheet -> Art Lock -> governed runtime raster / approved Pixel Master -> Sprite Sheet -> Godot import`

Once a source is approved, preserve exact identity and derive only allowed runtime motion rather than asking an image model to redraw the species from scratch.

## Governance
- `main` remains canonical source of truth.
- Issue #103 remains the canonical Fun Gate.
- Godot stays isolated under `godot/` until separately accepted/promoted.
- Root Pages deployment/workflows, Web save schema and #103 mechanics are untouched.

## Verification boundary
Repository diff/source integrity can be checked in GitHub. A Godot editor/device runtime PASS is **not claimed** until `godot/project.godot` is actually opened and run in Godot 4.x. Use `QA_V05.md` as the promotion checklist.

Refs: #38 #103 #107 #108
