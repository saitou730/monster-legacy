# MONSTER LEGACY — Audio QA v0.6.6

## Status
Production audio architecture: PASS
Final composer master: PENDING

## Acceptance checks
- [x] 5 phase-compatible adaptive stem slots exist.
- [x] 10 discrete authored SE reference files exist.
- [x] BASE begins at CALM; HEAT/RAGE/DANGER/LEGACY enter at 30/60/90/100.
- [x] Band changes crossfade without restarting the base layer.
- [x] LEGACY performs short music-bus duck before ritual layer.
- [x] BGM and SE have independent buses.
- [x] AudioContext is started/resumed only from user action.
- [x] Sample decode failure falls back to synthesized cues.
- [x] Command selection, STANCE, EXECUTE, HIT, CRASH, Equipment, JOIN, band shift and LEGACY hooks are wired.
- [x] No Thunder Owl / Rift Manticore identity audio is authored.

## Director decision
This closes the **production audio plumbing / authored SE preparation** blocker. It does not claim final score credit for professional composition/mastering. Replace reference WAVs with production masters without changing battle logic.
