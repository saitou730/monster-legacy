# Post-Chapter-1 First Area — Locked Species Placement v2.1

Canonical base reviewed: main `055647d2e1dbeaa1e4b5548c15b0632a9fce3c50` (2026-09-12)
Owner: Chat / Issue #38

This is a design/progression handoff only. Runtime UI, battle binding, save migration implementation, QA, merge and publication remain Work-owned.

## P0 — first playable continuation
`CH1_CLEAR -> DEPART -> DISCOVERY -> THUNDER_OWL_ENCOUNTER -> HUNT -> JOIN -> RETURN/NEXT_OBJECTIVE`.

SP-044 雷フクロウ is the required first DISCOVERY/HUNT/JOIN target. Player lesson: **observe the ecosystem, then choose the opening**. Normal copy is Japanese-first: 「痕跡を探す」「雷フクロウを見つける」「動きを読む」「隙をつく」「仲間になる」「次の目的へ」.

### Thunder Owl authority / latest-main acceptance alignment
Latest main adds Art-side Thunder Owl P0 runtime acceptance gating. That acceptance evidence governs whether Work may bind the supplied visual packet; it does not create progression authority.

- DISCOVERY is a field/progression event, not a battle command and never grants ownership.
- First-hunt READ is satisfied only after one announced owl action actually resolves and the party survives it.
- Opening the encounter, reading NEXT/help, command selection/cancel, animation playback, asset acceptance PASS, or runtime-binding readiness cannot satisfy READ or JOIN.
- READ adds no command, meter, status or STANCE rule.
- Failed hunt preserves durable discovery, but not JOIN. Retry resumes at HUNT.
- JOIN grants ownership exactly once. Repeat hunts never duplicate discovery/JOIN rewards.
- If a durable JOIN receipt exists but visual playback is interrupted, reload resumes after JOIN; visuals never reroll or revoke ownership.
- Existing NEXT turn-start lock, 3-monster party and 2 COMMAND + remaining 1 STANCE are unchanged.

## P1 — area-boundary challenge: 裂空マンティコア
Latest main contains governed SP-192 Art evidence (`production/art_handoffs/POSTCH1_AREA_SP192_FOLLOWUP_PACKET.yaml`). P1 is progression-authorized only after the durable Thunder Owl JOIN/RETURN step. It must never replace or block P0.

Narrative causality: 雷フクロウを追うことで、プレイヤーは「雷の痕跡」と「風圧で裂けた痕跡」の違いを読めるようになる。帰還時、エリア境界にそれまで判別できなかった大きな裂傷痕が見つかり、次の目的が「境界の裂傷を調べる」に更新される。雷フクロウがマンティコアを召喚・進化・配合するわけではない。

Player-facing P1 sequence:
`OWL_JOINED/RETURNED -> 裂傷痕を発見 -> 境界を調べる -> 裂空マンティコア遭遇 -> AREA CHALLENGE -> 勝利 -> 次エリアへの道を開く`.

### Manticore challenge lesson
The challenge teaches **read -> evade -> punish**, using existing battle grammar only.
1. 「構える」: an announced high-impact single-target action appears as the turn-start NEXT.
2. 「かわす」: the player uses an already-existing evasion-capable choice/party relationship; no new DODGE button or third COMMAND is introduced.
3. 「反撃する」: after a successful evade resolution, the next turn opens a temporary encounter vulnerability predicate in progression data. Work may translate this into existing battle data, but Chat does not prescribe UI or a new meter.
4. Victory after demonstrating the lesson clears the AREA CHALLENGE exactly once.

A raw damage win before the lesson predicate may count as an ordinary encounter clear only if Work needs replay safety, but it MUST NOT silently grant the one-time area-boundary progression reward. The intended first-clear path requires at least one resolved successful evade before the decisive clear. This requirement belongs to encounter/progression data, not animation completion.

### P1 durable semantics
Conceptual monotonic order:
`OWL_RETURNED -> MANTICORE_TRACE_DISCOVERED -> MANTICORE_CHALLENGE_OPEN -> MANTICORE_LESSON_PROVED -> MANTICORE_CHALLENGE_CLEARED -> NEXT_AREA_OPEN`.

These are semantic labels, not mandated storage keys. Save implementation remains data-driven and additive/default-safe. Resume targets the first incomplete durable milestone. Motion state, viewport state, help state and animation completion are never authority.

- Reload after trace discovery resumes at the boundary investigation, not Thunder Owl discovery.
- Reload after lesson proof but before victory may safely require the encounter to be fought again; it must not grant victory/reward from the proof alone.
- Reload after durable challenge clear cannot duplicate clear rewards or close the next-area route.
- SP-192 is a challenge target here, not automatically a JOIN reward. Any future JOIN eligibility requires a separate Chat-owned species/progression decision.

## P2 — victory creates immediate forward momentum
The first-area challenge must not end in another Archive/Record/COMING SOON dead-end. The one-time Manticore progression reward is **route access**, not another terminology-heavy collectible.

Durable causal order:
`MANTICORE_CHALLENGE_CLEARED -> BOUNDARY_ROUTE_OPENED -> NEXT_AREA_OPEN`.

