# Post Chapter 1 playable route — Work

Branch: work/post-ch1-speed-batch. Base: 6d5fe35d. Spec: PR #74 P0 only.

Implemented HOME -> depart -> discovery -> existing Owl battle -> explicit JOIN -> return.
An actually resolved enemy action with a surviving party is required before victory can advance.
Area receipts are additive, ordered, idempotent and persistence-first. SP-044 is stored in monsterRoster; active party remains three and is not replaced. Post-JOIN party configuration is downstream scope.

Validation: Node area transaction tests 2/2 pass. JavaScript syntax pass.
Local browser runner blocked by http-server uv_interface_addresses system error; browser CI pending.
No physical Android PASS claimed. No score change. No Art files modified.

Remaining: CI for three viewport sizes and legacy route regressions; review failure/retry and saved-state resumes; merge only after success; verify Pages.
