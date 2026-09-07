const { test, expect } = require('@playwright/test');

test('long press explains a technique and does not select it', async ({ page }) => {
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('/');
  await page.locator('#bootStart').tap();
  await expect(page.locator('.mlPrologueCard')).toBeVisible();
  await page.locator('.mlPrologueSkip').tap();
  await page.locator('.nav [data-go="hunt"]').tap();

  await page.locator('#huntParty [onclick="ML.openHunt(\'fire\')"]').tap();
  const core=page.locator('#sheetBody [data-uid="fire"][data-kind="CORE"]');
  await expect(core).toHaveAttribute('data-ml-help','1');

  await core.dispatchEvent('pointerdown',{pointerType:'touch',button:0,isPrimary:true});
  await page.waitForTimeout(620);
  await expect(page.locator('#mlTechHelp')).toHaveClass(/show/);
  await expect(page.locator('#mlTechHelp strong')).toContainText('CORE');
  await core.dispatchEvent('pointerup',{pointerType:'touch',button:0,isPrimary:true});
  await expect(page.locator('#huntQueue .ql')).toHaveCount(0);

  await page.waitForTimeout(700);
  await core.tap();
  await expect(page.locator('#huntQueue .ql')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('fresh run enters story, returning progress still enters home', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bootStart').tap();
  await expect(page.locator('#bootGate')).toHaveClass(/mlPrologue/);
  await page.locator('.mlPrologueSkip').tap();
  await expect(page.locator('#story')).toHaveClass(/show/);

  await page.evaluate(() => {
    const s=MLStorage.load();
    s.storyStep=1;
    MLStorage.save(s);
  });
  await page.reload();
  await page.locator('#bootStart').tap();
  await expect(page.locator('#home')).toHaveClass(/show/);
});
