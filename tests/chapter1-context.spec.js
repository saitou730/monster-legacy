const { test, expect } = require('@playwright/test');

test('battle explanations preserve progression and survive touch, hold and scroll cancellation', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto('/prototype/chapter1/');
  await page.locator('#primary').tap();
  await page.locator('#primary').tap();
  await expect(page.locator('#state')).toHaveText('P02_FIRST_BATTLE');
  const snapshot = await page.evaluate(() => localStorage.getItem('ml_ch1_v04'));
  const stance = page.getByRole('button', { name: 'STANCEの説明', exact: true });
  const dialog = page.getByRole('dialog');
  await stance.tap();
  await expect(dialog).toContainText('選ばなかった1体');
  await expect(dialog).toContainText('3つ目のコマンド');
  await page.getByRole('button', { name: '閉じる', exact: true }).tap();
  await expect(dialog).not.toBeVisible();
  await expect(stance).toBeFocused();

  const box = await stance.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(650);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();

  // A scrolling gesture must not open the explanation on release.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 20);
  await page.waitForTimeout(650);
  await page.mouse.up();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('#state')).toHaveText('P02_FIRST_BATTLE');
  expect(await page.evaluate(() => localStorage.getItem('ml_ch1_v04'))).toBe(snapshot);

  await page.getByRole('button', { name: 'NEXTの説明', exact: true }).tap();
  await expect(dialog).toContainText('ターン開始時に固定');
  const bounds = await dialog.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize().width);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('#state')).toHaveText('P02_FIRST_BATTLE');
  await expect(stance).toBeVisible();
  await page.locator('#primary').tap();
  await expect(page.locator('#state')).toHaveText('P03_BOAR_FIRST_ENCOUNTER');
  await expect(page.locator('.battle-context')).toHaveCount(1);
  expect(errors).toEqual([]);
});
