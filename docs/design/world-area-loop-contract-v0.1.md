# WORLD / AREA Loop Contract v0.1

Owner: Chat (Issue #38 split)
Base: main `351752fd2e625469f28ad63d05d7ccded004d36a`
Status: design / Work handoff; no runtime, QA, Pages, battle UI, or Art Lock changes.

## Purpose
Chapter 1 remains the authored onboarding vertical slice. After P20, MONSTER LEGACY changes from chapter-fed progression to a local, replayable AREA loop so ongoing story production is not required.

Core loop:
`WORLD MAP → AREA → DISCOVER → HUNT/JOIN → PARTY/FUSION → AREA CHALLENGE → AREA BOSS → LEGACY/AREA RECORD → NEXT AREA`

## Canon invariants
- Local/offline only. No multiplayer, server ranking, matchmaking, or live-service dependency.
- Portrait 9:16.
- Battle canon remains 3 monsters / 2 COMMAND / 1 STANCE; NEXT locks at turn start.
- Species visuals remain fixed Art Lock. FUSION creates a fixed species; parents influence HERITAGE/LINEAGE data, not random visual recombination.
- Chapter 1 save/progression remains backward compatible.
- `prototype/chapter1/` is never a publish target.

## Unlock boundary
P20 `P20_CHAPTER1_COMPLETE_HOME` is the only required bridge into WORLD mode.

On first valid P20 completion:
- unlock `WORLD_MAP`
- mark tutorial area `thorn_border` cleared/onboarded
- reveal the next explorable area, but do not auto-enter it
- preserve Chapter 1 Archive/Legacy records

Reload at P20 must not duplicate unlock rewards.

## Data-driven AREA schema
Each area should be representable as data, not bespoke routing code.

Required fields:
- `areaId`
- `displayName`
- `unlock`: prerequisite area/record/legacy conditions
- `fieldNodes[]`: reusable encounter nodes
- `speciesPool[]`: species id + encounter condition + weight/tier
- `discoveries[]`: hidden/rumored species clues and reveal conditions
- `huntRules[]`: JOIN eligibility conditions
- `fusionHints[]`: optional discovered recipe hints; never silently grant species
- `areaChallenges[]`: short mastery objectives using existing battle systems
- `boss`: boss id, unlock condition, battle variant id
- `rewards`: first-clear / mastery / discovery rewards with idempotent receipt ids
- `nextAreas[]`

No area may require new executable code solely to add ordinary species, encounter conditions, challenge text, boss variants, or rewards.

## AREA progression state
Minimum persistent state per area:
- `locked | discovered | active | boss_unlocked | cleared | mastered`
- discovery ids found
- JOIN species first-acquisition records
- boss first-clear receipt
- challenge completion receipts
- area Legacy/Record ids

All irreversible grants use receipt/idempotency semantics consistent with Chapter 1 atomic progression.

## Discovery / Ecology v0.1
Ecology is deterministic-condition discovery, not real-time live service.

Allowed initial condition vocabulary:
- field node
- prior species observed/defeated/joined
- party contains species/trait/heritage
- boss cleared/not cleared
- area challenge completed
- local run state such as encounter streak

Do NOT make device clock/date, online weather, server events, or geolocation mandatory for progression. These can never block collection completion in the local game.

A hidden species should expose a clue through DISCOVERY before requiring a non-obvious condition. The player should be able to reason toward discovery rather than brute-force random encounters.

## AREA boss contract
Boss unlock should normally require a small proof of area understanding, e.g. discoveries + one JOIN/challenge, not raw grind count.

Boss defeat:
1. records first clear atomically
2. unlocks area Record/Legacy reward if defined
3. changes ecology pool only through declared data rules
4. reveals next area(s)
5. never consumes owned monsters

Repeat victories may feed future BOSS MASTERY, but v1.1 does not require mastery implementation.

## Content budget per standard area
Target reusable production envelope:
- 2–3 field nodes/background variants
- 4–6 ordinary species encounters (existing species may recur where ecology fits)
- 1 area boss
- 3–5 discoveries
- 2–4 short area challenges
- 1–3 fusion hints/recipes using global FUSION rules
- 1 area clear record/reward

This is a budget, not a hard requirement; avoid adding filler species solely to hit counts.

## First post-Chapter-1 release boundary (v1.1)
Work implementation should stop at:
- WORLD MAP shell
- P20 → WORLD unlock
- generic AREA loader/state
- one post-Chapter-1 area implemented through data
- DISCOVERY clue → encounter → HUNT/JOIN
- AREA BOSS unlock/clear → next-area reveal
- save/reload/idempotency

Explicitly out of v1.1 runtime scope: Offline Arena, Anomaly Zone, Sanctuary, full Boss Mastery, full Lineage Trial.

## Work acceptance checks
- Existing Chapter 1 P00–P20 behavior and saves remain valid.
- P20 unlock is idempotent across reload.
- Adding a second test area can be done primarily by adding data.
- Locked area cannot be entered through direct UI navigation.
- Discovery clue and encounter condition survive reload.
- JOIN acquisition cannot duplicate one-time rewards.
- Boss first-clear reward cannot duplicate after reload/replay.
- Clearing an area reveals declared next area without auto-navigation.
- No multiplayer/network dependency exists.

## Conflict boundary
Chat owns this progression/content contract. Work owns runtime architecture, UI, navigation implementation, save migration code, tests, main merge, and publish. Art team owns actual area backgrounds/icons/species assets under Art Lock.
