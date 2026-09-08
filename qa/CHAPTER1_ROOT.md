# Chapter 1 root integration — stage 1

Source: Chat PR42 head86fe407b1370fc9656f888b77e0ed6dbd68369ec. game-state/progression pinned under src/chapter1; only import suffix changed to .mjs. Progression spec copied under data/chapter1. No prototype HTML publication.

Implemented: root loads the ordered/replay-safe controller API; additive migration adapter preserves root fields, backfills old checkpoint receipts without historical currency grants, fixed fusion and separate Lyra support projections. Existing UI handlers are unchanged in this stage; the new controller is not yet the owner of player-facing transitions. No autonomous startup migration writes and no old save reset.

Tests: pending. New root-staged browser checks run all controller events with serialization/replay, verify P07, one lineage, 3 monsters, separate contract, legacy and old fused-save preservation. These are controller integration checks, NOT full player-gesture end-to-end completion.

Remaining v1.0 gates: bind intro/first battle/boar retreat/HOME; connect real qualified JOIN and party confirmation; synchronize controller and root fusion/heritage without duplicate writes; add Lyra contract UI/support effects; connect test/mastery/legacy/archive and reload checkpoints; exercise full player route. The root app's in-memory save must be updated atomically with controller commits before using the transaction helper.

Public game UI/art/PR32 help untouched. Android manual NOT RUN. Score82 historical HOLD. v1.0 NOT COMPLETE.
