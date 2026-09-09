const { test, expect } = require('@playwright/test');

test('portrait battle keeps commands and execute action above the fold', async ({ page }) => {
  await page.goto('/');
  await page.locator('#bootStart').tap();
  await expect(page.locator('#journeyResult')).toHaveClass(/show/);
  await page.locator('#journeyResultPrimary').tap();
  await page.evaluate(() => ML.go('boss'));

  const scroll = page.locator('#boss .bossScroll');
  const execute = page.locator('#bossExec');
  await expect(execute).toBeVisible();
  await expect(execute).toBeInViewport();
  await expect(page.locator('#bossParty .commandTile').first()).toBeInViewport();

  const geometry = await scroll.evaluate((node) => ({
    scrollTop: node.scrollTop,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
  }));
  expect(geometry.scrollTop).toBe(0);
  expect(geometry.scrollHeight).toBeLessThanOrEqual(geometry.clientHeight + 1);

  await page.locator('#bossParty .formalUnit').nth(0).locator('.commandTile').first().tap();
  await page.locator('#bossParty .formalUnit').nth(1).locator('.commandTile').first().tap();
  await expect(page.locator('#bossFieldParty .stance')).toHaveCount(1);
  await expect(execute).toBeInViewport();
  await execute.tap();
});
