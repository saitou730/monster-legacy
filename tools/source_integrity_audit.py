from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'src/app.js').read_text(encoding='utf-8')
storage=(ROOT/'src/storage.js').read_text(encoding='utf-8')
index=(ROOT/'index.html').read_text(encoding='utf-8')
checks={
 'equipment resolver exists':'function equippedFor(' in app,
 'loadout renderer exists':'function renderLoadout(' in app,
 'setEquipment exists':'function setEquipment(' in app,
 'localStorage read guarded':'function safeLocalGet(' in app and 'let motionEnabled = safeLocalGet(' in app,
 'localStorage write guarded':'function safeLocalSet(' in app and 'safeLocalSet("mlMotion"' in app,
 'storage save guarded':'function save(state){\n    try{' in storage,
 'stale boss VOL DOM guarded':'if($("bossVolText"))' in app and 'if($("bossVol"))' in app,
 'formal direct commands':'function bossUnitHtml(' in app and 'commandTile' in app,
 'turn lock text':'NEXT ACTION — TURN LOCK' in index,
 'v1.8 label':'Director Build v1.8' in index,
}
for name,ok in checks.items(): print(('PASS' if ok else 'FAIL')+'  '+name)
failed=[k for k,v in checks.items() if not v]
if failed: raise SystemExit('Source integrity failed: '+', '.join(failed))
print(f'PASS  {len(checks)}/{len(checks)} source-integrity checks')
