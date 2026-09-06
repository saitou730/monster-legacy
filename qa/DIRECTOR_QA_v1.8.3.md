# Director QA v1.8.3 — Work Battle Impact Fix

## 判定
今回の体験スコアは未採点。継承記録は82/100 HOLDだが、ユーザーの理想との乖離を解消した証拠にはしない。80点ゲートの新規認定なし。

## 再現と修正
- 元v1.8.2のMLMotion.enemyWarningをVMで実行するとReferenceError: $ is not defined。enemyImpactBeatにも同じ参照があり、その呼出しの後ろにあるenemyActionが実行されない構造。両方をモジュール内byIdへ修正。
- 単体予告のdata-unitセレクタは実際のfield要素に存在しない。実在するfield IDへ修正。
- targetForecastが味方DOM作成前に走り、その後の再描画で消失。描画後にも適用。
- 命中時にHP、VOLTAGE、味方HP、DANGER表示を更新。NEXT再計算とステージ再作成は行わない。
- 大猪に存在しないattack_prepを指定してidleへ戻っていた。既存公式stanceを予備動作に使用。
- 命中時のmain全体の追加揺れを除去。既存battlefieldカメラだけを使用。
- 解決中のBoss切替・リセットを拒否し、既存タイマーが別の戦闘を変更する経路を防止。
- 反射ダメージによる敵HP0をターン終了で勝利判定。

## 検証
| 検証 | 結果 |
| --- | --- |
| 旧版での未定義参照再現 | FAILを再現、修正版はPASS |
| Node VMの演出回帰 | 単体対象・命中・後片付け・全体・スキップ・減動作の6観点PASS |
| Source integrity | 10/10 STATIC PASS |
| src全JS構文 | STATIC PASS |
| 素材SHA256 | 73/73一致 |
| Save/Continue | storage.js未変更。実ブラウザでの往復試験は未実施 |
| ブラウザE2E | NOT RUN。PlaywrightライブラリはあるがChromium実行ファイルなし |
| Portrait 360/390/430 | NOT RUN。既存設定と新規boss-impact.spec.jsで検証予定 |
| Android実機・音の聴取 | NOT RUN |

VMテストはDOMの最小代替で、描画・タッチ・戦闘全体の実証ではない。新規ブラウザテストも未実行であり合格扱いしない。

## 未解決の監査所見
- 味方2COMMANDは一括計算・合計ダメージ演出で、個別の攻撃と着弾の対応が弱い。
- 敵の状態と味方ポーズの表現には、回避時の被弾演出やKO時の対象整理の追加監査が必要。
- 既存smoke.spec.jsは条件分岐で操作をスキップでき、完全な初回導線の保証にならない。
- UIの累積CSS、主役サイズ、背景との一体感はレンダリングを見て判定する必要がある。
- 添付に旧公式素材と後続Art Lock素材がある。今回は73点すべて無変更。新規ビジュアル解釈なし。

## 次の最優先3項目
1. 同一コードをブラウザで実行し、エラーゼロ・NEXT固定・命中HP反映・Save/Continueを実証。
2. 390幅の大猪戦を変更前後で比較し、個別攻撃・着弾・反応を一本の時系列に整理。
3. Android実機で可読性、入力、BGMを確認してからDirector体験評価を更新。
