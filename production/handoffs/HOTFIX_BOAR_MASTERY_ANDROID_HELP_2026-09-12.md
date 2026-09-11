# Android hotfix — Thorn Boar mastery window / STANCE compact card

Owner: Work hotfix lane (temporary execution from Chat because Work session is unavailable)
Base: main `c6ced30553eb752706717d863adfa5eb0845f2f1`
Status: PR-only; do not publish or merge from Chat.

## Physical evidence
- Android playtest reached Thorn Boar HP 0 at VOLTAGE 90 before LEGACY ART could resolve.
- Result was BOSS CLEAR / MASTERY未達, blocking the intended Chapter 1 mastery route under normal high-damage play.
- When the remaining monster entered STANCE, the full STANCE prose rendered inside the compact 3-column card and overflowed vertically.

## Runtime fix
For Thorn Boar only, once VOLTAGE reaches DANGER (>=90), lethal player damage cannot reduce HP below 1 until the boss has actually triggered its LEGACY ART. If lethal damage and the VOLTAGE update happen in the same command sequence, entering DANGER also restores the pending mastery window to 1 HP. After LEGACY ART triggers, normal lethal damage is allowed again.

This preserves:
- normal clear below DANGER;
- NEXT ACTION turn-start lock (the current locked action is not rewritten mid-turn);
- mastery requirement itself (`legacyTriggered && legacySurvived`);
- 3 monsters / 2 COMMAND + remaining 1 STANCE;
- save format (boss object is transient and no durable save field is added).

## STANCE compact-card fix
Boss-mode party cards no longer render the long STANCE prose inside `.stanceLock`. The explicit `ⓘ STANCEの効果` control remains available and opens the full explanation sheet. This prevents Android text scaling from covering HP/commands or overflowing the compact card.

## Acceptance
1. Thorn Boar may still be defeated normally before VOLTAGE 90.
2. At VOLTAGE >=90 and before LEGACY ART triggers, lethal damage leaves Thorn Boar at 1 HP.
3. If a lethal command also raises VOLTAGE into DANGER, the boss remains at 1 HP rather than ending the battle.
4. NEXT remains the action locked at turn start; LEGACY ART appears only on the next canonical turn when VOLTAGE reaches 100.
5. Player must still survive LEGACY ART for mastery; protection does not grant mastery by itself.
6. After LEGACY ART triggers, Thorn Boar can be reduced to 0 and mastery is evaluated normally.
7. Full STANCE explanation remains reachable through the info/help sheet.
8. Compact boss cards do not render the long STANCE paragraph inline.
9. No Art Lock, Chapter 1 receipt, deployment workflow, or public Pages setting changes.
