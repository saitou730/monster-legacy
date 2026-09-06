# MONSTER LEGACY — PRODUCTION TRACKER v4.0

## Canonical floor
WEB v0.6 / Director Score 82 / 80-point Vertical Slice gate PASSED. Never regress below this floor.

## v1.0 Motion Feel Pass
- [x] v0.9 Commercial Flow retained
- [x] 9:16 / NEXT turn-lock / 3 party / 2 COMMAND / 1 STANCE retained
- [x] Art Lock identities retained without redesign
- [x] dedicated `src/motion.js` presentation module
- [x] COMMAND formation step-forward
- [x] STANCE formation settle-back
- [x] ally anticipation → strike/cast → return
- [x] ally hit/recoil response
- [x] enemy NEXT preparation pose
- [x] distinct single / AOE / random-3 enemy attack profiles
- [x] hit-stop + impact burst + local camera impulse
- [x] CALM / HEAT / RAGE / DANGER / LEGACY atmosphere scaling
- [x] LEGACY freeze → surge presentation
- [x] HUNT field party presentation
- [x] NEW SPECIES TEST field party presentation
- [x] Chapter 1 restrained creature motion
- [x] Fusion reveal motion
- [x] MOTION OFF / Reduced Motion guardrails
- [x] Motion Feel audit 22/22
- [x] Source Integrity 10/10
- [x] Mobile Static 15/15
- [x] Unified Loop 21/21
- [x] Legacy Progression 14/14
- [x] Boss Art Lock 18/18
- [x] Audio Contract PASS
- [x] Chromium 390×844 motion runtime smoke PASS

## Runtime smoke
Verified on the self-contained build using Chromium with `page.set_content` because localhost navigation is blocked by environment policy:
1. Manticore decision state shows field telegraph + atmosphere.
2. Goura / Fire Lizard selected as COMMAND, Leaf Rabbit becomes STANCE.
3. Player attack choreography enters strike state.
4. Enemy AOE choreography executes.
5. TURN 01 advances to TURN 02.
6. HUNT renders three field allies and completes an animated turn.
7. JavaScript page errors: 0.
8. Console errors: 0.

## Scope
Unity work paused by Director request. Do not spend production time on Unity until explicitly resumed.

## Score
**82 / 100 HOLD.** Implementation volume alone does not promote the Director score.

## 82 → 90 remaining evidence
1. Android physical-device full-route validation
2. >=5 first-time external-player sessions
3. motion timing adjustment from actual play (too slow / too noisy / readability)
4. final production audio authorship / listening approval
5. final presentation/performance pass after evidence
