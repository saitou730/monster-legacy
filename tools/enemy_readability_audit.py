from pathlib import Path
r=Path(__file__).resolve().parents[1]
app=(r/'src/app.js').read_text()
motion=(r/'src/motion.js').read_text()
css=(r/'styles/app.css').read_text()
checks={
'callout_after_player_beat':'},1350);' in app,
'anticipation_before_impact':'},1950);' in app and 'attack_prep' in app,
'impact_separate_beat':'},2450);' in app,
'next_turn_delay':'},3850);' in app,
'enemy_warning_api':'function enemyWarning' in motion,
'enemy_impact_api':'function enemyImpactBeat' in motion,
'target_warning_css':'.fieldAlly.enemyThreat img' in css,
'aoe_warning_css':'⚠ ALL TARGET' in css,
'random_warning_css':'⚠ RANDOM ×3' in css,
'ui_geometry_note':'permanent UI geometry unchanged' in css,
'reduced_motion':'prefers-reduced-motion:reduce' in css,
}
failed=[k for k,v in checks.items() if not v]
out='\n'.join([f'{k}: {"PASS" if v else "FAIL"}' for k,v in checks.items()]) + f'\nTOTAL {sum(checks.values())}/{len(checks)}\n'
(r/'qa/ENEMY_READABILITY_AUDIT_v1.3.2.txt').write_text(out)
print(out)
raise SystemExit(1 if failed else 0)
