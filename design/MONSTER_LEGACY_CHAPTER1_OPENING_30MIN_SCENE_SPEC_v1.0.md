# MONSTER LEGACY — CHAPTER 1 OPENING 30 MIN SCENE SPEC v1.0

Status: DESIGN CANDIDATE / Runtime未実装
Scope: TITLE開始〜風コウモリHUNT開始直前まで
Target playtime: 25〜30分
Screen: Portrait 9:16
Core objective:
- 「突然HOMEへ飛ばされる」現状を解消する
- 物語→戦闘→敗北/撤退→拠点→HUNTという自然な導線を作る
- NEXT / 2 COMMAND + 1 STANCE / VOLTAGE を説明しすぎず体験で理解させる
- Chapter 1の最初の感情軸を「倒す」ではなく「理解する」へ持っていく

---

# 0. OPENING PRINCIPLE

初回起動でHOMEには行かない。

正式導線:
TITLE
→ PROLOGUE
→ FIELD INTRO
→ FIRST BATTLE
→ BOAR ENCOUNTER
→ RETREAT
→ HOME ARRIVAL
→ STORY BRIEF
→ HUNT UNLOCK

HOMEは「最初に見せるメニュー」ではなく、
一度外の世界を経験したあとに戻ってくる「基地」として初登場させる。

最初の30分でプレイヤーに覚えさせる用語は4つだけ:
- NEXT
- COMMAND
- STANCE
- VOLTAGE

JOIN / FUSION / LEGACY / SUMMON はまだ用語だけ先出ししない。

---

# 1. TITLE — 0:00–0:45

## Visual
暗い遺跡壁面。
画面中央にMONSTER LEGACYロゴ。
背景奥で風に揺れる草。
ごく遠くで雷光。

STARTボタンのみ。

## Interaction
START tap

## Audio
BGMは低い環境音から開始。
最初のタップでAudio unlock。

## Transition
白フラッシュ禁止。
黒→風景フェード。

---

# 2. PROLOGUE — 0:45–2:30

## Scene
峡谷の細道。
主人公視点。
前方にミラとゴウラ。

Mira:
「この先、空気が重い。」

Kyle:
「また痕跡がある。昨日より近い。」

主人公の短い選択肢:
- 「モンスターの？」
- 「誰かがやった？」

どちらでも本筋は変えない。
選択は人格付け用。

## Exposition rule
世界設定は3文以上連続で説明しない。
異常は“見せる”。

具体表現:
- 木の幹に焦げ跡
- 地面に掘り返された跡
- 遠くで低い唸り声
- 小型モンスターが一斉に逃げる

## End beat
ゴウラが立ち止まる。
Mira:
「来る。」

Battle transition.

---

# 3. FIRST BATTLE — 2:30–7:30

Purpose:
- 3体が戦場にいることを理解
- NEXTがターン開始時に固定
- 2 COMMAND + 1 STANCEを触る
- STANCEが「余った1体」ではなく明示的役割だと理解
- VOLTAGEはまだCALM〜HEATまで

## Enemy
小型の野生種（既存アセット利用優先。新Art Lock不要）
仮: 野犬型 / 低脅威

## Party
- ゴウラ
- 火トカゲ
- 葉ウサギ

## Turn 1 — scripted NEXT
Enemy NEXT:
単体攻撃 → ゴウラ

UI teaching:
NEXT部分を軽くpulse。
「敵は次の行動を先に見せる」

Player must choose:
- 2 COMMAND
- remaining 1 STANCE

初回だけCOMMAND選択数を画面上に
1/2 → 2/2
と強調。

STANCEは自動確定ではなく、
選ばれなかった1体に
STANCE
と明示表示。

## Turn 2
Enemy NEXT:
全体弱攻撃

ここで葉ウサギのROLE技を見せる。

## Turn 3
Enemy NEXT:
単体攻撃 → 火トカゲ

火トカゲCOMMANDを選ぶと、
ゴウラ/葉ウサギのどちらをSTANCEに残すか迷う状況。

## Win condition
3〜4ターンで勝利。
敗北しない。

