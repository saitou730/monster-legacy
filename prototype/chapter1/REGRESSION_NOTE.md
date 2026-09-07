# Public visual regression note

Observed 2026-09-07 after Chapter 1 v0.5 merge.

## Symptom
- Fixed GitHub Pages URL looks visually degraded.
- Canonical monster/battle images no longer appear.
- Placeholder boxes such as `LOCKED ART` appear instead.

## Root cause
Main `.github/workflows/web-qa.yml` currently stages `prototype/chapter1/.` as the entire Pages site. That prototype intentionally renders locked art as placeholders and is not the canonical public runtime.

The root runtime still references and contains canonical assets, e.g. `assets/art/thorn_boar.png` and `assets/battle/wind_bat/idle.png` from root `index.html`.

## Required Work-side recovery
1. Restore Pages staging to the root runtime (`index.html`, `src`, `styles`, `assets`, `data`) rather than `prototype/chapter1/`.
2. Preserve PR #32 skill-help / STANCE / guided START changes.
3. Integrate Chat-owned Chapter 1 progression logic from `prototype/chapter1/src/` into the root runtime instead of publishing the prototype directly.
4. Run browser/mobile QA and only then publish.

Chat must not merge or change public deployment under the agreed ownership split.
