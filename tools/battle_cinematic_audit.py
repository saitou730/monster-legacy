from pathlib import Path
root=Path(__file__).resolve().parents[1]
css=(root/"styles/app.css").read_text()
app=(root/"src/app.js").read_text()
motion=(root/"src/motion.js").read_text()
checks={
"three depth layers": all(x in app for x in ["battleBackdropFar","battleBackdropMid","battleBackdropGround"]),
"cinematic haze": "cinematicHazeA" in css and "cinematicHazeB" in css,
"battlefield height >=57vh": "61vh" in css and "57vh" in css,
"hud overlap": "margin:0 6px -54px" in css,
"next overlay": "top:64px" in css,
"command forward": "translateY(-8px) scale(1.08)" in css,
"stance rear": "translateY(5px) scale(.96)" in css,
"pose telegraph single": "telegraph-single .enemySprite" in css,
"pose telegraph legacy": "telegraph-legacy .enemySprite" in css,
"voltage environment": all(x in css for x in ["vol-calm .battleBackdropFar","vol-rage .battleBackdropFar","vol-danger .battleBackdropFar"]),
"danger whole screen": "dangerBreath" in css,
"tray compressed": "formalUnit{min-height:96px" in css,
"queue hidden commercial": ".combatQueue{display:none}" in css,
"reduced motion": "prefers-reduced-motion" in css,
"motion dataset band": "stage.dataset.volBand" in motion,
"motion telegraph dataset": "stage.dataset.telegraph" in motion,
}
failed=[k for k,v in checks.items() if not v]
for k,v in checks.items(): print(("PASS" if v else "FAIL"),k)
if failed: raise SystemExit("Battle cinematic audit failed: "+", ".join(failed))
print(f"PASS {len(checks)}/{len(checks)}")
