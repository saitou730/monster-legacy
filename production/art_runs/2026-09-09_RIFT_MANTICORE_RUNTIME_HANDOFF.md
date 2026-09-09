# Rift Manticore runtime handoff — 2026-09-09

## Preflight / production record
- Canonical branch before this run: `main` @ `fa48a94a6ea1a0542bc756d19dcd65b27bd539b9`.
- Current Work gate: `QA-CHAPTER1-FULL-JOURNEY`; `production/next_queue.yaml` records no Chapter 1 art blocker. Android evidence remains a Work/device dependency, not an Art dependency.
- Target this run: SP-192 裂空マンティコア runtime motion + discovery/HUNT presentation specification.
- Intended screen/use: future AREA discovery, HUNT, battle, portrait/icon. Exact AREA placement and gameplay role are intentionally NOT canonized here.
- Art Lock: inherited Official Art Lock; no reinterpretation or redesign.
- Governing source: `assets/reference/裂空マンティコア_CHARACTER_DESIGN_SHEET_ML-002_v1.2.png`.
- Governing SHA-256: `0b1b8a4a9148cccd7342aa42e0a2d314d1dc09734b3137f064569777e40a1777`.
- Existing runtime assets: `assets/battle/manticore/idle.png`, `attack_prep.png`, `attack.png`, `hit.png`, `danger.png`, `stance.png`, `icon_portrait.png`.
- Planned new raster path: NONE.
- Work dependency: runtime binding only after next-AREA placement is approved. Art does not touch root runtime, public workflow, or replace any locked raster.

## Runtime motion contract v0.1
Use transform/opacity/restrained FX around the locked rasters only. Preserve anatomy, face, blade/wing/tail silhouette, palette, body proportions, and eye treatment.

| State | Frame/source order | Timing | Loop | Anchor | Motion note |
|---|---|---:|---|---|---|
| IDLE | idle | 1280 ms cycle | yes | 50% x / 82% y | grounded predator read; `y: 0 -> -1 -> 0 px`, body rotation <=0.35 deg; no breathing scale pulse |
| ATTACK_PREP | idle -> attack_prep | 110 + 190 ms | no | 50% / 82% | compress rearward 5 px and down 2 px; hold the blade silhouette for anticipation |
| ATTACK | attack_prep -> attack -> idle | 80 + 120 + 190 ms | no | 50% / 82% | fast diagonal advance 14 px / up 2 px, then controlled settle; one restrained rear air-slice streak allowed |
| HIT | hit -> idle | 130 + 210 ms | no | 50% / 82% | knockback 8 px; rotation <=0.9 deg; recover without squash/stretch |
| DANGER | danger | 900 ms cycle | yes | 50% / 82% | nearly still; 1 px tension shift once per cycle; no glow pumping or frantic shake |
| STANCE | stance | 1080 ms cycle | yes | 50% / 82% | planted silhouette; <=1 px drift; optional thin rear wind shear every second cycle, never across face/body read |

## Encounter / discovery presentation
- Reveal from `idle.png`; do not create a separate reveal illustration.
- Entry: 150 ms opacity 0 -> 1 plus 8 px lateral-to-anchor settle. The movement should read as a predator stepping into the lane, not a floating summon.
- Hold the full silhouette unobscured for >=480 ms before actionable UI appears.
- Optional environment response: one 120 ms narrow air-cut behind the monster, never a full-screen flash.
- HUNT framing: maintain negative space around head, forelimb/blade shapes, wing/back profile and tail. Foreground particles may not cross the eyes or merge blade edges into the background.
- Portrait/icon: use existing `icon_portrait.png`; do not create a second crop unless target-size QA proves unreadable.
- If `assets/art/manticore_battle_backdrop.jpg` is considered later, treat it as a separate background asset decision; this handoff does not promote or require it.

## Species contrast requirement
The next AREA currently has Thunder Owl as another locked anchor candidate. Their motion language must remain visibly different:
- Thunder Owl = airborne hover, restrained electrical pulse, lighter vertical rhythm.
- Rift Manticore = grounded/predatory weight, lateral anticipation, short decisive diagonal strike.
- Do not give Manticore hover/bobbing behavior merely because the silhouette includes aerial anatomy.

## Visual prohibitions
- No cute/rounder eye reinterpretation.
- No extra horns, blades, feathers, armor, markings, accessories, or symbols.
- No glossy uniform AI highlight pass or over-detailed FX skin.
- No evolution framing or intermediate form; SP-192 is its own species.
- No silhouette-changing squash/stretch.
- No wind/slash FX that hides the face, blade read, tail read, or changes the locked palette.
- No generic idle bob copied from Thunder Owl or Wind Bat.

## Art Director QA
**PASS — specification/handoff.** Existing source and seven runtime derivatives are sufficient for the requested presentation stage; no new raster is justified. Motion preserves the inherited Official Art Lock and deliberately separates SP-192's grounded weight from SP-044's hover vocabulary.

Runtime implementation must be checked at 360x800 / 390x844 / 430x932 before calling this motion game-implemented. Check especially: silhouette separation from UI, attack travel not colliding with enemy/ally cards, and tail/blade edges remaining readable against the chosen AREA background.

## Status
- 制作中: runtime binding is Work-side; no raster production is active.
- レビュー待ち: next-AREA gameplay placement + 3-viewport runtime QA.
- Visual Lock済み: SP-192 motion vocabulary and encounter treatment in this handoff.
- Official Art Lock済み: inherited SP-192 source/runtime assets unchanged; no new lock declared.
- 実装待ち: animation/encounter binding.
- ゲーム実装済み: existing static SP-192 assets only; this motion contract is not yet implemented.

## Next art queue
1. If Chapter 1 produces a concrete visual blocker, service it first.
2. Otherwise compare Thunder Owl + Rift Manticore against next-AREA gameplay/ecology needs and identify the first genuinely missing silhouette/role.
3. Do not generate a new species until that missing role has a governing concept/species brief. If gameplay definition is still absent, advance another already locked monster's runtime derivatives rather than inventing an SP ID.
