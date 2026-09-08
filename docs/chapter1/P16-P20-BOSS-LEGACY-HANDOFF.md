# Chapter 1 P16–P20 — Boss / Legacy closeout handoff

Owner: Chat (Issue #38 split)
Base: main @ 351752fd2e625469f28ad63d05d7ccded004d36a
Runtime implementation / QA / merge / publish: Work

## Conflict boundary
This document changes no root runtime, battle UI, PR #32 help/STANCE UX, save implementation, tests, Pages workflow, prototype HTML, or Art Lock asset. It defines player-visible completion boundaries only.

## Canon invariants
- Portrait 9:16.
- Battle remains 3 monsters, 2 COMMAND + remaining 1 STANCE.
- NEXT ACTION remains locked at turn start.
- Lyra is a Contract Support outside the 3-monster active party.
- First Thorn Boar encounter is a forced retreat; only the rematch can produce boss mastery and Legacy.
- `unyielding` / 「不退転」 is the Chapter 1 Legacy result.
- Irreversible rewards must be replay/reload safe under the controller receipts already in main.

## P16 — BOAR_REMATCH_BRIEF
Entry: `CONTRACT_EQUIP_COMPLETE` has committed and Lyra is owned/equipped outside monster party.

Player-facing purpose: make the rematch an intentional choice, not an automatic scene transition. HOME presents a single Chapter objective: return to the Thorn Boar with the rebuilt party, Flame Wing Lizard experience, and Lyra support available.

Completion boundary: player explicitly accepts the rematch objective. Merely opening HOME/objective detail does not advance.

Event: `BOAR_REMATCH_ACCEPT` → P17.

Reload acceptance: before acceptance stays P16; after committed acceptance resumes at P17 entry without re-awarding anything.

## P17 — BOAR_MASTERY
This is a real playable boss battle, not a controller-only acknowledgement.

Required battle context:
- active monster party remains exactly 3;
- Lyra support is available outside those 3 slots;
- standard 2 COMMAND + 1 STANCE turn structure remains intact;
- NEXT ACTION is frozen at each turn start;
- the battle may teach/validate the value of the player's Chapter 1 loop, but must not introduce a new mandatory system here.

Failure boundary: defeat/retry does not advance progression and does not grant mastery rewards.

Completion boundary: actual Thorn Boar rematch victory result is confirmed by the player.

Event: `BOAR_MASTERY_COMPLETE` → P18 and grants only the controller-defined mastery reward (`fieldMark:300`, `legacyCore:1`). It must not directly grant 「不退転」.

Reload acceptance: after victory commit, resume at P18; replaying/reloading must not duplicate mastery reward.

## P18 — LEGACY_REWARD
Player-facing purpose: explain that a Legacy is not ordinary loot. It records a battle principle earned from a resolved encounter.

Presentation requirement: show the source (`荊棘の大猪`), Legacy name (`不退転`), and a short principle line. Recommended copy intent: 「退かないことではない。退いた先で、勝ち筋を残す。」 Final UI copy may be polished without changing meaning.

Completion boundary: player explicitly claims/records the Legacy. Opening the reward panel alone does not claim it.

Event: `LEGACY_CLAIM` → P19, atomic, result `unyielding`, controller-defined `signalShard:300`.

Idempotency: if receipt exists, returning to this surface must show already recorded state and must never duplicate Legacy or shards.

## P19 — ARCHIVE_UNLOCK
Purpose: prove that the journey leaves a persistent record. This is the first mandatory Archive visit.

Archive must surface, at minimum:
- Thorn Boar encounter record / mastery result;
- Legacy 「不退転」 as owned;
- enough lineage/history context to communicate that JOIN/FUSION/battle outcomes persist beyond one fight.

Do not require exhaustive Archive browsing. One focused Chapter 1 record view plus explicit acknowledgement is sufficient.

Completion boundary: player opens the required Chapter 1 Archive record and acknowledges completion.

Event: `ARCHIVE_COMPLETE` → P20 and applies only the controller-defined completion reward (`fieldMark:500`, `signalShard:700`).

Idempotency: `ARCHIVE_COMPLETE` receipt prevents repeat completion rewards.

## P20 — CHAPTER1_COMPLETE_HOME
Return to HOME. Chapter 1 is complete and no longer turn-locks the player into tutorial routing.

HOME should communicate three things without a long story scene:
1. Chapter 1 complete.
2. The player's permanent records now include JOIN/FUSION/Contract/Legacy history.
3. The next game layer is exploration of new areas, not an endless scripted tutorial.

P20 is a stable save/resume destination. Reloading here must not reopen P18/P19 rewards or force the Chapter 1 route again.

## Work acceptance checklist
- [ ] P16 advances only on explicit rematch acceptance.
- [ ] P17 is completed by real player victory, not direct controller calls.
- [ ] Defeat/retry cannot advance or reward.
- [ ] Boss victory reward and Legacy claim remain separate commits.
- [ ] `LEGACY_CLAIM` is atomic/idempotent.
- [ ] Archive visit demonstrates persistent history and is not a fake acknowledgement.
- [ ] `ARCHIVE_COMPLETE` reward is idempotent.
- [ ] Reload checkpoints pass at P16, post-boss P18, post-Legacy P19, and P20.
- [ ] Lyra remains outside the 3-monster party throughout.
- [ ] No regression to PR #32 battle help/STANCE UX or core battle invariants.

## Out of scope
Boss tuning numbers, battle UI layout, touch UX, Playwright implementation, save code, root wiring, main merge, deployment, and Art changes remain Work/Art responsibilities.