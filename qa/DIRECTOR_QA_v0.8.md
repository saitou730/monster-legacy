# MONSTER LEGACY — Director QA v0.8

Score: 82/100 HOLD.

Pass conditions in this build:
- three boss definitions all have locked battle asset directories;
- ML-001/ML-002 references remain bundled;
- no same-name reinterpretation;
- NEXT turn-lock / 3 party / 2 COMMAND / 1 STANCE unchanged;
- fusion remains deterministic with one Heritage from each parent and 60% Growth Echo;
- Unity migration skeleton preserves those invariants.

No score increase is permitted from static integration alone. Physical-device and human play evidence remain required.

## Executable smoke
`qa/RUNTIME_SMOKE_v0.8.txt` passes the unified loop in Chromium using the self-contained v0.8 Direct Play build. This does not promote physical-device QA.
