# Thunder Owl runtime handoff — 2026-09-09

## Preflight
- Canonical branch: `main`.
- Current Work gate: `QA-CHAPTER1-FULL-JOURNEY`; no Chapter 1 art blocker is recorded in `production/next_queue.yaml`.
- Art supply manifest still lists HOME/FUSION LAB/JOIN as future supply, but the production gate explicitly favors runtime fixes over repeated near-identical regeneration.
- This run therefore advances an already Official-Art-Locked monster rather than generating an unrequested raster.

## Target
- Species: SP-044 雷フクロウ (Thunder Owl)
- Intended future use: next-AREA discovery / HUNT / battle presentation; exact AREA placement remains gameplay-owned and is NOT canonized here.
- Art Lock: inherited Official Art Lock; no reinterpretation.
- Governing source: `assets/reference/雷フクロウ_CHARACTER_DESIGN_BIBLE_ML-001_v1.1.png`
- Existing runtime assets: `assets/battle/owl/idle.png`, `attack_prep.png`, `attack.png`, `hit.png`, `danger.png`, `stance.png`, `icon_portrait.png`.
- Planned new raster path: NONE.
- Work dependency: runtime may bind these existing files only after next-AREA placement is approved. Root runtime/public workflow are untouched by Art.

## Runtime motion contract v0.1
All motion is transform/opacity/FX around the locked raster. Never redraw anatomy, eyes, plumage, silhouette, or palette.

| State | Frame/source order | Timing | Loop | Anchor | Motion note |
|---|---|---:|---|---|---|
| IDLE | idle | 1100 ms cycle | yes | 50% x / 78% y | hover `y: 0 -> -3 -> 0 px`; tiny `rotate: 0 -> -0.6 -> 0 deg`; no scale pulse |
| ATTACK_PREP | idle -> attack_prep | 90 + 170 ms | no | 50% / 78% | pull back 4 px and lower 2 px; hold silhouette before release |
| ATTACK | attack_prep -> attack -> idle | 90 + 130 + 150 ms | no | 50% / 78% | forward 10 px / up 3 px then settle; optional 1-frame lightning flash behind body, never over eyes |
| HIT | hit -> idle | 120 + 170 ms | no | 50% / 78% | knockback 7 px; rotation <= 1.2 deg; no squash/stretch |
| DANGER | danger | 820 ms cycle | yes | 50% / 78% | hover amplitude reduced to 1 px; 60 ms micro-shiver once per cycle; no glow pumping |
| STANCE | stance | 980 ms cycle | yes | 50% / 78% | nearly fixed body; <=1 px vertical drift; sparse rear lightning pulse allowed every second cycle |

## Encounter / discovery presentation
- Start from `idle.png`; do not create a separate reveal illustration.
- Entry: 180 ms opacity 0 -> 1 with 6 px downward-to-anchor settle.
- Background response: one restrained cool luminance pulse behind the silhouette, <=160 ms. No full-screen white flash.
- Discovery readability: hold the monster still for >=420 ms before actionable UI appears.
- HUNT readability: preserve clear negative space around wings/head; no foreground particles crossing the face or eyes.
- Portrait/icon: use existing `icon_portrait.png`; do not crop a second icon unless runtime QA proves it unreadable at target size.

## Visual prohibitions
- No rounder/cuter eye reinterpretation.
- No glossy uniform AI highlight pass.
- No additional feathers/horns/accessories/symbols.
- No evolution-stage framing; SP-044 remains its own species.
- No silhouette-changing squash/stretch.
- No lightning effect that hides the body read or changes the locked palette.

## Art Director QA
**PASS — specification/handoff.** The contract uses only assets already bound in `canon/visual_source_map.yaml`, introduces no new raster, and preserves the Official Art Lock. Runtime implementation remains pending and must be checked at 360x800 / 390x844 / 430x932 before calling the motion game-implemented.

## Status
- 制作中: runtime binding (Work side), not raster production.
- レビュー待ち: next-AREA gameplay placement + viewport runtime QA.
- Visual Lock済み: motion vocabulary and encounter treatment in this handoff.
- Official Art Lock済み: SP-044 inherited source/assets; unchanged.
- 実装待ち: runtime animation/encounter binding.
- ゲーム実装済み: existing static SP-044 assets only; this motion contract is not yet implemented.

## Next art queue
1. If Chapter 1 produces a concrete visual blocker, service it first.
2. Otherwise specify the same no-redesign runtime/encounter contract for 裂空マンティコア using only its existing locked assets.
3. Only after next-AREA gameplay roles are known, identify missing species roles and begin a genuinely new species at CONCEPT; never fill unknown SP IDs speculatively.
