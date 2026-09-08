# Chapter 1 Player-Route Binding Contract v0.1

Owner: Chat
Base: main @ 351752fd2e625469f28ad63d05d7ccded004d36a
Status: HANDOFF SPEC — no root UI/runtime edits

## Purpose
PR #44 integrated the pinned Chapter 1 controller and additive save adapter into canonical root. The next Work gate is to bind real player gestures to that controller without inventing progression semantics. This document defines the player-visible route and the atomic event boundary for each binding.

## Non-negotiable canon
- Portrait 9:16.
- Exactly 3 active monsters.
- Each turn: exactly 2 COMMAND; the remaining monster is STANCE.
- NEXT ACTION is locked at turn start.
- Monsters enter ownership only through HUNT/JOIN/FUSION.
- Contract Characters enter through SUMMON and remain outside the 3-monster party.
- Fire Lizard + Wind Bat -> Flame Wing Lizard is the Chapter 1 fixed Fusion.
- prototype/chapter1 is an integration workspace, never the public Pages target.
- Existing PR #32 skill/help/STANCE UX is Work-owned and must remain intact.

## Binding rule
A controller transition is committed only after the qualifying player action has succeeded. UI navigation, opening a sheet, previewing a target, cancelling, or reloading must never advance progression. For irreversible/rewarding actions, persist the receipt and resulting state atomically before the success/result screen is considered complete.

## Player route

| Phase | Player-visible action | Qualifying completion | Controller outcome / invariant |
|---|---|---|---|
| P00→P01 | START | player confirms first-start entry | Intro begins; no reward |
| P01→P02 | advance intro | final intro beat confirmed | FIRST BATTLE becomes the only forward route |
| P02→P03 | play FIRST BATTLE | tutorial battle reaches authored completion | Battle rules remain 3 / 2 COMMAND / 1 STANCE |
| P03→P04 | encounter Thorn Boar | first encounter starts | No Boss reward or legacy may be granted |
| P04→P05 | survive authored retreat condition | retreat result resolves | Return to HOME; this is not a victory |
| P05→P06 | HOME next-action | player accepts HUNT brief | HUNT is unlocked as the next route |
| P06→P07 | enter Wind Bat HUNT | HUNT encounter actually starts | Opening HUNT menu alone does not advance |
| P07→P08 | RESONATE/JOIN Wind Bat | JOIN succeeds under authored condition | Wind Bat ownership receipt written once |
| P08→P09 | PARTY confirm | active party is confirmed with Wind Bat included and exactly 3 valid monsters | Merely viewing PARTY does not advance |
| P09→P10 | choose FUSION | valid Fire Lizard + Wind Bat parents selected and player confirms | Preview/cancel does not consume parents |
| P10→P11 | resolve fixed FUSION | Catalyst cost + parent consumption + Flame Wing Lizard creation + one lineage commit all succeed | Transaction is replay-safe; active party repaired to exactly 3 |
| P11→P12 | NEW SPECIES TEST | player completes the authored Flame Wing Lizard test battle | Test is required before SUMMON unlock |
| P12→P13 | open tutorial CONTRACT SIGNAL | player explicitly starts the free tutorial SUMMON | No currency is charged |
| P13→P14 | resolve tutorial SUMMON | Lyra result is accepted and support ownership receipt persists | Lyra is Support, never inserted into monster party |
| P14→P15 | prepare Boss rematch | valid 3-monster party confirmed; support may be equipped separately | Support does not change party count |
| P15→P16 | Thorn Boar rematch | Boss victory resolves | Only the rematch victory qualifies for mastery |
| P16→P17 | claim Boss Mastery | mastery result accepted | Boss mastery receipt written once |
| P17→P18 | receive LEGACY 不退転 | reward commit succeeds | No duplicate reward on reload/re-entry |
| P18→P19 | ARCHIVE acknowledgement | player views/acknowledges the new record | Lineage + field/boss record remain inspectable |
| P19→P20 | return HOME | completion HOME renders from persisted state | Chapter 1 complete; no forced replay |

## Required reload checkpoints
Work QA should prove reload safety immediately after: Wind Bat JOIN; PARTY confirmation; FUSION result; NEW SPECIES TEST; Lyra SUMMON; Boss victory; LEGACY receipt; Chapter COMPLETE HOME.

Expected behavior: reload resumes from the persisted next phase and cannot duplicate monster ownership, parent consumption, Catalyst cost, lineage, Lyra support, mastery, LEGACY, or other one-time rewards.

## UI handoff constraints
- Work may choose presentation/layout, but must not collapse P06 HUNT BRIEF directly into JOIN RESULT.
- JOIN success must visibly precede PARTY confirmation.
- FUSION preview and confirmation must be distinct semantic states even if rendered in one screen.
- NEW SPECIES TEST is a real gameplay gate, not a decorative result card.
- Tutorial SUMMON is visibly free/guaranteed and is unlocked only after JOIN + FUSION + TEST.
- Lyra must be shown in a separate Support/Contract surface, not as a fourth monster.
- First Thorn Boar encounter must communicate retreat/non-victory; only the rematch can produce mastery/不退転.

## Ownership / conflict boundary
Chat owns this route contract and progression semantics. Work owns root handlers, DOM/UI, battle implementation, touch UX, automated/browser/device QA, main merge and Pages deployment. Art owns locked assets and new production art. This branch intentionally changes no root runtime, battle UI, Pages, tests, or Art Lock files.

## Work acceptance gate
v1.0 Chapter 1 is not complete until a browser test drives the real public-root player route from fresh save through P20 using player-facing controls, plus reload tests at the checkpoints above. Controller-only replay tests are necessary but not sufficient. Android manual remains a separate explicit gate.