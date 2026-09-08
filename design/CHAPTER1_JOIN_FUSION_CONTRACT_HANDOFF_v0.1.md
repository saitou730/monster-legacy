# Chapter 1 — JOIN → PARTY → FUSION → TEST → CONTRACT handoff v0.1

Owner: Chat (Issue #38 split)
Base: canonical `main` at branch creation
Runtime/UI/QA owner: Work

## Purpose
Remove implementation ambiguity for the player-facing P06–P15 route while Work binds P00–P05 in PR #46. This is a design/data handoff only: no root runtime, battle UI, tests, Pages, save implementation, or Art Lock changes.

## Locked player route

### P06 HUNT BRIEF — Wind Bat lead
Entry: player returns to HOME after the forced Thorn Boar retreat.
Player intent: learn that power alone is not the answer; find a monster able to create an opening.
Completion boundary: player explicitly chooses HUNT from the brief. Opening/closing the brief does not advance.
Reload: remains at the brief until HUNT is chosen.

### P07 WIND BAT HUNT — qualifying encounter
Target: Wind Bat / 風コウモリ.
JOIN qualification remains the controller/canon condition; UI may teach it but must not silently award the monster.
Completion boundary: the qualifying battle state is reached and the player explicitly executes the JOIN/RESONATE action accepted by the controller.
Failure/retreat: no ownership, no receipt, route remains retryable.

### P08 JOIN RESULT — ownership commit
Show the Wind Bat as newly joined only after the controller transaction has saved successfully.
Completion boundary: player confirms the result.
Atomic rule: if persistence fails, do not show permanent ownership/reward success.
Reload after success: Wind Bat exists exactly once and P08 result can safely resume/resolve without another grant.

### P09 PARTY — active three confirmation
The player must actively place the newly joined Wind Bat in the 3-monster party.
Completion boundary: player confirms a valid party of exactly 3 containing Wind Bat.
Merely opening PARTY or previewing a slot does not advance.
Lyra/Contract Characters never occupy these 3 monster slots.

### P10 FUSION BRIEF — deterministic first fusion
Required parents: Fire Lizard / 火トカゲ + Wind Bat / 風コウモリ.
Required result: Flame Wing Lizard / 炎翼リザル.
The first fusion is deterministic and instructional; do not present alternate species as equivalent choices.
Completion boundary: player enters the committed fusion flow, not when the recipe is merely previewed.

### P11 HERITAGE — meaningful inheritance choice
Player chooses one legal HERITAGE offered by the existing controller/data contract.
Selection must explain that species identity is fixed while lineage carries inherited history/ability; do not visually morph the child into a parent mixture.
Completion boundary: explicit HERITAGE confirmation.
Cancel/back: parents remain untouched.

### P12 FUSION RESULT — irreversible commit
Only the confirmed fusion transaction may consume parents/catalyst and create the single lineage + Flame Wing Lizard.
Result presentation occurs after successful save.
Reload after success: one Flame Wing Lizard, one lineage, parents not duplicated/restored, no second catalyst charge.
Active party must be repaired to exactly 3 valid monsters per controller semantics before leaving the result.

### P13 NEW SPECIES TEST — prove the fusion
This is a real playable battle gate, not a menu confirmation or cinematic.
Purpose: player immediately feels what changed by creating Flame Wing Lizard and applies COMMAND/STANCE rules already taught by Work-owned battle UX.
Completion boundary: win the designated test battle with Flame Wing Lizard in the active party.
Loss/retreat: retry without progression grant.
No new battle mechanics are invented in this handoff.

### P14 CONTRACT SIGNAL — separate reward language
After TEST victory, introduce a signal/person response distinct from monster JOIN language.
Message intent: monsters are met through ecology/HUNT/JOIN/FUSION; Contract Characters answer a Contract/SUMMON and support the party from outside the 3-monster formation.
Completion boundary: player explicitly opens/accepts the tutorial Contract invocation.
Do not use monster capture/JOIN terminology for Lyra.

### P15 LYRA CONTRACT — guaranteed tutorial support
Lyra is the free guaranteed tutorial Contract Character.
No premium currency, random roll, reroll, duplicate conversion, or monetization implication in Chapter 1.
Completion boundary: successful controller Contract transaction + persisted support ownership, followed by player acknowledgement.
Reload after success: Lyra exists exactly once in Support/Contract state and never displaces a monster from the 3-monster party.

## Presentation beats (implementation-neutral)
1. Retreat creates the question: “How do we make an opening?”
2. Wind Bat JOIN answers through ecology/relationship, not loot.
3. PARTY confirmation makes the new relationship mechanically relevant.
4. FUSION converts two encounters into a lineage decision.
5. TEST proves the result before another system is introduced.
6. Lyra then expands the rules horizontally: a person supports monsters; she is not another monster slot.

## Reload / replay acceptance checkpoints
Work should preserve real player-control reload coverage after: JOIN success, PARTY confirm, FUSION commit, TEST win, Lyra Contract success. At every checkpoint irreversible rewards must remain exactly-once.

## Hard canon guards
- Portrait First 9:16.
- NEXT locked at turn start.
- Exactly 3 active monsters.
- Exactly 2 COMMAND + remaining 1 STANCE.
- Monster acquisition = HUNT/JOIN/FUSION.
- Contract Character acquisition = SUMMON/Contract, outside monster party.
- Fire Lizard + Wind Bat → Flame Wing Lizard is fixed.
- Existing OFFICIAL ART LOCK assets are not regenerated or reinterpreted.
- Save compatibility remains additive.
- `prototype/chapter1/` is integration workspace, never Pages target.

## Work boundary / next integration gate
Work may consume this document after/alongside PR #46. Work owns root gesture binding, visuals, battle implementation, mobile ergonomics, automated/manual QA, merge and publish. Acceptance for this slice requires actual player gestures from HOME brief through Lyra acknowledgement, not direct controller calls.
