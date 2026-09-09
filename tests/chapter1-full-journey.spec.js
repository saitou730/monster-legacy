const { test, expect } = require('@playwright/test');

async function phase(page, expected, timeout = 7000) {
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)).chapter1.progress.state), { timeout }).toBe(expected);
}

async function choose(page, context, uid, kind) {
  await page.locator(`#${context}Party [onclick="ML.open${context[0].toUpperCase()+context.slice(1)}('${uid}')"]`).tap();
  await page.locator(`#sheetBody [data-uid="${uid}"][data-kind="${kind}"]`).tap();
}

async function turn(page, context, commands, timeout = 6000) {
  const nextId = context === 'boss' ? '#bossNext' : context === 'hunt' ? '.huntNextSticky strong' : '#testNextName';
  const before = await page.locator(nextId).textContent();
  for (const [uid, kind] of commands) await choose(page, context, uid, kind);
  await expect(page.locator(nextId)).toHaveText(before);
  await expect(page.locator(`#${context}Queue .ql`)).toHaveCount(2);
  await expect(page.locator(`#${context}FieldParty .stance`)).toHaveCount(1);
  await page.locator(`#${context}Exec`).tap();
  await expect.poll(async () => {
    const queue = await page.locator(`#${context}Queue .ql`).count();
    const clear = context === 'boss' && await page.locator('#bossExec').textContent() === 'BOSS CLEAR';
    return queue === 0 || clear;
  }, { timeout }).toBe(true);
}