## Battle result
「WIN」だけ。
経験値数字を大量に出さない。

Mira:
「動きが変だった。」

Kyle:
「逃げてるようにも見えた。」

次の場面へ。

---

# 4. FIELD WALK — 7:30–9:00

簡易ストーリー画面。
移動の雰囲気を見せる。

Player interaction:
「進む」1回のみ。

背景:
壊れた石柱。
草木が一方向へ倒れている。

SE:
低い地響き。

ゴウラが画面前へ出る。

---

# 5. FIRST BOAR ENCOUNTER — 9:00–14:00

Enemy:
荊棘の大猪

Purpose:
勝利ではなく、
「今は理解が足りない」を体験させる。

重要:
ゲーム開始直後に“理不尽な敗北”にはしない。
プレイヤーが1〜2回正しく対応できたうえで、
Bossの圧力が上がる。

## Boss intro
大猪を画面上部いっぱいに出す。
UIは一瞬消してモンスターを見る時間を1.0〜1.5秒作る。

Boss title:
荊棘の大猪
「境界を踏み荒らすもの」

## Turn 1
NEXT:
単体突進 → ゴウラ

正しくSTANCEすると耐えられる。

## Turn 2
NEXT:
地響き / ALL

VOLTAGEがHEATへ上がる。

ここで初めて
VOLTAGE: CALM → HEAT
を視覚的に見せる。

説明テキスト:
「戦場が荒れるほどVOLTAGEが上がる」

## Turn 3
NEXT:
連続圧力

敵HPはまだ高い。
プレイヤー側は削れるが、
大猪が「荊棘纏い」状態へ。

この状態では与ダメ低下。

Kyle:
「殴り続けても通らない！」

## Turn 4 — Retreat trigger
Bossが強攻撃予告。

Mira:
「ここで倒す相手じゃない。戻ろう！」

UI:
RETREAT COMMAND
を一度だけ表示。

RETREATは敗北扱いではない。

Player tap:
RETREAT

## Result
BATTLE INTERRUPTED
「撤退成功」

No red defeat screen.

---

# 6. RETREAT STORY — 14:00–16:30

峡谷から離脱。

主人公:
「勝てなかった。」

Mira:
「違う。まだ分からなかっただけ。」

ここでChapter 1のテーマを言語化。

Kyle:
「正面から倒す前に、この辺りのモンスターの動きを調べよう。」

遠くで風コウモリの影。

Mira:
「あの子も、逃げてる。」

HUNTの伏線。

---

# 7. FIRST HOME ARRIVAL — 16:30–20:00

ここで初めてHOME。

重要:
初回HOMEは通常HOMEよりUIを減らす。

表示:
- STORY
- PARTY
- FIELD

未解放アイコン:
- FUSION
- SUMMON
- ARCHIVE

ただし全部を灰色で並べすぎない。
「何か増えていく場所」という印象だけ作る。

## Home visual
中央:
3体モンスター
後方:
簡易拠点
NPC:
Mira / Kyle

## Home line
Mira:
「ここなら少し休める。」

Kyle:
「大猪を追う前に、風裂谷を見よう。」

## Interaction
FIELDにNEW marker。

ユーザーが他ボタンを触っても
PARTYは見られる。
STORYは短いログ。
しかし主導線はFIELD。

---

# 8. PARTY FIRST LOOK — optional 20:00–22:00

強制しないが、FIELDへ行く前にPARTYへ誘導。

初回だけ
「3体で行動する」
という一文。

表示:
ゴウラ / 火トカゲ / 葉ウサギ

ここでは装備・LEGACYを全部開放しない。
情報過多を避ける。

見せる項目:
- ROLE
- CORE
- STANCE identity

技詳細:
tap = select
long press = 説明

これは将来の全バトルUI仕様へ統一。

---

# 9. HUNT BRIEFING — 22:00–24:30

FIELD tap

Mapではなく、
Chapter 1の小さな地域選択。

Destination:
風裂谷

Title:
HUNT — 風コウモリ

Brief:
「逃げる風コウモリを追う」

