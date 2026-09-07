from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
play=(ROOT/'src/playtest.js').read_text(encoding='utf-8')
collector=(ROOT/'PLAYTEST_RESULT_COLLECTOR.html').read_text(encoding='utf-8')
guide=(ROOT/'TESTER_GUIDE.html').read_text(encoding='utf-8')
coord=(ROOT/'PLAYTEST_COORDINATOR_GUIDE.md').read_text(encoding='utf-8')
checks={
 'v0.7 session key':"monsterLegacyPlaytestV070" in play and "const VERSION = '0.7.0'" in play,
 'tester query mode':"query().get('tester')==='1'" in play and 'startTesterMode' in play,
 'clean external session':"restart('external_tester_kit')" in play,
 'routes to chapter 1':"ML.go('story')" in play,
 'tester guide launch':'index.html?tester=1' in guide,
 'collector multi json':'multiple accept="application/json,.json"' in collector,
 'collector duplicate filter':'duplicate session-id filtering' in (ROOT/'PRODUCTION_TRACKER_v2.8.md').read_text(encoding='utf-8').lower() or 'unique.has(r.sessionId)' in collector,
 'collector csv export':'MONSTER_LEGACY_PLAYTEST_AGGREGATE.csv' in collector,
 'collector director summary':'MONSTER_LEGACY_PLAYTEST_DIRECTOR_SUMMARY.md' in collector,
 'five-player gate':'rows.length>=5' in collector and 'replay4>=4' in collector,
 'no collector network':'fetch(' not in collector and 'XMLHttpRequest' not in collector,
 'privacy guidance':'network upload' in coord.lower() or 'no network upload' in coord.lower(),
 'art locks preserved':'Thunder Owl / Rift Manticore' in (ROOT/'PRODUCTION_TRACKER_v2.8.md').read_text(encoding='utf-8'),
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL')+'  '+k)
failed=[k for k,v in checks.items() if not v]
if failed: raise SystemExit('Distribution audit failed: '+', '.join(failed))
print(f'PASS  {len(checks)}/{len(checks)} distribution checks')
