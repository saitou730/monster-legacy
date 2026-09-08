const { test, expect } = require('@playwright/test');

async function reachFirstHome(page) {
  await page.locator('#bootStart').tap();
  await page.locator('#journeyResultPrimary').tap();
  await page.locator('[onclick="ML.storyNext()"]').tap();
  await page.locator('[data-unit="goura"][onclick="ML.storyCmd(this)"]').tap();
  await page.locator('[data-unit="fire"][onclick="ML.storyCmd(this)"]').tap();
  await page.locator('[onclick="ML.storyStance(\'goura\')"]').tap();
  await page.locator('[onclick="ML.storyVol(\'calm\')"]').tap();
  await page.locator('[onclick="ML.storyEquip(\'bell\')"]').tap();
  await page.locator('[onclick="ML.storyBoss()"]').tap();
  await page.locator('#journeyResultPrimary').tap();
  await expect(page.locator('#home')).toHaveClass(/show/);
}

async function chooseHunt(page, uid, kind) {
  await page.locator(`#huntParty [onclick="ML.openHunt('${uid}')"]`).tap();
  await page.locator(`#sheetBody [data-uid="${uid}"][data-kind="${kind}"]`).tap();
}

async function executeHuntTurn(page, first, second) {
  await chooseHunt(page, ...first);
  await chooseHunt(page, ...second);
  await expect(page.locator('#huntQueue .ql')).toHaveCount(2);
  await expect(page.locator('#huntFieldParty .stance')).toHaveCount(1);
  await page.locator('#huntExec').tap();
  await expect(page.locator('#huntQueue .ql')).toHaveCount(0, { timeout: 4000 });
}

async function chooseTest(page, uid, kind) {
  await page.locator(`#testParty [onclick="ML.openTest('${uid}')"]`).tap();
  await page.locator(`#sheetBody [data-uid="${uid}"][data-kind="${kind}"]`).tap();
}

async function executeTestTurn(page, first, second) {
  await chooseTest(page, ...first);
  await chooseTest(page, ...second);
  await expect(page.locator('#testQueue .ql')).toHaveCount(2);
  await expect(page.locator('#testFieldParty .stance')).toHaveCount(1);
  await page.locator('#testExec').tap();
  await expect(page.locator('#testQueue .ql')).toHaveCount(0, { timeout: 4000 });
}

test('HOME → qualified JOIN → PARTY → fixed FUSION → playable TEST is replay-safe', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto('/_site/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await reachFirstHome(page);

  await page.locator('.nav [data-go="hunt"]').tap();
  await expect(page.locator('#journeyResultTitle')).toContainText('開口を探す');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P05_HOME_FIRST_ARRIVAL');
  await page.locator('#journeyResultPrimary').tap();
  await expect(page.locator('#hunt')).toHaveClass(/show/);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P07_HUNT_WIND_BAT');

  await executeHuntTurn(page, ['fire', 'ROLE'], ['goura', 'CORE']);
  await executeHuntTurn(page, ['fire', 'CORE'], ['goura', 'CORE']);
  await expect(page.locator('#joinBtn')).toBeVisible();
  await page.locator('#joinBtn').tap();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P08_JOIN_RESULT');

  const joined = await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  expect(Object.values(joined.chapter1.roster).filter(monster => monster.speciesId === 'wind_bat')).toHaveLength(1);
  expect(joined.chapter1.wallet.fusionCatalyst).toBe(1);
  await page.reload();
  await page.locator('#bootStart').tap();
  await expect(page.locator('#journeyResultTitle')).toContainText('風コウモリが仲間');
  await page.locator('#journeyResultPrimary').tap();
  await expect(page.locator('#party')).toHaveClass(/show/);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P09_PARTY_REBUILD');

  await page.locator('#formationSlots .formationSlot').nth(1).tap();
  await page.locator('#ownedList .rosterCard').filter({ hasText: '風コウモリ' }).locator('button').tap();
  await page.locator('#partyConfirmBtn').tap();
  await expect(page.locator('#fusion')).toHaveClass(/show/);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P10_FUSION_INTRO');

  await page.reload();
  await page.locator('#bootStart').tap();
  await expect(page.locator('#fusion')).toHaveClass(/show/);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#fuseBtn').tap();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state)).toBe('P12_NEW_SPECIES_TEST');
  const fused = await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  expect(fused.party).toEqual(['goura', 'flame', 'leaf']);
  expect(fused.chapter1.party.active).toHaveLength(3);
  expect(fused.chapter1.lineage).toHaveLength(1);
  expect(Object.values(fused.chapter1.roster).filter(monster => monster.speciesId === 'flame_wing_lizard')).toHaveLength(1);
  expect(Object.values(fused.chapter1.roster).some(monster => monster.speciesId === 'fire_lizard')).toBe(false);
  expect(Object.values(fused.chapter1.roster).some(monster => monster.speciesId === 'wind_bat')).toBe(false);

  await page.reload();
  await page.locator('#bootStart').tap();
  await expect(page.locator('#test')).toHaveClass(/show/);
  await executeTestTurn(page, ['flame', 'ROLE'], ['goura', 'CORE']);
  await executeTestTurn(page, ['flame', 'CORE'], ['goura', 'CORE']);
  await executeTestTurn(page, ['flame', 'CORE'], ['goura', 'CORE']);
  await executeTestTurn(page, ['flame', 'CORE'], ['goura', 'CORE']);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state), { timeout: 5000 }).toBe('P13_SUMMON_UNLOCK');
  await expect(page.locator('#journeyResultTitle')).toContainText('戦い方を確認');

  const complete = await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  await page.reload();
  await page.locator('#bootStart').tap();
  const reloaded = await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  expect(reloaded.chapter1.progress.state).toBe('P13_SUMMON_UNLOCK');
  expect(reloaded.chapter1.lineage).toHaveLength(1);
  expect(reloaded.chapter1.wallet.fusionCatalyst).toBe(complete.chapter1.wallet.fusionCatalyst);
  expect(Object.values(reloaded.chapter1.roster).filter(monster => monster.speciesId === 'flame_wing_lizard')).toHaveLength(1);
  expect(errors).toEqual([]);
});
