# v1.8.4 — Skill explanations and first-session entry

User feedback: skill consequences, especially STANCE, cannot be understood before selection; START abruptly opens HOME; the path to fusion/characters/summon is unclear.

Changes:
- Boss commands support 500ms long press, plus visible info buttons. STANCE info is available before choosing the two commands. Explanation never enqueues a command; movement/scroll cancels long press.
- Existing technique sheets support long press; keyboard-accessible info buttons expose the boss explanations.
- First START opens a short narrative with existing Goura art, then STORY. Returning saves with progress skip the intro. No new character art.
- End of tutorial leads to HUNT before fusion and boss. This repairs the previous boss shortcut.
- Flame Wing Lizard STANCE now retains +12% damage / +2 VOL for its next CORE, matching game_data_v4.1.json rather than resetting before use.
- Generic first JOIN is not named unique Phil; unique character identity stays separate from the consumable species.

Known gaps explicitly exposed, not silently claimed complete:
- Fire/Wind individual STANCE effects are not implemented; HUNT Goura/Leaf STANCE effects are not implemented. Explanations state this.
- Equipment descriptions and role behavior still require broader balance/domain consolidation; no new cooldown promises.
- Summon/gacha runtime, currency, pool, rates, pity and duplicates are absent. No paid or random system introduced in this patch.
- Humanoid unique character names/settings exist, but governing source images are missing from main. No text-only regeneration permitted.

Validation: syntax and asset hashes PASS locally. CI must run existing HUNT/boar cases plus intro persistence and non-selecting long-press/tap explanation at three widths. No Android MANUAL PASS; Score82 HOLD.

First CI found the smoke test attempting hidden STORY navigation: replaced that shortcut with actual six-lesson taps into HUNT. A flaky long press exposed closing-sheet touch interception; closed sheet descendants now immediately disable pointer events. Verna source registry recovered: libfile_1054b449f75c8191813e305303457a4a; exact source file_00000000332882119034b17fa590c007 is accessible. Source image is not yet bound into GitHub or newly approved.
