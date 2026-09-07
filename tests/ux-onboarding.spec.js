const { test, expect } = require('@playwright/test');

async function openFresh(page){
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('/');
  await page.waitForFunction(() => window.ML_UX_BUILD === '1.8.4-ux');
}

test('fresh START enters STORY before HOME', async ({ page }) => {
  await openFresh(page);
  await page.locator('#bootStart').click();
  await expect(page.locator('#story')).toHaveClass(/show/);
  await expect(page.locator('#home')).not.toHaveClass(/show/);
  await expect(page.locator('body')).toHaveClass(/mlFirstRun/);
  await expect(page.locator('#story .storyMission')).toBeVisible();
});

test('returning save preserves HOME entry', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('monsterLegacyWeb02', JSON.stringify({storyStep:6, storyComplete:true}));
  });
  await page.goto('/');
  await page.waitForFunction(() => window.ML_UX_BUILD === '1.8.4-ux');
  await page.locator('#bootStart').click();
  await expect(page.locator('#home')).toHaveClass(/show/);
  await expect(page.locator('body')).not.toHaveClass(/mlFirstRun/);
});

test('STANCE help is discoverable from command sheet and long press', async ({ page }) => {
  await openFresh(page);
  await page.locator('#bootStart').click();
  await page.evaluate(() => window.ML.go('hunt'));

  const firstUnit = page.locator('#huntParty .unit').first();
  await expect(firstUnit.locator('.stanceHoldHint')).toContainText('長押し');

  await firstUnit.locator('button').click();
  await expect(page.locator('#sheet')).toHaveClass(/show/);
  await expect(page.locator('#sheetBody .stanceSkillGuide')).toContainText('STANCE');
  await page.locator('#mask').click();

  const top = firstUnit.locator('.unitTop');
  await top.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', clientX: 20, clientY: 20 });
  await page.waitForTimeout(620);
  await top.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', clientX: 20, clientY: 20 });
  await expect(page.locator('#sheet')).toHaveClass(/show/);
  await expect(page.locator('#sheetTitle')).toContainText('STANCE');
  await expect(page.locator('#sheetBody')).toContainText('2体をCOMMANDに選ぶ');
});
