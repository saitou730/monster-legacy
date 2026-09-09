const { test, expect } = require('@playwright/test');

test('monster portrait/name opens complete read-only details in HUNT, TEST and BOSS', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bootStart').tap();
  if(await page.locator('#journeyResult').evaluate(el=>el.classList.contains('show'))){
    await page.locator('#journeyResultPrimary').tap();
  }

  for(const screen of ['hunt','boss']){
    await page.evaluate(name=>ML.go(name),screen);
    const party=page.locator(`#${screen}Party`);
    const inspect=party.locator('.unitInspect').first();
    await expect(inspect).toBeVisible();
    const queue=page.locator(`#${screen}Queue .ql`);
    await expect(queue).toHaveCount(0);
    await inspect.tap();
    await expect(page.locator('#sheet')).toHaveClass(/show/);
    await expect(page.locator('#sheetBody')).toContainText('HP');
    await expect(page.locator('#sheetBody')).toContainText('CORE');
    await expect(page.locator('#sheetBody')).toContainText('ROLE');
    await expect(page.locator('#sheetBody')).toContainText('EQUIPMENT');
    await expect(page.locator('#sheetBody')).toContainText('STANCE');
    await expect(page.locator('#sheetBody')).toContainText('詳細を開いてもCOMMANDは選択されません');
    await expect(queue).toHaveCount(0);
    await page.locator('#sheetBody .btn').tap();
    await expect(page.locator('#sheet')).not.toHaveClass(/show/);
  }

  await page.evaluate(()=>{
    const key=ML_DATA.saveKey, save=JSON.parse(localStorage.getItem(key));
    save.fused=true; save.party=['goura','flame','leaf'];
    localStorage.setItem(key,JSON.stringify(save));
  });
  await page.reload();
  await page.locator('#bootStart').tap();
  await page.evaluate(()=>ML.go('test'));
  await page.locator('#testParty .unitInspect').first().tap();
  await expect(page.locator('#sheetBody')).toContainText('CORE');
  await expect(page.locator('#sheetBody')).toContainText('STANCE');
  await expect(page.locator('#testQueue .ql')).toHaveCount(0);
});