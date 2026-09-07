# MONSTER LEGACY — CHAPTER 1–3 ROADMAP v1.0

Status: DESIGN CANDIDATE / Runtime未実装
Purpose: Chapter 1〜3を、STORY / HUNT / JOIN / PARTY / FUSION / SUMMON / BOSS / LEGACY が毎章つながる形で定義する。

---

# 0. SERIES STRUCTURE

各章の基本構造は共通。

1. STORY — 地域と人物、異常の提示
2. FIELD — 新種の戦い方を観察
3. HUNT — 条件理解
4. JOIN — 仲間化
5. PARTY — 3体編成の再構築
6. FUSION — 系譜の更新
7. NEW SPECIES TEST — 新個体の使い方を体験
8. CONTRACT / SUMMON — 人型支援者による戦術拡張
9. BOSS — 章で学んだ戦術の試験
10. LEGACY — Bossの戦い方を継承
11. ARCHIVE / HOME — 成果を残し、次章へ

重要:
- モンスター獲得はHUNT / JOIN / FUSION。
- SUMMONは契約キャラクターのみ。
- 各章Bossは新ルール追加ではなく、既存コアルールの別解を要求する。
- 章ごとに最低1回「編成を組み替えたくなる理由」を作る。
- 章ごとに最低1回「FUSIONしたくなる理由」を作る。

---

# CHAPTER 1 — 荊棘の境界
Theme: 「理解することで、敵は仲間になる」
Primary System Lesson:
- NEXT ACTION
- 2 COMMAND + 1 STANCE
- VOLTAGE
- JOIN
- SPECIAL FUSION
- 初回LEGACY

## STORY
導入:
ミラ、ゴウラ、カイルと行動。
遺跡近郊でモンスターの行動異常が増加。
“倒すこと”だけでは解決できないと知る。

Key beats:
1. ゴウラと初戦闘
2. 荊棘の大猪と初遭遇
3. 風裂谷へのHUNT
4. 風コウモリと共鳴
5. FUSION LAB解放
6. 炎翼リザル誕生
7. NEW SPECIES TEST
8. 初回SUMMON / SUPPORT CONTRACT
9. 荊棘の大猪 Mastery
10. LEGACY「不退転」
11. HOMEに最初の記録が残る

## HUNT TARGET
風コウモリ

JOIN condition:
- 単体攻撃を回避
- HP35%以下
- RAGE未満
- RESONATE costs 1 COMMAND
- Success deterministic

Learning purpose:
「弱らせるだけでなく、相手の戦い方を理解する」

## PARTY SHIFT
Initial:
- ゴウラ
- 火トカゲ
- 葉ウサギ

After JOIN:
- 風コウモリを含む4体から3体選択

Tactical question:
「受ける / 攻める / 回避する」のどれをSTANCEに残すか

## SPECIAL FUSION
火トカゲ + 風コウモリ → 炎翼リザル

Inheritance:
- Parent A HERITAGE x1
- Parent B HERITAGE x1
- Lv1
- Growth Echo ~60%
- Equipment / LEGACY CORE returned
- Lineage saved

## NEW SPECIES TEST
炎翼リザル専用 45–60 sec

Goals:
- 炎翼牙を使う
- EVADE由来の継承挙動を1回確認
- VOLTAGEをRAGE未満で終える

## CONTRACT INTRO
First guaranteed candidate:
Lyra Vell

Reason:
HUNT/EVADE理解を補助するが、JOINを自動成功させない。

## BOSS
荊棘の大猪

Boss lesson:
RECEIVE / RAISE / STANCE timing

Attack identity:
- 単体突進
- 全体地響き
- 連続圧力

Mastery condition candidate:
- 1回以上STANCEで主要攻撃を受ける
- VOLTAGEをDANGER未満で勝利

## LEGACY
不退転

Per-recipient translation examples:
- ゴウラ: low HPでGUARD強化
- 火トカゲ: low HPで攻撃強化
- 葉ウサギ: ally low HP時にSTANCE heal/shield
- 炎翼リザル: low HPでCORE補正

## CHAPTER END
HOME changes:
- FIELD RECORD +1 JOIN
- LINEAGE appears
- LEGACY RECORD: 不退転
- Support Contract slot visible
- Chapter 2 teaser: 雷雲域

---

# CHAPTER 2 — 雷雲の秩序
Theme: 「危険を抑えるか、利用するか」
Primary System Lesson:
- SUPPRESS
- HEAT ↔ RAGE control
- NEXT target reading
- Contract Character strategy
- LEGACY loadout decision

## STORY
雷雲域で異常放電。
モンスターが“命令されたように”同じ行動パターンを繰り返す。

Verna Noxが本格登場。
Aurellと思想対立。

Verna:
「危険を抱えたまま進む」

Aurell:
「危険は統制されるべき」

Player:
どちらか一方を正解にせず、状況で使い分ける。

## NEW HUNT TARGET
候補: 雷尾リス（temporary name）

Combat identity:
- NEXT単体ロック
- 攻撃後にVOLTAGE上昇
- HEAT帯で回避性能上昇

