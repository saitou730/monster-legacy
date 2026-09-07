const { test, expect } = require('@playwright/test');
test('Pages artifact contains the real HOME and official battle images', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('/_site/');
  await expect(page.locator('#bootStart')).toBeVisible();
  await page.locator('#bootStart').tap();
  // PR32 first-run intro may be present after its separate integration.
  if (await page.locator('#journeyPrimary').isVisible()) await page.locator('#journeyPrimary').tap();
  await page.evaluate(() => ML.go('home'));
  await expect(page.locator('#home')).toHaveClass(/show/);
  await page.evaluate(() => ML.go('hunt'));
  await expect(page.locator('#huntEnemySprite')).toBeVisible();
  await expect.poll(() => page.locator('#huntEnemySprite').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('#huntEnemySprite')).toHaveAttribute('src', /assets\/battle\/wind_bat\//);
  for (const asset of ['assets/art/thorn_boar.png', 'assets/art/flame_lizard.png']) {
    const response = await page.request.get('/_site/' + asset);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/');
  }
  expect((await page.request.get('/_site/prototype/chapter1/index.html')).status()).toBe(404);
  expect(errors).toEqual([]);
});
