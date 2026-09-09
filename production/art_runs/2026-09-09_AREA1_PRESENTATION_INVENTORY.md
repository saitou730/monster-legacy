# AREA 1 Presentation Inventory — Art Run

Date: 2026-09-09
Canonical main checked: `4fe1ee0f244eba54cb74c90738ef36deb06447e3`
Branch: `art/area1-monster-runtime-plan`
Status: ART DIRECTOR PASS / NO NEW RASTER

## Preflight
- Work current gate remains `QA-CHAPTER1-FULL-JOURNEY`; no blocking Chapter 1 Art is required.
- Existing Official Art Lock / governed sources remain immutable.
- This run inventories existing AREA 1 presentation coverage before any new generation.
- No root runtime, workflow, `assets/art/*`, or `assets/battle/*` binary is changed.

## AREA 1 species presentation inventory

| Species | Role | Governed battle derivatives | Standalone presentation art | Decision |
| --- | --- | --- | --- | --- |
| SP-011 火トカゲ | starter / fast ground | idle, attack, hit, danger, stance | `assets/art/flame_lizard.png` exists | REUSE; no new raster |
| SP-031 風コウモリ | first JOIN / aerial | idle, attack, hit, danger, stance | `assets/art/wind_bat.png` exists | REUSE; no new raster |
| SP-071 葉ウサギ | grounded ecology / party contrast | idle, attack, hit, danger, stance | no dedicated `assets/art/leaf_rabbit.png` on main | HOLD new generation; battle idle is sufficient for current gameplay until a concrete non-battle screen requires a hero raster |
| SP-018 炎翼リザル | independent FUSION result species | idle, attack, hit, danger, stance | no dedicated `assets/art/flame_wing_lizard.png` on main | HOLD new generation; existing governed battle states cover fusion-test gameplay; never depict as evolution/morph of SP-011 |
| SP-191 荊棘の大猪 | AREA Boss / rematch | idle, attack, hit, danger, stance | `assets/art/thorn_boar.png` exists | REUSE; no new raster |

## Icon audit
- A dedicated icon raster is not required for the current AREA 1 gameplay gate.
- Do **not** create five new icon portraits merely for collection completeness.
- Preferred implementation order if UI later requires icons: crop/mask a governed idle/source raster at runtime first; only request a dedicated icon when silhouette/readability fails at actual UI size.
- This avoids a parallel icon canon that can drift from Official Art Lock.

## Encounter / JOIN presentation audit
- HUNT/JOIN can reuse the governed species raster plus runtime framing/FX; no species redesign is required.
- Keep encounter presentation species-specific through motion grammar rather than generating decorative alternate poses: Fire Lizard = quick grounded readiness; Wind Bat = aerial hover; Leaf Rabbit = grounded compression/hop; Thorn Boar = low-travel heavy mass.
- JOIN effect must not recolor or mutate anatomy. Species raster stays canonical while surrounding particles/signal may animate.

## FUSION presentation audit
- SP-018 炎翼リザル is an independent species design, not an evolution frame.
- FUSION presentation should conceal the operands during the transition and reveal the existing SP-018 governed raster after the effect. Do not generate interpolation frames between SP-011 and SP-018.

## Art Director QA
**PASS — inventory complete; zero new raster justified by current implementation dependency.**

Reasons:
1. Current Work gate has no Art blocker.
2. Every AREA 1 gameplay species has governed battle derivatives.
3. Three species already have standalone `assets/art/*` presentation raster; the two without one do not currently have an implementation dependency that justifies new Art.
4. Dedicated icons would be premature duplication; runtime crops should be tested first.
5. No registry slot or species concept was invented.

## State
- 制作中: none requiring new raster.
- レビュー待ち: Work runtime animation handoff; future UI-size icon readability check only when that UI exists.
- Visual Lock済み: AREA 1 presentation reuse policy + encounter motion distinction.
- Official Art Lock済み: inherited governed species only; no new lock declared.
- 実装待ち: AREA 1 animation metadata binding; runtime crop/mask if a concrete icon surface requests it.
- ゲーム実装済み: existing static battle derivatives and current Chapter 1 species presentation.

## Next Art queue
1. Re-check Work full-journey/Android QA for any concrete visual blocker.
2. If still unblocked, stop adding AREA 1 presentation assets and evaluate the next AREA/ecology need from existing governed species first (雷フクロウ / 裂空マンティコア / ゴウラ where gameplay authority permits).
3. Only create a new species concept after gameplay/ecology defines a missing role and a governing registry/source authorizes it.
