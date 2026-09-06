# MONSTER LEGACY — Web Architecture v1.0

## Active runtime
Web is the active playable target. Unity migration is paused.

## Separation
- `src/data.js`: game content and locked identity references
- `src/storage.js`: persistence
- `src/battle.js`: battle rules / NEXT / VOLTAGE / mastery
- `src/fusion.js`: deterministic Fusion and Heritage
- `src/legacy.js`: Legacy inheritance
- `src/progression.js`: commercial journey routing
- `src/test_battle.js`: new-species tactical test
- `src/audio.js`: adaptive audio
- `src/motion.js`: presentation-only motion / camera / atmosphere / telegraph
- `src/app.js`: DOM orchestration and screen flow

## Motion rule
`motion.js` may change how an action is presented, but it must not decide damage, VOLTAGE, NEXT ACTION, mastery, Fusion results, Heritage, or save progression. This keeps game logic stable while timing and feel can be tuned aggressively.

## Art Lock rule
Motion may translate, scale, rotate, fade, filter, layer, or swap between already approved state assets. It may not redraw, reinterpret, or procedurally alter the identity of a locked monster.
