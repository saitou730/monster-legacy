# Chapter 1 — Thorn Boar Rematch Resolution Contract v1

Owner: Chat (Issue #38)
Base: main `706a7e1b840a0873d8da9953b1cd38256b42fd4f` (canonical re-audit 2026-09-10)
Status: Chat-owned scenario/progression handoff only; no root runtime/UI/QA/deploy changes.

## Purpose
Close the emotional loop opened by the first forced retreat. The rematch is not another tutorial and Lyra does not win the fight for the player. The player returns with the accumulated meaning of JOIN → PARTY → FUSION → NEW SPECIES TEST → CONTRACT/SUPPORT and proves mastery with the canonical three-monster battle rules.

## Entry
`P17_BOAR_REMATCH_READY`

Start conditions:
- the initial Thorn Boar retreat receipt already exists;
- Wind Bat JOIN / PARTY reformation / first FUSION / NEW SPECIES TEST are complete;
- first Contract is complete and its Support-equipment acceptance step is complete;
- no Chapter 1 clear receipt exists.

On reload, enter the earliest incomplete step. Never revoke or duplicate prior JOIN, FUSION, Contract, or Support receipts.

## Full-journey resume invariants
The Chapter 1 route is monotonic. A durable receipt may move the player forward, but no later failure, reload, HOME visit, or rematch retry may erase an earlier durable milestone.

Canonical semantic order:
`INTRO → FIRST BATTLE → THORN BOAR RETREAT → HOME/HUNT → JOIN → PARTY → FUSION → NEW SPECIES TEST → CONTRACT SUMMON → SUPPORT ACCEPTED → BOAR REMATCH → LEGACY → ARCHIVE → CH1_CLEAR`.

Resume rule: resolve the earliest incomplete semantic milestone whose prerequisites are durable. Never infer completion from the currently visible screen alone.

Cross-boundary invariants:
- after JOIN is durable, reload must not return to a pre-JOIN capture/resonance requirement;
- after PARTY reformation is durable, reload must preserve the accepted three-monster formation subject to canonical normalization;
- after FUSION is durable, neither ingredient ownership nor the fusion reward may be granted a second time;
- after NEW SPECIES TEST is durable, reload must not require the test again to unlock Contract;
- after CONTRACT SUMMON is durable, the free deterministic first Contract cannot be claimed again;
- after Support acceptance is durable, reload advances to rematch readiness rather than replaying Contract reward ownership;
- after rematch victory is durable, reload advances to the first incomplete LEGACY/ARCHIVE/clear step and never respawns the mandatory rematch as uncleared;
- after `CH1_CLEAR`, returning play enters normal HOME and never re-enters the fresh-start Chapter 1 route.

This is a semantic/save handoff only. It does not prescribe Work-owned schema names or migration code. Runtime binding must remain additive/default-safe for older saves.

## Beat 1 — Return
The field framing deliberately echoes the first encounter, but the protagonist does not get forced forward by a tutorial prompt. The narrative objective is simply: return to the place that previously required retreat.

No new battle mechanic is introduced here. Existing canonical battle runtime remains authoritative:
- Portrait 9:16;
- exactly 3 battle monsters;
- exactly 2 COMMAND selections each turn;
- the remaining monster resolves its own STANCE;
- NEXT ACTION is fixed at turn start;
- Lyra remains Support outside the three-monster party.

Completion: player explicitly starts the rematch.
Receipt: `CH1_BOAR_REMATCH_STARTED`.
Replay: if the battle was interrupted, resume/re-enter the rematch without replaying Contract rewards.

## Beat 2 — Rematch Victory
The Thorn Boar is defeated only by the normal canonical battle resolution. There is no scripted finishing blow, Support auto-win, fourth party member, or weakened story-only substitute.

Completion: canonical battle result reports victory.
Receipt: `CH1_BOAR_REMATCH_WON`.

On defeat, return to `P17_BOAR_REMATCH_READY`; all prior Chapter 1 progression remains intact. On reload after victory, never respawn the mandatory rematch as uncleared.

## Beat 3 — LEGACY: 不退転
Victory converts the meaning of the first retreat into the first Chapter 1 LEGACY record. `不退転` is earned because the player returned after learning the world's systems, not because retreat itself was failure.

This document fixes narrative/progression semantics only. Work owns the actual LEGACY reward binding, presentation, save implementation, QA, and runtime integration.

Completion: LEGACY award is acknowledged once.
Receipt: `CH1_LEGACY_FUTAITEN_GRANTED`.
Idempotency: award exactly once; reload may replay acknowledgement presentation only if Work's save boundary requires it, never duplicate ownership/effect.

## Beat 4 — ARCHIVE → HOME
After the LEGACY acknowledgement, route to the Archive record, then back to HOME. The Archive should make the chapter legible as a completed journey: first retreat → first JOIN → first FUSION/new species → first Contract → return victory.

Receipts:
- `CH1_ARCHIVE_RECORDED`
- `CH1_CLEAR`

`CH1_CLEAR` is written only after the Archive record is durable. HOME after clear must be a normal returning-player HOME state, not the fresh-start intro.

## Acceptance contract for Work handoff
1. No root battle UI, long-press help, STANCE UX, mobile feel, automated QA, merge, or deployment is implemented by this Chat PR.
2. Rematch uses the canonical battle runtime and hard rules unchanged.
3. Lyra never occupies a battle party slot and never bypasses battle victory.
4. Defeat/reload cannot roll back JOIN/FUSION/Contract/Support ownership.
5. Victory, LEGACY, Archive, and Chapter clear rewards are idempotent.
6. `prototype/chapter1` remains an integration workspace and is not made the public deployment target.
7. Existing saves remain compatible; new receipts must be additive/default-safe when Work binds them to runtime.
8. Full-journey resume follows the monotonic semantic order above; screen state alone is never authoritative over durable progression.
