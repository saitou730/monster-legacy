# Post-Chapter-1 First Area — Locked Species Placement v1.6

Canonical base reviewed: main `eb54dc91a29578e892a9f832ee6ccd3e57b7f1ec` (2026-09-12)
Owner: Chat / Issue #38

This is a design/progression handoff only. Runtime UI, battle binding, save migration implementation, QA, merge and publication remain Work-owned.

## Current P0
The first post-Chapter-1 playable proof must ship as:
`CH1_CLEAR -> DEPART -> DISCOVERY -> THUNDER_OWL_ENCOUNTER -> HUNT -> JOIN -> RETURN/NEXT_OBJECTIVE`.

SP-044 雷フクロウ is the required first-area DISCOVERY -> HUNT/JOIN target. Use only its canonical locked source/runtime derivatives. The player-facing purpose is to teach **observe the ecosystem, then choose the opening**, rather than repeat Chapter 1's low-HP resonance lesson.

## Latest-main Art correction
Main now contains governed Art evidence for SP-192 裂空マンティコア (`POSTCH1_AREA_SP192_FOLLOWUP_PACKET.yaml` and its governing runtime-motion specification). The previous Art-binding HOLD in v1.5 is therefore obsolete.

However SP-192 is explicitly **P1 after the P0 Thunder Owl slice**. It must not replace SP-044, appear as generic filler, or delay the first playable continuation. Its placement is allowed only after the P0 owl route has durable progression semantics/runtime proof.

SP-001 ゴウラ remains excluded from generic fauna; an individual character source must not be broadened into generic species population evidence.

## Thunder Owl DISCOVERY contract
DISCOVERY is a field/progression event, not a new battle command. The player follows intermittent thunder/perch traces until the owl encounter becomes available. Discovery itself never grants ownership.

Player-facing sequence:
1. **痕跡を探す** — enter the new area and identify thunder/perch traces.
2. **雷フクロウを見つける** — discovery becomes durable and HUNT opens.
3. **動きを読む** — in the first hunt, survive one announced owl action before JOIN eligibility can open.
4. **隙をつく** — after that read predicate, resolve the encounter under the existing battle/JOIN interaction.
5. **仲間になる** — first successful JOIN grants ownership exactly once.
6. **次の目的へ** — return/progress without replaying discovery or first-JOIN presentation.

Internal labels such as READ THE PERCH may remain implementation vocabulary, but normal player copy should use plain Japanese such as 「動きを読む」「隙をつく」. Do not expose receipt IDs, Build/JSON/Clarity/test terminology in the normal journey.

## First-hunt semantics
- The read predicate is satisfied only by resolving/surviving one announced owl action in that hunt.
- Merely opening the encounter, viewing NEXT, opening help, selecting/cancelling COMMAND, or playing an animation does not satisfy it.
- The read predicate introduces no new command, meter, status, or STANCE rule.
- Existing NEXT turn-start lock, exactly 3 monsters, exactly 2 COMMAND + remaining 1 STANCE remain unchanged.
- A failed hunt preserves durable discovery but not first JOIN ownership. Retry begins at HUNT, not at field discovery.
- First JOIN is idempotent. Repeat hunts never replay discovery or duplicate ownership/rewards.

## Save / resume authority
The first-area implementation must be additive/default-safe for existing Chapter 1 saves. Conceptual durable order is:
`CH1_CLEAR -> AREA_UNLOCKED -> OWL_DISCOVERED -> OWL_JOINED -> RETURNED/NEXT_OBJECTIVE`.

These names are semantic labels, not a requirement to persist literal `AREA01_*` keys. PR #49 intentionally defines areas by data `areaId`; Work must use the canonical WORLD/AREA identity selected by runtime data rather than hard-coding a numeric alias from this document.

Resume always targets the first incomplete durable milestone. UI state, focus, animation completion, reduced-motion acknowledgement, or screen visibility never becomes progression authority. No Chapter 1 receipt is consumed, rewritten or downgraded.

## After the P0 owl slice
Once the owl slice is shipped, SP-192 裂空マンティコア is the preferred existing-Art candidate for the next ecology/challenge expansion. Narrative causality: after learning the owl's trace rhythm, the player can distinguish a larger, previously unreadable disturbance at the area boundary. The owl does not summon, evolve into, fuse into, or need to be actively partied for the manticore challenge.

SP-192 progression must remain separate from motion/presentation. Existing governed animation availability cannot itself unlock discovery, challenge, victory, rewards or replay state.

## Player-facing clarity guard
Post-Chapter-1 screens should answer three things without archive jargon:
- **どこへ行く？** — the next area/field destination.
- **何をする？** — e.g. 「雷の痕跡を探す」.
- **何が増える？** — e.g. a newly discovered/joined monster and the next field objective.

LEGACY/MASTERY/REMNANT/RECORD terminology must not crowd out the forward objective. Developer-only playtest controls remain outside normal player mode.

## Conflict boundary
Chat does not implement root battle UI, long-press help, STANCE UX, mobile feel, accessibility, automated QA, save migration code, main merge, Pages/publication, prototype deployment, or asset generation. Work owns runtime binding/verification/publication. Art owns governed assets and Art Lock.

## Hard rules
Portrait 9:16. NEXT fixed at turn start. Exactly 3 battle monsters. Exactly 2 COMMAND plus remaining 1 STANCE. Save compatibility is mandatory. `prototype/chapter1` remains an integration workspace and is not a public deployment target.
