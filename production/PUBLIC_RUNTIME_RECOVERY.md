# Public runtime recovery — Issue #40

Owner: Work. Branch: work/restore-root-runtime. Status: started from main 36af36ba48a9044873cf8e42c98957e0ad8fb19e.

Priority 1: restore Pages staging to root index.html / src / styles / assets / data. prototype/chapter1 is Chat's integration workspace and must never be deployed as the public root.

Planned first-phase files: .github/workflows/web-qa.yml, scripts/stage-pages.js, tests/public-runtime.spec.js, qa/PUBLIC_RUNTIME_RECOVERY.md, production/next_queue.yaml. No image bytes or gameplay/save changes in restoration phase.

Conflict review: PR32 owns root index.html, src/app.js, src/skill-help.js, styles/app.css and root UX tests. Preserve and merge its changes after deployment recovery. Chat branch chat/ch1-progression-v0.6 (6a1a325f) owns prototype/chapter1/src/game-state.js, progression.js and data; root adapter will copy/version logic without publishing prototype HTML. Issue38 confirms ownership. Integration phase may modify PR32 root files only after merging PR32 and re-reading latest main; no competing reimplementation.

QA: 360x800, 390x844, 430x932; root official asset loading, HOME/HUNT/BOSS, then help and full-loop/save tests after integration. Android manual NOT RUN. Implementation/test/publication are separate evidence gates.
