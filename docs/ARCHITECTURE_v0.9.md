# MONSTER LEGACY — Architecture v0.9

## Executable reference
Web v0.9 remains the executable source of truth while GitHub main is empty and Unity Editor compilation is unavailable in the current production environment.

## Domain modules
- `battle.js`: NEXT turn-lock, 3 party / 2 COMMAND / remaining STANCE, VOLTAGE, boss mastery
- `fusion.js`: deterministic fusion, one HERITAGE from each parent, Growth Echo 60%, lineage history
- `legacy.js`: boss mastery reward inventory, per-unit equip, recipient-specific effect translation
- `progression.js`: continuous commercial player route
- `test_battle.js`: new-species validation battle
- `storage.js`: persistent state with graceful localStorage failure handling
- `audio.js`: adaptive authored-reference stems + SE / fallback
- `app.js`: presentation and input orchestration only

## Player route
HOME → STORY → BOSS/Chapter 1 → HUNT → JOIN → PARTY → FUSION → NEW SPECIES TEST → 3 BOSS MASTERY → LEGACY ARCHIVE / CODEX.

## v0.9 rule
The player-facing UI must not expose Director telemetry unless `?director=1` or `?tester=1` is active.

## Unity migration boundary
Unity must consume the same domain rules rather than recreate them inside scene-specific MonoBehaviours. See `unity/Docs/SCENE_FLOW_v0.9.md` and `UNITY_PREFAB_PLAN_v0.9.md`.
