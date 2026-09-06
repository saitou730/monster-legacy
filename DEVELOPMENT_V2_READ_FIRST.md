# MONSTER LEGACY Development v2 — READ FIRST

This package is the v1.8.2 Touch Input Fix source + official packaged assets, prepared for repository-first development.

## New workflow
1. Put this folder contents at the repository root.
2. `npm install`
3. `npx playwright install chromium`
4. `npm run verify:assets`
5. `npm run test:e2e`
6. Deploy the repository root to one fixed HTTPS URL.
7. Test that URL on Android Chrome.

## QA language
- STATIC PASS = syntax/contracts only.
- BROWSER E2E PASS = Playwright browser interaction passed.
- ANDROID MANUAL PASS = verified on a physical Android device.

Never treat STATIC or BROWSER E2E as Android proof.

## Source of truth transition
Until this full package (including `assets/`) is pushed to GitHub and verified by `ASSET_MANIFEST_SHA256.txt`, GitHub is not yet the complete gameplay source of truth.
