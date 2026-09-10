# AREA-01 Locked Species Placement v1.4

Canonical base reviewed: main c22953518cb63922303308a88cc1eb491f9684c4
Owner: Chat / Issue #38

This is a design/progression handoff only. Runtime UI QA merge and publication remain Work-owned.

## Placement
SP-044 雷フクロウ is the primary AREA-01 DISCOVERY to HUNT/JOIN target. Reuse its existing governing source and runtime derivatives without redesign. First JOIN creates one durable ownership milestone; repeat hunts do not duplicate that first-JOIN progression.

裂空マンティコア is the AREA-01 CHALLENGE gate. Reuse its existing governing source and runtime derivatives. It is not declared an evolution or fusion result and is not generic filler fauna. Unlock the challenge after AREA-01 discovery plus at least one durable AREA-01 JOIN milestone. First clear creates one durable challenge-clear milestone.

SP-001 ゴウラ is excluded from generic AREA-01 fauna because the current source is scoped to the individual ゴウラ and must not be broadened to all SP-001.

## Minimal route
CH1_CLEAR -> WORLD/AREA-01 unlock -> 雷フクロウ DISCOVERY -> HUNT -> 雷フクロウ JOIN -> PARTY/FUSION freedom -> 裂空マンティコア AREA CHALLENGE -> AREA01_CLEAR -> next-area boundary.

PARTY/FUSION is player freedom here; this document does not canonize a new fusion recipe.

## 雷フクロウ DISCOVERY -> JOIN ecology contract
The AREA-01 owl encounter must teach observation before capture, rather than repeat Chapter 1's low-HP resonance lesson.

Discovery is a non-combat field event: the player enters AREA-01 and finds intermittent thunder marks/perch traces. Following the trace sequence completes AREA01_OWL_DISCOVERED and makes the owl hunt available. Discovery itself never grants ownership.

The first owl HUNT uses a two-step behavioral condition:
1. **READ THE PERCH** — survive one announced owl action without forcing a JOIN check. This represents learning its rhythm; it is a progression predicate, not a new battle command or UI system.
2. **OPENING** — after the read predicate is satisfied, resolve the hunt under the existing battle rules and existing JOIN interaction. Do not require the Chapter 1 wind-bat condition (single-attack evade -> HP <=35% under RAGE) and do not introduce a new command, meter, status, or STANCE rule.

On the first successful JOIN, write AREA01_OWL_JOINED exactly once. A failed hunt preserves AREA01_OWL_DISCOVERED but not AREA01_OWL_JOINED, and the next attempt begins at the hunt boundary. After first JOIN, repeat owl hunts are ordinary repeat encounters and never replay discovery or first-JOIN progression.

Narrative intent: Chapter 1 taught **how to make a bond**; AREA-01 teaches **how to read an ecosystem before choosing the moment to engage**. The owl should feel watchful and territorial, not hostile by default. No dialogue, new species lore, fusion relation, or visual trait is canonized beyond existing locked sources.

## 雷フクロウ JOIN -> 裂空マンティコア challenge causality
The manticore challenge must be a consequence of what the player learned in AREA-01, not a disconnected next-boss unlock.

After AREA01_OWL_JOINED is durable, the player's completed observation route is treated as enough field knowledge to identify a previously unreadable disturbance pattern at the AREA boundary. The game may frame this as the same trace network becoming legible from a new perspective, but must not canonize a new visual trait, species relationship, dialogue, or asset beyond locked sources.

This establishes the narrative cause: the owl does not summon, evolve into, fuse with, or directly lead the party to 裂空マンティコア. Instead, learning to read one territorial creature gives the player the ecological literacy required to recognize that a stronger presence is controlling access deeper into the AREA. That recognition writes AREA01_CHALLENGE_UNLOCKED exactly once and exposes the existing 裂空マンティコア AREA CHALLENGE.

Challenge unlock predicates are therefore:
- CH1_CLEAR is durable.
- AREA01_UNLOCKED is durable.
- AREA01_OWL_DISCOVERED is durable.
- AREA01_OWL_JOINED is durable.
- AREA01_CHALLENGE_UNLOCKED is not yet durable.

PARTY/FUSION remains free preparation between owl JOIN and challenge entry. 雷フクロウ is never mandatory in the active three-monster party for the challenge; ownership/progression knowledge, not party composition, is the gate. This preserves exactly three battle monsters and avoids turning the ecology lesson into a forced-character tutorial.

Defeat against 裂空マンティコア preserves AREA01_CHALLENGE_UNLOCKED and all earlier AREA milestones. Retry begins at the challenge boundary. First victory writes AREA01_CHALLENGE_CLEARED exactly once; AREA01_CLEAR may then resolve as the AREA completion receipt without replaying owl discovery/JOIN.

Narrative intent: **observe -> understand -> recognize the larger pattern -> choose to challenge it**. Chapter 1 closes by returning to a threat the player once fled; AREA-01 advances that theme by making knowledge itself the reason a previously hidden challenge becomes actionable.

