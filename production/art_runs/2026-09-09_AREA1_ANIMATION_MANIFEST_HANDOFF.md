# AREA 1 Animation Manifest Handoff — Art Run

Date: 2026-09-09
Canonical base checked: main `4fe1ee0f244eba54cb74c90738ef36deb06447e3`
Branch: `art/area1-monster-runtime-plan`
Status: ART DIRECTOR PASS / WORK IMPLEMENTATION READY

## Preflight
- Work current task: `QA-CHAPTER1-FULL-JOURNEY`; browser journey is unblocked by Art. Android physical-device evidence remains separate.
- No new Chapter 1 raster is required by the current Work gate.
- `canon/visual_source_map.yaml` confirms governed battle derivatives for the AREA 1 species below. Existing rasters remain immutable inputs.
- No unknown registry ID is invented.

## Exact implementation manifest
This is metadata/specification only. Art does not modify root runtime or replace binaries.

```json
{
  "schema_version": 1,
  "anchor_policy": {
    "grounded": "bottom-center contact point",
    "flying": "body-center projected to fixed bottom-center battle slot"
  },
  "max_travel_percent": 7,
  "species": {
    "SP-011": {
      "name": "火トカゲ",
      "asset_root": "assets/battle/fire",
      "profile": "ground_quick",
      "states": {
        "idle": {"frames":["idle.png","idle.png","idle.png","idle.png"],"ms":[160,160,160,160],"loop":true,"transform":["base","y:-2% squash:+1%","base","y:+1%"]},
        "attack": {"frames":["idle.png","idle.png","attack.png","attack.png","idle.png"],"ms":[80,90,110,90,120],"loop":false,"transform":["base","x:-5%","x:+7%","x:+3%","base"]},
        "hit": {"frames":["hit.png","hit.png","hit.png","idle.png"],"ms":[90,70,70,120],"loop":false,"transform":["base","x:-4%","x:-2%","base"]},
        "danger": {"frames":["danger.png","danger.png","danger.png"],"ms":[180,140,180],"loop":true,"transform":["base","y:+1% squash:+1%","base"]},
        "stance": {"frames":["stance.png","stance.png","stance.png"],"ms":[220,180,220],"loop":true,"transform":["base","x:+1%","base"]}
      }
    },
    "SP-031": {
      "name": "風コウモリ",
      "asset_root": "assets/battle/wind_bat",
      "profile": "air_hover",
      "states": {
        "idle": {"frames":["idle.png","idle.png","idle.png","idle.png"],"ms":[160,160,160,160],"loop":true,"transform":["y:0%","y:-2%","y:0%","y:+1%"]},
        "attack": {"frames":["idle.png","idle.png","attack.png","attack.png","idle.png"],"ms":[80,90,110,90,120],"loop":false,"transform":["base","x:-3% y:+1%","x:+6% y:-3%","x:+3% y:-1%","base"]},
        "hit": {"frames":["hit.png","hit.png","hit.png","idle.png"],"ms":[90,70,70,120],"loop":false,"transform":["base","x:-4% y:+2%","x:-2% y:+1%","base"]},
        "danger": {"frames":["danger.png","danger.png","danger.png"],"ms":[180,140,180],"loop":true,"transform":["y:0%","y:+1%","y:0%"]},
        "stance": {"frames":["stance.png","stance.png","stance.png"],"ms":[220,180,220],"loop":true,"transform":["y:0%","y:-1%","y:0%"]}
      }
    },
    "SP-071": {
      "name": "葉ウサギ",
      "asset_root": "assets/battle/leaf",
      "profile": "ground_hop",
      "states": {
        "idle": {"frames":["idle.png","idle.png","idle.png","idle.png"],"ms":[160,160,160,160],"loop":true,"transform":["base","y:+1% squash:+1%","base","y:-1%"]},
        "attack": {"frames":["idle.png","idle.png","attack.png","attack.png","idle.png"],"ms":[80,90,110,90,120],"loop":false,"transform":["base","y:+2% squash:+2%","x:+5% y:-3%","x:+2% y:-1%","base"]},
        "hit": {"frames":["hit.png","hit.png","hit.png","idle.png"],"ms":[90,70,70,120],"loop":false,"transform":["base","x:-3% y:+1%","x:-1%","base"]},
        "danger": {"frames":["danger.png","danger.png","danger.png"],"ms":[180,140,180],"loop":true,"transform":["base","y:+1% squash:+1%","base"]},
        "stance": {"frames":["stance.png","stance.png","stance.png"],"ms":[220,180,220],"loop":true,"transform":["base","y:+1%","base"]}
      }
    },
    "SP-018": {
      "name": "炎翼リザル",
      "asset_root": "assets/battle/flame",
      "profile": "air_heavy",
      "states": {
        "idle": {"frames":["idle.png","idle.png","idle.png","idle.png"],"ms":[180,180,180,180],"loop":true,"transform":["y:0%","y:-1%","y:0%","y:+1%"]},
        "attack": {"frames":["idle.png","idle.png","attack.png","attack.png","idle.png"],"ms":[90,110,130,110,140],"loop":false,"transform":["base","x:-3%","x:+6% y:-2%","x:+3%","base"]},
        "hit": {"frames":["hit.png","hit.png","hit.png","idle.png"],"ms":[100,80,80,140],"loop":false,"transform":["base","x:-4%","x:-2%","base"]},
        "danger": {"frames":["danger.png","danger.png","danger.png"],"ms":[200,160,200],"loop":true,"transform":["base","y:+1%","base"]},
        "stance": {"frames":["stance.png","stance.png","stance.png"],"ms":[240,200,240],"loop":true,"transform":["base","x:+1%","base"]}
      }
    },
    "SP-191": {
      "name": "荊棘の大猪",
      "asset_root": "assets/battle/boar",
      "profile": "boss_heavy",
      "states": {
        "idle": {"frames":["idle.png","idle.png","idle.png","idle.png"],"ms":[190,190,190,190],"loop":true,"transform":["base","y:-1%","base","y:+1%"]},
        "attack": {"frames":["idle.png","idle.png","attack.png","attack.png","idle.png"],"ms":[100,130,130,110,150],"loop":false,"transform":["base","x:-3%","x:+4%","x:+2%","base"]},
        "hit": {"frames":["hit.png","hit.png","hit.png","idle.png"],"ms":[100,80,80,140],"loop":false,"transform":["base","x:-3%","x:-1%","base"]},
        "danger": {"frames":["danger.png","danger.png","danger.png"],"ms":[210,170,210],"loop":true,"transform":["base","y:+1% squash:+1%","base"]},
        "stance": {"frames":["stance.png","stance.png","stance.png"],"ms":[250,210,250],"loop":true,"transform":["base","x:+1%","base"]}
      }
    }
  }
}
```

