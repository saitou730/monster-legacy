# Repository-first migration — Work

- [x] Receive full v1.8.2 source and official binary assets.
- [x] Verify all 73 asset-manifest entries locally.
- [x] Preserve v1.8.3 battle-impact bug fixes and regression test.
- [x] Add package-lock and npm ci for repeatable installation.
- [x] Add mandatory touch-path checks at 360/390/430 widths.
- [x] Gate main deployment on browser E2E success.
- [x] Verify the committed GitHub tree contains every source and asset blob.
- [x] BROWSER E2E PASS (initial two flows × three widths) on GitHub Actions.
- [x] Merge reviewed migration PR #31 into main.
- [ ] Enable GitHub Pages Source = GitHub Actions and verify deployment URL.
- [ ] ANDROID MANUAL PASS for touch, sticky HUD, audio, Save/Continue.
- [ ] Expand E2E through resonance, JOIN, FUSION, species test and archive.

Local Chromium installation failed (download timeout/502). No local browser PASS.
Issue #30 remains the migration tracker. Do not call main complete before tree verification and merge.
