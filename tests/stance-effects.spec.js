const { test, expect } = require('@playwright/test');

async function openFreshHunt(page){
  await page.goto('/');
  await page.locator('#bootStart').tap();
  if(await page.locator('#journeyResult').evaluate(el=>el.classList.contains('show'))){
    await page.locator('#journeyResultPrimary').tap();
  }
  await page.evaluate(()=>ML.go('hunt'));
}

async function choose(page, unitIndex, kind){
  await page.locator('#huntParty .unit').nth(unitIndex).locator(`[data-help-kind="${kind}"]`).tap();
}

test('HUNT applies visible guard, heal and primed-core STANCE effects', async ({ page }) => {
  await openFreshHunt(page);

  await page.locator('#huntParty .skillInfo[data-help-unit="goura"]').tap();
  await expect(page.locator('#sheetBody')).toContainText('45%');
  await expect(page.locator('#sheetBody')).not.toContainText('未実装');
  await page.locator('#sheetBody .btn').tap();

  await choose(page,1,'CORE');
  await choose(page,2,'CORE');
  await expect(page.locator('#huntStancePreview')).toContainText('ゴウラ');
  await page.locator('#huntExec').tap();
  await page.waitForTimeout(1250);
  await expect(page.locator('#huntLog')).toContainText('STANCE ゴウラ');
  await expect(page.locator('#huntLog')).toContainText('火トカゲ 10 (STANCE軽減)');

  await page.reload();
  await page.locator('#bootStart').tap();
  await page.evaluate(()=>ML.go('hunt'));

  await choose(page,0,'CORE');
  await choose(page,2,'CORE');
  await expect(page.locator('#huntStancePreview')).toContainText('火トカゲ');
  await page.locator('#huntExec').tap();
  await page.waitForTimeout(1250);
  await expect(page.locator('#huntLog')).toContainText('STANCE 火トカゲ');

  await choose(page,1,'CORE');
  await choose(page,0,'CORE');
  await expect(page.locator('#huntStancePreview')).toContainText('葉ウサギ');
  await page.locator('#huntExec').tap();
  await page.waitForTimeout(1250);
  await expect(page.locator('#huntLog')).toContainText('火トカゲ 火牙: 35 / VOL+10');
  await expect(page.locator('#huntLog')).toContainText('STANCE 葉ウサギ');
});