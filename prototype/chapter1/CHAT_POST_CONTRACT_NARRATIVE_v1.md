# Chapter 1 Post-Contract Narrative Contract v1.2

Authority base: main `7fb18d16c9259565d9df10377eea22520f19ac0d`.
Owner: Chat (scenario / progression specification only).
Integration owner: Work.

## Purpose

Lock the narrative meaning and replay-safe progression boundary from NEW SPECIES TEST through CONTRACT SUMMON and the return toward the Thorn Boar rematch, without changing root runtime, battle UI, STANCE UX, QA, deployment, Art Lock, or save schema.

## Canonical sequence

1. `P13_TEST_CLEAR`
   - NEW SPECIES TEST is cleared with the fused species.
   - Fusion is proven as a usable lineage, not merely a menu unlock.
   - Persist existing test-clear receipt only; do not award Contract here.

2. `P14_SIGNAL_DISCOVERED`
   - Returning from the test reveals an anomalous resonance/signal that does not match ordinary FIELD JOIN behavior.
   - The signal is presented as a response to what the party just demonstrated through fusion, not as a random reward roll.
   - Completion condition: the player has seen/acknowledged that the signal is distinct from ordinary field resonance.
   - Save boundary: existing signal-discovered receipt only. Re-entry skips discovery fanfare but preserves the unresolved Contract acknowledgement.

3. `P15_CONTRACT_READY`
   - Lyra answers the signal before any acquisition result is shown. Her role is framed as answering/connecting to the expedition rather than being captured or recruited through FIELD JOIN.
   - Player agency beat: one explicit acknowledgement to accept the connection and proceed with the first Contract.
   - The first Contract is guaranteed and free. No odds, currency pressure, rarity-roll tutorial, or paid framing belongs in this scene.
   - Completion condition: explicit Contract acknowledgement is accepted; the Contract itself has not yet been duplicated or pre-granted.
   - Re-entry after save returns to the first unresolved acknowledgement/contract step.

4. `P16_LYRA_CONTRACTED`
   - Contract resolves exactly once.
   - Lyra is introduced as a Contract-bound Support, not a fourth battle-party monster.
   - Narrative payoff: the player has expanded the expedition's possibilities without breaking the three-monster formation learned throughout Chapter 1.
   - Save boundary: existing Contract receipt. Reload after this point must never replay the grant.

5. `P16_SUPPORT_EQUIPPED`
   - Support equip/acknowledgement is a distinct step after Contract resolution.
   - The scene communicates one idea only: Lyra supports the active formation from outside its three battle slots.
   - It may resume independently if Contract is complete but Support acknowledgement is incomplete.
   - No duplicate Contract, JOIN, FUSION, or Support grant is permitted on reload/replay.

6. `P17_BOAR_REMATCH_READY`
   - Support acknowledgement immediately restores the unresolved dramatic objective from the opening: the Thorn Boar encounter ended in retreat, not victory.
   - The player now returns by choice with three pieces of earned growth: a joined field monster, a fused lineage proven in TEST, and Lyra as external Support.
   - Lyra must not replace the player's learned battle decisions. Her narrative role is to widen the expedition's options while the three-monster formation remains responsible for winning the rematch.
   - Completion condition: the player explicitly accepts the return objective / enters the rematch route. Do not auto-resolve the boar encounter from Contract completion.
   - Re-entry: if Contract and Support are complete but the rematch has not started, resume at this return objective rather than replaying Contract or Support acknowledgement.

## First-Contract scene beat contract

The scene should be short enough not to interrupt the momentum created by NEW SPECIES TEST. Exact dialogue wording remains implementation-flexible, but the semantic beats are fixed:

1. **Afterglow** — the fused-species test ends; the party has just proven that combining lineages can create a new answer.
2. **Different signal** — a response appears that is recognizably not the FIELD JOIN resonance the player already learned.
3. **Lyra answers** — Lyra establishes that this connection comes from outside the active three-monster formation. Do not imply that she is a monster occupying a party slot.
4. **Player accepts** — one explicit acknowledgement authorizes the guaranteed/free Contract. The scene must not auto-grant before this acknowledgement.
5. **Contract resolves** — Lyra becomes available exactly once as Support.
6. **Role clarity** — a separate acknowledgement establishes Support as outside the three active slots.
7. **Unfinished trail** — the scene closes by recalling the Thorn Boar retreat and returning control toward the unresolved rematch rather than celebrating Contract as an endpoint.