test('fresh START reaches replay-safe Chapter 1 complete HOME through every playable gate', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto('/_site/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // TITLE → PROLOGUE → FIRST BATTLE → first Boar encounter → RETREAT → HOME.
  await page.locator('#bootStart').tap();
  await page.locator('#journeyResultPrimary').tap();
  await page.locator('[onclick="ML.storyNext()"]' ).tap();
  await page.locator('[data-unit="goura"][onclick="ML.storyCmd(this)"]').tap();
  await page.locator('[data-unit="fire"][onclick="ML.storyCmd(this)"]').tap();
  await page.locator('[onclick="ML.storyStance(\'goura\')"]').tap();
  await page.locator('[onclick="ML.storyVol(\'calm\')"]').tap();
  await page.locator('[onclick="ML.storyEquip(\'bell\')"]').tap();
  await page.locator('[onclick="ML.storyBoss()"]' ).tap();
  await page.locator('#journeyResultPrimary').tap();
  await phase(page, 'P05_HOME_FIRST_ARRIVAL');

  // HUNT → qualified Wind Bat JOIN.
  await page.locator('.nav [data-go="hunt"]').tap();
  await page.locator('#journeyResultPrimary').tap();
  await phase(page, 'P07_HUNT_WIND_BAT');
  await turn(page, 'hunt', [['fire','ROLE'],['goura','CORE']]);
  await turn(page, 'hunt', [['fire','CORE'],['goura','CORE']]);
  await page.locator('#joinBtn').tap();
  await phase(page, 'P08_JOIN_RESULT');
  await expect(page.locator('#journeyResultTitle')).toContainText('風コウモリが仲間');
  await page.locator('#journeyResultPrimary').tap();

  // PARTY → fixed FUSION. Equip a deliberate RAISE tool for the later Boar mastery.
  await page.locator('#formationSlots .formationSlot').nth(1).tap();
  await page.locator('#ownedList .rosterCard').filter({ hasText: '風コウモリ' }).locator('button').tap();
  await page.locator('#formationSlots .formationSlot').filter({ hasText: '葉ウサギ' }).tap();
  await page.locator('#loadoutFocus .loadoutChoice').filter({ hasText: '灰火の腕輪' }).tap();
  await page.locator('#partyConfirmBtn').tap();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#fuseBtn').tap();
  await phase(page, 'P12_NEW_SPECIES_TEST');
  await expect(page.locator('#journeyResultTitle')).toHaveText('炎翼リザル');
  await page.locator('#journeyResultPrimary').tap();
  await expect(page.locator('#test')).toHaveClass(/show/);
  await expect(page.locator('#toast')).not.toHaveClass(/show/, { timeout: 3000 });

  // NEW SPECIES TEST proves CORE + EVADE using the real 2 COMMAND / 1 STANCE surface.
  await turn(page, 'test', [['flame','ROLE'],['goura','CORE']]);
  for (let i=0;i<3;i++) await turn(page, 'test', [['flame','CORE'],['goura','CORE']]);
  await phase(page, 'P13_SUMMON_UNLOCK');
  await expect(page.locator('#journeyResultTitle')).toContainText('戦い方を確認');
  await page.locator('#journeyResultPrimary').tap();

  // Guaranteed Lyra SUMMON and Support equip remain outside the monster party.
  await page.locator('#contractUnlock .btn').tap();
  await page.locator('#contractSummon .btn').tap();
  await page.locator('#contractEquip .btn').tap();
  await phase(page, 'P16_BOAR_REMATCH_BRIEF');
  let save = await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  expect(save.party).toEqual(['goura','flame','leaf']);
  expect(save.party).not.toContain('lyra_vell');
  expect(save.chapter1.contracts.lyra_vell.acquiredCount).toBe(1);
  await page.locator('#contractComplete .btn').tap();
  await expect(page.locator('#journeyResultTitle')).toContainText('勝ち筋を持ち帰る');
  await page.locator('#journeyResultPrimary').tap();
  await phase(page, 'P17_BOAR_MASTERY');

  // RAISE with guarded STANCE, receive the announced LEGACY ART, then finish.
  for (let i=0;i<5;i++) await turn(page, 'boss', [['leaf','EQUIPMENT'],['flame','CORE']]);
  await turn(page, 'boss', [['goura','ROLE'],['flame','ROLE']]);
  await turn(page, 'boss', [['flame','CORE'],['goura','CORE']]);
  await turn(page, 'boss', [['flame','CORE'],['goura','CORE']]);
  await phase(page, 'P18_LEGACY_REWARD', 10000);
  save = await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  expect(save.mastery.boar).toBe(true);
  expect(save.legacyCores.unyielding).toBe(false);

  // Explicit claim → required Archive acknowledgement → completed HOME.
  await expect(page.locator('#journeyResultPrimary')).toContainText('不退転');
  await page.locator('#journeyResultPrimary').tap();
  await phase(page, 'P19_ARCHIVE_UNLOCK');
  await expect(page.locator('#chapterArchiveGate')).toBeVisible();
  await page.locator('#chapterArchiveGate .btn').tap();
  await phase(page, 'P20_CHAPTER1_COMPLETE_HOME');
  await expect(page.locator('#home')).toHaveClass(/show/);
  await expect(page.locator('#homeObjective')).toHaveText('CHAPTER 1 COMPLETE');

  // Reload from the final save: no duplicate JOIN/FUSION/SUMMON/LEGACY.
  const completed = await page.evaluate(() => localStorage.getItem(ML_DATA.saveKey));
  await page.reload();
  await page.locator('#bootStart').tap();
  await phase(page, 'P20_CHAPTER1_COMPLETE_HOME');
  const reloaded = await page.evaluate(() => JSON.parse(localStorage.getItem(ML_DATA.saveKey)));
  const before = JSON.parse(completed);
  expect(reloaded.chapter1.lineage).toHaveLength(1);
  expect(reloaded.chapter1.contracts.lyra_vell.acquiredCount).toBe(1);
  expect(reloaded.chapter1.wallet.legacyCore).toBe(before.chapter1.wallet.legacyCore);
  expect(Object.values(reloaded.chapter1.roster).filter(monster => monster.speciesId === 'flame_wing_lizard')).toHaveLength(1);
  expect(errors).toEqual([]);
});
