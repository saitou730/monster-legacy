# MONSTER LEGACY — DIRECTOR QA v0.6.1

## Canonical floor
- WEB v0.6
- Director Score: **82 / 100**
- 80-point Vertical Slice gate: **PASSED**

## Candidate assessment
**82 / 100 — score held pending real-device evidence.**

The implementation is stronger than v0.6, but the Director score is not raised from static/CSS evidence alone.

### 100-point breakdown
| Axis | Score | Current gap |
|---|---:|---|
| Core Fun / Battle | 18 / 20 | External feel / replay evidence |
| Monster Growth Loop | 13 / 15 | Replay motivation / growth depth validation |
| UI/UX / Portrait | 11 / 15 | Physical-device touch/scroll/text-zoom validation |
| Art Direction / Consistency | 12 / 15 | Thunder Owl + Rift Manticore official Art Lock |
| Audio / Adaptive BGM | 6 / 10 | Production stems / authored SE |
| Technical Quality | 9 / 10 | Browser/device soak |
| Narrative / Onboarding | 9 / 10 | Chapter 1 scene/pacing polish |
| Commercial Readiness | 4 / 5 | External comprehension/replay test |
| **Total** | **82 / 100** | |

## v0.6.1 change — real-device readiness
Source audit found several v0.6 implementation details that contradicted the existing Mobile QA intent: browser zoom was disabled, NEXT scrolled away with the battle body, TURN execution was not sticky, and header controls were absolutely positioned with an obsolete v0.2 label.

Implemented:
- browser zoom restored
- sticky NEXT card
- sticky TURN action rail
- safe-area-aware bottom spacing
- dynamic viewport `vh` fallback + `dvh`
- responsive header action layout
- 44–52px primary controls
- 48px Equipment select target
- narrow-screen toast wrapping
- focus-visible treatment
- external mobile playtest protocol

## Validation
- `python tools/mobile_static_audit.py`: **12 / 12 PASS**
- `node --check src/*.js`: **PASS**
- `python tools/balance_simulator.py`: **PASS / strategic identities preserved**
- HTML structural smoke: **PASS**
- Real-device matrix: **NOT RUN**
- External-player comprehension/replay: **NOT RUN**

## Director decision
No score increase until a physical-device pass demonstrates that the fixes actually improve touch reachability and comprehension. No gameplay rule or Art Lock was changed.

## Next score condition
Raise to 83+ only after at least representative 360/390/430px portrait devices show zero critical overflow/touch blockers, NEXT + TURN remain reachable with browser chrome changes, and 200% text zoom remains operable.
