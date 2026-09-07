# MONSTER LEGACY — CHAPTER 1 30–90 MIN SCENE SPEC v1.0

Status: DESIGN CANDIDATE / Runtime未実装
Scope: 風コウモリHUNT開始〜Chapter 1終了まで
Target playtime: 30〜90分
Screen: Portrait 9:16

Core objective:
- HUNT → JOIN → PARTY → FUSION → NEW SPECIES TEST → SUMMON → BOSS MASTERY → LEGACY → HOME
  を一続きの体験として完結させる
- 「集める」「作る」「契約する」「継承する」が別メニューではなく、物語上の必要から解放される構成にする
- Chapter 1の最後に「このゲームで何を繰り返すのか」を自然に理解させる

---

# 0. CONTINUATION POINT

前半終了地点:
- 風コウモリHUNT進行中
- プレイヤーはNEXT / COMMAND / STANCE / VOLTAGEを理解済み
- 荊棘の大猪は一度撤退済み
- HOME初訪問済み
- FIELD/HUNT解放済み

ここからJOIN/FUSION/LEGACYを順に初解放する。

---

# 1. HUNT — WIND BAT RESONANCE
Target: 30:00–38:00

Enemy:
風コウモリ

Core condition:
- 単体攻撃を回避
- HP35%以下
- RAGE未満
- RESONATE consumes 1 COMMAND
- deterministic success

## UX
HUNTでは「倒す」より条件達成が主目的。

Enemy sticky panel:
- HP
- VOLTAGE
- BAND
- RESONANCE progress

Progress wording:
1. [ ] 攻撃の癖を見切る
2. [ ] 力を落とす
3. [ ] 警戒を高めすぎない

Exact thresholdsは詳細タップ時のみ。

## Failure handling
If lethal damage while condition qualified:
- HP clamps to 1
- RESONANCE READY
- RESONATE button appears

If lethal damage without qualification:
- FIELD RESONANCE LOST
- short result
- RETRY

No silent 0HP hang.

## RESONATE moment
When ready:
Battle tempo drops.
BGM ducks.
Wind Bat stops attacking.

Button:
RESONATE

On tap:
- consumes 1 COMMAND
- no RNG
- visual pulse from player side to target
- target leaves battle
- battle concludes after remaining enemy logic if needed

Result:
RESONANCE SUCCESS
「風コウモリが後を追っている」

No capsule/capture imagery.

---

# 2. JOIN RESULT / HOME RETURN
Target: 38:00–42:00

HOME return is automatic after short result.

New visual:
風コウモリがHOMEの端にいる。
最初は少し距離を取る。

Mira:
「仲間になった、というより……ついてきた、かな。」

Kyle:
「編成を見直そう。」

New unlock:
PARTY — NEW

No FUSION yet.

---

# 3. PARTY REBUILD
Target: 42:00–48:00

Roster:
- ゴウラ
- 火トカゲ
- 葉ウサギ
- 風コウモリ

Exactly 3 active slots.

## Tutorial
Message:
「3体を選んでFIELDへ出る」

Player must bench 1.

Each card shows only:
- ROLE
- CORE
- STANCE identity

Long press:
full detail.

Recommended hint:
Wind Bat + Fire Lizard pairing gets subtle “?” lineage marker.
Do not reveal result yet.

## Completion
Any valid 3 allowed.
But if Fire Lizard + Wind Bat both active/owned:
Kyle notices unusual resonance.

Kyle:
「この2体、反応が似てる。」

New unlock:
FUSION LAB

---

# 4. FUSION LAB INTRO
Target: 48:00–53:00

First presentation should feel like a meaningful choice, not crafting menu.

Visual:
two parent pedestals
center empty silhouette
lineage thread visual

Rouen Ash teaser optional:
recorded note / voice only

Message:
「融合は元に戻せない。」

Explicit preview:
- Parent A consumed
- Parent B consumed
- Equipment returned
- LEGACY CORE returned
- child Lv1
- Growth Echo ~60%
- HERITAGE 1 from A
- HERITAGE 1 from B
- species result fixed

Protected favorites cannot be selected.

---

# 5. FIRST SPECIAL FUSION
Target: 53:00–58:00

Required:
火トカゲ + 風コウモリ → 炎翼リザル

This special fusion may skip normal TIER progression.

## Heritage selection
Parent A candidate:
- 火炎適応
- 牙撃強化

Parent B candidate:
- 風読み
- 回避反応

For tutorial:
show 2 choices each, but recommend one pair.

Do not allow random result.

