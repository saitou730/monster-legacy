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

Godot's documentation recommends configuring portrait projects through Display > Window and describes `viewport` scaling as rendering to the fixed base viewport before scaling to the target display, which is a good baseline for deliberate pixel-art presentation.

## Current v0.1
- Opens through `project.godot`
- Main scene: `scenes/main.tscn`
- Runtime script: `scripts/main.gd`
- Keyboard: arrows / WASD
- Touch: lower-left D-pad
- Placeholder field, grass, trees, player, and HUD are drawn in code

**Important:** placeholder drawing is not canonical character/monster art. Do not regenerate or reinterpret locked official monster designs to fill this prototype. Bind exact approved assets when they are available.

## Next implementation order
1. Replace programmatic environment blocks with a real TileMap/TileSet pipeline.
2. Add locked protagonist sprite sheet with 4-direction idle/walk animation.
3. Add encounter zones and deterministic test encounter.
4. Add a separate battle scene preserving `NEXT` turn-start lock, exactly 3 monsters, exactly 2 COMMAND + remaining 1 STANCE.
5. Bind official locked monster sprites as sprite sheets; never regenerate them at runtime.
6. Add short attack / hit / KO animation clips, screen shake, hit-stop, particles, and SFX hooks.
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

Refs: #38 #103 #107
