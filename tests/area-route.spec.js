const {test,expect}=require('@playwright/test');

test('completed Chapter 1 continues through #103 hunt, qualified Owl resolution, JOIN and return',async({page})=>{
 test.setTimeout(120000);
 await page.goto('/');await page.waitForFunction(()=>!!window.MLChapter1);
 await page.evaluate(()=>{const s=MLStorage.load();s.chapter1=MLChapter1.migrateRootChapter(s);s.chapter1.progress.state='P20_CHAPTER1_COMPLETE_HOME';Object.assign(s,{introSeen:true,storyComplete:true,fused:true,testComplete:true,joinedBat:true,party:['goura','flame','leaf'],supportContract:'lyra_vell'});s.mastery.boar=true;s.legacyCores.unyielding=true;MLStorage.save(s);});
 await page.reload();await page.locator('#bootStart').tap();
 await expect(page.locator('#chapterFeedbackPanel')).toBeHidden();await expect(page.locator('header .sub')).not.toContainText('Director Build');await expect(page.locator('details.directorDetails')).toBeHidden();

 // Enter Area 1, then drive the new player-visible three-beat hunt instead of the old #98 CTA chain.
 await page.locator('#journeyGoBtn').tap();await page.locator('#areaAdvance').tap();
 await expect(page.getByRole('heading',{name:'何を手がかりにする？'})).toBeVisible();
 await page.getByRole('button',{name:'焦げ跡を調べる'}).tap();
 await expect(page.getByRole('heading',{name:'どう近づく？'})).toBeVisible();
 await page.getByRole('button',{name:'先回りして圧をかける'}).tap();
 await expect(page.getByRole('heading',{name:'雷フクロウを捉えた'})).toBeVisible();
 await expect(page.getByText('開始時VOLTAGEはHEAT')).toBeVisible();
 await page.getByRole('button',{name:'この読みで挑む'}).tap();

 // Discovery and the chosen hunt payload are durable across reload before battle.
 let hunt=await page.evaluate(()=>MLStorage.load().area1?.hunt);
 expect(hunt.lesson).toBe('suppress');expect(hunt.approach).toBe('pressure');
 await page.reload();await page.locator('#bootStart').tap();await page.locator('#journeyGoBtn').tap();
 await expect(page.locator('#areaAdvance')).toHaveText('雷フクロウに挑む');await page.locator('#areaAdvance').tap();

 // Integration-level qualification: the runtime must refuse a free resolve, then accept the deterministic SUPPRESS evidence.
 expect(await page.evaluate(()=>{const s=MLStorage.load();return MLArea.commit(s,'resolved',MLStorage.save);})).toBe(false);
 await page.evaluate(()=>{const s=MLStorage.load();s.area1.hunt.attempt={...(s.area1.hunt.attempt||{}),suppressProven:true,rageEntered:false};MLStorage.save(s);});
 expect(await page.evaluate(()=>{const s=MLStorage.load();return MLArea.commit(s,'resolved',MLStorage.save);})).toBe(true);

 // Resolution survives reload; JOIN remains the only exact-once SP-044 ownership transaction and party stays exactly three.
 await page.reload();await page.locator('#bootStart').tap();await page.locator('#journeyGoBtn').tap();
 await expect(page.getByRole('heading',{name:'雷フクロウが同行を選んだ'})).toBeVisible();
 expect(await page.evaluate(()=>MLStorage.load().monsterRoster||[])).toEqual([]);
 await page.getByRole('button',{name:'JOINを記録する'}).tap();
 await page.locator('#areaAdvance').tap();
 await page.reload();
 expect(await page.evaluate(()=>MLStorage.load().monsterRoster)).toEqual(['SP-044']);
 expect(await page.evaluate(()=>MLStorage.load().party)).toEqual(['goura','flame','leaf']);
 expect(await page.evaluate(()=>MLStorage.load().party.length)).toBe(3);
 expect(await page.evaluate(()=>MLStorage.load().area1.returned)).toBe(true);
});
