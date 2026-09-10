const { test, expect } = require('@playwright/test');

test('battle detail sheet exposes dialog semantics and restores focus', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bootStart').tap();
  await page.evaluate(() => ML.go('hunt'));
  const opener=page.getByRole('button', { name: /能力と技を見る/ }).first();
  await opener.tap();
  const dialog=page.locator('#sheet [role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#sheet')).toHaveAttribute('aria-hidden','false');
  await expect(page.getByRole('button', { name: '戦闘へ戻る' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('#sheet')).toHaveAttribute('aria-hidden','true');
  await expect(opener).toBeFocused();
});

test('optional playtest dialog focuses close and returns to its opener', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bootStart').tap();
  await page.evaluate(() => {
    const state=MLStorage.load();
    state.chapter1.progress.state='P20_CHAPTER1_COMPLETE_HOME';
    state.storyComplete=true;
    MLStorage.save(state);
  });
  await page.reload();
  await page.locator('#bootStart').tap();
  const opener=page.locator('#playtestSurveyBtn');
  await opener.tap();
  await expect(page.locator('#playtestModal')).toHaveAttribute('aria-hidden','false');
  await expect(page.locator('#playtestClose')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#playtestModal')).toHaveAttribute('aria-hidden','true');
  await expect(opener).toBeFocused();
});
