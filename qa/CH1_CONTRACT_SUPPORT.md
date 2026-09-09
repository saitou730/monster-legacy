# Contract Support save projection

Owner: Work
Branch: work/ch1-contract-support-save
Status: unit-tested; browser gate pending; not published

The root Support ID previously changed while the root Lyra ownership record
retained supportEquipped=false. Equip now projects the controller record while
preserving unrelated contracts and custom root metadata. The three-monster party
is unchanged. Existing acknowledged events remain no-ops; this patch does not
retroactively repair previously inconsistent saves.

Validation: node --test tests/contract-support-save.test.mjs — 2/2 PASS.
Covers input immutability, reload/replay, single acquisition, party preservation,
and persistence failure. New Browser E2E: NOT RUN. Android physical: NOT RUN.

Remaining: Contract/Support player-facing root UI, old inconsistent-save repair,
360x800 / 390x844 / 430x932 full route and save QA, then merge/deploy verification.
production/next_queue.yaml remains on CH1-CONTRACT-SUPPORT-BINDING; this is only
a prerequisite fix, not completion of that task. Art/prototype/workflow unchanged.
