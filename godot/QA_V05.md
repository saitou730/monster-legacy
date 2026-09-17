# Godot Pixel Vertical Slice v0.5 — Locked Art QA

## Editor smoke
1. Open `godot/project.godot` in Godot 4.x.
2. Confirm `scenes/main.tscn` loads `scripts/main_v05.gd` without parser/import errors.
3. Run at the portrait base viewport and verify no missing-resource errors for `assets/fire/*` or `assets/wind_bat/*`.

## Field -> battle
1. Move with arrows/WASD or touch D-pad.
2. Enter tall grass while moving.
3. Confirm the encounter transition completes and battle opens.
4. Confirm the enemy identity reads `SP-011 火トカゲ` and the party lead reads `SP-031 風コウモリ`.

## SP-011 火トカゲ lock checks
- Idle uses the exact mirrored `fire/idle.png` raster.
- Enemy attack visibly switches idle -> attack -> idle.
- Hit reaction uses the exact governed hit raster with no new anatomy frame.
- At <=30 HP, danger uses the exact danger raster with reduced hover amplitude only: no flashing, no body scale pulse.
- No recolor, redraw, eye change, silhouette edit or synthesized in-between frame is visible.

## SP-031 風コウモリ lock checks
- Idle uses the exact mirrored `wind_bat/idle.png` raster.
- COMMAND temporarily uses the governed attack raster and returns to idle.
- Hit reaction uses the governed hit raster.
- STANCE briefly uses the governed stance raster and settles back to idle while guard remains active.
- At <=30 HP, danger uses the governed danger raster with reduced hover amplitude.
- No anatomy deformation or synthesized in-between character frame is visible.

## Battle feel
1. COMMAND still gives a forward impulse, impact pause, shake and particles.
2. Two COMMAND uses exhaust the turn allowance.
3. STANCE reduces the next enemy hit and resets after NEXT TURN.
4. Enemy KO still drops/fades and can return to field.
5. No button requires scrolling at 390x844.

## Source integrity
Compare `godot/assets/fire/SOURCE_LOCK.json` and `godot/assets/wind_bat/SOURCE_LOCK.json` against canonical paths/hashes before promotion. The mirrored PNG files must remain exact binary copies of the canonical runtime rasters.

## Known v0.5 boundary
SP-031's canonical 500 ms attack timing is not yet claimed exact. v0.5 preserves the already-prototyped 340 ms teaching/action timing while using the canonical frame order/proportions. Tune to the exact motion contract only after a real Godot editor run confirms the current feel and import behavior.

## Promotion gate
Do not merge/promote from source inspection alone. Required sequence:
`Godot editor PASS -> desktop feel PASS -> Android touch PASS -> locked-art visual comparison PASS`.

Root Web runtime, Pages workflow, Web save schema and Issue #103 mechanics must remain unchanged.
