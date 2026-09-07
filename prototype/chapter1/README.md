# MONSTER LEGACY — Chapter 1 Vertical Slice

Branch: `feature/ch1-vertical-slice-v0.5`

## Purpose

Chapter 1を画面単体ではなく、TITLEからCOMPLETE HOMEまで1本のゲーム体験として実装する作業ブランチです。

## Current route

TITLE → PROLOGUE → FIRST BATTLE → BOAR FIRST ENCOUNTER → RETREAT → HOME → HUNT → JOIN → PARTY → FUSION → NEW SPECIES TEST → CONTRACT SUMMON → SUPPORT CONTRACT → BOAR MASTERY → LEGACY → ARCHIVE → CHAPTER 1 COMPLETE HOME

## Canon

- Portrait First 9:16
- 3-monster party
- 2 COMMAND + 1 STANCE
- NEXT ACTION is turn-locked
- Monsters: HUNT / JOIN / FUSION
- Contract Characters: SUMMON
- Contract Character does not occupy monster party slot
- Fusion result is deterministic
- First special Fusion: 火トカゲ + 風コウモリ → 炎翼リザル
- First JOIN: 風コウモリ
- First Legacy: 不退転 from 荊棘の大猪
- Locked monster art must not be reinterpreted

## Status

This branch currently contains the integrated local-style HTML prototype plus implementation data. It is not an Android manual PASS and not a deployed production build.

QA labels must remain separate:

- STATIC PASS
- BROWSER E2E PASS
- ANDROID MANUAL PASS

## Next implementation priorities

1. Replace placeholder HUNT / TEST / BOSS states with the real shared battle controller.
2. Move progression, species, techniques and rewards from hard-coded UI strings into data files.
3. Add safe save migration/versioning.
4. Add automated route assertions and reload tests.
5. Integrate locked art assets only from canonical sources.
