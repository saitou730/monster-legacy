# AREA 1 Monster Runtime Supply — Art Run

Date: 2026-09-09
Base: main `4fe1ee0f244eba54cb74c90738ef36deb06447e3`
Branch: `art/area1-monster-runtime-plan`
Status: VISUAL/RUNTIME PLANNING PASS

## Why this run moved to monsters
Chapter 1 P00-P20 is now implemented/browser-PASS on main and Work's current task is full-journey QA. No new character raster is blocking that QA. Per Art Supply policy, this run therefore moves to monster supply instead of generating another environment candidate.

## Canon constraints checked
- `canon/character_registry.yaml`: unknown IDs remain `source_recovery_required_DO_NOT_INVENT`; do not fill the 200 slots by invention.
- `canon/visual_source_map.yaml`: existing official/source-bound species remain the governing visual sources.
- No reinterpretation of SP-001, SP-011, SP-018, SP-031, SP-044, SP-071, SP-191 or other Official Art Lock material.

## AREA 1 usable ecosystem inventory
Use the already governed species first:
- SP-011 Fire Lizard — early active attacker / FUSION parent.
- SP-031 Wind Bat — HUNT/JOIN tutorial species / evasive aerial silhouette / FUSION parent.
- SP-071 Leaf Rabbit — grounded light silhouette and non-fire/non-air party contrast.
- SP-191 Thorn Boar — AREA Boss / mastery source; never normalize its boss mass into a regular small-monster silhouette.
- SP-018 Flame Wing Lizard — independent FUSION-result species; never present as a simple evolution frame of Fire Lizard.

This is enough to define an AREA 1 gameplay-facing monster set without inventing missing registry IDs. New unnamed species are HOLD until source/design authority exists.

## Runtime art gap decision
The existing battle derivatives for governed species are static state rasters. Do not regenerate them. The next useful Art deliverable is an animation contract that lets Work add motion while preserving the locked rasters.

### Motion contract v0.1
Applies first to Fire Lizard, Wind Bat, Leaf Rabbit and Flame Wing Lizard. Thorn Boar uses the same timing vocabulary but a heavier amplitude profile.

**Anchor:** bottom-center foot/contact point for grounded species; body-center projected to a fixed bottom-center battle slot for flying species. Work must not animate by changing the canonical crop per frame.

**IDLE** — loop: yes
1. canonical idle, 160 ms
2. +1–2% vertical body offset / breathing squash only, 160 ms
3. canonical idle, 160 ms
4. -1% offset / recovery, 160 ms
Total 640 ms. No anatomy redraw required; transform-based runtime motion preferred.

**ATTACK** — loop: no
1. canonical idle hold, 80 ms
2. attack anticipation: 4–7% reverse offset, 90 ms
3. canonical attack raster at forward peak, 110 ms
4. attack raster recovery, 90 ms
5. canonical idle, 120 ms
Total 490 ms.

**HIT** — loop: no
1. canonical hit raster, 90 ms
2. 3–5% recoil opposite attacker, 70 ms
3. canonical hit raster, 70 ms
4. canonical idle, 120 ms
Total 350 ms. Do not add facial expressions not present in source.

**DANGER** — loop: yes
1. canonical danger raster, 180 ms
2. 1% low-frequency tremor/vertical compression, 140 ms
3. canonical danger raster, 180 ms
Total 500 ms. Avoid rapid flashing.

**STANCE** — loop: yes, restrained
1. canonical stance raster, 220 ms
2. 1–2% weight shift, 180 ms
3. canonical stance raster, 220 ms
Total 620 ms.

### Species motion differentiation
- Fire Lizard: grounded, quick anticipation and recovery; tail/body transform as one locked silhouette unless authored frames exist.
- Wind Bat: continuous small vertical hover; attack moves on a shallow diagonal, not a ground lunge.
- Leaf Rabbit: short compressed anticipation; no generic bat hover or lizard sway.
- Flame Wing Lizard: broader but slower wing/body travel than Wind Bat; preserve its independent-species mass.
- Thorn Boar: 60–70% of the positional amplitude above, longer anticipation (+40 ms) and stronger single recoil; weight over speed.

## Planned paths / Work dependency
No binary replacement in this branch. Proposed metadata handoff path for Work: `assets/battle/animation_manifest.json` or equivalent runtime data file chosen by Work. Art does not modify root runtime.

Work dependency: implement transform/timing motion around existing locked rasters first. Only request new authored raster frames when runtime QA proves transforms insufficient.

## Art Director QA
PASS for specification / implementation handoff.
- Duplicate generation: none.
- Official design changes: none.
- Unknown species invention: none.
- Portrait/UI risk: low; transforms are bounded to <=7% travel.
- Animation metadata includes order, timing, loop and anchor.

## State
- 制作中: none requiring new raster.
- レビュー待ち: runtime motion implementation by Work.
- Visual Lock済み: AREA 1 five-species ecosystem role split and motion vocabulary.
- Official Art Lock済み: inherited existing governed species only; no new lock declared.
- 実装待ち: animation contract metadata/runtime binding.
- ゲーム実装済み: existing static battle rasters and Chapter 1 species usage; motion contract not yet implemented.

## Next Art queue
1. Check Work full-journey QA for any visual blocker.
2. If none, prepare exact per-species runtime animation manifest values from existing asset paths.
3. Only after AREA 1 runtime motion is usable, evaluate whether AREA 2 needs a new species concept; do not invent a source-missing named/unnamed registry slot.