JOIN condition candidate:
- HEAT帯を1ターン維持
- NEXT対象をSTANCEで受けない
- その後VOLTAGEをCALM寄りへ戻す

Purpose:
HEATをただ避けるのではなく“使って戻す”。

## SECOND HUNT TARGET
候補: 雨甲カメ（temporary name）

Combat identity:
- SUPPRESS耐性
- 低火力・高防御
- 特定ターンだけ殻が開く

JOIN condition candidate:
- 2ターン連続で同一COMMAND種別を使わない
- 殻開放ターンに低ダメージで止める

Purpose:
技連打を防ぎ、COMMAND選択の幅を使わせる。

## PARTY SHIFT
候補:
- ゴウラ
- 葉ウサギ
- 炎翼リザル
- 雷尾リス
- 雨甲カメ

Tactical question:
「RAGEを利用する編成」か「抑制する編成」か。

## SPECIAL FUSION
炎翼リザル + 雷尾リス → 雷炎グリフ（temporary name）

Identity:
- Speed / HEAT leverage
- 攻撃後VOLTAGEを動かす
- 高火力だが制御要求あり

Alternative normal fusion candidate:
葉ウサギ + 雨甲カメ → 苔甲ラビタス（temporary name）
- HEAL / GUARD hybrid

## NEW SPECIES TEST
雷炎グリフ:
- HEATで火力上昇
- RAGEへ入る前にSTANCE/Contractで戻す
- NEXT target対応

## CONTRACT CHARACTER FOCUS
Verna Nox — Featured prototype
Aurell — Story preview / later banner

Chapter 2では、契約キャラが“4人目の火力”ではなく、
VOLTAGEとNEXT判断を変えることを強く見せる。

## BOSS
雷フクロウ

Art:
LOCKED authoritative design

Boss lesson:
SUPPRESS / target reading / calm after escalation

Attack identity:
- 雷槍: single target
- 雷雲: AOE
- static lock: next target emphasis
- attack_prep locked state used

Mastery candidate:
- RAGEに1回入る
- その後CALM/HEATへ戻す
- DANGER未到達で勝利

## LEGACY
静雷

Translation direction:
- 守備型: 被弾後VOL低下
- 攻撃型: HEAT時に初撃強化
- 回避型: target回避後SUPPRESS bonus
- 回復型: STANCE時のVOL stabilization

## CHAPTER END
HOME changes:
- 雷雲の環境演出
- LEGACY RECORD: 静雷
- Contract record expands
- Verna/Aurell relationship archive opens
- Chapter 3 teaser: 裂空域

---

# CHAPTER 3 — 裂空の系譜
Theme: 「受け継ぐほど、自分の形が問われる」
Primary System Lesson:
- CRASH
- Multi-hit sequencing
- Lineage identity
- Multiple LEGACY interaction
- Advanced FUSION choice

## STORY
裂空域で“融合痕”を持つ野生種が現れる。
自然発生のFUSIONではなく、何者かが系譜へ介入している。

Selene Arcの記録が登場。
Rouen AshのFUSION観と対立する研究者勢力を示す。

Core drama:
「強い血統を作る」のではなく、
「何を残し、何を捨てるか」。

## NEW HUNT TARGET
候補: 裂羽ジャッカル（temporary name）

Combat identity:
- RANDOM ×3
- hitごとにターゲット変化
- CRASH buildup

JOIN condition candidate:
- 3hitのうち2hit以上を別々の防御方法で処理
- 最後にSTANCEを残す

Purpose:
連撃を“まとめて耐える”だけでなく、順番を読む。

## SECOND HUNT TARGET
候補: 空洞クラゲ（temporary name）

Combat identity:
- delayed action
- 次ターンへ持ち越す予兆
- low damage / strong VOL manipulation

JOIN condition candidate:
- 予兆を消さずに1回受ける
- 次ターンにVOLを安全帯へ戻す

Purpose:
未来のリスク管理。

## PARTY SHIFT
ここで所持数が増え、
単純な3体固定ではなく“目的別編成”が成立する。

Formation examples:
- RECEIVE heavy
- EVADE/CRASH
- VOL control
- LEGACY chain

## SPECIAL FUSION
雷炎グリフ + 裂羽ジャッカル → 裂雷キマイラ（temporary name）

Identity:
- multi-hit
- CRASH
- high VOL acceleration
- lineage-heavy advanced unit

Alternative:
苔甲ラビタス + 空洞クラゲ → 霧界守り（temporary name）
- delay / heal / control

## FUSION ADVANCE
Chapter 3で初めて、
「親A/BからHERITAGE 1つずつ」だけでなく
継承候補の相互作用プレビューを見せる。

ただし:
- 結果speciesは固定
- appearance blendなし
- random resultなし
- irreversible
- preview required

## NEW SPECIES TEST
Focus:
- multi-hit
- CRASH
- LEGACY chain
- inherited behavior

## CONTRACT CHARACTER FOCUS
Selene Arc — Archive / LEGACY chain
Rouen Ash — Fusion / Lineage
Aurell — full availability candidate

