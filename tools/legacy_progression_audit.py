from pathlib import Path
root=Path(__file__).resolve().parents[1]
index=(root/'index.html').read_text()
data=(root/'src/data.js').read_text()
storage=(root/'src/storage.js').read_text()
app=(root/'src/app.js').read_text()
legacy=(root/'src/legacy.js').read_text()
prog=(root/'src/progression.js').read_text()
checks={
 'archive screen':'id="archive"' in index,
 'legacy and codex tabs':'data-archive-tab="legacy"' in index and 'data-archive-tab="codex"' in index,
 'three legacy cores':all(x in data for x in ['unyielding','quiet_thunder','falling_wind']),
 'boss reward mapping':all(x in legacy for x in ['boar:"unyielding"','owl:"quiet_thunder"','manticore:"falling_wind"']),
 'persistent legacy inventory':'legacyCores' in storage and 'legacyEquipped' in storage,
 'per-unit translation':'effects:' in data and 'goura:' in data and 'flame:' in data,
 'runtime equip':'function setLegacy' in app and 'MLLegacy.equip' in app,
 'runtime modifier':'MLLegacy.modifier' in app,
 'boss mastery unlock':'MLLegacy.unlockForBoss' in app,
 'commercial progression':'MLProgression.next(state)' in app and "JourneyStep" not in prog,
 'progression all three bosses':all(x in prog for x in ['boar','owl','manticore']),
 'director-only telemetry':'directorOnly' in index and 'directorMode' in app,
 'archive nav':'data-go="archive"' in index,
 'v1.4 label':'Director Build v1.4' in index and 'version: "1.4.0"' in data,
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
print(f"RESULT {sum(checks.values())}/{len(checks)}")
raise SystemExit(0 if all(checks.values()) else 1)
