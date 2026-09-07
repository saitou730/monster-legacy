# Chapter 1 Battle Context — Director QA

## Scope and implementation
- Work branch: work/chapter1-battle-context, base c123130.
- Independent context module and stylesheet; entry HTML adds only two includes.
- FIRST BATTLE, first boar encounter, HUNT, NEW SPECIES TEST and MASTERY expose concise rule help.
- 500 ms hold or ordinary tap opens the same native modal. Visible buttons are at least 48 px tall.
- Movement over 10 px, scrolling, pointer cancellation and focus loss cancel the hold.
- Escape/close, modal focus, focus restoration, safe-area padding, 16 px explanatory body text.
- Does not mutate save, party, command selection, NEXT, rewards, story transitions or art.

## Verification
- Browser CI pending. Added regression for tap/hold, movement cancellation, modal bounds, unchanged save/progression, reload and route continuation at existing 360/390/430 projects.
- Existing integrated Chapter 1 route test remains unchanged.
- Android physical long press / TalkBack: NOT RUN.

## Director assessment
Score: 82 HOLD (inherited; no fresh quality score awarded).
The public Chapter 1 page at this base is a progression prototype: its battles use completion buttons and locked-art placeholders. This change makes core rules accessible; it does not claim that skill execution or individual STANCE effects are implemented there. Earlier root runtime PR32/35/37 do not automatically affect the deployed prototype.

## Remaining priorities
1. Connect the shared real battle controller to the Chapter 1 route, then bind each skill's actual effect and STANCE preview to that controller's data. Chat owns progression, Work owns battle UI; coordinate the shared entry point in production/WORK_CHAT_OWNERSHIP.md.
2. Verify actual 2 COMMAND / unselected STANCE / turn-locked NEXT and Save/Continue end to end after that integration. Existing route tests alone do not establish battle fidelity.
3. Integrate official art and verify mobile touch readability. Preserve existing canonical designs; no replacement generation.
