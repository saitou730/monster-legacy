const { test, expect } = require('@playwright/test');
test('boar: selected commands resolve, locked NEXT survives impact, enemy damages party', async ({ page }) => {
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('/');await page.locator('#bootStart').tap();
  await expect(page.locator('#journeyResult')).toHaveClass(/show/);
  await page.locator('#journeyResultPrimary').tap();
  // Direct route isolates this regression from onboarding unlocks.
  await page.evaluate(()=>ML.go('boss'));
  await expect(page.locator('#bossNext')).toBeVisible();
  const next=await page.locator('#bossNext').textContent();
  const enemyHp=await page.locator('#bossHpText').textContent();
  const allyHp=await page.locator('#bossParty .formalHp small').allTextContents();
  await page.locator('#bossParty .formalUnit').nth(0).locator('.commandTile').first().tap();
  await page.locator('#bossParty .formalUnit').nth(1).locator('.commandTile').first().tap();
  await expect(page.locator('#bossFieldParty .stance')).toHaveCount(1);
  await page.locator('#bossExec').tap();
  await page.waitForTimeout(650);
  await expect(page.locator('#bossHpText')).not.toHaveText(enemyHp);
  await expect(page.locator('#bossNext')).toHaveText(next);
  await page.waitForTimeout(2150);
  expect(await page.locator('#bossParty .formalHp small').allTextContents()).not.toEqual(allyHp);
  await expect(page.locator('#bossNext')).toHaveText(next);
  await expect(page.locator('#bossTurnNo')).toHaveText('02');
  expect(errors).toEqual([]);
});