Kyle:
「攻撃を避けたあと、動きが鈍る。」
「追い詰めすぎると、逆に暴れる。」

ここでJOIN条件を全部数値では見せない。

Visible hints:
- 回避させる
- 弱らせる
- 怒らせすぎない

Exact:
HP35%
RAGE未満
はCodex/詳細を見た場合のみ。

---

# 10. HUNT ENTRY — 24:30–30:00

HUNT開始。

ここから既存v1.8系HUNTへ接続。

最初のターンで
風コウモリが高速単体攻撃。

NEXT target visible。

Player learns:
「倒すのではなく、条件を満たす」

## Hunt UI
Sticky NEXT内に:
- Enemy HP
- VOLTAGE
- BAND

RESONANCE panel:
最初は3つの条件を曖昧表示。

条件達成ごとに
1つずつ明確になる。

Example:
[✓] 攻撃をかわした
[ ] まだ警戒している
[ ] 力を落としている

HP35%以下になると:
[✓] 力を落としている

RAGEに入ると:
[!] 警戒が強すぎる

## End of 30min target
RESONANCE READY直前または初回READYまで。

---

# 11. FIRST SESSION UX RULES

## Do not
- START直後HOME
- 5個以上のメニュー説明
- JOIN/FUSION/SUMMON/LEGACYを一気に説明
- 初戦から難しいSTANCE最適化
- 最初のBossをただの敗北イベントにする
- 長文世界設定
- チュートリアルポップアップ連打

## Do
- 体験→短い説明
- モンスターを先に見せ、UIは後から出す
- Boss撤退を「失敗」にしない
- HOME初登場に意味を持たせる
- HUNTへ物語的理由を作る

---

# 12. LONG-PRESS SKILL HELP SPEC

Problem:
スタンスや技が、選ぶ時に何をするか分かりづらい。

Formal rule:
- Tap = 選択
- Long press 450ms = 詳細
- Desktop hover/focus = 詳細候補
- Android: pointerdown → 450ms → sheet
- 指が10px以上移動したらlong-press cancel

Detail sheet:
NAME
TYPE: CORE / ROLE / EQUIPMENT / STANCE
EFFECT
TARGET
VOLTAGE IMPACT
NEXT SYNERGY
HERITAGE / LEGACY interaction if relevant

STANCE example:
「防御姿勢。COMMANDを選ばなかった1体が取る。被ダメージ軽減と固有STANCE効果を得る。」

Important:
Long-press sheet must not execute the skill.

---

# 13. OPENING ACCEPTANCE CRITERIA

Gameplay:
- STARTからHOMEへ直接遷移しない
- First battle within 3 minutes
- Player executes 2 COMMAND + 1 STANCE by minute 5
- VOLTAGE introduced by minute 12
- Boar encounter does not require winning
- Retreat is intentional state, not defeat
- HOME first appears after field experience
- HUNT motivation is story-supported
- Wind Bat HUNT begins by minute 25 target

UX:
- No more than 4 new terms in first 15min
- Long press explains skill/STANCE
- Long press never triggers action
- 390x844 no overlap between TURN/action rail/party cards
- Sticky enemy HP/VOLTAGE remains visible in HUNT
- Ability sheet tap works on Android

Narrative:
- Mira states “まだ分からなかっただけ” theme
- Boar is established before Mastery battle
- Wind Bat appears before HUNT menu
- HOME feels like return/base, not default menu dump

QA:
STATIC PASS
BROWSER E2E PASS
ANDROID MANUAL PASS
must remain separate.

---

# 14. IMPLEMENTATION ORDER FOR WORK

1. Add START → PROLOGUE state
2. Add FIRST BATTLE scripted tutorial
3. Add BOAR ENCOUNTER + RETREAT state
4. Gate HOME until retreat
5. Add reduced first-HOME layout
6. Add FIELD → HUNT briefing
7. Connect to existing HUNT
8. Add long-press help for all skill buttons + STANCE
9. Add E2E for:
   START
   first battle
   retreat
   HOME
   HUNT
   long-press no action
10. Android manual test

Do not add SUMMON/FUSION during this implementation pass.
First make the opening feel intentional.