Player-facing resolution: **「裂空マンティコアを退け、先へ進めるようになった。」** Primary CTA: **「裂け谷の向こうへ進む」**. No Archive acknowledgement is required before travel. Route-open authority is durable progression, never animation or modal dismissal.

## P3 — next-area first discovery contract
Working player-facing area name: **「鳴石の裂け谷」**. This is a scenario label, not a hard-coded runtime `areaId`; Work must use the canonical data-driven WORLD/AREA identity when one exists.

Beyond the torn boundary, wind passing through exposed stone veins makes the valley itself ring. The important change from the previous forest is that traces are no longer only footprints or visible movement: **sound and timing become evidence**. This extends the Thunder Owl lesson and the Manticore lesson without adding a new battle rule.

First-entry player sequence:
`NEXT_AREA_OPEN -> 鳴石の裂け谷へ進む -> 鳴る岩場を探索 -> 正体不明の鳴き返しを発見 -> 生態の手掛かりを記憶 -> FIRST_DISCOVERY_COMPLETE -> 鳴き返しの主を探す`.

Player-facing copy:
- destination: **「鳴石の裂け谷」**
- objective: **「音の返る岩場を調べる」**
- discovery: **「同じ音が、少し遅れて返ってくる。」**
- result: **「この谷には、音に反応して動く生き物がいる。」**
- next CTA: **「鳴き返しの主を探す」**

Sound is narrative/ecological evidence, not an audio-only accessibility dependency. No rhythm QTE, timing meter, extra command or STANCE rule is introduced.

### P3 durable semantics
`NEXT_AREA_OPEN -> NEXT_AREA_ENTERED -> RESONANT_STONE_TRACE_FOUND -> NEXT_AREA_FIRST_DISCOVERY_COMPLETE -> NEXT_AREA_FIRST_TARGET_OPEN`.

Existing Chapter 1/Owl/Manticore receipts are never consumed, renamed, rewritten or downgraded. Reload resumes at the first incomplete durable milestone. Discovery never grants ownership, currency, FUSION material or battle victory.

## P4 — first-target binding gate (new in v2.1)
The first real target after 「鳴き返しの主を探す」 must not be invented from whatever art happens to be available. Chat may bind a species only when **all seven** conditions below are evidenced from canonical main/Art governance:

1. exact canonical roster/species ID is known;
2. exact approved Art Lock/source binding is known;
3. the species ecology is compatible with the resonant-stone call/response clue without rewriting its locked identity;
4. encounter role is explicitly chosen as `HUNT/JOIN` or `AREA_CHALLENGE`;
5. player lesson can be expressed through existing battle/progression grammar;
6. one durable growth consequence is defined (ownership, party/fusion option, route access, or another canonical progression reward);
7. no higher-priority Art/Work P0 ownership or unresolved source HOLD is violated.

Until all seven are satisfied, the target remains **unknown**. Do not show a fake silhouette implying a specific species, do not reuse SP-044/SP-192/SP-001, and do not award a placeholder reward.

When a target is validly bound, its conceptual progression is:
`NEXT_AREA_FIRST_TARGET_OPEN -> FIRST_TARGET_ENCOUNTERED -> FIRST_TARGET_RESOLVED -> NEXT_AREA_GROWTH_REWARD_GRANTED`.

`FIRST_TARGET_RESOLVED` alone is not permission to grant a reward twice. The growth reward must be durable and exact-once; reload after its receipt advances to the next objective. Runtime storage keys remain Work-owned.

### Handoff-ready acceptance payload
A later Chat/Art binding unit should hand Work exactly this minimum payload in one batch: `{speciesId, governedAssetRef, ecologyReason, encounterRole, lessonPredicate, rewardType, nextObjective}`. Missing any field means the binding is not ready for runtime implementation.

## Player-facing clarity guard
Every post-Chapter-1 HOME/AREA state must answer:
- **どこへ行く？** destination;
- **何をする？** one concrete action;
- **何が増える？** monster, route or next objective.

After owl JOIN: 「境界の裂傷を調べる」. After Manticore clear: 「裂け谷の向こうへ進む」. After next-area entry: 「音の返る岩場を調べる」 then 「鳴き返しの主を探す」. No state requires an Archive/Record acknowledgement. LEGACY/MASTERY/REMNANT/RECORD and Build/JSON/Clarity/test terminology must not crowd out the journey.

## Species / Art boundaries
- SP-044 uses canonical locked Thunder Owl assets only.
- SP-192 uses existing governed canonical derivatives only; no regeneration or redesign.
- SP-001 ゴウラ remains excluded from generic fauna; an individual source is not generic population evidence.
- P3/P4 unknown target remains visually/species-unbound until a governed source placement exists.
- Art availability or binary acceptance never creates discovery, JOIN, challenge or reward receipts.

## Conflict boundary
Chat owns scenario/progression/encounter semantics only. No root battle UI, long-press help, STANCE UX, mobile feel, accessibility implementation, QA/automated tests, save migration code, main merge, Pages/publication, prototype deployment or asset generation. Work owns runtime binding/verification/publication; Art owns governed assets and Art Lock.

## Hard rules
Portrait 9:16. NEXT fixed at turn start. Exactly 3 battle monsters. Exactly 2 COMMAND plus remaining 1 STANCE. Save compatibility mandatory. `prototype/chapter1` is integration workspace only and is never the publication target.
