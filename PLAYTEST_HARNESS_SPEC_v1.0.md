# MONSTER LEGACY — External Playtest Harness v1.0

Build: WEB v0.6.7

## Purpose
Measure whether a first-time player understands the existing Vertical Slice without adding a new game system.

## Automatic evidence
- Session start / app ready
- Screen transitions
- Chapter 1 lesson completion and time-to-step
- First 2 COMMAND lock
- STANCE recognition
- VOLTAGE and Equipment tutorial choices
- Boss selected / boss opened
- Every executed boss turn: chosen 2 COMMAND, derived STANCE, VOLTAGE and turn number
- Command corrections/reselections
- Boss replay count
- Boss clear, mastery, LEGACY survival and CRASH count

## Post-battle comprehension
After Thorn Boar clear, ask four rule questions:
1. NEXT ACTION updates at the next turn start.
2. Exactly 2 monsters receive COMMAND each turn.
3. The unselected monster contributes through STANCE.
4. VOLTAGE 100 triggers LEGACY ART.

Also collect:
- Replay intent, 1–5
- Rule clarity, 1–5
- Optional free comment

## Success gate for 90-point work
Use at least 5 genuinely external first-time players.
Target evidence (not yet claimed):
- Median comprehension >= 3/4
- At least 4/5 players identify 2 COMMAND and STANCE correctly
- Median replay intent >= 4/5
- No recurring critical misunderstanding of NEXT turn-lock
- No recurring mobile blocker preventing BOSS clear/retry

## Privacy / storage
The harness records only local gameplay events and the player's typed optional comment. No account, device identifier, location, contact information, or network upload is implemented. The report is exported manually as JSON.

## Aggregation
Use `tools/playtest_aggregate.py` with exported player JSON files. It outputs group medians, threshold counts, a gate candidate verdict, and `PLAYTEST_AGGREGATE.csv`. The tool does not manufacture or infer missing player results.
