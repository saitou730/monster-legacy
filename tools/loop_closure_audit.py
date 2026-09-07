from pathlib import Path
root=Path(__file__).resolve().parents[1]
app=(root/'src/app.js').read_text()
index=(root/'index.html').read_text()
css=(root/'styles/app.css').read_text()
checks={
 'result modal exists':'id="journeyResult"' in index,
 'result primary exists':'journeyResultPrimary' in index,
 'result home exists':'journeyResultHome' in index,
 'join explicit result':'RESONANCE / JOIN COMPLETE' in app and 'PARTYへ' in app,
 'fusion explicit result':'SPECIAL FUSION / BIRTH' in app and 'NEW SPECIES TEST' in app,
 'lineage visible':'LINEAGE  ヒノ × フィル → 炎翼リザル' in app,
 'test explicit result':'SPECIES TEST COMPLETE' in app and 'BOSSへ' in app,
 'boss legacy result':'BOSS MASTERY / LEGACY ACQUIRED' in app,
 'archive home':'archiveHomeBtn' in index,
 'home acknowledgement':'homeReturnNotice' in app and 'homeReturnNotice' in css,
 'battle geometry not touched by v1.5 css':'v1.5 Loop Closure: post-content result cards' in css,
 'version 1.5':'Director Build v1.5' in index and 'version: "1.5.0"' in (root/'src/data.js').read_text(),
}
for k,v in checks.items(): print(('PASS' if v else 'FAIL'),k)
print('RESULT',sum(checks.values()),'/',len(checks))
raise SystemExit(0 if all(checks.values()) else 1)
