from pathlib import Path
R=Path(__file__).resolve().parents[1]
checks={
"boss intent api":"bossIntent" in (R/"src/motion.js").read_text(),
"camera focus api":"function focus" in (R/"src/motion.js").read_text(),
"trail api":"slashTrail" in (R/"src/motion.js").read_text(),
"join cinematic":"joinCinematic" in (R/"src/app.js").read_text(),
"fusion cinematic":"fusionCinematic" in (R/"src/app.js").read_text(),
"owl identity motion":"owlAim" in (R/"styles/app.css").read_text(),
"manticore identity motion":"manticoreDivePrep" in (R/"styles/app.css").read_text(),
"boar identity motion":"boarChargePrep" in (R/"styles/app.css").read_text(),
"reduced motion":"prefers-reduced-motion" in (R/"styles/app.css").read_text(),
"core command count":"boss.queue.length !== 2" in (R/"src/app.js").read_text(),
}
for k,v in checks.items(): print(("PASS" if v else "FAIL"),k)
print(f"{sum(checks.values())}/{len(checks)} PASS")
raise SystemExit(0 if all(checks.values()) else 1)
