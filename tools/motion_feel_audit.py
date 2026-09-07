from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
css=(ROOT/'styles/app.css').read_text(encoding='utf-8')
app=(ROOT/'src/app.js').read_text(encoding='utf-8')
motion=(ROOT/'src/motion.js').read_text(encoding='utf-8')
index=(ROOT/'index.html').read_text(encoding='utf-8')
checks={
 'motion module loaded':'<script src="src/motion.js"></script>' in index,
 'motion module API':'window.MLMotion' in motion and 'telegraph' in motion and 'animateAlly' in motion,
 'band atmosphere':'motionParticles' in motion and 'setBand' in motion and '.motionParticles' in css,
 'CALM/HEAT/RAGE/DANGER classes':all(f'vol-{x}' in css for x in ['calm','heat','rage','danger','legacy']),
 'enemy NEXT telegraph':'MLMotion.telegraph' in app and 'attack_prep' in motion,
 'single telegraph':'.telegraph-single' in css,
 'AOE telegraph':'.telegraph-aoe' in css,
 'random3 telegraph':'.telegraph-random3' in css,
 'LEGACY telegraph':'.telegraph-legacy' in css,
 'command formation motion':'mlCommandEnter' in css and 'mlStanceEnter' in css,
 'ally anticipation':'allyWindup' in motion and 'mlAllyWindup' in css,
 'ally strike':'allyStrike' in motion and 'mlAllyStrike' in css,
 'ally impact':'impactAlly' in motion and 'mlAllyImpact' in css,
 'enemy strike':'enemyStrike' in motion and 'mlEnemyStrikeSingle' in css,
 'camera impulse':'MLMotion.camera' in app and 'mlCameraHeavy' in css,
 'hit stop':'MLMotion.hitStop' in app and '.hitStop' in css,
 'impact burst':'MLMotion.burst' in app and '.impactBurst' in css,
 'LEGACY freeze/surge':'legacyFreeze' in motion and 'mlLegacySurge' in css,
 'HUNT field party':'id="huntFieldParty"' in index and 'renderMiniFieldParty("huntFieldParty"' in app,
 'TEST field party':'id="testFieldParty"' in index and 'renderMiniFieldParty("testFieldParty"' in app,
 'reduced motion retained':'prefers-reduced-motion:reduce' in css and 'motionOff' in css,
 'Art Lock preserved':'OFFICIAL DESIGN LOCK' in index and 'setSpriteState' in app,
}
for name,ok in checks.items(): print(('PASS' if ok else 'FAIL')+'  '+name)
failed=[k for k,v in checks.items() if not v]
if failed: raise SystemExit('Motion Feel audit failed: '+', '.join(failed))
print(f'PASS  {len(checks)}/{len(checks)} motion-feel checks')
