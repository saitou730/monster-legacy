# MONSTER LEGACY Production Tracker v4.6

## v1.4 GAME LOOP SHELL
Status: IMPLEMENTED / Director Score 82 HOLD

### Goal
Stop presenting MONSTER LEGACY as a battle-only prototype. Make the existing Vertical Slice read as one game from launch: START → HOME → STORY → HUNT/JOIN → PARTY → FUSION → NEW SPECIES TEST → BOSS → LEGACY ARCHIVE.

### Implemented
- Full-screen title/start gate; first user gesture also unlocks BGM/SE.
- Startup is always HOME. Previous boss screen is never auto-restored on launch.
- HOME rebuilt as Chapter 1 journey hub, not a web-tool landing page.
- State-driven Journey Route with STORY/HUNT/PARTY/FUSION/TEST/BOSS nodes.
- Current 3-monster party preview on HOME.
- Direct entry cards for STORY/HUNT/PARTY/FUSION.
- Existing progression engine remains authoritative for NEXT JOURNEY.
- Existing battle geometry and 3 party / 2 COMMAND / 1 STANCE / NEXT turn-lock are unchanged.

### Acceptance
- GAME_LOOP_SHELL_AUDIT_v1.4: 14/14 PASS
- Source Integrity: PASS
- Mobile Static: PASS
- Unified Loop: PASS
- Audio Contract: PASS
- Node syntax: PASS
- Physical Android/external-player PASS: NOT CLAIMED.

### Next
1. Turn HUNT/JOIN completion into a clear reward/result beat that returns to HOME.
2. Turn FUSION result into full-screen lineage reveal and return path.
3. Add seamless scene transitions between journey nodes.
4. Validate the entire first-session route on Android and with 5 first-time players.
