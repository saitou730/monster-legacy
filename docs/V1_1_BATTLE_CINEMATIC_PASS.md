# MONSTER LEGACY v1.1 — Battle Cinematic Pass

Canonical floor: WEB v0.6 / Director Score 82 / 80-point Vertical Slice gate PASSED.

## Goal
Close the presentation gap between the current playable boss battle and the approved final battle-screen vision without changing core rules or Art Lock.

## Implemented
- battlefield-first boss composition, ~57–61% of phone height
- boss HUD overlaps the battlefield instead of living in a separate block
- NEXT ACTION remains turn-locked and is presented as a translucent battlefield overlay
- three depth layers for the battle background: far / mid / ground
- moving haze/parallax without altering official monster identity
- COMMAND units step further forward; STANCE settles visibly behind
- enemy NEXT telegraph changes boss pose/scale before execution
- VOLTAGE affects the full battlefield grade, haze and vignette pressure
- DANGER / LEGACY apply whole-screen pressure rather than only brighter UI
- compressed lower command tray so monsters occupy more screen space
- reduced-motion / MOTION OFF retained

## Core rules unchanged
- Portrait 9:16
- NEXT ACTION turn-lock
- 3-monster party
- exactly 2 COMMAND per turn
- remaining unselected monster uses STANCE

## QA
- app.js / motion.js syntax PASS
- Source Integrity PASS
- Mobile Static PASS
- Unified Loop PASS
- Legacy Progression PASS
- Boss Art Lock PASS
- Audio Contract PASS
- Battle Cinematic dedicated audit: 16/16 PASS

Chromium screenshot/runtime re-check was attempted in the current container but timed out. No new browser-runtime, Android physical-device, or external-player PASS is claimed.

Director Score remains 82/100 HOLD until real-device and genuine external-player evidence exists.
