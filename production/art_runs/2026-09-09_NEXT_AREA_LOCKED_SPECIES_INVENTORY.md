# Art Run — Next AREA locked-species inventory

Date: 2026-09-09
Canonical base: main `4fe1ee0f244eba54cb74c90738ef36deb06447e3`
Status: ART DIRECTOR QA PASS / NO NEW RASTER

## Preflight
- Work current task: `QA-CHAPTER1-FULL-JOURNEY`; no blocking Art. Android evidence is a physical-device dependency, not an Art dependency.
- Phase 1 manifest still lists HOME/FUSION LAB/FX, but production policy says not to regenerate near-identical Art and current Work is unblocked.
- Existing Official Art Lock sources are authoritative via `canon/visual_source_map.yaml`.
- Blocked candidates (Bulk/Grausen/Nocta/Lucia/Phil) remain HOLD; do not invent or generate them.

## This run
Purpose: establish the safest monster-side handoff after AREA 1 without inventing unknown SP IDs or reinterpreting locked species.
Planned files changed: this record only.
Root runtime/workflows/assets: unchanged.
Work dependency: none; this is a planning handoff for the next AREA after Chapter 1 QA.

## Locked-species inventory for next AREA
### SP-044 雷フクロウ — READY FOR RUNTIME USE
Governing source: `assets/reference/雷フクロウ_CHARACTER_DESIGN_BIBLE_ML-001_v1.1.png`
Official source SHA-256: `6e3cacaf83b8541d85560d9bf4358029c0be484af976125a399a7df14e72fedc`
Existing runtime derivatives include idle / attack_prep / attack / hit / danger / stance / icon_portrait.
Art decision: highest-priority next-AREA anchor because it is already locked and has the richest runtime derivative set. Do not redesign.

### 裂空マンティコア — READY FOR RUNTIME USE
Governing source: `assets/reference/裂空マンティコア_CHARACTER_DESIGN_SHEET_ML-002_v1.2.png`
Existing runtime derivatives include battle states and `icon_portrait` in `assets/battle/manticore/`.
Art decision: second next-AREA anchor; preserve its existing official silhouette. Do not reinterpret as an evolution or fusion result unless a canonical gameplay source explicitly says so.

### SP-001 ゴウラ — CONDITIONAL / INDIVIDUAL-SCOPE
Governing source: `assets/reference/熔岩守護獣ゴウラ_モンスターデザインシート.png`
Official source SHA-256: `7089b6b62cd5da9e77b644650891953403c20d2079051a0e39df6e437ef5bff5`
Existing runtime derivatives include idle / attack / hit / danger / stance.
Important scope: the visual source map states this is the ゴウラ individual and must NOT be used to newly define all of SP-001.
Art decision: usable only when the game explicitly calls for ゴウラ as that individual. Do not use it as generic filler fauna for the next AREA.

## AREA planning gate
Do NOT declare a full AREA 2 roster yet. Two locked species (雷フクロウ / 裂空マンティコア) can seed visual and combat contrast, while ゴウラ is conditional. The remaining ecology slots must come from canonical game/design requirements before new species generation.

Before any new-species raster is generated, the next AREA design handoff must identify at minimum:
1. discovery/HUNT role,
2. JOIN availability,
3. battle role and silhouette gap relative to owl/manticore,
4. FUSION relationship if any,
5. AREA Boss relationship,
6. whether the species needs a new governing source or already has one.

Unknown 200-ID slots remain `DO_NOT_INVENT`.

## Art Director QA
PASS.
Reason: advances the monster production queue with concrete reusable locked assets, prevents unnecessary generation, and identifies the exact gate for the first genuinely new next-AREA species.

## Status
- 制作中: none; no justified new raster this run.
- レビュー待ち: next AREA gameplay/ecology handoff for missing roles.
- Visual Lock済み: 雷フクロウ / 裂空マンティコア / ゴウラ existing locks preserved; no new Visual Lock declared.
- Official Art Lock済み: inherited existing official locks only.
- 実装待ち: next AREA runtime use of 雷フクロウ and 裂空マンティコア after gameplay placement is defined.
- ゲーム実装済み: Chapter 1 through P20; this run does not claim next AREA implementation.

## Next Art queue
1. If Chapter 1 QA exposes an Art blocker, service it first using existing assets/runtime fixes.
2. Otherwise inspect canonical next-AREA/gameplay design for roles around 雷フクロウ and 裂空マンティコア.
3. If a named species with a governing source is available, advance that species CONCEPT/lock/runtime gap.
4. If no canonical new species is available, specify runtime animation/encounter presentation for 雷フクロウ first, then 裂空マンティコア, without changing their source design.
