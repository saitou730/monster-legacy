from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
app=(root/'src/app.js').read_text()
css=(root/'styles/app.css').read_text()
checks={
'boot_gate':'id="bootGate"' in html and 'id="bootStart"' in html,
'home_first':'state.lastScreen="home"' in app and 'go("home");' in app,
'journey_route':'id="journeyRoute"' in html and 'function goJourney' in app,
'party_preview':'id="homePartyPreview"' in html and 'currentParty().map' in app,
'quick_story':"ML.go('story')" in html,
'quick_hunt':"ML.go('hunt')" in html,
'quick_party':"ML.go('party')" in html,
'quick_fusion':"ML.go('fusion')" in html,
'flow_test':'{id:"test"' in app,
'flow_boss':'{id:"boss"' in app,
'archive_access':"ML.go('archive')" in html,
'battle_rules_preserved':'2 Commands / 1 Stance' in html and 'Next Action — TURN LOCKED' in html,
'patch_geometry_untouched':'v1.4 GAME LOOP SHELL' in css,
'audio_start':'await enableGameAudio()' in app,
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
print(f"RESULT {sum(checks.values())}/{len(checks)}")
raise SystemExit(0 if all(checks.values()) else 1)