## 裂空マンティコア clear -> AREA01_CLEAR -> next-area boundary
AREA-01 completion must resolve the ecology lesson rather than treat the challenge victory as a generic boss-clear flag.

On the first durable AREA01_CHALLENGE_CLEARED, the player is considered to have proven that the AREA can be navigated by reading its inhabitants and boundary patterns rather than merely overpowering encounters. AREA01_CLEAR is therefore a separate completion receipt written only after challenge victory has already persisted. It does not award a new species, fusion recipe, visual form, command, or battle modifier.

Resolution order is strict and idempotent:
1. Persist AREA01_CHALLENGE_CLEARED exactly once after the existing challenge victory resolves.
2. Resolve the AREA-01 completion beat from that durable receipt; do not replay 雷フクロウ discovery/JOIN or require 雷フクロウ in the active party.
3. Persist AREA01_CLEAR exactly once.
4. Expose a **next-area boundary** as progression availability only. Do not name, populate, visually define, or unlock a specific next AREA until a separate canonical Chat/Art handoff exists.

The completion beat should communicate a change in player competence, not a change in the ecosystem: traces that once looked like noise are now readable as routes, territories, and warning boundaries. This is narrative framing only and must reuse existing presentation capabilities; it does not authorize new environmental Art Lock or UI work.

Resume semantics:
- If the app closes after challenge victory but before AREA01_CLEAR persists, resume from AREA-01 completion resolution, never from the manticore battle.
- If AREA01_CLEAR is durable, HOME/reload/re-entry treats AREA-01 as cleared and never replays first-clear resolution.
- Repeat manticore encounters, if Work/runtime later exposes them, cannot revoke or duplicate AREA01_CLEAR.
- No Chapter 1 receipt is rewritten, consumed, or downgraded by AREA-01 completion.

Narrative intent: **the player entered AREA-01 seeing encounters; the player leaves it seeing an ecosystem.** The next-area boundary is the reward: the world becomes legible enough to go farther, without prematurely canonizing content that does not yet have locked design/art support.

## AREA-01 end-to-end handoff / first-incomplete resolver
Work may bind these milestones to runtime using additive/default-safe save fields. The resolver is semantic, not a mandate for a specific implementation shape.

Canonical monotonic order:
1. CH1_CLEAR (existing Chapter 1 receipt; prerequisite only)
2. AREA01_UNLOCKED
3. AREA01_OWL_DISCOVERED
4. AREA01_OWL_JOINED
5. AREA01_CHALLENGE_UNLOCKED
6. AREA01_CHALLENGE_CLEARED
7. AREA01_CLEAR

Resume target is always the first incomplete AREA-01 milestone whose prerequisites are durable:
- CH1_CLEAR absent -> AREA-01 remains unavailable; do not synthesize Chapter 1 completion.
- CH1_CLEAR present, AREA01_UNLOCKED absent -> resolve AREA-01 unlock once.
- unlocked, owl discovery absent -> resume at field trace/discovery boundary.
- discovered, owl JOIN absent -> resume at owl HUNT boundary; discovery does not replay.
- owl joined, challenge unlock absent -> resolve ecological recognition/challenge unlock once.
- challenge unlocked, challenge clear absent -> resume at manticore challenge boundary.
- challenge cleared, AREA01_CLEAR absent -> resume at AREA completion beat; do not replay battle.
- AREA01_CLEAR present -> normal cleared-area state; first-clear beats never replay.

Invalid/legacy partial combinations must heal forward without deleting durable ownership. If a later milestone is already durable, Work should treat all logically required earlier AREA-01 progression as satisfied for routing purposes rather than resetting the player or duplicating rewards. This is a compatibility rule, not permission to fabricate inventory entries. Existing monster ownership remains authoritative.

No AREA-01 milestone consumes or mutates Chapter 1 receipts. No AREA-01 milestone grants duplicate monsters, new fusion recipes, currencies, or Contract rewards. This handoff therefore adds progression knowledge only and leaves reward implementation to separately canonicalized content.

## Durable milestone semantics
AREA01_UNLOCKED, AREA01_OWL_DISCOVERED, AREA01_OWL_JOINED, AREA01_CHALLENGE_UNLOCKED, AREA01_CHALLENGE_CLEARED, AREA01_CLEAR.

Milestones are monotonic and idempotent. Defeat, HOME return, app close, or reload never removes discovery/JOIN/clear ownership. Resume at the first incomplete milestone. Existing saves must remain valid through additive/default-safe Work binding. Chapter 1 receipts are never rewritten by AREA-01.

## Hard rules
Portrait 9:16. NEXT fixed at turn start. Exactly 3 battle monsters. Exactly 2 COMMAND plus remaining 1 STANCE. Existing official sources only. prototype/chapter1 remains an integration workspace and is not a public deployment target.

## Work boundary
No root battle UI, long-press help, STANCE UX, mobile feel, accessibility, QA/automation, save migration code, main merge, publication, or asset generation is implemented here. Work owns runtime binding and verification; Art owns future missing sources/derivatives.
