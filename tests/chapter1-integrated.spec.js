const { test, expect } = require('@playwright/test');

async function next(page, count = 1) {
  for (let i = 0; i < count; i += 1) {
    await page.locator('#primary').tap();
  }
}

test('Chapter 1 integrated route persists JOIN → FUSION → CONTRACT → LEGACY', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));

  await page.goto('/prototype/chapter1/');
  await page.evaluate(() => localStorage.removeItem('ml_ch1_v04'));
  await page.reload();

  await expect(page.locator('#state')).toHaveText('P00_TITLE');

  // TITLE → PROLOGUE → FIRST BATTLE → BOAR → RETREAT → HOME
  await next(page, 5);
  await expect(page.locator('#state')).toHaveText('P05_HOME_FIRST_ARRIVAL');
  await expect(page.locator('.objective')).toContainText('風裂谷で風コウモリを追う');

  // HOME → HUNT BRIEF → HUNT → JOIN RESULT
  await next(page, 3);
  await expect(page.locator('#state')).toHaveText('P08_JOIN_RESULT');
  let save = await page.evaluate(() => JSON.parse(localStorage.getItem('ml_ch1_v04')));
  expect(save.flags.join).toBe(true);
  expect(save.owned).toContain('風コウモリ');

  // JOIN RESULT → PARTY
  await next(page);
  await expect(page.locator('#state')).toHaveText('P09_PARTY_REBUILD');
  await expect(page.locator('[data-roster]')).toHaveCount(4);

  // PARTY → FUSION INTRO → FUSION
  await next(page, 2);
  await expect(page.locator('#state')).toHaveText('P11_FUSION_FLAME_WING');
  await page.locator('[data-ha="牙撃強化"]').tap();
  await page.locator('[data-hb="回避反応"]').tap();
  await page.locator('#primary').tap();
  await expect(page.locator('#state')).toHaveText('P12_NEW_SPECIES_TEST');

  save = await page.evaluate(() => JSON.parse(localStorage.getItem('ml_ch1_v04')));
  expect(save.flags.fusion).toBe(true);
  expect(save.owned).toContain('炎翼リザル');
  expect(save.owned).not.toContain('火トカゲ');
  expect(save.owned).not.toContain('風コウモリ');
  expect(save.heritage).toEqual({ a: '牙撃強化', b: '回避反応' });

  // TEST → SIGNAL → FREE CONTRACT → SUPPORT CONTRACT
  await next(page, 3);
  await expect(page.locator('#state')).toHaveText('P15_CONTRACT_EQUIP');
  save = await page.evaluate(() => JSON.parse(localStorage.getItem('ml_ch1_v04')));
  expect(save.flags.contract).toBe(true);
  expect(save.contract).toBe('Lyra Vell');

  // CONTRACT → BOSS BRIEF → BOSS MASTERY → LEGACY
  await next(page, 3);
  await expect(page.locator('#state')).toHaveText('P18_LEGACY_REWARD');
  await page.locator('#primary').tap();
  await expect(page.locator('#state')).toHaveText('P19_ARCHIVE_UNLOCK');
  save = await page.evaluate(() => JSON.parse(localStorage.getItem('ml_ch1_v04')));
  expect(save.flags.legacy).toBe(true);
  expect(save.legacy).toBe('不退転');

  // Archive should preserve lineage choice.
  await page.locator('[data-tab="LINEAGE"]').tap();
  await expect(page.locator('.card')).toContainText('牙撃強化 + 回避反応');

  // Chapter complete and reload recovery.
  await page.locator('#primary').tap();
  await expect(page.locator('#state')).toHaveText('P20_CHAPTER1_COMPLETE_HOME');
  await expect(page.locator('.complete')).toContainText('CHAPTER 1');
  await page.reload();
  await expect(page.locator('#state')).toHaveText('P20_CHAPTER1_COMPLETE_HOME');

  expect(errors).toEqual([]);
});
