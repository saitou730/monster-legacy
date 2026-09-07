# Chapter 1 progression v0.6 — Chat → Work handoff

## Scope delivered by Chat

This handoff contains progression/state/data only. It intentionally does not modify root battle UI, root `index.html`, root `src/app.js`, long-press help, STANCE UX, root tests, deployment, or Pages settings.

## Integration target

Work should integrate the progression behavior into the canonical root runtime without publishing `prototype/chapter1/` directly.

Primary files:
- `src/progression.js`
- `data/progression.json`
- existing `src/game-state.js`

## Required route behavior

1. `P00_TITLE` → `P01_PROLOGUE`
2. `P01_PROLOGUE` → `P02_FIRST_BATTLE`
3. first battle complete → `P03_BOAR_FIRST_ENCOUNTER`
4. player retreat → `P04_RETREAT_RESULT`
5. first HOME arrival → `P05_HOME_FIRST_ARRIVAL`
6. HUNT briefing → `P06_HUNT_BRIEF`
7. HUNT start → `P07_HUNT_WIND_BAT`
8. qualified RESONATE/JOIN → `P08_JOIN_RESULT`
9. result acknowledgement → `P09_PARTY_REBUILD`
10. confirm exactly 3 active monsters including Wind Bat → `P10_FUSION_INTRO`
11. Fusion intro → `P11_FUSION_FLAME_WING`
12. fixed Fusion commit → `P12_NEW_SPECIES_TEST`
13. new species test complete → `P13_SUMMON_UNLOCK`
14. summon unlock acknowledgement → `P14_SUMMON_TUTORIAL`
15. free guaranteed Lyra summon → `P15_CONTRACT_EQUIP`
16. equip Lyra outside monster party → `P16_BOAR_REMATCH_BRIEF`
17. rematch accept → `P17_BOAR_MASTERY`
18. mastery complete → `P18_LEGACY_REWARD`
19. claim 不退転 → `P19_ARCHIVE_UNLOCK`
20. archive complete → `P20_CHAPTER1_COMPLETE_HOME`

## Irreversible/rewarding transaction guard

`progress.receipts` is optional/additive under existing save version 1. An already-received event returns the save unchanged, preventing duplicate JOIN, child creation, Contract acquisition, Legacy acquisition, or reward grants after reload/replay.

No save version bump is required for these optional fields. Existing saves without receipts receive `[]` at runtime.

## Fusion invariants

- parents: `fire_lizard` + `wind_bat`
- result: `flame_wing_lizard`
- deterministic, no reroll
- one heritage from each parent
- favorite/protected parent blocks commit
- costs `fusionCatalyst: 1`
- parents consumed only at commit
- lineage record saved once
- non-null parent equipment is recorded as returned
- child starts level 1 with growthEcho 0.6 in lineage metadata
- active party is repaired to exactly 3 valid monster instances after parent consumption

## Contract invariant

Lyra Vell is stored in `contracts.lyra_vell`. Active support is `contracts.supportEquippedId = 'lyra_vell'`. Contract IDs must never enter `party.active`.

## Reward checkpoints

- first battle: FIELD MARK +100
- Wind Bat JOIN: FIELD MARK +150, FUSION CATALYST +1
- Boar Mastery: FIELD MARK +300, LEGACY CORE +1
- Legacy/Archive unlock: SIGNAL SHARD +300
- Chapter 1 complete: FIELD MARK +500, SIGNAL SHARD +700

These values remain candidate balance values, not commercial monetization locks.

## Work-side acceptance checklist

- preserve PR #32 long-press / info / STANCE / guided START behavior
- preserve Portrait 9:16
- preserve NEXT turn-start lock
- preserve exactly 3 monsters / 2 COMMAND + 1 STANCE
- root official art remains visible
- P07 HUNT is not skipped
- P09 cannot confirm without Wind Bat
- Fusion replay/reload cannot create a second Flame Wing or second lineage record
- Fusion cannot leave active party at 2 members
- tutorial Lyra cannot duplicate on replay/reload
- Lyra remains outside monster party
- 不退転 and rewards cannot duplicate on replay/reload
- final HOME reflects JOIN / FUSION / CONTRACT / LEGACY history
- save compatibility verified on pre-v0.6 save data

## Status taxonomy

Chat handoff = **implemented on branch only**.
Browser/device QA = **not claimed by Chat**.
Published = **not claimed until Work merges and deploys**.
