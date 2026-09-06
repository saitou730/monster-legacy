from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
app=(root/'src/app.js').read_text(encoding='utf-8')
pt=(root/'src/playtest.js').read_text(encoding='utf-8')
checks={
 'playtest script loaded':'src/playtest.js' in html,
 'home playtest controls':'playtestStartBtn' in html and 'playtestExportBtn' in html,
 'survey modal':'playtestModal' in html and 'playtestForm' in html,
 'four comprehension questions':all(x in html for x in ['qNext','qCommands','qStance','qVoltage']),
 'replay intent':'replayIntent' in html,
 'clarity':'name="clarity"' in html,
 'json export':'new Blob' in pt and 'download=' in pt,
 'no network upload':'fetch(' not in pt and 'XMLHttpRequest' not in pt and 'sendBeacon' not in pt,
 'story telemetry':'story_step_complete' in app,
 '2 command telemetry':'two_commands_locked' in app,
 'stance telemetry':'stance_understood' in app,
 'boss turn telemetry':'boss_turn_execute' in app,
 'boss clear telemetry':'boss_clear' in app,
 'survey after boar':'boss.id==="boar"' in app and 'showSurvey' in app,
 'fixed rules preserved':'2 COMMAND / 1 STANCE' in html and 'NEXT ACTION — TURN LOCK' in html,
 'locked-design boss placeholders':'DESIGN LOCKED — BATTLE ASSET PENDING' in app,
}
passed=sum(checks.values())
for k,v in checks.items(): print(f"{'PASS' if v else 'FAIL'} | {k}")
print(f"RESULT {passed}/{len(checks)}")
raise SystemExit(0 if passed==len(checks) else 1)
