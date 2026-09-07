# MONSTER LEGACY — CONTRACT CHARACTER ROSTER v1.0

Status: DESIGN CANDIDATE / Runtime未実装  
Purpose: 初期実装候補の契約キャラクター8人を、ガチャ・物語・戦術の3軸で定義する。

## Core Lock
- モンスターはHUNT / JOIN / FUSIONで獲得する。SUMMONから通常モンスターは出さない。
- 契約キャラクターは3体パーティの外側にある SUPPORT CONTRACT 枠へ装備する。
- 3 monsters / 2 COMMAND + 1 STANCE / NEXT turn-lock を崩さない。
- 契約キャラは4人目の通常戦闘員ではない。
- Unique contract characters are never consumed by fusion.
- 重複はCONTRACT MEMORYへ変換し、必須凸にはしない。

## SUPPORT CONTRACT 共通フォーマット
各契約キャラクターは以下4要素を持つ。
1. PASSIVE — 常時有効。判断を少し変える。
2. CONTRACT COMMAND — 1戦1〜2回。通常の2 COMMAND枠を増やさない補助アクション。
3. LEGACY AFFINITY — 特定LEGACY系統への小変換。
4. FIELD TRAIT — HUNT / FUSION / ARCHIVE / STORY等への非戦闘効果。

Rarity candidate:
- SSR = 物語主要人物 / 高演出 / 専用契約演出
- SR = 強い戦術個性 / 低めの物語依存
- R = 初期チュートリアルやコモンプール向け

レアリティで強さの絶対値を大きく分けない。SSRは演出・物語・柔軟性を主価値にする。

# 1. VERNA NOX
Rarity: SSR  
Archetype: VOLTAGE / LEGACY CONVERTER  
Story Timing: Chapter 1終盤で顔見せ、Chapter 2本格登場、最初の大型Featured候補

**PASSIVE — OATH PRESSURE**  
VOLTAGEがHEAT以上のときSTANCE中のモンスターの被ダメージを軽減。RAGE中はCOMMAND側の与ダメージが少し増える代わりにVOLTAGE回復量も増える。

**CONTRACT COMMAND — BLACK OATH**  
1 battle / 1 use。対象1体。COMMANDなら次攻撃強化、STANCEなら次被弾を大幅軽減。

**LEGACY AFFINITY — WEIGHT OF INHERITANCE**  
防御系LEGACY→小回復、攻撃系→VOL微増、制御系→次STANCE効率上昇。

**FIELD TRAIT — OATH RECORD**  
ArchiveでLEGACY由来テキストを1段深く解放。

# 2. AURELL
Rarity: SSR  
Archetype: SUPPRESS / ORDER / NEXT CONTROL  
Story Timing: Chapter 2中盤〜終盤。Vernaの思想的ライバル。

**PASSIVE — ORDERED FIELD**  
NEXT ACTIONがSUPPRESS系・全体攻撃系のとき、対象情報を早めに強調。

**CONTRACT COMMAND — IMPERIAL SEAL**  
1 battle / 1 use。NEXT自体は変更せず、現在のNEXT威力とVOLTAGE上昇を抑える。

**LEGACY AFFINITY — DISCIPLINED CORE**  
制御系LEGACY装備者がSTANCEを取った場合、次ターンCOMMAND候補に小ボーナス。

**FIELD TRAIT — CENSUS**  
HUNT対象の既知行動パターンをCodexに1項目追加表示。

# 3. LYRA VELL
Rarity: SR  
Archetype: EVADE / RESONANCE / HUNT SUPPORT  
Story Timing: Chapter 1 SUMMON tutorial保証枠候補。

**PASSIVE — LIGHT FOOTPRINT**  
単体NEXT対象になったモンスターがSTANCEの場合、EVADE関連判定に小補正。

**CONTRACT COMMAND — ECHO STEP**  
1 battle / 2 uses。対象1体に「次の単体攻撃を受けた後、VOLTAGE微減」。回避確定にはしない。

**LEGACY AFFINITY — RESONANT THREAD**  
EVADE系LEGACY発動後、RESONANCE条件表示を一時強調。

**FIELD TRAIT — TRACKER**  
HUNT画面で未達成RESONANCE条件のヒントを1段階具体化。

# 4. DORAN KEL
Rarity: SR  
Archetype: RECEIVE / GUARD / STANCE SPECIALIST

**PASSIVE — HOLD THE LINE**  
STANCEモンスターが同一ターンに2回以上被弾する場合、2Hit目以降を軽減。

**CONTRACT COMMAND — ANCHOR**  
1 battle / 1 use。すでにSTANCEになる予定のモンスターを強化。2 COMMAND + 1 STANCEの選択結果は改変しない。

**LEGACY AFFINITY — ENDURE**  
防御系LEGACY発動条件を満たしたとき、次ターンだけ小GUARD補正。

**FIELD TRAIT — CAMP DISCIPLINE**  
HOME帰還時、直前の敗北理由を被弾 / VOL / COMMAND不足の3分類でログ表示。

# 5. MIRA
Rarity: SR  
Archetype: HEAL / CALM / PARTY STABILIZER  
Story Timing: Chapter 1主要人物。無料加入型候補。

**PASSIVE — QUIET HANDS**  
ターン終了時、HP一定以下の仲間がいる場合VOLTAGE微減。