## Runtime rules
1. Transform existing locked raster elements only; never interpolate/redraw anatomy.
2. No crop changes between states. Preserve battle-slot anchor and perceived scale.
3. Mirroring is allowed only where current runtime already mirrors the same canonical asset; do not create a new canonical view from a mirror.
4. Motion amplitude is a ceiling, not a target. Reduce travel if it collides with NEXT ACTION, HP, COMMAND or lower thumb-zone UI.
5. `prefers-reduced-motion`: collapse looping transform motion to canonical raster; state changes may still swap rasters without travel.
6. No rapid flashing, hue cycling or emissive overlay is part of this Art contract.
7. FUSION result SP-018 remains an independent species; animation must not visually morph SP-011 into SP-018.

## Acceptance criteria for Work
- Existing source hashes/paths remain unchanged.
- 360x800, 390x844, 430x932: no sprite/FX overlap that hides actionable battle UI.
- IDLE does not change hitbox or selection target.
- ATTACK/HIT return exactly to the canonical battle anchor.
- DANGER/STANCE loops do not cause cumulative drift.
- Thorn Boar reads heavier/slower than Fire Lizard and Wind Bat.
- Wind Bat reads aerial; Leaf Rabbit reads grounded/hopping; they do not share generic float motion.
- Reduced-motion mode remains readable and playable.

## Art Director QA
PASS — implementation-ready metadata handoff.

- Duplicate generation: none.
- Official design mutation: none.
- New species invention: none.
- Frame order: specified.
- Per-frame timing: specified.
- Loop behavior: specified.
- Anchor: specified.
- Portrait UI guardrails: specified.

## State
- 制作中: none requiring new raster.
- レビュー待ち: Work runtime implementation and viewport QA.
- Visual Lock済み: AREA 1 motion grammar + exact per-species values.
- Official Art Lock済み: inherited governed species only; no new lock declared.
- 実装待ち: Work converts this handoff into its chosen runtime manifest/binding.
- ゲーム実装済み: existing static battle derivatives; animation metadata is not yet root runtime.

## Next Art queue
1. Re-check full-journey/Android QA for a visual blocker.
2. If no blocker and Work has not yet consumed motion metadata, do not duplicate this deliverable; move to AREA 1 icon/encounter presentation inventory using existing governed sources.
3. Only after AREA 1 presentation gaps are exhausted, evaluate AREA 2 species needs from gameplay/ecology requirements; do not invent registry slots without authority.
