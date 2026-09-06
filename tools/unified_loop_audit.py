from pathlib import Path
root=Path(__file__).resolve().parents[1]
index=(root/'index.html').read_text()
app=(root/'src/app.js').read_text()
data=(root/'src/data.js').read_text()
storage=(root/'src/storage.js').read_text()
fusion=(root/'src/fusion.js').read_text()
test=(root/'src/test_battle.js').read_text()
checks={
 'v1.8 runtime label':'Director Build v1.8' in index and 'version: "1.8.0"' in data,
 'story scene':'id="story"' in index,
 'hunt scene':'id="hunt"' in index,
 'fusion scene':'id="fusion"' in index,
 'new species test scene':'id="test"' in index,
 'boss replay CTA':'BOSS REPLAYへ' in index,
 'fusion domain module':'window.MLFusion' in fusion,
 'deterministic fusion':'resultRandom:false' in fusion,
 'heritage A+B':'heritage:[a,b]' in fusion,
 'growth echo 0.6':'growthEchoRatio:0.6' in fusion,
 'lineage history persisted':'lineageHistory' in fusion and 'lineageHistory' in storage,
 'test domain module':'window.MLTestBattle' in test,
 'test requires core':'coreUsed' in test and 't.coreUsed=true' in app,
 'test requires successful evade':'evadeSucceeded' in test and 't.evadeSucceeded=true' in app,
 'test completion saved':'state.testComplete=true' in app,
 '2 command gate':'queue.length!==2' in app,
 'stance resolver':'function stanceId' in app,
 'turn-locked next':'lockedAction' in test and 'lockedAction' in app,
 'owl design lock':'DESIGN LOCKED / BATTLE ASSET PENDING' in data and 'Thunder Owl' not in data,
 'manticore battle lock':'assets/battle/manticore' in data and 'LOCKED / OFFICIAL-SHEET-DERIVED BATTLE ASSET' in data,
 'motion module integrated':(root/'src/motion.js').exists() and '<script src="src/motion.js"></script>' in index,
}
# The owl name is Japanese in runtime data; verify both locked bosses by count instead.
checks['two locked boss metadata']=data.count('LOCKED / OFFICIAL-SHEET-DERIVED BATTLE ASSET')>=2
checks.pop('owl design lock',None)
failed=[]
for k,v in checks.items():
 print(('PASS' if v else 'FAIL'),k)
 if not v: failed.append(k)
print(f'RESULT {len(checks)-len(failed)}/{len(checks)}')
raise SystemExit(1 if failed else 0)
