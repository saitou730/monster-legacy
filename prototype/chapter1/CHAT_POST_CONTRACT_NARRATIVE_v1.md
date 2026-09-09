# Chapter 1 Post-Contract Narrative Contract v1

Authority base: main `cde798514227221fb0a296cd72bd3b22a38a2885`.
Owner: Chat (scenario / progression specification only).
Integration owner: Work.

## Purpose

Lock the narrative meaning and replay-safe progression boundary from NEW SPECIES TEST through CONTRACT SUMMON without changing root runtime, battle UI, STANCE UX, QA, deployment, or save schema.

## Canonical sequence

1. `P13_TEST_CLEAR`
   - NEW SPECIES TEST is cleared with the fused species.
   - Meaning: fusion is proven as a usable lineage, not merely a menu unlock.
   - Persist existing test-clear receipt only; do not award Contract here.

2. `P14_SIGNAL_DISCOVERED`
   - Returning from the test reveals an anomalous resonance/signal that does not match ordinary field JOIN behavior.
   - This is the narrative justification for CONTRACT SUMMON becoming available.
   - It must not imply random gacha odds or paid acquisition.

3. `P15_CONTRACT_READY`
   - The player explicitly acknowledges the signal and chooses to proceed.
   - Lyra's first Contract is guaranteed/free per current canonical runtime.
   - Re-entry after save must return to the unresolved acknowledgement/contract step without duplicating rewards.

4. `P16_LYRA_CONTRACTED`
   - Contract resolves exactly once.
   - Lyra is introduced as a Contract-bound Support, not a fourth battle-party monster.
   - The three-monster battle party remains unchanged; Support remains outside the three battle slots.

5. `P16_SUPPORT_EQUIPPED`
   - Support equip is a distinct player acknowledgement after Contract resolution.
   - It may be resumed independently if Contract is complete but Support equip acknowledgement is not.
   - No duplicate Contract, JOIN, FUSION, or Support grant is permitted on reload/replay.

## Narrative rules

- FIELD JOIN and CONTRACT SUMMON must feel like different relationships: JOIN is earned through field resonance/encounter understanding; Contract answers a discovered signal after the fused-species test.
- The first Contract is deterministic and free. Do not frame it as a probability tutorial.
- Lyra must not replace, occupy, or silently expand the canonical three-monster battle party.
- The Contract scene should establish that Support affects the expedition from outside the active three-monster formation, leaving later Support growth space without changing Chapter 1 battle rules.
- No new species name, portrait, or character design is authorized by this document. Formal Art Lock remains authoritative.

## Battle/runtime invariants for Work integration

- Portrait 9:16.
- NEXT action is fixed at turn start.
- Three-monster formation.
- Two COMMAND selections; remaining monster resolves its STANCE.
- Existing save compatibility and replay-safe receipts are preserved.
- `prototype/chapter1` remains an integration workspace and is not a publish target.

## Acceptance handoff

Work may integrate this contract only by mapping it onto the existing canonical controller/receipts. Chat does not prescribe root DOM, battle UI, long-press behavior, STANCE presentation, mobile interaction, automated QA, merge, or Pages settings.

Required observable progression meaning:

`TEST CLEAR -> anomalous signal discovered -> explicit Contract acknowledgement -> guaranteed Lyra Contract -> separate Support equip acknowledgement -> continue toward boar rematch`

A reload at any boundary must resume at the first incomplete semantic step and must never duplicate the Contract or Support grant.
