# Unified COMMAND UI QA v1.8.8

Date: 2026-09-10
Branch: `work/unified-command-ui`
PR: #62

## Scope

- HUNT / NEW SPECIES TEST / BOSS use direct CORE, ROLE and EQUIPMENT command tiles.
- Portrait or monster name opens read-only details and never selects a command.
- Re-tapping the selected skill cancels it; tapping another skill replaces it without increasing the COMMAND count.
- Two selected monsters assign the remaining monster to STANCE.
- Chapter 1 progression, save schema, NEXT lock and Art Lock assets are unchanged.

## Evidence

- Web QA run: https://github.com/saitou730/monster-legacy/actions/runs/34392504907
- Result: 54/54 Playwright cases passed.
- Viewports: 360x800, 390x844, 430x932.
- Regression and asset verification passed.
- Android physical device: NOT RUN.

Director Score: **82/100 HOLD**.
