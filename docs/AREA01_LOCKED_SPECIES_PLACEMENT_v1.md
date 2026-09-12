# Post-Chapter-1 First Area — Locked Species Placement v1.7

Canonical base reviewed: main `eb54dc91a29578e892a9f832ee6ccd3e57b7f1ec` (2026-09-12)
Owner: Chat / Issue #38

This is a design/progression handoff only. Runtime UI, battle binding, save migration implementation, QA, merge and publication remain Work-owned.

## P0 — first playable continuation
`CH1_CLEAR -> DEPART -> DISCOVERY -> THUNDER_OWL_ENCOUNTER -> HUNT -> JOIN -> RETURN/NEXT_OBJECTIVE`.

SP-044 雷フクロウ is the required first DISCOVERY/HUNT/JOIN target. Player lesson: **observe the ecosystem, then choose the opening**. Normal copy is Japanese-first: 「痕跡を探す」「雷フクロウを見つける」「動きを読む」「隙をつく」「仲間になる」「次の目的へ」.

### Thunder Owl authority
- DISCOVERY is a field/progression event, not a battle command and never grants ownership.
- First-hunt READ is satisfied only after one announced owl action actually resolves and the party survives it.
- Opening the encounter, reading NEXT/help, command selection/cancel or animation playback cannot satisfy READ.
- READ adds no command, meter, status or STANCE rule.
- Failed hunt preserves durable discovery, but not JOIN. Retry resumes at HUNT.
- JOIN grants ownership exactly once. Repeat hunts never duplicate discovery/JOIN rewards.
- Existing NEXT turn-start lock, 3-monster party and 2 COMMAND + remaining 1 STANCE are unchanged.

## P1 — area-boundary challenge: 裂空マンティコア
Latest main contains governed SP-192 Art evidence (`production/art_handoffs/POSTCH1_AREA_SP192_FOLLOWUP_PACKET.yaml`). P1 is now progression-authorized **only after the durable Thunder Owl JOIN/RETURN step**. It must never replace or block P0.

Narrative causality: 雷フクロウを追うことで、プレイヤーは「雷の痕跡」と「風圧で裂けた痕跡」の違いを読めるようになる。帰還時、エリア境界にそれまで判別できなかった大きな裂傷痕が見つかり、次の目的が「境界の裂傷を調べる」に更新される。雷フクロウがマンティコアを召喚・進化・配合するわけではない。

Player-facing P1 sequence:
`OWL_JOINED/RETURNED -> 裂傷痕を発見 -> 境界を調べる -> 裂空マンティコア遭遇 -> AREA CHALLENGE -> 勝利 -> 次エリアへの道を開く`.

### Manticore challenge lesson
The challenge teaches **read -> evade -> punish**, using existing battle grammar only.
1. 「構える」: an announced high-impact single-target action appears as the turn-start NEXT.
2. 「かわす」: the player uses an already-existing evasion-capable choice/party relationship; no new DODGE button or third COMMAND is introduced.
3. 「反撃する」: after a successful evade resolution, the next turn opens a temporary narrative/encounter vulnerability predicate in progression data. Work may translate this into existing damage/battle data, but Chat does not prescribe UI or a new meter.
4. Victory after demonstrating the read/evade lesson clears the AREA CHALLENGE exactly once.

A raw damage win before the lesson predicate may count as an ordinary encounter clear only if Work needs replay safety, but it MUST NOT silently grant the one-time area-boundary progression reward. The intended first-clear path requires at least one resolved successful evade before the decisive clear. This requirement belongs to encounter/progression data, not animation completion.

### P1 durable semantics
Conceptual monotonic order:
`OWL_RETURNED -> MANTICORE_TRACE_DISCOVERED -> MANTICORE_CHALLENGE_OPEN -> MANTICORE_LESSON_PROVED -> MANTICORE_CHALLENGE_CLEARED -> NEXT_AREA_OPEN`.

These are semantic labels, not mandated storage keys. Save implementation remains data-driven and additive/default-safe. Resume targets the first incomplete durable milestone. Motion state, viewport state, help state and animation completion are never authority.

- Reload after trace discovery resumes at the boundary investigation, not Thunder Owl discovery.
- Reload after lesson proof but before victory may safely require the encounter to be fought again; it must not grant victory/reward from the proof alone.
- Reload after durable challenge clear cannot duplicate clear rewards or close the next-area route.
- SP-192 is a challenge target here, not automatically a JOIN reward. Any future JOIN eligibility requires a separate Chat-owned species/progression decision.

## Save / Chapter 1 compatibility
Existing Chapter 1 receipts are never consumed, renamed, rewritten or downgraded. Conceptual P0 order remains:
`CH1_CLEAR -> AREA_UNLOCKED -> OWL_DISCOVERED -> OWL_JOINED -> RETURNED/NEXT_OBJECTIVE`.

PR #49 defines areas by data `areaId`; Work should bind canonical WORLD/AREA identity rather than hard-code numeric aliases from this handoff.

## Player-facing clarity guard
Every post-Chapter-1 HOME/AREA state must answer:
- **どこへ行く？** destination;
- **何をする？** one concrete action;
- **何が増える？** monster, route or next objective.

After owl JOIN the forward CTA becomes 「境界の裂傷を調べる」, not another archive/record acknowledgement. LEGACY/MASTERY/REMNANT/RECORD and Build/JSON/Clarity/test terminology must not crowd out the journey.

## Species / Art boundaries
- SP-044 uses canonical locked Thunder Owl assets only.
- SP-192 uses existing governed canonical derivatives only; no regeneration or redesign.
- SP-001 ゴウラ remains excluded from generic fauna; an individual source is not generic population evidence.
- Art availability never creates discovery, JOIN, challenge or reward receipts.

## Conflict boundary
Chat owns scenario/progression/encounter semantics only. No root battle UI, long-press help, STANCE UX, mobile feel, accessibility implementation, QA/automated tests, save migration code, main merge, Pages/publication, prototype deployment or asset generation. Work owns runtime binding/verification/publication; Art owns governed assets and Art Lock.

## Hard rules
Portrait 9:16. NEXT fixed at turn start. Exactly 3 battle monsters. Exactly 2 COMMAND plus remaining 1 STANCE. Save compatibility mandatory. `prototype/chapter1` is integration workspace only and is never the publication target.
