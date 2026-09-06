# MONSTER LEGACY — External Playtest Coordinator Guide v1.0

Build: WEB v0.7

## Goal
Collect genuine first-time-player evidence for the existing Vertical Slice. Do not coach rules during the test.

## Minimum run
- 5 first-time players
- Prefer real phones in portrait orientation
- Start from `TESTER_GUIDE.html`
- Ask the tester to play Chapter 1 → Thorn Boar → post-battle survey
- Collect the exported `MONSTER_LEGACY_PLAYTEST_*.json`

## Do not coach
Do not explain NEXT turn-lock, 2 COMMAND, STANCE, or VOLTAGE before/during play unless the tester is completely blocked. If intervention is required, note it in the optional comment or coordinator notes; that session should not be treated as clean comprehension evidence.

## Aggregate
Open `PLAYTEST_RESULT_COLLECTOR.html` and select all exported JSON files. The collector:
- deduplicates matching session IDs
- calculates comprehension / replay / clarity medians
- shows the 90-point evidence-gate candidate status
- exports aggregate CSV and Director Summary markdown

The Python equivalent remains available as `tools/playtest_aggregate.py`.

## 90-point external evidence candidate gate
- >= 5 genuine external first-time players
- Median comprehension >= 3 / 4
- Replay intent >= 4 / 5 for at least 4 testers
- Median replay intent >= 4 / 5
- No recurring critical NEXT turn-lock misunderstanding
- No recurring mobile blocker preventing boss clear / retry

PASS CANDIDATE is evidence for Director review, not an automatic score increase.

## Privacy
The harness has no network upload. It records gameplay events, survey answers, and optional free comment locally. Do not ask testers to type personal information into the free-comment field.
