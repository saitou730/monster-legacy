# Development v2 migration checklist

## Done
- [x] Repository-first policy documented
- [x] Playwright dependency scaffold added
- [x] Mobile projects: 360 / 390 / 430 width
- [x] First-session interaction smoke test scaffold added
- [x] QA levels split into STATIC / BROWSER E2E / ANDROID MANUAL

## Required before GitHub becomes canonical
- [ ] Upload v1.8.2 `index.html`, `styles/`, `src/`
- [ ] Upload v1.8.2 official `assets/` unchanged
- [ ] Verify asset hashes / file count against packaged v1.8.2
- [ ] Add/enable GitHub Actions E2E workflow
- [ ] Run BROWSER E2E PASS on the repository build
- [ ] Enable fixed HTTPS deployment (GitHub Pages / equivalent)
- [ ] Validate fixed URL on physical Android Chrome
- [ ] Mark first ANDROID MANUAL PASS
- [ ] Retire Direct Play downloads as the normal test path

Issue: #30
