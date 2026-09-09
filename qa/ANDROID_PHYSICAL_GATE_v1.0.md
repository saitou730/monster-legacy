# Android Physical Device Gate v1.0

Canonical build: https://saitou730.github.io/monster-legacy/
Status: **NOT RUN**
Director Score: **82/100 HOLD**

Browser emulation and automated CI do not satisfy this gate. Record a physical Android device, browser version, date and evidence for every required item below.

## Test setup

- Open the canonical URL in Chrome on a physical Android phone.
- Keep the phone in portrait orientation.
- Test once with a fresh site-data state and once using Continue after Chrome is fully closed.
- Do not use seeded or edited localStorage.
- Record device model, Android version, Chrome version and viewport screenshot.
- Capture a short screen recording covering COMMAND selection through EXECUTE.

## Required pass sequence

| ID | Check | PASS criterion | Evidence |
| --- | --- | --- | --- |
| AND-01 | Launch | TITLE loads without blank screen, clipped controls or forced landscape | NOT RUN |
| AND-02 | Audio unlock | First deliberate tap enables BGM/SE; mute control works | NOT RUN |
| AND-03 | Portrait layout | At TITLE, HOME, HUNT, TEST and BOSS no horizontal overflow occurs | NOT RUN |
| AND-04 | Monster details | Portrait/name tap opens details; close returns without selecting COMMAND | NOT RUN |
| AND-05 | Long press | Long-press skill explanation opens once and does not also select the skill | NOT RUN |
| AND-06 | Direct COMMAND | CORE/ROLE/EQUIPMENT select, replace and cancel reliably | NOT RUN |
| AND-07 | Turn controls | Two COMMANDs assign the third monster to STANCE; EXECUTE is reachable without page scroll | NOT RUN |
| AND-08 | NEXT lock | Displayed NEXT action does not change after COMMAND selection in the same turn | NOT RUN |
| AND-09 | Save/Continue | Close Chrome after a saved milestone, reopen, Continue and resume at the same progression state | NOT RUN |
| AND-10 | Duplicate safety | Resume/replay does not duplicate JOIN, FUSION, Lyra Contract or Unyielding | NOT RUN |
| AND-11 | Reduced motion | Android Remove animations is reflected unless an explicit in-game choice exists | NOT RUN |
| AND-12 | Chapter completion | Fresh START reaches completed HOME without blocked taps or overlay interception | NOT RUN |

## Failure record

For any failure, record:

- Gate ID and exact screen/progression state
- Device/Android/Chrome versions
- Steps immediately before failure
- Screenshot or screen-recording timestamp
- Whether reload reproduces it
- Whether existing save remains recoverable

## Release decision

- ANDROID MANUAL PASS is permitted only when AND-01 through AND-12 all have physical evidence.
- Any progression blocker, lost save, duplicate reward, unreachable EXECUTE, or touch interception is release-blocking.
- Cosmetic differences may be logged separately but must not be used to claim PASS.
