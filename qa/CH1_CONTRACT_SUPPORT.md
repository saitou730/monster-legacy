# Contract Support save projection

Owner: Work
Branch: work/ch1-contract-support-save
Status: merged; main publication verification pending

The root Support ID previously changed while the root Lyra ownership record
retained supportEquipped=false. Equip now projects the controller record while
preserving unrelated contracts and custom root metadata. The three-monster party
is unchanged. Existing acknowledged events remain no-ops; this patch does not
retroactively repair previously inconsistent saves.

Validation: node --test tests/contract-support-save.test.mjs — 2/2 PASS.
Covers input immutability, reload/replay, single acquisition, party preservation,
and persistence failure. Local Browser E2E could not start because the executor's
http-server failed at uv_interface_addresses. GitHub Web QA passed 33/33 at
360x800, 390x844 and 430x932: https://github.com/saitou730/monster-legacy/actions/runs/34306276752.
Android physical: NOT RUN.

The canonical root now also exposes the explicit P13 signal acknowledgement,
free guaranteed P14 Lyra invocation and P15 Support equip screens. The screen
uses typography and a contract sigil only; no unapproved character art was made.

Remaining: old inconsistent-save repair, 360x800 / 390x844 / 430x932 full route
and save QA, then merge/deploy verification.
production/next_queue.yaml remains on CH1-CONTRACT-SUPPORT-BINDING; this is only
a prerequisite fix, not completion of that task. Art/prototype/workflow unchanged.
