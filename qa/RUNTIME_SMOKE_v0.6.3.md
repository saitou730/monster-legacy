# MONSTER LEGACY — Runtime Smoke v0.6.3

## Critical regression repaired
The prior v0.6.x browser build could abort during initialization before `window.ML` was exported. Root causes found during executable browser smoke testing:

- `renderLoadout`, `equippedFor`, and `setEquipment` were referenced but not defined.
- `renderBoss()` still wrote to removed `bossVolText` / `bossVol` DOM nodes.
- direct `localStorage` access for motion preference could throw in restricted document contexts.

These were runtime failures, not merely visual issues, and are repaired in v0.6.3.

## Browser smoke evidence
Headless Chromium, portrait 390×844:

- app initializes and exports `ML`: PASS
- boss screen renders: PASS
- official locked boar + party battle sprites render: PASS
- NEXT remains unchanged while selecting commands: PASS
- exactly 2 COMMAND selection: PASS
- remaining unit becomes STANCE: PASS
- TURN EXECUTE resolves and advances turn: PASS
- no page error during tested path: PASS

## Still pending
Physical Android/iOS browser validation and external-human comprehension/feel testing.
