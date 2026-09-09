# Chapter 1 P16-P20 Closeout QA

Date: 2026-09-09  
Branch: `work/ch1-boar-legacy-closeout`  
PR: #54  
Base: `b70680e681702ccf03e6740ca0637d6901fe278f`

## Implementation gate

- PASS: P16 requires an explicit Thorn Boar rematch confirmation.
- PASS: P17 uses the canonical root boss battle. Progression only commits after the authored MASTERY check passes.
- PASS: boss MASTERY and P18 LEGACY claim are separate durable events.
- PASS: `unyielding` is projected only by `LEGACY_CLAIM`, after Thorn Boar mastery.
- PASS: P19 requires the player to acknowledge the journey record in the root Archive.
- PASS: P20 returns to a stable HOME with `CHAPTER 1 COMPLETE` persisted.
- PASS: receipt replay does not duplicate Contract, LEGACY, lineage, or completion rewards.
- PASS: root Art Lock paths and `prototype/chapter1/` were not changed.

## Verification

| Check | Result |
| --- | --- |
| JS syntax / diff whitespace | PASS |
| Direct P16-P20 state and replay test | PASS |
| Browser E2E 360x800 / 390x844 / 430x932 | PASS — Web QA run 34310053715 |
| Save compatibility / duplicate receipts | PASS — browser controller suite |
| Android physical device | NOT RUN |

Director Score remains **82/100 HOLD**. Chapter 1 closeout removes a completion blocker, but no score increase is claimed without a physical-device and external-player quality pass.
