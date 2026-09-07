# MONSTER LEGACY Development v2

## Goal
Replace chat-exported Direct Play files as the primary development workflow with a repository-first, repeatable pipeline.

## Source of truth
- `main` becomes the only canonical source after v1.8.2 source + assets are fully synchronized.
- Until binary assets are uploaded, the packaged v1.8.2 artifact remains the gameplay reference candidate.

## Target workflow
1. Edit source in GitHub / local checkout.
2. Run static checks and Playwright browser E2E.
3. Build/deploy the same source to a fixed HTTPS URL.
4. Validate on Android Chrome.
5. Record Android-only failures separately from browser/static QA.

## QA levels
- STATIC PASS: syntax/contracts/file integrity only.
- BROWSER E2E PASS: real browser interaction and assertions.
- ANDROID MANUAL PASS: manually verified on physical Android device.

Never promote a lower level to a higher one.

## First E2E route
START -> HOME -> HUNT -> open skill sheet -> select 2 COMMAND -> execute turn -> HUNT resolution -> PARTY.

## Migration order
1. Add repository development scaffold.
2. Synchronize v1.8.2 text source.
3. Synchronize official locked binary assets unchanged.
4. Enable CI.
5. Enable fixed HTTPS preview/deployment.
6. Retire Direct Play downloads as the normal playtest route.

## Core rules remain locked
- Portrait 9:16
- NEXT ACTION turn-locked
- 3 party members
- 2 COMMAND / 1 STANCE
- Art Lock is authoritative
