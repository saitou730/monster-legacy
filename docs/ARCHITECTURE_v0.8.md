# MONSTER LEGACY Architecture v0.8

v0.8 changes the project from a single Vertical Slice implementation into an engine-portable game core.

## Runtime modules
- `data.js`: content definitions only.
- `battle.js`: boss policy / turn-state factory / mastery check.
- `fusion.js`: deterministic result + one Heritage per parent + 60% growth echo.
- `test_battle.js`: post-fusion proof battle.
- `storage.js`: persistence boundary.
- `app.js`: Web presentation adapter.

## Art lock expansion
Battle-ready derivatives now exist for:
- P0 six
- Thunder Owl ML-001
- Skycleave Manticore ML-002

All are official-sheet-derived. These assets are production placeholders for dedicated cleaned exports; identity is locked and must not be redesigned.

## Engine boundary
The game rules must not depend on DOM/CSS. Unity migration mirrors rules through `unity/Assets/Scripts` while the Web build remains the executable reference implementation.
