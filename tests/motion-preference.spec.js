const { test, expect } = require('@playwright/test');

test('system reduced-motion is the default until the player chooses explicitly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.locator('body')).toHaveClass(/motionOff/);
  await expect(page.locator('#motionBtn')).toHaveText('MOTION OFF');
  await expect(page.locator('#motionBtn')).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => localStorage.getItem('mlMotion'))).toBeNull();

  await page.locator('#motionBtn').tap();
  await expect(page.locator('body')).not.toHaveClass(/motionOff/);
  expect(await page.evaluate(() => localStorage.getItem('mlMotion'))).toBe('on');

  await page.reload();
  await expect(page.locator('#motionBtn')).toHaveText('MOTION ON');
  await expect(page.locator('body')).not.toHaveClass(/motionOff/);
});

test('system preference changes are followed only before an explicit choice', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('#motionBtn')).toHaveText('MOTION ON');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#motionBtn')).toHaveText('MOTION OFF');

  await page.locator('#motionBtn').tap();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#motionBtn')).toHaveText('MOTION ON');
});
