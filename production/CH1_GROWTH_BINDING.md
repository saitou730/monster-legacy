# Chapter 1 P06-P13 root binding

Owner: Work
Branch: `work/ch1-join-fusion-test-binding`
Base main: `05c8ee29def8fc82ebc0ac12a3fc3697528caeac`
Status: tested_merge_pending

## Assigned function
Connect the existing canonical root HUNT, JOIN result acknowledgement, PARTY confirmation, fixed Fire Lizard + Wind Bat fusion, and real Flame Wing Lizard species test to the Chapter 1 controller. This slice targets controller states P05 through P13; Contract/SUMMON remains the next slice.

## Changed files
- `index.html`
- `src/app.js`
- `src/chapter1/root-adapter.mjs`
- `src/fusion.js`
- `src/storage.js`
- `tests/chapter1-growth-route.spec.js`
- `tests/smoke.spec.js`
- `qa/CHAPTER1_ROOT.md`
- `production/next_queue.yaml`

## Conflict review
- Chat PR47 changes only `design/CHAPTER1_JOIN_FUSION_CONTRACT_HANDOFF_v0.1.md`; consumed as the P06-P15 semantic handoff. No same-file conflict.
- Chat PR45 changes only `design/CHAPTER1_PLAYER_ROUTE_CONTRACT_v0.1.md`; no same-file conflict.
- PR42 remains controller source; root copy on main is the executable contract.
- No edits to `prototype/chapter1/`, `assets/art/`, or `assets/battle/`.
- PR32 long-press help, click suppression, visible info and STANCE readability remain intact.

## Evidence
- PR: https://github.com/saitou730/monster-legacy/pull/52
- CI: https://github.com/saitou730/monster-legacy/actions/runs/34289713369
- Result: 30/30 browser tests passed at 360x800, 390x844 and 430x932.
- Android physical device: NOT RUN.

## Remaining
Contract/SUMMON, Lyra Support, Thorn Boar rematch, Unyielding, Archive and complete HOME remain outside this slice. v1.0 is not complete.
