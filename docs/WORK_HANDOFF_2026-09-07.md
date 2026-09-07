# MONSTER LEGACY — WORK HANDOFF
Date: 2026-09-07 JST
Status: Active production handoff from ChatGPT chat workflow to ChatGPT Work.

## 0. Executive instruction
Treat the latest packaged build and this handoff as the authoritative production context for continuation. Do NOT redesign from zero. Continue from the current web vertical-slice codebase and preserve all locked rules/art unless explicitly instructed otherwise.

Primary objective of the Work session:
1. Move development away from chat-exported Direct Play HTML files.
2. Make GitHub the single source of truth.
3. Fully synchronize the current v1.8.2 source + official binary assets.
4. Establish browser E2E + fixed HTTPS deployment URL.
5. Resume game development only after the repository-first pipeline is working.

## 1. Current product / design canon
- Portrait First, 9:16.
- NEXT ACTION is turn-locked at turn start.
- Party = exactly 3 monsters.
- Player selects exactly 2 COMMAND per turn.
- Remaining unselected monster uses STANCE.
- Core philosophy: "UIを見るゲームではなく、モンスターを見ながら判断するゲーム".
- Do not reinterpret or regenerate same-name locked monsters.
- Art Lock / Creative Guideline / official design sheets are top-level canon.
- Do not call Android/physical-device QA PASS unless actually validated on device.

### Core battle language
- Enemy + NEXT in upper area.
- Battlefield visually dominant.
- All 3 party monsters present on battlefield.
- COMMAND-selected units step forward; STANCE unit recedes/guards.
- Enemy telegraphs NEXT via prep state/motion where available.
- VOLTAGE states: CALM → HEAT → RAGE → DANGER → LEGACY.
- LEGACY should create strong stillness/telegraph, not change underlying rules.

## 2. Current gameplay loop design
Target full first-session loop:
START → HOME → STORY → HUNT → JOIN → PARTY → FUSION → NEW SPECIES TEST → BOSS → LEGACY ARCHIVE → HOME

### HUNT / JOIN
- No capture RNG.
- Wild target must satisfy field resonance condition.
- RESONATE costs 1 COMMAND and succeeds deterministically when ready.
- First JOIN target: 風コウモリ.
- First condition: evade a single-target attack, then reduce HP to <=35% while staying below RAGE.

### FUSION
- First special fusion: 火トカゲ + 風コウモリ → 炎翼リザル.
- Result is not random.
- Choose one HERITAGE from parent A and one from parent B.
- Child Lv1.
- Growth Echo ~60%.
- Equipment / LEGACY CORE return automatically.
- Irreversible, full preview, lineage saved.
- Species identity fixed; no visual parent blending beyond small legacy marks.

### LEGACY
- Boss mastery unlocks CORE-like inherited combat identity.
- Same LEGACY translates differently by recipient.
- Example 不退転:
  - ゴウラ: low-HP guard boost
  - 火トカゲ: low-HP attack boost
  - 葉ウサギ: low-ally-HP extra shield/heal

## 3. Locked monster art
Authoritative locked battle identities include:
- ゴウラ
- 火トカゲ
- 葉ウサギ
- 風コウモリ
- 炎翼リザル
- 荊棘の大猪
- 雷フクロウ (locked)
- 裂空マンティコア (locked)

Thunder Owl lock:
- White/grey/blue feathers
- gold metallic accents
- amber/yellow eyes
- elegant lightning
- intelligence / mystery / dignity
- ~100cm, wingspan ~2m

Rift Manticore lock:
- lion musculature + flight wings
- two swept-back horns
- segmented tail
- realistic weight
- wind is external
- no owl/bird torso or beak
- no shape/count reinterpretation

## 4. Latest implementation state
Latest working package:
- v1.8.2 Touch Input Fix

Primary local artifacts from the chat session:
- /mnt/data/MONSTER_LEGACY_v1.8.2_TOUCH_INPUT_FIX_DIRECT_PLAY.html
- /mnt/data/MONSTER_LEGACY_WEB_v1.8.2_TOUCH_INPUT_FIX.zip
- /mnt/data/MONSTER_LEGACY_v1.8.1_to_v1.8.2_TOUCH_INPUT_FIX.patch

Development-v2 bootstrap created:
- /mnt/data/MONSTER_LEGACY_DEV_V2_BOOTSTRAP.zip

The bootstrap is intended to become the repository-first source package. It contains the current game source, assets, and dev-infra scaffolding.

