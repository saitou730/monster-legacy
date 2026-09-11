# Android Physical Device Gate v1.1

Canonical build: https://saitou730.github.io/monster-legacy/
Status: **PLAY-FIRST EVIDENCE COLLECTION**
Director Score: **82/100 HOLD**

Browser emulation and automated CI do not satisfy physical-device evidence. The 12 checks remain the internal release-quality checklist, but the player is **not required to execute AND-01 through AND-12 as a manual scripted test every time**.

## Standing operating rule — play-first Android QA

1. The player normally plays the canonical public build on a physical Android device.
2. When a bug, visual break, awkward interaction, pacing problem, or other unexpected behavior is observed, the player may report it naturally with a screenshot, recording, or short description. A formal gate ID is not required from the player.
3. The development side maps the report to the relevant AND item(s), inspects the latest canonical `main`, reproduces where possible, fixes the issue, adds/updates automated regression coverage, runs CI, merges the validated fix, and verifies publication before asking for another physical-device observation.
4. Do not stop at PR creation when the fix can be completed safely in the same work session. Continue through implementation → regression → CI → main merge → Pages/publication verification. Only a genuinely external blocker may stop the lane.
5. A successful browser test never becomes fabricated Android evidence. Physical observations are accumulated opportunistically from real play.
6. The checklist below remains the internal coverage map and final release gate. Formal `ANDROID MANUAL PASS` still requires physical evidence covering all AND-01 through AND-12, but routine development does not require the player to run all twelve in one scripted session.
7. When an observation covers multiple checks, record it once and credit every directly evidenced check. Never ask the player to repeat an already evidenced action only to satisfy checklist ceremony.
8. After a reported defect is fixed and published, the preferred retest is the smallest natural gameplay path that reaches the affected behavior; do not require a full Chapter replay unless progression/save interactions make it necessary.

## Test setup for evidence that is actually collected

- Use the canonical URL in Chrome on a physical Android phone.
- Keep the phone in portrait orientation unless the reported issue concerns rotation.
- Do not require seeded or edited localStorage from the player.
- When readily available, retain device/Android/Chrome information and screenshot/recording evidence, but lack of metadata must not block intake or fixing of a reproducible player report.

## Internal coverage map

| ID | Check | PASS criterion | Evidence |
| --- | --- | --- | --- |
| AND-01 | Launch | TITLE loads without blank screen, clipped controls or forced landscape | COLLECT DURING PLAY |
| AND-02 | Audio unlock | First deliberate tap enables BGM/SE; mute control works | COLLECT DURING PLAY |
| AND-03 | Portrait layout | At TITLE, HOME, HUNT, TEST and BOSS no horizontal overflow occurs | COLLECT DURING PLAY |
| AND-04 | Monster details | Portrait/name tap opens details; close returns without selecting COMMAND | COLLECT DURING PLAY |
| AND-05 | Long press | Long-press skill explanation opens once and does not also select the skill | COLLECT DURING PLAY |
| AND-06 | Direct COMMAND | CORE/ROLE/EQUIPMENT select, replace and cancel reliably | COLLECT DURING PLAY |
| AND-07 | Turn controls | Two COMMANDs assign the third monster to STANCE; EXECUTE is reachable without page scroll | COLLECT DURING PLAY |
| AND-08 | NEXT lock | Displayed NEXT action does not change after COMMAND selection in the same turn | COLLECT DURING PLAY |
| AND-09 | Save/Continue | Close Chrome after a saved milestone, reopen, Continue and resume at the same progression state | COLLECT DURING PLAY |
| AND-10 | Duplicate safety | Resume/replay does not duplicate JOIN, FUSION, Lyra Contract or Unyielding | COLLECT DURING PLAY |
| AND-11 | Reduced motion | Android Remove animations is reflected unless an explicit in-game choice exists | COLLECT DURING PLAY |
| AND-12 | Chapter completion | Fresh START reaches completed HOME without blocked taps or overlay interception | COLLECT DURING PLAY |

## Failure intake

For any player-reported failure, capture whatever is available:

- relevant gate ID(s), assigned by development rather than the player
- exact screen/progression state
- steps immediately before failure
- screenshot or screen-recording timestamp when supplied
- whether reload reproduces it, when known
- whether existing save remains recoverable, when known

Missing optional metadata is a follow-up aid, not a reason to reject or delay a fix.

## Release decision

- Routine Android QA uses the play-first workflow above.
- `ANDROID MANUAL PASS` is permitted only when AND-01 through AND-12 collectively have genuine physical evidence; evidence may be accumulated across normal play sessions.
- Any progression blocker, lost save, duplicate reward, unreachable EXECUTE, or touch interception is release-blocking.
- Cosmetic differences may be logged separately but must not be used to claim PASS.
