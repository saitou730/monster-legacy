from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
index=(ROOT/'index.html').read_text(encoding='utf-8')
app=(ROOT/'src/app.js').read_text(encoding='utf-8')
css=(ROOT/'styles/app.css').read_text(encoding='utf-8')
checks={
 'chapter full-screen mode':'body.storyMode .header,body.storyMode .nav{display:none}' in css,
 'chapter cinematic backdrop':'storyBackdrop' in index and 'assets/art/thorn_boar.png' in index,
 'single active beat':'$("storyLessons").innerHTML=storyLesson(step' in app,
 'six beats preserved':all(x in app for x in ['NEXT ACTION — TURN LOCK','2 / 3','1 STANCE','VOLTAGE','EQUIPMENT','BOSS BATTLE START']),
 'official Goura sprite':'assets/battle/goura/idle.png' in app,
 'official Fire Lizard sprite':'assets/battle/fire/idle.png' in app,
 'official Leaf Rabbit sprite':'assets/battle/leaf/idle.png' in app,
 'official Thorn Boar sprite':'assets/battle/boar/danger.png' in app,
 'no owl visual reinterpretation':'assets/battle/owl/' not in app,
 'no manticore visual reinterpretation':'assets/battle/manticore/' not in app,
 'boss transition preserved':'selectBoss("boar")' in app and 'go("boss")' in app,
 'story mode toggled by navigation':'document.body.classList.toggle("storyMode", id === "story")' in app,
}
for name,ok in checks.items(): print(('PASS' if ok else 'FAIL')+'  '+name)
failed=[k for k,v in checks.items() if not v]
if failed: raise SystemExit('Chapter presentation audit failed: '+', '.join(failed))
print(f'PASS  {len(checks)}/{len(checks)} chapter-presentation checks')
