# MONSTER LEGACY — DIRECTOR QA v0.6.2 VISUAL FIDELITY

## Baseline protection
- Canonical minimum: WEB v0.6
- Director Score floor: 82 / 100
- 80-point Vertical Slice gate: PASSED
- No rollback below the gate.

## This pass
Target: close the gap between the playable prototype presentation and the approved formal battle image without adding systems.

Implemented:
- Formal boss battle hierarchy: boss HUD / HP / prominent VOLTAGE seal / NEXT ACTION turn-lock.
- Battlefield staging now shows the locked boss sprite plus all three allied official battle assets simultaneously.
- 2 selected actors are marked COMMAND; the unselected actor is rendered as STANCE in both battlefield and command tray.
- EXECUTE now exposes 0/2 → 2/2 directly.
- Enemy and party field-state transitions use existing idle / attack / hit / stance / danger fixed assets.
- Turn resolution presentation is sequenced instead of rebuilding the stage immediately after tap.
- Director telemetry moved behind a disclosure so player-facing presentation remains primary.
- Boar backdrop reuses the existing fixed thorn-boar full art only as a darkened atmospheric layer.

## Art Lock
- No same-name monster redesign introduced.
- Existing P0 locked assets remain source of truth.
- Thunder Owl and Rift Manticore remain ART LOCK PENDING and are not visually finalized.
- The approved high-fidelity concept is treated as layout / mood direction only, not as canonical monster art.

## Rules regression
- Portrait 9:16: preserved.
- NEXT ACTION turn-lock: preserved.
- 3-unit party: preserved.
- 2 COMMAND per turn: preserved.
- 1 unselected STANCE: preserved.
- Save / Continue model: unchanged.
- Boss balance data: unchanged.

## Automated validation
- JavaScript syntax: PASS.
- Mobile static readiness: PASS 15 / 15.
- Balance simulator policy separation: PASS.
  - Boar RAISE / RECEIVE mastery: PASS.
  - Owl SUPPRESS mastery: PASS.
  - Manticore CRASH mastery: PASS.
  - Aggressive route is not universal mastery: PASS.

## Director score
**82 / 100 — HOLD**

Why no automatic increase:
The implementation closes a major presentation gap, but visual feel still needs physical-device review and external comprehension / replay testing. We do not award score for code or mockup fidelity without player evidence.

## Remaining to 90
1. Physical-device visual / touch validation of v0.6.2.
2. Chapter 1 scene presentation pass.
3. Production BGM stems / authored SE.
4. Thunder Owl official Art Lock.
5. Rift Manticore official Art Lock.
6. External player comprehension and replay-intent test.

## Promotion condition
Raise above 82 only after the formal v0.6.2 boss screen is run on real portrait devices and demonstrates:
- NEXT visible before command selection.
- Two-command selection understood without instruction.
- STANCE recognized as the third unit's role.
- EXECUTE reachable with browser chrome / safe area.
- Monster art remains the visual focus rather than UI chrome.
