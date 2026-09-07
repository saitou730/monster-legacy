# Chapter 1 prototype deployment boundary

`prototype/chapter1/` is a Chat-owned progression/integration workspace.

It is **not** the public player-facing runtime and must not replace the root application in GitHub Pages deployment.

## Public runtime

The public runtime remains the repository root application (`index.html`, `src/`, `styles/`, `assets/`, `data/`) and is owned for merge/deploy by Work.

## Why

The Chapter 1 prototype intentionally uses locked-art placeholders while progression, save transactions, JOIN, FUSION and CONTRACT flow are being developed. Publishing it directly causes an apparent visual regression and hides the canonical locked assets already present in the root runtime.

## Integration rule

Chat implements progression logic and Chapter 1 data here and opens a PR. Work reconciles those changes into the root runtime, preserves PR #32 battle/onboarding work, runs QA, then merges/publishes.

Do not change `.github/workflows/web-qa.yml` to stage `prototype/chapter1/` directly.
