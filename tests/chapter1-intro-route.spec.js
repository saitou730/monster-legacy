const { test, expect } = require('@playwright/test');

test('new player explicitly completes first encounter retreat before HOME', async ({ page }) => {
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  await page.goto('/_site/');
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  await page.locator('#bootStart').tap();
  await page.locator('#journeyResultPrimary').tap();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P01_PROLOGUE');

  await page.locator('[onclick="ML.storyNext()"]').tap();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P02_FIRST_BATTLE');
  await page.locator('[data-unit="goura"][onclick="ML.storyCmd(this)"]').tap();
  await page.locator('[data-unit="fire"][onclick="ML.storyCmd(this)"]').tap();
  await page.locator('[onclick="ML.storyStance(\'goura\')"]').tap();
  await page.locator('[onclick="ML.storyVol(\'calm\')"]').tap();
  await page.locator('[onclick="ML.storyEquip(\'bell\')"]').tap();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P03_BOAR_FIRST_ENCOUNTER');

  await expect(page.locator('[onclick="ML.storyBoss()"]')).toContainText('撤退');
  await page.locator('[onclick="ML.storyBoss()"]').tap();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P04_RETREAT_RESULT');
  await expect(page.locator('#journeyResult')).toHaveClass(/show/);
  await page.locator('#journeyResultPrimary').tap();
  await expect(page.locator('#home')).toHaveClass(/show/);
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P05_HOME_FIRST_ARRIVAL');
  const before=await page.evaluate(()=>localStorage.getItem(ML_DATA.saveKey));
  await page.reload();await page.locator('#bootStart').tap();
  await expect(page.locator('#home')).toHaveClass(/show/);
  const after=await page.evaluate(()=>localStorage.getItem(ML_DATA.saveKey));
  expect(JSON.parse(after).chapter1.progress.state).toBe('P05_HOME_FIRST_ARRIVAL');
  expect(JSON.parse(after).chapter1.wallet.fieldMark).toBe(JSON.parse(before).chapter1.wallet.fieldMark);
  expect(errors).toEqual([]);
});
