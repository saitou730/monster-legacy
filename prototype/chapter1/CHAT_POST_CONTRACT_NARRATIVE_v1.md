# Chapter 1 Post-Contract Narrative Contract v1.1

Authority base: main `7fb18d16c9259565d9df10377eea22520f19ac0d`.
Owner: Chat (scenario / progression specification only).
Integration owner: Work.

## Purpose

Lock the narrative meaning and replay-safe progression boundary from NEW SPECIES TEST through CONTRACT SUMMON without changing root runtime, battle UI, STANCE UX, QA, deployment, Art Lock, or save schema.

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

## First-Contract scene beat contract

The scene should be short enough not to interrupt the momentum created by NEW SPECIES TEST. Exact dialogue wording remains implementation-flexible, but the semantic beats are fixed:

1. **Afterglow** — the fused-species test ends; the party has just proven that combining lineages can create a new answer.
2. **Different signal** — a response appears that is recognizably not the FIELD JOIN resonance the player already learned.
3. **Lyra answers** — Lyra establishes that this connection comes from outside the active three-monster formation. Do not imply that she is a monster occupying a party slot.
4. **Player accepts** — one explicit acknowledgement authorizes the guaranteed/free Contract. The scene must not auto-grant before this acknowledgement.
5. **Contract resolves** — Lyra becomes available exactly once as Support.
6. **Role clarity** — a separate acknowledgement establishes Support as outside the three active slots, then progression returns toward the boar rematch.

Emotional target: curiosity -> recognition that the world is larger than FIELD JOIN -> deliberate acceptance -> quiet confidence. Avoid jackpot/gacha excitement; the first Contract is a story relationship beat, not a monetization beat.

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

`TEST CLEAR -> distinct signal discovered -> Lyra answers -> explicit Contract acknowledgement -> guaranteed/free Lyra Contract -> separate Support-role acknowledgement -> continue toward boar rematch`

Acceptance conditions:
- Contract cannot be granted before explicit acknowledgement.
- Contract resolves exactly once.
- Reload at every boundary resumes at the first incomplete semantic step.
- Support never occupies or silently expands the three-monster battle formation.
- No duplicate JOIN, FUSION, Contract, or Support grant occurs on replay.
- The scene never presents the first Contract as random, paid, or a probability tutorial.
