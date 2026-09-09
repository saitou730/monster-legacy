# Dynamic Battle Viewport QA v1.8.5

Date: 2026-09-09  
Scope: canonical root boss battle only

## Result

- Browser E2E: **48/48 PASS**
- Viewports: 360x800, 390x844, 430x932
- Battle scroll position: 0
- Battle scroll height: no larger than its visible client height
- First COMMAND, automatic remaining STANCE, and EXECUTE remain visible without scrolling
- A canonical 2 COMMAND + 1 STANCE turn executes from the same viewport
- Save schema, battle timing, progression, official Art Lock assets: unchanged
- Android physical device: **NOT RUN**

Evidence: PR #59; Web QA run `34368173715`.
