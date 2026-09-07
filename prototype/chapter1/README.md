# MONSTER LEGACY — Chapter 1 Progression Workspace

Branch: `chat/ch1-progression-v0.6-r2`
Base: latest `main` at branch start (`36af36ba48a9044873cf8e42c98957e0ad8fb19e`)

## Purpose

This directory is the Chat-owned Chapter 1 progression workspace. It defines the route, progression events, JOIN / FUSION / CONTRACT state changes, rewards, save-compatible guards, and integration handoff for the root runtime.

It is **not** the public runtime and must not be deployed directly to GitHub Pages.

## Current route

TITLE → PROLOGUE → FIRST BATTLE → BOAR FIRST ENCOUNTER → RETREAT → HOME → HUNT BRIEF → WIND BAT HUNT → JOIN → PARTY → FUSION → NEW SPECIES TEST → CONTRACT SUMMON → SUPPORT CONTRACT → BOAR REMATCH → BOSS MASTERY → LEGACY → ARCHIVE → CHAPTER 1 COMPLETE HOME

## Chat ownership

- worldbuilding / scenario / character settings / new feature specifications
- Chapter 1 progression through intro → battle handoff → JOIN → FUSION → CONTRACT SUMMON
- `prototype/chapter1/data/*`
- `prototype/chapter1/src/game-state.js`
- `prototype/chapter1/src/progression.js`
- progression integration notes/specs

## Work ownership

- root battle UI
- skill long-press help
- STANCE clarity
- battle presentation / feel / Portrait mobile polish
- bug fixing / QA / automated tests
- root runtime integration
- merge to `main`
- GitHub Pages publication

PR #32 (`work/skill-help-intro`) already owns long-press skill help, visible info affordances, STANCE UX, guided START, and related root tests. Do not duplicate those changes here.

## Canon

- Portrait First 9:16
- exactly 3 monsters in the active party
- exactly 2 COMMAND + remaining 1 STANCE
- NEXT is locked at turn start
- Monsters: HUNT / JOIN / FUSION
- Contract Characters: SUMMON and never occupy a monster party slot
- deterministic Fusion
- first special Fusion: 火トカゲ + 風コウモリ → 炎翼リザル
- first JOIN: 風コウモリ
- first Contract: Lyra Vell tutorial-guaranteed/free
- first Legacy: 不退転 from 荊棘の大猪
- locked art must not be regenerated or reinterpreted
- save compatibility must be preserved

## v0.6 progression controller

`src/progression.js` adds an ordered event graph with replay-safe receipts for irreversible/rewarding transitions. It also enforces:

- P06 HUNT BRIEF → P07 WIND BAT HUNT → P08 JOIN RESULT (no skipped HUNT state)
- Wind Bat must be in the confirmed P09 party
- Fusion parents cannot be favorite/protected
- Fusion costs one Catalyst and creates exactly one Flame Wing Lizard lineage record
- after Fusion, active party is repaired back to exactly three valid monster instances
- Lyra is stored outside the monster party and equipped via `supportEquippedId`
- JOIN / FUSION / SUMMON / LEGACY / Chapter completion rewards are replay-safe
- Chapter 1 completion rewards: FIELD MARK 500 + SIGNAL SHARD 700

`data/progression.json` is the corresponding data/spec representation for Work-side root integration.

## Reporting

Always report these separately:

- **implemented** — code/data exists on the Chat branch
- **tested** — Work/browser/device QA has passed
- **published** — merged to main and deployed by Work

Chat must stop at PR creation. Work owns merge and publication.