## Confirmation
Final panel:
「この融合は元に戻せません」

Hold-to-confirm candidate:
700ms press
or explicit two-step confirm.

## Birth sequence
No excessive gacha sparkle.
Use lineage emphasis:
- fire thread
- wind thread
- converge
- silhouette
- Flame Wing Lizard reveal

Species identity fixed.
No parent appearance blending.

Result title:
NEW LINEAGE
炎翼リザル

---

# 6. NEW SPECIES TEST
Target: 58:00–65:00

Duration:
45–60 seconds target.

Enemy:
training target / weak field creature

Party must include:
炎翼リザル

## Required interactions
1. CORE 炎翼牙
2. ROLE 逆風滑空
3. EQUIPMENT 静音弓
4. one STANCE observation

Each first-use gets short one-line contextual explanation.

Long press still available.

## Success criteria
- use CORE once
- use ROLE once
- use EQUIPMENT once
- finish below RAGE
- no need for perfect win

Result:
TEST COMPLETE
「この種は、戦える。」

## Narrative
Mira:
「前の2体が消えたわけじゃないね。」

Kyle:
「残り方が変わった。」

This frames Fusion as lineage, not disposal.

---

# 7. SUMMON UNLOCK
Target: 65:00–68:00

Only now.

HOME visual:
new signal appears near an unused device/altar.

Label:
CONTRACT SIGNAL

Do not show “GACHA” as first wording.

Mira:
「モンスターじゃない。誰かが、こっちを見てる。」

Tap opens SUMMON.

---

# 8. FIRST SUMMON TUTORIAL
Target: 68:00–73:00

Header:
SUMMON — CONTRACT

One-line rule:
「ここで呼び出されるのは契約者です。モンスターは出現しません。」

First pull:
FREE
GUARANTEED
Lyra Vell candidate

## Animation
Signal trace
human silhouette
contract mark
portrait reveal

No weapon-heavy “combat unit acquired” framing.

Result:
CONTRACT ESTABLISHED
Lyra Vell

## Duplicate/rarity
Do not explain pity/rates yet.
Do not show paid shop.
No purchase prompt.

---

# 9. SUPPORT CONTRACT EQUIP
Target: 73:00–77:00

New slot:
SUPPORT CONTRACT

Outside 3-monster party.

Equip:
Lyra Vell

Show only:
PASSIVE
CONTRACT COMMAND
FIELD TRAIT

First tooltip:
「契約者は4体目の戦闘員ではありません」

Core protection:
- party remains 3
- 2 COMMAND + 1 STANCE unchanged

Lyra preview:
EVADE / HUNT support
light VOL stabilization

Completion:
Boss rematch marker appears.

---

# 10. BOSS REMATCH BRIEF
Target: 77:00–80:00

Destination:
荊棘の境界

Mira:
「今度は倒せる、じゃない。」
「今度は、どう戦うか分かってる。」

Boss mastery hint:
- major attackをSTANCEで受ける
- VOLTAGEを上げすぎない

No exact hidden mastery score yet.

---

# 11. BOAR MASTERY BATTLE
Target: 80:00–87:00

Enemy:
荊棘の大猪

Battle should reuse first encounter but with one meaningful escalation.

## Turn pattern candidate
Turn 1:
単体突進 → target visible

Turn 2:
地響き ALL

Turn 3:
荊棘纏い

Turn 4:
破砕突進
STANCE recommended

Turn 5+:
mixed pattern

## Difference from first encounter
Player now has:
- stronger party understanding
- Flame Wing Lizard
- Support Contract
- better VOL control

Do not simply lower boss stats massively.

## Mastery conditions
At least one:
- major attack absorbed by STANCE
- no DANGER entry
- or recover from HEAT safely

Completion:
BOSS MASTERY

---

# 12. FIRST LEGACY REWARD
Target: 87:00–89:00

Reward:
LEGACY — 不退転

Presentation:
Boss silhouette behind legacy sigil.
No loot chest.

Message:
「戦い方は、残る。」

Then show recipient translation.

Examples:
ゴウラ:
low HP → GUARD

火トカゲ:
low HP → ATTACK

葉ウサギ:
ally low HP → shield/heal

炎翼リザル:
low HP → CORE correction

Important:
same LEGACY, different expression by recipient.

Player equips to one target.

---

# 13. ARCHIVE / LINEAGE UNLOCK
Target: 89:00–90:00+

New unlocks:
- LEGACY RECORD
- LINEAGE
- FIELD RECORD

## LINEAGE first view
火トカゲ
+
風コウモリ
↓
炎翼リザル

