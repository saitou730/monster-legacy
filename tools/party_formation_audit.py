from pathlib import Path
R=Path(__file__).resolve().parents[1]
app=(R/'src/app.js').read_text(); st=(R/'src/storage.js').read_text(); idx=(R/'index.html').read_text(); css=(R/'styles/app.css').read_text()
checks={
'party persisted':'party:["goura","fire","leaf"]' in st and 'party:Array.isArray(parsed.party)' in st,
'available roster':'function availablePartyIds()' in app and 'id:"wind"' in (R/'src/data.js').read_text(),
'normalize fusion':'function normalizeParty()' in app and 'state.fused' in app and 'flame' in app,
'current party state-driven':'function currentParty(){ return normalizeParty().map(cloneUnit); }' in app,
'slot focus':'function setPartyFocus' in app,
'assign unit':'function assignParty' in app,
'3 slot UI':'id="formationSlots"' in idx and 'Party Formation / 3 Slots' in idx,
'roster UI':'class="rosterList"' in idx,
'tactical summary':'formationSummary()' in app and 'id="formationSummary"' in idx,
'formation CSS':'.formationSlots' in css and '.rosterCard' in css,
'core rule copy':'2 COMMAND + 1 STANCE' in css and '毎ターン2体がCOMMAND' in idx,
'loadout preserved':'id="loadoutList"' in idx and 'function renderLoadout' in app,
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
print(f"{sum(checks.values())}/{len(checks)} PASS")
raise SystemExit(0 if all(checks.values()) else 1)
