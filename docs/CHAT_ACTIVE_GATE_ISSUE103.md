# Chat Active Gate — Issue #103 Thunder Owl Fun Acceptance

Canonical authority checked against `main` `659e8ee5ed2c14271fa93ae02489010206ce6e72` on 2026-09-14.
Owner: Chat / Game Design under Issue #38.
Status: design/reference only; Draft PR #74; not merged or published.

## Current authority
`production/next_queue.yaml` on canonical `main` makes Issue #103 the active P0 and explicitly holds Manticore, PARTY, FUSION, NEW SPECIES TEST, CONTRACT SUMMON, AREA02 and new-species promotion until natural-play fun acceptance or a concrete #103 regression/fun defect is reported.

The technically shipped Thunder Owl pass is therefore the only executable progression gate. Existing #103 mechanics are frozen; Chat may refine concise player-facing semantics/copy only when natural-play evidence identifies a concrete comprehension defect.

## Natural-play decision rule
Classify new ordinary-play evidence as exactly one of:
- `PASS`: all frozen fun observations are evidenced in ordinary play.
- `FIRST_FAIL:<observation>`: identify the earliest concrete failed observation and scope only that defect.
- `INSUFFICIENT`: evidence is not enough to judge; do not invent a downstream task.

Technical CI/Pages success alone is not natural-play PASS.

## Supersession notice for this Draft PR
The downstream P1–P4 material in `AREA01_LOCKED_SPECIES_PLACEMENT_v1.md` is retained as non-executable design reference only. It MUST NOT be interpreted as authorization to implement Manticore, AREA02, PARTY/FUSION/TEST/CONTRACT, or new species while Issue #103 remains the canonical P0.

If #103 later receives PASS, re-read latest `main` and `production/next_queue.yaml` before promoting any reference material. Do not assume this Draft PR becomes executable automatically.

## Non-conflict boundary
Chat does not implement PR #32 battle UI, long-press help, STANCE UX, mobile feel, QA/automated tests, save migration/runtime binding, main merge, Pages/publication, prototype deployment, or Art generation.

Preserve official Art Lock, Portrait 9:16, NEXT fixed at turn start, exactly 3 active monsters, exactly 2 COMMAND plus remaining 1 STANCE, and additive/default-safe save compatibility. `prototype/chapter1` remains an integration workspace and is never the public deployment target.
