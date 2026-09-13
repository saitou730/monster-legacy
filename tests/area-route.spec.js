const {test,expect}=require('@playwright/test');
test('completed Chapter 1 continues into discovery, real owl battle, JOIN and return',async({page})=>{
 test.setTimeout(120000);
 await page.goto('/');await page.waitForFunction(()=>!!window.MLChapter1);
 await page.evaluate(()=>{const s=MLStorage.load();s.chapter1=MLChapter1.migrateRootChapter(s);s.chapter1.progress.state='P20_CHAPTER1_COMPLETE_HOME';Object.assign(s,{introSeen:true,storyComplete:true,fused:true,testComplete:true,joinedBat:true,party:['goura','flame','leaf'],supportContract:'lyra_vell'});s.mastery.boar=true;s.legacyCores.unyielding=true;MLStorage.save(s);});
 await page.reload();await page.locator('#bootStart').tap();
 await expect(page.locator('#chapterFeedbackPanel')).toBeHidden();await expect(page.locator('header .sub')).not.toContainText('Director Build');await expect(page.locator('details.directorDetails')).toBeHidden();
 await page.locator('#journeyGoBtn').tap();await page.locator('#areaAdvance').tap();await page.locator('#areaAdvance').tap();
 await expect(page.locator('#areaContent img')).toBeVisible();await page.reload();await page.locator('#bootStart').tap();await page.locator('#journeyGoBtn').tap();await expect(page.locator('#areaAdvance')).toHaveText('雷フクロウに挑む');await page.locator('#areaAdvance').tap();
 for(let turn=0;turn<18;turn++){
  if(await page.evaluate(()=>!!MLStorage.load().area1?.resolved))break;
  await page.evaluate(()=>{ML.pickBoss('flame','CORE');ML.pickBoss('goura','CORE');});
  await page.locator('#bossExec').tap();await page.waitForTimeout(4100);
 }
 expect(await page.evaluate(()=>MLStorage.load().area1?.resolved)).toBe(true);
 await page.reload();await page.locator('#bootStart').tap();await page.locator('#journeyGoBtn').tap();await expect(page.locator('#areaAdvance')).toHaveText('雷フクロウを仲間にする');await page.locator('#areaAdvance').tap();await page.locator('#areaAdvance').tap();
 await page.reload();expect(await page.evaluate(()=>MLStorage.load().monsterRoster)).toEqual(['SP-044']);expect(await page.evaluate(()=>MLStorage.load().party)).toEqual(['goura','flame','leaf']);expect(await page.evaluate(()=>MLStorage.load().area1.returned)).toBe(true);
});
