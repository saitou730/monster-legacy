# MONSTER LEGACY — Mobile / External Playtest v1.2

Baseline: WEB v0.6.1 / Director Score floor 82 / 80 Gate PASSED.

## Purpose
Validate the existing Vertical Slice on real portrait phones. Do not add systems to solve a test problem before observing it.

## Device matrix
Run at minimum: 360, 375/390, 412, 430 CSS px widths where available. Test normal browser chrome expanded/collapsed and at 200% text zoom.

## Critical interaction checks
1. NEXT remains readable while the command body scrolls.
2. TURN execution remains reachable without hunting for the button.
3. Two COMMAND selections are reversible before execution.
4. After two actors are selected, the third actor's STANCE is understood without opening help.
5. No horizontal page scroll, clipped toast, header-control collision, or bottom-nav collision.
6. Background/resume during an attack does not duplicate or partially resolve a turn.
7. Reduced motion and BGM toggles remain independently operable.

## External comprehension protocol
Do not explain the rules before the first attempt. After the player reaches each checkpoint, ask only:
- “What do you think NEXT means?”
- “Why did the third monster do something even though you did not select it?”
- “What are you trying to do with VOLTAGE against this boss?”
- “Would you replay with a different party or command plan? Why?”

## 90-point evidence thresholds
- >=80% identify NEXT correctly without a rule explanation after the first battle turn.
- >=80% explain 2 COMMAND + 1 STANCE by the end of Chapter 1 onboarding.
- >=70% can state that boss strategy differs between Boar / Owl / Manticore after playing them.
- >=60% voluntarily express replay intent or choose another strategy/party for a rematch.
- 0 critical touch blockers across the tested device widths.

## Director rule
A CSS/static audit is readiness evidence only. It must never be reported as a real-device PASS.
