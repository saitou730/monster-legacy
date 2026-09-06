# MONSTER LEGACY — DIRECTOR QA v0.9

## Score
82 / 100 HOLD

## Why this build matters
v0.9 converts LEGACY from a reward label into a playable inheritance loop. Mastery rewards are persisted, equipped, translated per recipient, and affect Battle runtime. The Home route now advances the player through the existing Vertical Slice instead of exposing a collection of development screens.

## Runtime evidence
Headless Chromium at 390x844 using the self-contained Direct Play build:
- app initialization PASS
- HOME current journey PASS
- LEGACY ARCHIVE renders 3 cores PASS
- equipped `不退転` to ゴウラ PASS
- Battle card displays equipped Legacy PASS
- selected 2 direct COMMAND PASS
- EXECUTE 2/2 PASS
- turn 01 -> 02 PASS
- CODEX renders 8 cards PASS
- JavaScript page errors: 0

Runtime was executed with `page.set_content()` because localhost navigation is blocked by environment policy. This is browser runtime evidence, not physical-device evidence.

## Hold reasons
- no physical Android pass
- no real first-time external-player evidence
- no Unity Editor compile validation