## BOSS
裂空マンティコア

Art:
LOCKED authoritative design

Boss lesson:
CRASH / sequencing / battlefield pressure

Identity:
- 飛翔突貫
- 全体風圧
- RANDOM ×3
- segmented tail attack
- attack_prep locked state

Mastery candidate:
- CRASHを1回発生
- 3hit sequenceを全滅なしで処理
- LEGACYを2体以上で発動
- DANGERを跨いでも立て直して勝利

## LEGACY
墜風

Translation direction:
- tank: 被弾蓄積をGUARDへ
- attacker: multi-hit最終段強化
- evade: 回避成功でCRASH補正
- control: CRASH後VOL抑制

## CHAPTER END
HOME changes:
- LINEAGE TREEがメイン機能へ昇格
- LEGACY RECORD 3/3
- CHAPTER 1–3 RECORD COMPLETE candidate
- Selene deep archive unlocked
- “誰が系譜へ介入しているか”を次章フックにする

---

# 4. INITIAL MONSTER ROSTER EXPANSION TARGET

Locked / existing:
- ゴウラ
- 火トカゲ
- 葉ウサギ
- 風コウモリ
- 炎翼リザル
- 荊棘の大猪
- 雷フクロウ
- 裂空マンティコア

Chapter 2 design candidates:
- 雷尾リス
- 雨甲カメ
- 雷炎グリフ
- 苔甲ラビタス

Chapter 3 design candidates:
- 裂羽ジャッカル
- 空洞クラゲ
- 裂雷キマイラ
- 霧界守り

Important:
Temporary names/designs are NOT Art Lock.
Do not generate canonical art until approved and locked.

---

# 5. BOSS PROGRESSION MAP

Chapter 1 — 荊棘の大猪
Question:
「誰をSTANCEにして受けるか」

Chapter 2 — 雷フクロウ
Question:
「危険帯をどう利用し、どう戻すか」

Chapter 3 — 裂空マンティコア
Question:
「連撃とCRASHをどう順番で処理するか」

This creates progression:
STANCE understanding
→ VOLTAGE control
→ sequencing / advanced mastery

---

# 6. CONTRACT CHARACTER STORY MAP

Chapter 1:
- Mira
- Kyle
- Lyra Vell
- Rouen Ash teaser

Chapter 2:
- Verna Nox full introduction
- Aurell rival role
- Doran Kel
- Verna Featured

Chapter 3:
- Selene Arc
- Rouen Ash full role
- Aurell summon availability
- deeper Contract Memory / Archive hooks

---

# 7. FIRST 90 MINUTES TARGET FLOW

0–5 min
TITLE / Story / first battle

5–15
NEXT + COMMAND + STANCE comprehension

15–25
Boss encounter / loss or partial clear

25–40
HUNT / Wind Bat / JOIN

40–50
PARTY rebuild

50–60
FUSION / Flame Wing Lizard

60–68
NEW SPECIES TEST

68–75
SUMMON tutorial / Lyra contract

75–90
Boss Mastery / 不退転 / Archive / HOME return

Target:
「戦闘だけ」ではなく、90分以内に
JOIN / FUSION / SUMMON / LEGACY
の4本柱を全部一度触らせる。

---

# 8. CONTENT PRODUCTION PRIORITY

P0 — Chapter 1 complete playable
- Story intro
- Wind Bat HUNT/JOIN
- Party
- Flame Wing Lizard Fusion
- Test
- Lyra Summon tutorial
- Boar mastery
- 不退転
- Home closure

P1 — Chapter 2 vertical slice
- 1 new hunt target
- 1 special fusion
- Verna contract
- Thunder Owl
- 静雷

P2 — Chapter 3 systems proof
- 1 multi-hit hunt
- advanced lineage preview
- Selene/Rouen
- Rift Manticore
- 墜風

---

# 9. WORK HANDOFF ACCEPTANCE

Work should not invent new systems while implementing this roadmap.

Implementation order:
1. Make Chapter 1 fully playable end-to-end.
2. Add SUMMON tutorial only after JOIN/FUSION/TEST.
3. Add Support Contract slot.
4. Add Lyra only.
5. Validate Android manual.
6. Only then begin Chapter 2 runtime.

QA labels:
- STATIC PASS
- BROWSER E2E PASS
- ANDROID MANUAL PASS

Never collapse them into one PASS.

---

# 10. DIRECTOR LOCK CANDIDATES

- Chapter structure repeats STORY → HUNT → JOIN → PARTY → FUSION → TEST → CONTRACT → BOSS → LEGACY → HOME.
- Chapter 1 teaches RECEIVE / STANCE.
- Chapter 2 teaches SUPPRESS / VOLTAGE control.
- Chapter 3 teaches CRASH / sequencing / lineage mastery.
- Normal monsters remain outside gacha.
- Contract characters remain outside the 3-monster party.
- Verna is first major Featured after story buildup.
- Boss LEGACY is the chapter’s strategic reward, not just stat loot.
- FUSION results are previewed and deterministic.
- New monster candidate names in Chapter 2–3 are temporary and not Art Lock.
