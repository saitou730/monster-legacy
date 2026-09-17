# Godot Pixel Vertical Slice v0.3 — QA

## Editor smoke test
1. Open `godot/project.godot` in Godot 4.x.
2. Run the project.
3. Confirm portrait viewport and no parser/runtime errors.
4. Move with arrows/WASD.
5. Confirm the placeholder player visibly walks and changes directional read.
6. Enter a tall-grass patch while moving and confirm the encounter transition fires.

## Battle feel test
1. Confirm both monsters slide into the arena and idle-bob.
2. Tap COMMAND once.
3. Confirm the player lunges forward before impact.
4. Confirm the enemy flashes, the contact briefly hit-stops, the arena shakes, hit particles appear, and HP decreases once.
5. Tap COMMAND a second time and confirm COMMAND reaches 0/2.
6. Confirm further COMMAND taps do not deal damage until NEXT TURN.
7. Activate STANCE and confirm the panel shows STANCE ON.
8. Tap NEXT TURN and confirm the enemy lunges, player flashes, particles/shake occur, reduced damage is applied, COMMAND resets to 2/2 and STANCE resets.
9. Defeat FIRE LIZARD and confirm it drops/fades instead of disappearing instantly.
10. Tap COMMAND after the KO message and confirm return to the field.

## Mobile touch test
- D-pad accepts touch and drag.
- COMMAND, STANCE, NEXT TURN, and RUN hit areas respond at 390x844.
- No button requires scrolling.
- Encounter transition does not leave the D-pad held.

## Regression guard
- Root Web runtime is unchanged.
- GitHub Pages deployment is unchanged.
- Web save schema is unchanged.
- Issue #103 canonical mechanics remain untouched.
- Placeholder sprites are not treated as official Art Lock assets.

## Promotion rule
Do not merge/promote the Godot lane based on source inspection alone. Record an actual Godot editor PASS first, followed by Android touch QA before considering this prototype a replacement candidate.