Show:
HERITAGE selections
first fusion date
test result

## LEGACY first view
不退転
source:
荊棘の大猪

equipped recipient:
player choice

## FIELD RECORD
風コウモリ
JOIN completed

---

# 14. CHAPTER 1 END HOME

HOME should visibly change.

Before:
temporary base

After Chapter 1:
- Wind Bat record visible even if fused
- Flame Wing Lizard present
- Legacy sigil on record wall
- contract signal active
- archive shelf or terminal active

Title:
CHAPTER 1 COMPLETE
荊棘の境界

Next teaser:
雷鳴
dark sky
Thunder Owl silhouette only if Art Lock-compatible asset already exists

No immediate auto-start Chapter 2.
Return control to HOME.

---

# 15. 30–90 MIN EMOTIONAL ARC

30–40:
「倒さなくても仲間になる」

40–60:
「仲間は編成と系譜へつながる」

60–75:
「人型キャラはモンスターを支える」

75–90:
「Bossの戦い方そのものを継承できる」

This establishes the four pillars:
JOIN
FUSION
CONTRACT
LEGACY

---

# 16. UI UNLOCK SCHEDULE

At game start:
STORY
FIELD
PARTY basic

After JOIN:
PARTY full roster

After Party check:
FUSION

After Fusion Test:
SUMMON
SUPPORT CONTRACT

After Boss Mastery:
LEGACY
ARCHIVE
LINEAGE

Never show all locked menu icons from minute 1.

---

# 17. CHAPTER 1 ACCEPTANCE CRITERIA

JOIN:
- Wind Bat cannot be obtained by SUMMON
- Resonance success deterministic
- RESONATE consumes exactly 1 COMMAND
- no 0HP deadlock

PARTY:
- exactly 3 active monsters
- Wind Bat can be benched or used before Fusion

FUSION:
- Fire Lizard + Wind Bat result fixed to Flame Wing Lizard
- parent consumption explicit
- equipment/core return explicit
- irreversible warning explicit
- lineage recorded

TEST:
- CORE/ROLE/EQUIPMENT buttons tappable on Android
- long press shows help
- long press does not execute

SUMMON:
- unlock after JOIN + FUSION + TEST
- free first pull
- no monsters in result
- no payment prompt in tutorial
- contract slot outside party

BOSS:
- rematch meaningfully tests STANCE/VOLTAGE
- mastery result distinct from normal WIN

LEGACY:
- same legacy differs by recipient
- equip target preview visible

HOME:
- visible state change after chapter completion
- archive/lineage records reflect actual journey

---

# 18. WORK IMPLEMENTATION ORDER

1. Complete HUNT outcome handling
2. JOIN result → HOME
3. Party roster add/bench
4. Fusion Lab first-use flow
5. Flame Wing birth
6. New Species Test
7. SUMMON tutorial
8. Support Contract equip
9. Boss Mastery rematch
10. Legacy award/equip
11. Archive/Lineage closure
12. HOME chapter-complete state
13. E2E for entire 30–90min route
14. Android manual pass

Do not begin Chapter 2 runtime until Chapter 1 end-to-end is stable.

---

# 19. E2E SCENARIOS

Scenario A — JOIN
- enter HUNT
- achieve evade
- reduce HP
- verify RAGE threshold
- tap RESONATE
- Wind Bat joins

Scenario B — PARTY/FUSION
- open Party
- verify 4 roster / 3 slots
- open Fusion
- select Fire Lizard + Wind Bat
- select heritages
- confirm
- verify Flame Wing Lizard exists
- parents removed
- equipment returned

Scenario C — TEST
- tap CORE
- tap ROLE
- tap EQUIPMENT
- long-press STANCE help
- verify no duplicate action

Scenario D — SUMMON
- verify locked before TEST
- unlock after TEST
- free pull
- Lyra guaranteed
- equip Support Contract
- party remains 3

Scenario E — BOSS/LEGACY
- rematch Boar
- complete mastery
- receive 不退転
- verify recipient-dependent preview
- equip
- archive records update

---

# 20. DIRECTOR LOCK CANDIDATES

- Chapter 1 end-to-end target is 90 minutes.
- First four pillars experienced in order: JOIN → FUSION → CONTRACT → LEGACY.
- FUSION result is deterministic.
- SUMMON does not grant monsters.
- First SUMMON is free and guaranteed.
- Contract character does not become 4th party member.
- Boss rematch is “understanding demonstrated,” not merely stat check.
- HOME visibly records the player’s journey.