## 5. Recent implemented versions
v1.3.x — Combat readability / audio pacing
- BGM + SE wiring repaired for Direct Play.
- First user gesture unlocks audio in autoplay-safe way.
- SOUND ON/OFF control.
- ENEMY ACTION callout.
- Enemy turn pacing separated from player hit.
- Single-target / ALL TARGET / RANDOM×3 warnings.

v1.4 — Game Loop Shell
- Title/start gate.
- Startup always HOME.
- Journey route for STORY → HUNT/JOIN → PARTY → FUSION → TEST → BOSS → ARCHIVE.

v1.5 — Loop Closure
- Explicit JOIN result.
- FUSION birth/lineage result.
- TEST complete result.
- LEGACY result.
- Archive → HOME handoff.

v1.6 — Living Home Hub
- LEGACY RECORD.
- LINEAGE history.
- FIELD RECORD.
- Party/loadout identity.
- Milestone-driven HOME atmosphere.

v1.7 — Party Formation
- Persistent 3-slot party formation.
- Slot focus + roster assignment.
- JOIN adds Wind Bat to roster.
- FUSION removes consumed parents and normalizes party to include Flame Wing Lizard.

v1.8 — Tactical Loadout
- Formation + EQUIPMENT + LEGACY integrated into PARTY.
- Equipment framed as 3rd COMMAND source.
- Unit-specific LEGACY effect preview.
- Fixed missing ML exposure for setPartyFocus/assignParty.

v1.8.1 — Mobile HUNT Fix
Fixes based on real Android screenshots:
- HUNT no longer stalls at enemy HP 0.
- Qualified resonance clamps to 1 HP and opens RESONATE.
- Unqualified KO shows FIELD RESONANCE LOST + retry.
- Compact HP/VOLTAGE/BAND kept visible in sticky NEXT.
- HUNT action rail overlap reduced.
- BGM stem edges faded (~90ms) to reduce loop-boundary pops.

v1.8.2 — Touch Input Fix
Fixes based on real Android screenshot where 炎翼リザル technique sheet opened but technique buttons did not respond:
- Removed inline onclick for technique sheet actions.
- Event delegation through #sheetBody.
- data-sheet-action / uid / kind routing.
- pointer-events / touch-action explicitly handled.
- HUNT / TEST / BOSS technique sheets unified to same interaction path.
- Duplicate 2-COMMAND assignment guarded.

IMPORTANT: v1.8.2 was code-path verified, but NOT Android-manual PASS. User has been explicitly told that static/source validation is not equivalent to device interaction validation.

## 6. Real Android issues reported by user
These are critical and should drive future QA:
1. Enemy defeated in HUNT but nothing happened (HP 0 stall). Fixed in v1.8.1.
2. Scrolling down caused critical HP/VOLTAGE info to disappear. Fixed by sticky compact status in v1.8.1.
3. BGM produced periodic crackle/pops at loop boundary. Edge-fade mitigation in v1.8.1; Android confirmation still needed.
4. 炎翼リザル technique sheet opened, but CORE/ROLE/EQUIPMENT technique taps did not work. Input routing reworked in v1.8.2; Android confirmation still needed.

## 7. GitHub repository status
Repository:
- saitou730/monster-legacy
- public
- default branch: main

At the time of handoff, main was extremely sparse before infra work (README-only baseline), while previous feature branches/PRs mainly contained textual implementation records, not the full binary game source.

Known repository milestone commits / PR history:
- README baseline commit: 0074c0bc90046af5f9fed667bc2fc019fb937fa2
- v1.3 PR #17
- v1.4 PR #20
- v1.5 PR #22
- v1.6 PR #24
- v1.7 PR #26
- v1.8 PR #28

Development-v2 infra work was written directly to main in the final chat session. Added scaffold included:
- DEV_INFRA_V2_PLAN.md
- package.json
- playwright.config.js
- tests/smoke.spec.js
- .gitignore
- supporting infra checklist/readme files

Issue created:
- Issue #30 — “Development v2: repository-first build + E2E + fixed URL”

Issue #30 core text:
- Fully synchronize v1.8.2 source and official locked binary assets into GitHub.
- Run Playwright mobile E2E in CI at 360/390/430 widths.
- Deploy same repository build to one fixed HTTPS URL for Android Chrome playtest.
- Separate STATIC / BROWSER E2E / ANDROID MANUAL PASS.
- Blocker noted: current GitHub connector cannot directly upload ~46 MB binary asset tree from packaged build.

## 8. Development v2 architecture target
Move away from chat-exported Direct Play files as normal workflow.

Target pipeline:
GitHub main (single source of truth)
→ repository web source
→ GitHub Actions
→ Playwright E2E
→ fixed HTTPS deployment (Vercel / Cloudflare Pages / GitHub Pages equivalent)
→ Android Chrome manual test
→ Issue / PR
→ iterate

