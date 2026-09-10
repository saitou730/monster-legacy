# AREA-01 Locked Species Placement v1

Canonical base: main c719735f37997383e53336b79e4bb739e4a677fc
Owner: Chat / Issue #38

This is a design/progression handoff only. Runtime UI QA merge and publication remain Work-owned.

## Placement
SP-044 雷フクロウ is the primary AREA-01 DISCOVERY to HUNT/JOIN target. Reuse its existing governing source and runtime derivatives without redesign. First JOIN creates one durable ownership milestone; repeat hunts do not duplicate that first-JOIN progression.

裂空マンティコア is the AREA-01 CHALLENGE gate. Reuse its existing governing source and runtime derivatives. It is not declared an evolution or fusion result and is not generic filler fauna. Unlock the challenge after AREA-01 discovery plus at least one durable AREA-01 JOIN milestone. First clear creates one durable challenge-clear milestone.

SP-001 ゴウラ is excluded from generic AREA-01 fauna because the current source is scoped to the individual ゴウラ and must not be broadened to all SP-001.

## Minimal route
CH1_CLEAR -> WORLD/AREA-01 unlock -> 雷フクロウ DISCOVERY -> HUNT -> 雷フクロウ JOIN -> PARTY/FUSION freedom -> 裂空マンティコア AREA CHALLENGE -> AREA01_CLEAR -> next-area boundary.

PARTY/FUSION is player freedom here; this document does not canonize a new fusion recipe.

## Durable milestone semantics
AREA01_UNLOCKED, AREA01_OWL_DISCOVERED, AREA01_OWL_JOINED, AREA01_CHALLENGE_UNLOCKED, AREA01_CHALLENGE_CLEARED, AREA01_CLEAR.

Milestones are monotonic and idempotent. Defeat, HOME return, app close, or reload never removes discovery/JOIN/clear ownership. Resume at the first incomplete milestone. Existing saves must remain valid through additive/default-safe Work binding. Chapter 1 receipts are never rewritten by AREA-01.

## Hard rules
Portrait 9:16. NEXT fixed at turn start. Exactly 3 battle monsters. Exactly 2 COMMAND plus remaining 1 STANCE. Existing official sources only. prototype/chapter1 remains an integration workspace and is not a public deployment target.

## Work boundary
No root battle UI, long-press help, STANCE UX, mobile feel, accessibility, QA/automation, save migration code, main merge, publication, or asset generation is implemented here. Work owns runtime binding and verification; Art owns future missing sources/derivatives.
