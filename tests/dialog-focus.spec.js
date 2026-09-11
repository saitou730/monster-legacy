const { test, expect } = require('@playwright/test');

test('battle detail sheet exposes dialog semantics and restores focus', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bootStart').tap();
  await page.evaluate(() => ML.go('hunt', { chapterReady: true }));
  const opener=page.getByRole('button', { name: /能力と技を見る/ }).first();
  await opener.evaluate(element => {
    element.focus();
    element.click();
  });
  const dialog=page.locator('#sheet [role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#sheet')).toHaveAttribute('aria-hidden','false');
  const close=page.getByRole('button', { name: '戦闘へ戻る' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#sheet')).not.toHaveClass(/show/);
  await expect(page.locator('#sheet')).toHaveAttribute('aria-hidden','true');
  await expect(opener).toBeFocused();
});

test('optional playtest dialog focuses close and returns to its opener', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bootStart').tap();
  await page.waitForFunction(() => Boolean(window.MLChapter1));
  await page.evaluate(() => {
    const state=MLStorage.load();
    state.chapter1=MLChapter1.migrateRootChapter(state);
    state.chapter1.progress.state='P20_CHAPTER1_COMPLETE_HOME';
    state.storyComplete=true;
    MLStorage.save(state);
  });
  await page.reload();
  await page.locator('#bootStart').tap();
  const opener=page.locator('#playtestSurveyBtn');
  await opener.evaluate(element => {
    element.focus();
    element.click();
  });
  await expect(page.locator('#playtestModal')).toHaveAttribute('aria-hidden','false');
  const close=page.locator('#playtestClose');
  const submit=page.getByRole('button', { name: 'PLAYTEST RESULTを保存' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(submit).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#playtestModal')).toHaveAttribute('aria-hidden','true');
  await expect(opener).toBeFocused();
});
