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

test('boar: DANGER mastery window prevents premature KO but does not grant mastery', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(() => {
    const party = [
      {...ML_DATA.units.goura, hp: ML_DATA.units.goura.maxHp},
      {...ML_DATA.units.flame, hp: ML_DATA.units.flame.maxHp},
      {...ML_DATA.units.leaf, hp: ML_DATA.units.leaf.maxHp}
    ];
    const boss = MLBattle.createBoss('boar', party);

    boss.hp = 20;
    boss.vol = 89;
    boss.hp = 0;
    const belowDanger = {hp: boss.hp, protected: boss.masteryWindowProtected};

    boss.hp = 20;
    boss.vol = 90;
    boss.hp = 0;
    const dangerProtected = {hp: boss.hp, protected: boss.masteryWindowProtected, mastery: MLBattle.masteryCheck(boss)};

    boss.legacyTriggered = true;
    boss.legacySurvived = true;
    boss.hp = 0;
    boss.won = true;
    const afterLegacy = {hp: boss.hp, mastery: MLBattle.masteryCheck(boss)};

    const edge = MLBattle.createBoss('boar', party.map(x => ({...x})));
    edge.hp = 1;
    edge.vol = 89;
    edge.hp = 0;
    edge.vol = 90;

    return {belowDanger, dangerProtected, afterLegacy, sameCommandEdge:{hp:edge.hp, protected:edge.masteryWindowProtected}};
  });

  expect(result.belowDanger).toEqual({hp:0, protected:false});
  expect(result.dangerProtected).toEqual({hp:1, protected:true, mastery:false});
  expect(result.afterLegacy).toEqual({hp:0, mastery:true});
  expect(result.sameCommandEdge).toEqual({hp:1, protected:true});
});

test('boss: compact STANCE card hides long prose while explicit help remains available', async ({ page }) => {
  await page.goto('/');await page.locator('#bootStart').tap();
  await expect(page.locator('#journeyResult')).toHaveClass(/show/);
  await page.locator('#journeyResultPrimary').tap();
  await page.evaluate(()=>ML.go('boss'));
  await page.locator('#bossParty .formalUnit').nth(0).locator('.commandTile').first().tap();
  await page.locator('#bossParty .formalUnit').nth(1).locator('.commandTile').first().tap();

  const stanceCard = page.locator('#bossParty .formalUnit.stance');
  await expect(stanceCard).toHaveCount(1);
  await expect(stanceCard.locator('.stanceLock small')).toBeHidden();
  const help = stanceCard.locator('.skillInfo');
  await expect(help).toBeVisible();
  await help.tap();
  await expect(page.locator('#sheet')).toHaveClass(/show/);
  await expect(page.locator('#sheetBody')).toContainText('COMMANDを2体分選ぶと');
});
