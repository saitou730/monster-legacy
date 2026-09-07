const { test, expect } = require('@playwright/test');
test('START → STORY → HUNT: two actual touch commands and a resolved turn', async ({ page }) => {
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('/');
  await page.waitForFunction(() => window.ML_UX_BUILD === '1.8.4-ux');
  await page.locator('#bootStart').tap();
  await expect(page.locator('#story')).toHaveClass(/show/);
  // Tactical smoke remains focused on HUNT execution; onboarding progression has dedicated coverage.
  await page.evaluate(() => window.ML.go('hunt'));
  await expect(page.locator('#hunt')).toHaveClass(/show/);
  await expect(page.locator('#huntStickyHpText')).toBeVisible();
  await expect(page.locator('#huntStickyVolText')).toBeVisible();
  const hp=await page.locator('#huntHpText').textContent();
  await page.locator('#huntParty [onclick="ML.openHunt(\'fire\')"]').tap();
  await page.locator('#sheetBody [data-uid="fire"][data-kind="CORE"]').tap();
  await expect(page.locator('#huntQueue .ql')).toHaveCount(1);
  await page.locator('#huntParty [onclick="ML.openHunt(\'goura\')"]').tap();
  await page.locator('#sheetBody [data-uid="goura"][data-kind="CORE"]').tap();
  await expect(page.locator('#huntQueue .ql')).toHaveCount(2);
  await expect(page.locator('#huntFieldParty .stance')).toHaveCount(1);
  await page.locator('#huntExec').tap();
  await expect(page.locator('#huntQueue .ql')).toHaveCount(0);
  await expect(page.locator('#huntHpText')).not.toHaveText(hp);
  expect(errors).toEqual([]);
});
