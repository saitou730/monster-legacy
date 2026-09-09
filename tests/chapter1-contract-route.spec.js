const { test, expect } = require('@playwright/test');

test('P13-P16 free Lyra Contract equips outside the three-monster party and survives reload', async ({ page }) => {
  const errors=[];
  page.on('pageerror', error=>errors.push(String(error)));
  await page.goto('/_site/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(ML_DATA.saveKey, JSON.stringify({
      fused:true, testComplete:true, storyComplete:true,
      party:['goura','flame','leaf'],
      contracts:{ existing:{ owned:true } }
    }));
  });
  await page.reload();
  await page.locator('#bootStart').tap();
  await expect(page.locator('#contract')).toHaveClass(/show/);
  await expect(page.locator('#contractUnlock')).toBeVisible();
  await page.locator('#contractUnlock .btn').tap();
  await expect(page.locator('#contractSummon')).toBeVisible();
  await page.locator('#contractSummon .btn').tap();
  await expect(page.locator('#contractEquip')).toBeVisible();

  let save=await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  expect(save.chapter1.progress.state).toBe('P15_CONTRACT_EQUIP');
  expect(save.chapter1.contracts.lyra_vell.acquiredCount).toBe(1);
  expect(save.party).toEqual(['goura','flame','leaf']);
  expect(save.party).not.toContain('lyra_vell');

  await page.reload();
  await page.locator('#bootStart').tap();
  await expect(page.locator('#contractEquip')).toBeVisible();
  await page.locator('#contractEquip .btn').tap();
  await expect(page.locator('#contractComplete')).toBeVisible();

  save=await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  expect(save.chapter1.progress.state).toBe('P16_BOAR_REMATCH_BRIEF');
  expect(save.supportContract).toBe('lyra_vell');
  expect(save.contracts.lyra_vell.supportEquipped).toBe(true);
  expect(save.contracts.existing).toEqual({owned:true});
  expect(save.party).toEqual(['goura','flame','leaf']);

  const snapshot=JSON.stringify(save);
  await page.reload();
  await page.locator('#bootStart').tap();
  expect(await page.evaluate(() => localStorage.getItem(ML_DATA.saveKey))).toBe(snapshot);
  expect(errors).toEqual([]);
});
