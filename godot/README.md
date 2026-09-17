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

## Current v0.2 playable prototype
- Opens through `project.godot`
- Main scene: `scenes/main.tscn`
- Runtime script: `scripts/main.gd`
- Keyboard field movement: arrows / WASD
- Touch field movement: lower-left D-pad
- Code-drawn pixel field with route, trees, shrine marker and tall-grass encounter zones
- Short deterministic grass dwell triggers an encounter transition
- Battle screen is playable with programmatic temporary monster silhouettes
- Enemy/player idle bob animation
- Enemy/player HP bars and hit flash feedback
- COMMAND attack button with two command points per turn
- STANCE guard button reducing the next enemy strike
- NEXT TURN resolves the enemy action and resets the turn grammar
- RUN returns to the field with encounter cooldown
- Mouse/keyboard battle controls for desktop checking plus touch buttons for mobile

**Important:** every current character/monster block sprite is a non-canonical placeholder. Do not regenerate or reinterpret locked official monster designs to fill the prototype. Bind exact approved Pixel Master assets when they are available.

## What v0.2 proves
The Godot lane now has a complete first interaction loop rather than a static mock:

`FIELD MOVEMENT -> TALL GRASS -> ENCOUNTER TRANSITION -> BATTLE -> COMMAND/STANCE/NEXT -> RETURN TO FIELD`

This intentionally stops before claiming canonical RESONANCE/JOIN, save migration, or official art integration. Those require explicit design/asset authority and should not be faked with placeholders.

## Next implementation order
1. Replace programmatic environment blocks with a real TileMap/TileSet pipeline.
2. Bind an approved protagonist Pixel Master sprite sheet with four-direction idle/walk animation.
3. Replace the temporary battle silhouettes with exact approved MONSTER LEGACY Pixel Master sprites.
4. Expand battle presentation with short attack/hit/KO clips, screen shake, hit-stop, particles and SFX hooks.
5. Implement the canonical three-monster presentation and the exact `2 COMMAND + remaining 1 STANCE` selection grammar instead of the current single-lead teaching mock.
6. Add RESONANCE/JOIN only after the canonical Chapter/Fun Gate authority allows it.
7. Add save adapter only after an explicit migration contract is approved; do not silently replace the Web save schema.
8. Add Android export profile and physical-device QA.

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
Repository diff and source consistency can be checked from GitHub. A Godot editor/device runtime PASS is not claimed until the project is actually opened and run in Godot 4.x.

Refs: #38 #103 #107 #108
