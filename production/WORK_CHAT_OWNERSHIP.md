# Work / Chat ownership — 2026-09-07

User-approved split: Chat owns Chapter 1 progression, narrative and feature specifications. Work owns battle UX, help, mobile presentation, QA and final integration/deployment. main is the only canonical source. Use separate branches/PRs; record intended file changes before editing. Do not overwrite concurrent work.

## Active Work claim
- Branch: work/chapter1-battle-context
- Base: c12313059b46cee5988ee3cdfa494078fbe99a0c
- Files: prototype/chapter1/src/battle-context.js; prototype/chapter1/styles/battle-context.css; tests/chapter1-context.spec.js; qa/CHAPTER1_BATTLE_CONTEXT.md
- Shared entry point: prototype/chapter1/index.html — stylesheet/script loading only. No progression function or save schema edits.
- Scope: contextual battle rule explanations, long press, visible help alternative, accessible modal, touch cancellation and save-neutral QA.
- Existing PR32/35/37 target the older root runtime; do not merge their introductory routes blindly into Chapter 1.
- Current deployment copies prototype/chapter1, whose battles are progression placeholders. Full combat integration remains a blocker, not a passed game-quality gate.
