# Chapter 1 intro / retreat binding

Owner: Work
Branch: work/ch1-intro-retreat-binding
Base: 351752fd2e625469f28ad63d05d7ccded004d36a
Status: in_progress

## Scope
Bind the existing PR32 guided START and playable story lesson UI to the PR42 Chapter 1 controller for START, PROLOGUE_COMPLETE, FIRST_BATTLE_COMPLETE, BOAR_RETREAT and HOME_FIRST_ARRIVAL. Show the first boar encounter and explicit player-selected retreat before HOME. Preserve root art, battle/help UI and root-only Pages deployment.

## Planned files
- src/app.js
- src/chapter1/runtime.mjs
- tests/chapter1-intro-route.spec.js
- tests/smoke.spec.js
- qa/CHAPTER1_ROOT.md
- production/next_queue.yaml (after QA)

## Conflict check
PR42 changes prototype/chapter1 only and is consumed through the merged pinned controller. PR32 is already merged; this task extends its existing intro/story functions without replacing skill-help.js or STANCE help. No art files or prototype HTML will change. Chat owns narrative/progression specification; Work owns these root UI bindings.

## Acceptance
New save reaches P05 only through START → prologue → playable first-battle lessons → first boar encounter → explicit retreat → HOME. Reload at HOME preserves P05. Existing users retain their root fields and do not receive duplicated rewards. Existing HUNT 2 COMMAND + 1 STANCE remains operational. Browser 360/390/430; Android manual separate.