Emotional target: curiosity -> recognition that the world is larger than FIELD JOIN -> deliberate acceptance -> quiet confidence -> resolve to return. Avoid jackpot/gacha excitement; the first Contract is a story relationship beat, not a monetization beat.

## Rematch motivation contract

The rematch is the Chapter 1 payoff for the player's growth loop, not a separate tutorial chapter.

- Opening meaning: the first Thorn Boar encounter establishes that reading NEXT and choosing two COMMAND + one STANCE is necessary but not sufficient when the expedition lacks options.
- Growth meaning: HUNT/JOIN expands available relationships; PARTY makes composition deliberate; FUSION creates a new lineage; NEW SPECIES TEST proves that lineage; CONTRACT introduces Support without expanding the active three slots.
- Return meaning: after `P16_SUPPORT_EQUIPPED`, the player should understand that the same threat can now be approached with a qualitatively richer toolkit.
- Victory ownership: the rematch must still be won through the canonical three-monster battle. Lyra Support may contribute only through the already-canonical Support mechanics; narrative text must not imply an off-screen rescue, fourth COMMAND, or scripted instant win.
- Failure meaning: a failed rematch is retryable and does not revoke JOIN, FUSION, Contract, Support, or their receipts.
- Replay meaning: completed Contract/Support beats are never replayed merely because the player retries or reloads before the boar clear.

### Minimal return scene semantics

Exact copy remains flexible, but the return scene should convey only three beats before handing back to play:

1. **Recall:** the route ahead is the place the party previously had to abandon.
2. **Recognition:** the formation is still three monsters, but it is no longer the same expedition that retreated; its relationships and lineage have changed.
3. **Choice:** the player confirms the return. The scene ends on agency, not on Lyra issuing an order or guaranteeing victory.

Do not add a second tutorial overlay here. The player has already learned the systems; the rematch should test synthesis.

## Relationship distinction

- **FIELD JOIN:** earned by reading a monster/encounter and reaching resonance in the field; it changes the roster of battle monsters.
- **CONTRACT SUMMON:** answers a discovered signal after the fused-species test; the first Contract is deterministic/free and introduces a Support relationship outside the active three.
- The player should be able to explain the difference after Chapter 1 without needing a glossary.

## Battle/runtime invariants for Work integration

- Portrait 9:16.
- NEXT action is fixed at turn start.
- Three-monster formation.
- Two COMMAND selections; remaining monster resolves its STANCE.
- Existing save compatibility and replay-safe receipts are preserved.
- `prototype/chapter1` remains an integration workspace and is not a publish target.
- No new species name, portrait, or character redesign is authorized here; formal Art Lock remains authoritative.

## Acceptance handoff

Work may integrate this contract only by mapping it onto the existing canonical controller/receipts. Chat does not prescribe root DOM, battle UI, long-press behavior, STANCE presentation, mobile interaction, automated QA, merge, or Pages settings.

Required observable progression meaning:

`TEST CLEAR -> distinct signal discovered -> Lyra answers -> explicit Contract acknowledgement -> guaranteed/free Lyra Contract -> separate Support-role acknowledgement -> unresolved Thorn Boar objective recalled -> explicit return -> boar rematch`

Acceptance conditions:
- Contract cannot be granted before explicit acknowledgement.
- Contract resolves exactly once.
- Reload at every boundary resumes at the first incomplete semantic step.
- Support never occupies or silently expands the three-monster battle formation.
- No duplicate JOIN, FUSION, Contract, or Support grant occurs on replay.
- The scene never presents the first Contract as random, paid, or a probability tutorial.
- Support acknowledgement does not auto-clear or auto-start the boar rematch without the return handoff.
- Rematch retry/reload preserves all previously earned Chapter 1 growth receipts.
- Narrative never attributes victory to a fourth active unit or scripted Lyra rescue.