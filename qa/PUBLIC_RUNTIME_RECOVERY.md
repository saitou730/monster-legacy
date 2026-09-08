# Issue 40 — public runtime recovery

Root cause: c123130 changed the Pages staging directory to prototype/chapter1, replacing the official-image root game with progression placeholders. The previous Work verification checked successful delivery but failed to reject that product regression.

Restoration: deploy only root index.html / src / styles / assets / data. Both CI and deployment use scripts/stage-pages.js. A browser test opens the actual staged artifact and checks real HOME, HUNT sprite decoding and official image responses; prototype HTML must be absent.

Implementation: workflow and staging guard completed. No asset bytes, saves or gameplay changed in this recovery phase. PR32 integration follows restoration.

Browser QA: pending at 360x800 / 390x844 / 430x932. Android manual: NOT RUN. Public deployment: pending.

Follow-up: integrate PR32 then adapt Chat progression data into root; never publish prototype HTML directly. Score 82 remains historical HOLD, not an evaluation of the regressed prototype.