**CONTRACT COMMAND — BREATH**  
1 battle / 2 uses。対象1体を小回復。STANCEなら追加でVOLTAGE低下。

**LEGACY AFFINITY — GENTLE MEMORY**  
回復・保護系LEGACY発動時、最低HPの味方へ小シールド。

**FIELD TRAIT — CARE NOTES**  
HOMEで最近被弾したモンスターに短いケアコメント。

# 6. KYLE
Rarity: R  
Archetype: BASIC COMMAND / EQUIPMENT LEARNING  
Story Timing: Chapter 1初期。

**PASSIVE — FIELD ROUTINE**  
EQUIPMENT由来COMMANDを初めて使うターン、その技説明を短く再表示。

**CONTRACT COMMAND — QUICK ADJUST**  
1 battle / 1 use。未実行の選択済みEQUIPMENT COMMAND 1つを別装備技へ差し替え。

**LEGACY AFFINITY — PRACTICAL USE**  
LEGACY発動時、次に相性のいいEQUIPMENT候補をUI強調。

**FIELD TRAIT — KIT CHECK**  
PARTY画面で装備重複や役割偏りを警告。

# 7. SELENE ARC
Rarity: SSR  
Archetype: LEGACY CHAIN / ARCHIVE / HIGH SKILL CEILING  
Story Timing: Chapter 3候補。早期はArchive記録のみ。

**PASSIVE — CHAINED MEMORY**  
異なる2体のLEGACYが同じ戦闘中に発動した場合、2回目を小強化。

**CONTRACT COMMAND — RECALL**  
1 battle / 1 use。直前ターンに発動したLEGACYの副次効果のみ再発動。主効果・大ダメージは再発動しない。

**LEGACY AFFINITY — ARCHIVIST**  
全LEGACY対応だが倍率は小さい。

**FIELD TRAIT — DEEP ARCHIVE**  
LINEAGE / LEGACY Archiveに構成別発動履歴を追加。

# 8. ROUEN ASH
Rarity: R  
Archetype: FUSION / HERITAGE / NEW SPECIES SUPPORT  
Story Timing: FUSION LAB解放時。

**PASSIVE — BLOODLINE READ**  
FUSION後のNEW SPECIES TESTで、継承HERITAGE由来の技を初回使用したとき小ボーナス。

**CONTRACT COMMAND — LINEAGE SPARK**  
NEW SPECIES TEST限定 / 1 use。継承HERITAGE効果を一度強調発動。

**LEGACY AFFINITY — ROOTED MEMORY**  
融合個体にLEGACY装備時、親系統由来なら小補正。

**FIELD TRAIT — LINEAGE PREVIEW**  
FUSION確認画面で、親A/Bから残るもの・消費されるもの・返却Equipment/LEGACY COREを明確化。

# 初期提供プール案

## Tutorial / Free
- Kyle (R) — Chapter 1序盤
- Rouen Ash (R) — FUSION LAB解放
- Mira (SR) — Story clear / free contract candidate
- Lyra Vell (SR) — 初回SUMMON保証候補

## Standard SUMMON
- Kyle
- Rouen
- Mira
- Lyra
- Doran

## Featured / Story Banner
- Verna Nox
- Aurell
- Selene Arc

Vernaを初回無料1連の確定枠にはしない。先に物語で価値を作る。

# 初回SUMMON UX
Unlock condition: JOIN complete + SPECIAL FUSION complete + NEW SPECIES TEST complete

Flow:
1. HOMEに NEW — CONTRACT SIGNAL
2. SUMMON画面
3. 「モンスターは召喚されません」と明示
4. 無料1回
5. Lyra Vell guaranteed candidate
6. 契約演出
7. SUPPORT CONTRACT slot tutorial
8. Boss Masteryへ
9. Boss前に契約効果を1文表示

No shop wall before first contract equip.

# ガチャ経済の暫定ルール
Currency candidate:
- SIGNAL SHARD = 無償
- OATH GEM = 有償候補

Pity candidate:
- SSR 80 pulls hard pity
- Featured 160 pulls guaranteed ceiling
- SR以上 10 pulls guarantee

Duplicate → CONTRACT MEMORY。
Memory用途: conversation / alternate passive branch / archive / cosmetic contract frame / small utility node。

禁止:
- SSR重複5体前提
- 重複でしか基本機能が解放されない
- JOIN/FUSIONを弱く見せる直接的モンスター販売

# 実装優先順位
P0: SUPPORT CONTRACT slot / Lyra / Kyle / Mira / SUMMON tutorial / Boss前equip
P1: Doran / Verna featured prototype / Contract Memory basic conversion
P2: Aurell / Rouen / Selene / Archive & Lineage deep integration

# Acceptance Criteria
- 3-monster party remains exactly 3.
- Contract character is outside the 3 slots.
- Selecting a contract never adds a 3rd normal COMMAND.
- NEXT remains turn-locked.
- Lyra tutorial pull is free.
- Normal monsters never appear in SUMMON results.
- Unique Contract Characters cannot be fusion materials.
- HUNT/JOIN remains required for Wind Bat acquisition.
- SUMMON unlock does not appear before JOIN + FUSION + TEST.
- Mobile 9:16 first.
- All contract effects have explicit UI preview.
- STATIC / BROWSER E2E / ANDROID MANUAL are reported separately.
