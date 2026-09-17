# MONSTER LEGACY — Godot Pixel Vertical Slice

This directory is a **parallel Godot prototype**. The canonical public Web runtime remains at repository root and is not replaced by this work.

## Goal
Build a portrait-first 2D pixel RPG vertical slice with the warmth/readability of the GBA monster-RPG era while preserving MONSTER LEGACY's own identity, systems, Art Lock, and mobile-first controls.

Target slice:

`HOME -> FIELD -> ENCOUNTER -> BATTLE -> RESONANCE/JOIN -> RETURN`

## Engine baseline
- Godot 4.x
- Base viewport: `390 x 844` portrait
- Stretch mode: `viewport` + `keep`
- Pixel texture filtering: nearest on the root CanvasItem
- Compatibility renderer first for broad Android/Web export coverage

## Current v0.3 playable prototype
- Opens through `project.godot`
- Main scene: `scenes/main.tscn`
- Active runtime script: `scripts/main_v03.gd`
- Previous v0.2 script retained as `scripts/main.gd` for reference
- QA checklist: `QA_V03.md`
- Keyboard field movement: arrows / WASD
- Touch field movement: lower-left D-pad
- Animated code-drawn field with route, side path, pond/bridge landmark, shrine, trees and tall grass
- Four-step placeholder walk cadence and directional character read
- Grass and foliage sway
- Short deterministic grass dwell triggers an encounter transition
- Battle intro slide-in for both sides
- Enemy/player idle bob animation
- Enemy/player HP bars and hit flash feedback
- COMMAND attack lunge
- Hit-stop on contact
- Battle shake
- Pixel hit particles
- Enemy KO drop/fade presentation
- Two COMMAND points per turn
- STANCE guard reducing the next enemy strike
- NEXT TURN enemy lunge/impact and turn reset
- RUN returns to the field with encounter cooldown
- Mouse/keyboard battle controls for desktop checking plus touch buttons for mobile

**Important:** every current character/monster block sprite is a non-canonical placeholder. Do not promote it as official species art. Bind exact approved Pixel Master assets when available.

## What v0.3 proves
The Godot lane now demonstrates both the basic loop and a first combat-feel pass:

`FIELD MOVEMENT -> TALL GRASS -> ENCOUNTER -> BATTLE INTRO -> COMMAND LUNGE -> HIT-STOP/SHAKE/PARTICLES -> STANCE/NEXT -> KO -> RETURN`

This intentionally stops before claiming canonical RESONANCE/JOIN, save migration, or official art integration. Those require explicit design/asset authority and should not be faked with placeholders.

## Next implementation order
1. Run v0.3 in Godot 4.x and fix any editor/runtime errors before promotion.
2. Replace programmatic environment blocks with a real TileMap/TileSet pipeline.
3. Bind an approved protagonist Pixel Master sprite sheet with four-direction idle/walk animation.
4. Replace temporary battle silhouettes with exact approved MONSTER LEGACY Pixel Master sprites.
5. Split field/battle into dedicated scenes once the v0.3 runtime is verified.
6. Implement the canonical three-monster presentation and exact `2 COMMAND + remaining 1 STANCE` selection grammar instead of the current single-lead teaching mock.
7. Add SFX/BGM hooks after visual timing is verified.
8. Add RESONANCE/JOIN only after the canonical Chapter/Fun Gate authority allows it.
9. Add save adapter only after an explicit migration contract is approved; do not silently replace the Web save schema.
10. Add Android export profile and physical-device QA.

## Asset pipeline
Recommended authority chain:

`Concept -> Official Design Sheet -> Art Lock -> Pixel Master Sprite -> Sprite Sheet -> Godot import`

Once a Pixel Master is approved, treat the exact source asset as immutable and derive animation frames from it rather than asking an image model to redraw the species from scratch.

## Governance
- `main` is canonical source of truth.
- Issue #103 remains the current canonical Fun Gate.
- Godot work stays under `godot/` until separately promoted.
- Do not change root Pages deployment/workflows from this lane.
- Preserve Art Lock and existing gameplay invariants.

## Verification boundary
Repository diff and source consistency can be checked from GitHub. A Godot editor/device runtime PASS is not claimed until the project is actually opened and run in Godot 4.x. Use `QA_V03.md` as the promotion checklist.

Refs: #38 #103 #107 #108
