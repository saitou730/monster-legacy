# MONSTER LEGACY — DIRECTOR QA v0.6.3

## Score
82 / 100 HOLD

## 80 Gate
PASS (inherited and must not regress)

## v0.6.3 acceptance
- [x] Portrait boss mode uses the battle canvas rather than prototype chrome
- [x] NEXT ACTION remains turn-locked and visually dominant
- [x] Exactly two COMMAND actors supported
- [x] Remaining actor becomes STANCE
- [x] Direct CORE / ROLE / EQUIPMENT command tiles implemented
- [x] Official locked battle sprites reused without reinterpretation
- [x] Owl / Manticore visuals not invented
- [x] Executable Chromium 390×844 runtime smoke (init / NEXT lock / 2 COMMAND / STANCE / turn execute)
- [ ] Physical-device 360 / 390 / 412 / 430px visual validation
- [ ] External player comprehension / replay intent

## Critical runtime repair
The previous v0.6.x path contained fatal initialization regressions (missing equipment/loadout functions, stale boss VOL DOM references, unsafe motion localStorage access). v0.6.3 repairs these and passes an executable Chromium smoke path.

## Director decision
Do not raise score from 82 until a physical-device test confirms the repaired build and formal battle composition. Candidate after that validation: 84/100.
