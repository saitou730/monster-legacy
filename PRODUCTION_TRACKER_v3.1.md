# MONSTER LEGACY — Production Tracker v3.1

## Protected baseline
WEB v0.6 / Director Score 82 / 80 Gate PASSED. Never regress.

## v0.8 — Three Boss + Unity-ready Core
- [x] v0.7 unified STORY -> HUNT -> JOIN -> FUSION -> TEST -> BOSS REPLAY retained.
- [x] Thunder Owl ML-001 official-sheet-derived battle state set added.
- [x] Skycleave Manticore ML-002 official-sheet-derived battle state set added.
- [x] Both boss definitions moved from `BATTLE ASSET PENDING` to locked battle paths.
- [x] Official-sheet-derived atmospheric backdrops added.
- [x] Boss selector now shows locked boss portraits.
- [x] Three Boss Core Clear result added.
- [x] Art manifest expanded from 6 to 8 locked monsters.
- [x] Unity migration kit v0.2 created: ScriptableObject definitions, TurnController, VoltageSystem, FusionService, SaveData, data bridge.
- [x] No gameplay fundamental changed.

## Director score
82 / 100 HOLD until real-device/human evidence.

## Next
1. Runtime smoke v0.8.
2. Real-device full-loop playtest.
3. Clean dedicated battle exports for ML-001 / ML-002 if artifact edges/labels are visible on device.
4. Unity Editor import + compile validation when Unity environment is available.
5. Chapter transition / Home / Codex presentation polish.

## Runtime evidence added
Headless Chromium via in-memory document at 390×844:
- app init PASS
- HUNT -> RESONANCE READY PASS
- JOIN PASS
- deterministic FUSION PASS
- NEW SPECIES TEST (CORE + EVADE + defeat) PASS
- TEST -> BOSS REPLAY PASS
- Thunder Owl locked battle asset loads PASS
- Skycleave Manticore locked battle asset loads PASS

This is executable browser evidence, not physical-device/human evidence.
