# Chapter 1 root integration — stage 2

Source: Chat PR42 head86fe407b1370fc9656f888b77e0ed6dbd68369ec. game-state/progression pinned under src/chapter1; only import suffix changed to .mjs. Progression spec copied under data/chapter1. No prototype HTML publication.

Implemented: root loads the ordered/replay-safe controller API; additive migration preserves root fields, backfills old checkpoint receipts without historical currency grants, fixed fusion and separate Lyra support projections. PR44 merged this foundation as `351752fd2e625469f28ad63d05d7ccded004d36a`.

PR46, merged as `86e8a60b7744539b42a6d08d24a7f8d2a6b724d0`, connects the canonical root UI from P00 through P05. START commits before leaving the introduction, the prologue and first-battle tutorial commit their controller events, the final story beat is the first Thorn Boar encounter with an explicit RETREAT result, and the result acknowledgement commits first HOME arrival before routing to HOME. A controller-save failure does not advance the visible route. Existing completed-story replay behavior remains available, and reload after HOME stays at HOME without duplicating the Field Mark reward.

Tests: PR44 browser CI passed 24/24 at 360x800, 390x844 and 430x932: https://github.com/saitou730/monster-legacy/actions/runs/34254607554. PR46 browser CI passed 27/27 at the same three viewports; merged-main E2E and Pages deploy both succeeded: https://github.com/saitou730/monster-legacy/actions/runs/34284029293. The added player-route test verifies P01, P02, P03, P04, P05, explicit retreat, HOME presentation, reload and reward non-duplication through the real root UI. The deployed root HTML references `src/app.js` and `src/chapter1/runtime.mjs`; the deployed app script contains the controller bindings and Thorn Boar retreat route. The first battle remains the current playable tutorial interaction; it is not yet a shared formal battle-controller combat.

Remaining v1.0 gates: connect real qualified HUNT/JOIN and party confirmation (P06-P09); synchronize controller and root fixed fusion/new-species test without duplicate writes (P10-P11); add contract summon and Lyra support outside the three-monster party (P12-P13); connect boss rematch/mastery, Unyielding LEGACY, archive and complete HOME (P14-P17); then exercise the entire player route plus reload checkpoints.

Public game UI/art/PR32 help and locked assets are untouched. Prototype HTML remains non-public. Android manual NOT RUN. Score82 historical HOLD; no score increase is claimed from browser evidence alone. v1.0 NOT COMPLETE.
