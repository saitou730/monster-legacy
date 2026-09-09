# Chapter 1 Fresh Full-Journey QA

Date: 2026-09-09  
Branch: `work/ch1-full-journey-e2e`  
PR: #55  
Base: `4fe1ee0f244eba54cb74c90738ef36deb06447e3`

## Implementation gate

- PASS: a cleared localStorage reaches P20 using player-facing root-runtime controls.
- PASS: TITLE, PROLOGUE, FIRST BATTLE, first Thorn Boar encounter, retreat, and HOME are traversed in order.
- PASS: Wind Bat JOIN, three-monster PARTY, fixed Fire Lizard + Wind Bat FUSION, and NEW SPECIES TEST are traversed.
- PASS: Lyra is acquired once and equipped as Support outside the three-monster party.
- PASS: Thorn Boar MASTERY requires VOLTAGE 100, surviving LEGACY ART, and victory.
- PASS: victory, explicit LEGACY「不退転」claim, Archive acknowledgement, and completed HOME remain separate gates.
- PASS: reload preserves P20 and does not duplicate JOIN, lineage, Contract, or LEGACY currency.
- PASS: invisible toast no longer intercepts portrait touch controls.
- PASS: the playtest survey does not cover the canonical Chapter 1 LEGACY/Archive closeout.
- PASS: completed HOME exposes an explicit optional feedback entry; it stays hidden before P20 and does not auto-open.
- PASS: first load respects OS reduced-motion; a player's explicit MOTION choice persists and overrides later OS changes.
- PASS: root Art Lock assets and `prototype/chapter1/` were not changed.

## Verification

| Check | Result |
| --- | --- |
| Asset verification / Node regression | PASS |
| Browser E2E 360x800 / 390x844 / 430x932 | PASS — 45/45, run 34355933486 |
| Fresh START-to-P20 journey | PASS on all three browser projects |
| Final Save/Continue and duplicate receipts | PASS |
| Android physical device | NOT RUN |

Director Score remains **82/100 HOLD**. This closes the browser full-journey evidence gap; physical-device and external-player evidence are still required for a score increase.
