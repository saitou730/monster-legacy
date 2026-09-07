# v1.8.2 Touch Input Regression

Observed Android failure: opening 炎翼リザル command sheet succeeded, but CORE / ROLE / EQUIPMENT taps did not enqueue a command.

Fix:
- Replace inline sheet skill onclick handlers with one delegated click listener on #sheetBody.
- Use data-sheet-action / data-uid / data-kind for HUNT, TEST, and BOSS sheets.
- Force pointer-events/touch-action on sheet skill controls.
- Reject duplicate/invalid unit queue inserts.

Acceptance checks:
1. openHunt('flame') renders 3 actionable skill buttons.
2. Each button carries data-sheet-action="pickHunt", uid="flame", and CORE/ROLE/EQUIPMENT kind.
3. Delegated sheetBody click dispatches to pickHunt/pickTest/pickBoss.
4. pickHunt closes sheet and re-renders queue after a valid selection.
5. Existing 2 COMMAND / 1 STANCE rule is unchanged.

Note: container Chromium is blocked by administrator policy for file:// and localhost, so this is source/event-path verification rather than a new physical Android PASS.
