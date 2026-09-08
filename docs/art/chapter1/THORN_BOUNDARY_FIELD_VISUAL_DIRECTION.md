# CH1-ENV-001 — 荊棘の境界 FIELD / HUNT Visual Direction

Status: VISUAL_DIRECTION_LOCK
Date: 2026-09-09
Target runtime: AREA exploration / DISCOVERY / HUNT
Planned asset: `assets/backgrounds/chapter1/thorn_boundary_field.jpg`
Official Art Lock: NO — final raster, SHA-256 and runtime crop QA are not yet complete.

## Intent
Chapter 1の基準環境。物語用の一枚絵ではなく、AREA探索→発見→HUNTへ連続利用できるゲームプレイ背景として設計する。荊棘の大猪の既存正式Art Lockを主役として読ませ、背景側から新しいモンスター解釈を追加しない。

## Composition lock — Portrait 9:16
- 上部20%: 遠景。灰青の空、低い山稜、折れた樹冠。タイトル文字やAREA名を置ける低コントラスト域。
- 中央45%: 発見/HUNTの主戦場。左右から黒褐色の荊棘と根が侵入するが、中央は不整形の土・石の空地として開ける。
- 下部35%: UI安全域。踏み荒らされた土、短い枯草、浅い根のみ。高コントラストの枝・発光物・顔に見える形を置かない。
- 奥行きは前景の荊棘→中央空地→崩れた境界標→山稜の4層。中央に単純な一点透視の道を置かず、静止画感を避ける。

## Visual language
- Theme: 「森そのものが拒絶している境界」。悪魔的・ホラー的ではなく、生態圧と重量で危険を示す。
- Palette: charcoal brown / desaturated moss / dry ochre / cold blue-gray. 彩度の高い緑、ネオン紫、全面的な金色逆光は禁止。
- Light: 曇天の拡散光。局所的な湿った反射は可。均一な映画的rim light、過剰なvolumetric beamは禁止。
- Detail: 中景を最も情報量高くし、UI域と遠景は整理。AI生成に見える全面同密度の微細枝・葉・岩テクスチャは禁止。

## Gameplay readability
- Enemy anchor: 画面中央より約8%上、右寄りにも左寄りにも展開できる横長の空地を確保。
- Player/party read: 下中央〜下左右に3体のシルエットが重ならない暗度差を確保。
- Discovery silhouette: 背景中央奥に1体分の暗いシルエットを置ける霧/空気遠近域を残す。
- HUNT reuse: 同一背景を基本採用し、CSS/FXによる軽いvignette・dust・windのみで戦闘状態を差別化。専用HUNT背景の新規制作は現時点で不要。

## Motifs
PASS: 太い捻れ根、折れた境界杭、擦過痕、押し倒された低木、疎らな棘、獣道ではなく踏み荒らされた空地。
HOLD: 巨大な骨、人工遺跡、発光植物 — Chapter 1の情報量を増やすため現段階では採用しない。
REJECT: モンスター形の樹木、目のような発光点、顔に見える節、過剰な赤い血痕、ゴシック城、魔法陣。

## Art Director QA
- Portrait 9:16: PASS
- FIELD/HUNT共用性: PASS
- UI安全域: PASS by specification; raster runtime verification pending
- Existing Art Lock interference: PASS — no character redesign
- AI-gloss / over-detail risk: controlled by explicit restrictions
- Production decision: VISUAL_DIRECTION_LOCK

## Next production action
この仕様を正本としてfinal rasterを1点制作し、360x800 / 390x844 / 430x932のruntime cropで、既存の風コウモリ・荊棘の大猪battle derivativeを重ねて可読性QAする。PASS後のみファイル名・GitHub path・SHA-256を記録してOFFICIAL ART LOCKへ昇格する。
