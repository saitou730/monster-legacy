# AREA-01 Locked Species Placement v1.5

Canonical base reviewed: main 6173d7a24b15782c8167051104fbef821a26589f
Owner: Chat / Issue #38

This is a design/progression handoff only. Runtime UI QA merge and publication remain Work-owned.

## Latest-main correction / Art evidence gate
Latest main adds `production/art_handoffs/AREA02_EXISTING_LOCKED_SPECIES_RUNTIME_INVENTORY.yaml`. It canonically verifies SP-044 雷フクロウ and its existing runtime states, but places 裂空マンティコア on HOLD because its governing repository source, species ID, runtime path, and derivatives are not currently verified in the canonical visual-source evidence.

Therefore this handoff supersedes the earlier wording that Work could already reuse existing manticore runtime derivatives. 裂空マンティコア remains a user-declared official Art Lock and may remain the intended semantic AREA CHALLENGE role, but **runtime binding is blocked until Art recovers/verifies the governing source binding and exact repository paths**. Chat must not invent those identifiers, paths, derivatives, visual traits, or substitute another species.

## Placement
SP-044 雷フクロウ is the primary AREA-01 DISCOVERY to HUNT/JOIN target. Reuse its canonically verified governing source and runtime derivatives without redesign. First JOIN creates one durable ownership milestone; repeat hunts do not duplicate that first-JOIN progression.

裂空マンティコア is the intended AREA CHALLENGE gate at the design/progression layer only. It is not declared an evolution or fusion result and is not generic filler fauna. Challenge runtime/content binding stays HOLD until canonical Art evidence is restored.

SP-001 ゴウラ is excluded from generic AREA-01 fauna because the current source is scoped to the individual ゴウラ and must not be broadened to all SP-001.

## Minimal route
CH1_CLEAR -> WORLD/AREA-01 unlock -> 雷フクロウ DISCOVERY -> HUNT -> 雷フクロウ JOIN -> PARTY/FUSION freedom -> 裂空マンティコア AREA CHALLENGE [ART_BINDING_HOLD] -> AREA01_CLEAR -> next-area boundary.

PARTY/FUSION is player freedom here; this document does not canonize a new fusion recipe.

## 雷フクロウ DISCOVERY -> JOIN ecology contract
The AREA-01 owl encounter must teach observation before capture, rather than repeat Chapter 1's low-HP resonance lesson.

Discovery is a non-combat field event: the player enters AREA-01 and finds intermittent thunder marks/perch traces. Following the trace sequence completes AREA01_OWL_DISCOVERED and makes the owl hunt available. Discovery itself never grants ownership.

The first owl HUNT uses a two-step behavioral condition:
1. **READ THE PERCH** — survive one announced owl action without forcing a JOIN check. This represents learning its rhythm; it is a progression predicate, not a new battle command or UI system.
2. **OPENING** — after the read predicate is satisfied, resolve the hunt under the existing battle rules and existing JOIN interaction. Do not require the Chapter 1 wind-bat condition and do not introduce a new command, meter, status, or STANCE rule.

On the first successful JOIN, write AREA01_OWL_JOINED exactly once. A failed hunt preserves AREA01_OWL_DISCOVERED but not AREA01_OWL_JOINED, and the next attempt begins at the hunt boundary. After first JOIN, repeat owl hunts are ordinary repeat encounters and never replay discovery or first-JOIN progression.

Narrative intent: Chapter 1 taught **how to make a bond**; AREA-01 teaches **how to read an ecosystem before choosing the moment to engage**. The owl should feel watchful and territorial, not hostile by default. No dialogue, new species lore, fusion relation, or visual trait is canonized beyond existing locked sources.

## 雷フクロウ JOIN -> intended challenge causality
After AREA01_OWL_JOINED is durable, the player's completed observation route is treated as enough field knowledge to identify a previously unreadable disturbance pattern at the AREA boundary. This establishes the narrative cause for an intended stronger-presence challenge without requiring 雷フクロウ in the active party.

`AREA01_CHALLENGE_UNLOCKED` may represent the semantic progression unlock, but runtime entry into the 裂空マンティコア encounter must remain unavailable while `MANTICORE_ART_BINDING_VERIFIED` is false. This hold must not roll back owl discovery/JOIN or fabricate replacement content. Once Art verification exists, Work may bind the intended challenge without changing the progression semantics here.

## Challenge clear -> AREA01_CLEAR -> next-area boundary
When the canonically bound challenge is eventually available, first victory writes AREA01_CHALLENGE_CLEARED exactly once. AREA01_CLEAR is a separate completion receipt written only after that durable victory. It does not award a new species, fusion recipe, visual form, command, or battle modifier.

Resume semantics remain monotonic: app close/reload never replays durable discovery, JOIN, challenge clear, or AREA clear. No Chapter 1 receipt is rewritten, consumed, or downgraded.

## AREA-01 end-to-end handoff / first-incomplete resolver
Canonical monotonic order:
1. CH1_CLEAR
2. AREA01_UNLOCKED
3. AREA01_OWL_DISCOVERED
4. AREA01_OWL_JOINED
5. AREA01_CHALLENGE_UNLOCKED
6. AREA01_CHALLENGE_CLEARED
7. AREA01_CLEAR

Resume target is the first incomplete milestone whose prerequisites are durable. A semantic challenge unlock does not override the Art evidence gate: if the intended challenge binding is unresolved, routing stops safely at the challenge boundary and preserves all prior milestones.

Invalid/legacy partial combinations heal forward without deleting durable ownership or duplicating rewards. Existing monster ownership remains authoritative. No AREA-01 milestone consumes or mutates Chapter 1 receipts.

## Durable milestone semantics
AREA01_UNLOCKED, AREA01_OWL_DISCOVERED, AREA01_OWL_JOINED, AREA01_CHALLENGE_UNLOCKED, AREA01_CHALLENGE_CLEARED, AREA01_CLEAR.

Milestones are monotonic and idempotent. Defeat, HOME return, app close, or reload never removes discovery/JOIN/clear ownership. Existing saves remain valid through additive/default-safe Work binding.

## Hard rules
Portrait 9:16. NEXT fixed at turn start. Exactly 3 battle monsters. Exactly 2 COMMAND plus remaining 1 STANCE. Existing official sources only. prototype/chapter1 remains an integration workspace and is not a public deployment target.

## Work boundary
No root battle UI, long-press help, STANCE UX, mobile feel, accessibility, QA/automation, save migration code, main merge, publication, or asset generation is implemented here. Work owns runtime binding and verification; Art owns recovery/verification of missing governing sources and derivatives.