Do not use Direct Play HTML as the primary authoritative build once repository-first pipeline is live.

## 9. Required QA taxonomy from now on
Never collapse these into one “PASS”.

### STATIC PASS
- syntax
- source integrity
- asset-lock checks
- DOM/CSS/static audits

### BROWSER E2E PASS
- real browser launch
- actual click/tap path
- state transitions
- console/page errors
- viewport checks

### ANDROID MANUAL PASS
- user/device confirmed on Android Chrome
- touch input
- scroll/sticky behavior
- audio continuity
- full progression path

## 10. Minimum Playwright E2E flows
At minimum automate:
1. START → HOME.
2. HOME → HUNT.
3. Verify NEXT / HP / VOLTAGE visible.
4. Open 炎翼リザル technique sheet.
5. Tap CORE 炎翼牙.
6. Verify COMMAND queue reflects it.
7. Select second COMMAND.
8. Execute TURN.
9. Verify STANCE unit remains.
10. Verify enemy action beat appears after player action.
11. Verify HUNT qualified resonance does not die to 0; goes to 1 HP + RESONANCE READY.
12. RESONATE → JOIN result.
13. PARTY reflects joined Wind Bat.
14. FUSION route → Flame Wing Lizard.
15. NEW SPECIES TEST → BOSS route.

Run across at least 360×800, 390×844, 430×932-like widths.

## 11. Audio acceptance priorities
- No periodic click/pop at loop seam on Android Chrome.
- First user gesture unlocks BGM/SE cleanly.
- No audio restart spam when DOM re-renders.
- Enemy action and impact SE remain distinguishable.
- If loop seam remains audible, prefer better loop-region trimming/crossfade logic rather than adding more effects.

## 12. UI acceptance priorities
- Critical enemy HP / VOLTAGE / band always visible or trivially accessible while choosing commands.
- No sticky element may overlap tappable command cards.
- Technique sheet buttons must be tappable on Android content/browser context.
- Bottom navigation must not cover action controls.
- On 390×844 the primary combat decision must fit without requiring blind scrolling.

## 13. Director Score
Current official score remains:
- 82 / 100 HOLD

Do not raise based only on static/local code changes. Require stronger runtime/device/external-play evidence.

## 14. Recommended immediate Work tasks
Execute in this order:
1. Inspect the latest local bootstrap ZIP and v1.8.2 package.
2. Inspect GitHub main and Issue #30.
3. Fully upload/sync game source + assets to GitHub using Work’s cloud computer/browser/file capabilities, not manual user uploads if Work can do it.
4. Make main truly authoritative.
5. Verify asset hashes against the included manifest.
6. Create/repair GitHub Actions workflow for Playwright.
7. Get browser E2E green on 360/390/430 widths.
8. Deploy to one fixed HTTPS URL.
9. Provide the fixed URL to the user for Android Chrome testing.
10. Only then resume feature work.

If upload to GitHub through Work is technically blocked, use a new branch and PR with the complete source where possible, and explicitly state what remains unsynced. Do not claim GitHub is authoritative until binary assets and source are actually present.

## 15. Art / system safety rules
- Do not regenerate canonical monster art.
- Do not reinterpret locked silhouettes.
- Do not change 3 party / 2 COMMAND / 1 STANCE.
- Do not unlock NEXT mid-turn.
- Do not turn JOIN into RNG capture.
- Do not make Fusion result random.
- Do not consume unique contract/story/gacha characters in fusion.
- Do not call browser/static validation “Android PASS”.

## 16. User working style
The user prefers autonomous execution and often says “進めて” / “一気に進行”.
Interpret that as: execute the highest-value unblocked task without routine confirmations.
Ask only before changing core game fundamentals, monetization/business model, or locked art.

## 17. Handoff files to read first in Work
Priority:
1. This file: MONSTER_LEGACY_WORK_HANDOFF_2026-09-07.md
2. /mnt/data/MONSTER_LEGACY_DEV_V2_BOOTSTRAP.zip
3. /mnt/data/MONSTER_LEGACY_WEB_v1.8.2_TOUCH_INPUT_FIX.zip
4. /mnt/data/MONSTER_LEGACY_v1.8.2_TOUCH_INPUT_FIX_DIRECT_PLAY.html
5. GitHub Issue #30
6. GitHub main branch infra files

## 18. Desired first Work deliverable
A repository-first playable build with:
- full source + assets in GitHub
- passing Playwright browser E2E
- fixed HTTPS play URL
- clear STATIC / BROWSER E2E / ANDROID MANUAL status table
- no need for the user to download Direct Play HTML for normal testing

