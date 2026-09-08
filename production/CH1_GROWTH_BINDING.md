# Chapter 1 P06-P13 root binding

Owner: Work
Branch: `work/ch1-join-fusion-test-binding`
Base main: `05c8ee29def8fc82ebc0ac12a3fc3697528caeac`
Status: in_progress

## Assigned function
Connect the existing canonical root HUNT, JOIN result acknowledgement, PARTY confirmation, fixed Fire Lizard + Wind Bat fusion, and real Flame Wing Lizard species test to the Chapter 1 controller. This slice targets controller states P05 through P13; Contract/SUMMON remains the next slice.

## Planned files
- `index.html`
- `src/app.js`
- `src/chapter1/root-adapter.mjs` only if transaction projection needs correction
- `tests/chapter1-growth-route.spec.js`
- `tests/smoke.spec.js` only for route compatibility
- `qa/CHAPTER1_ROOT.md`
- `production/next_queue.yaml`

## Conflict review
- Chat PR47 changes only `design/CHAPTER1_JOIN_FUSION_CONTRACT_HANDOFF_v0.1.md`; consumed as the P06-P15 semantic handoff. No same-file conflict.
- Chat PR45 changes only `design/CHAPTER1_PLAYER_ROUTE_CONTRACT_v0.1.md`; no same-file conflict.
- PR42 remains controller source; root copy on main is the executable contract.
- No edits to `prototype/chapter1/`, `assets/art/`, or `assets/battle/`.
- PR32 long-press help, click suppression, visible info and STANCE readability must remain intact.

## Acceptance
- Opening HUNT/PARTY/FUSION without the qualifying action does not advance.
- HOME accepts the HUNT brief before the Wind Bat encounter starts.
- Qualified RESONATE commits Wind Bat exactly once before JOIN success is shown; result acknowledgement is distinct.
- PARTY advances only on explicit confirmation of exactly three active monsters including Wind Bat.
- Fusion preview/cancel consumes nothing; confirmed fixed fusion commits one child, one lineage and one catalyst charge before success UI.
- New-species test remains playable with exactly 2 COMMAND + 1 STANCE; victory commits once and reload resumes at P13.
- Existing saves remain additive and playable.
- Browser QA at 360x800, 390x844 and 430x932; Android manual reported separately.
