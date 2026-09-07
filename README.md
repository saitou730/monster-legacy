# MONSTER LEGACY — repository-first migration

Source: v1.8.2 DEV_V2_BOOTSTRAP, with the reviewed Work v1.8.3 battle-impact corrections.
Official assets are byte-preserved; `ASSET_MANIFEST_SHA256.txt` verifies 73 entries.

## Run

```
npm ci
npm run serve
```

## Verify

```
npm run verify:assets
npm run test:regression
npx playwright install chromium
npm run test:e2e
```

Browser E2E runs at 360×800, 390×844, and 430×932. Current tests cover START/HOME/HUNT touch selection and a boar turn, not the entire first-session loop. No physical Android PASS is claimed.

## Deployment

The Web QA workflow deploys runtime-only files from main to GitHub Pages only after E2E succeeds. Repository Settings → Pages → Source must be GitHub Actions. The fixed URL is not live until the deployment job succeeds.

## Canon

Portrait 9:16; NEXT ACTION turn-lock; 3 party / 2 COMMAND / 1 STANCE; official Art Lock. Score 82/100 HOLD is inherited, not a fresh runtime assessment.

See `docs/WORK_HANDOFF_2026-09-07.md` and `qa/DIRECTOR_QA_v1.8.3.md`. Direct Play exports are archival, not the canonical development route.
