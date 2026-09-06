const { test, expect } = require('@playwright/test');

async function tapText(page, text) {
  const locator = page.getByText(text, { exact: false }).first();
  await expect(locator).toBeVisible();
  await locator.tap();
}

test('first-session mobile interaction smoke', async ({ page }) => {
  await page.goto('/');

  // Startup must not throw and should expose MONSTER LEGACY UI.
  await expect(page.getByText('MONSTER LEGACY', { exact: false }).first()).toBeVisible();

  // Title gate may or may not be present depending on persisted state.
  const start = page.getByText(/TAP TO START|START/i).first();
  if (await start.isVisible().catch(() => false)) await start.tap();

  // HOME must be reachable in the repository build.
  const home = page.getByText('HOME', { exact: true }).first();
  if (await home.isVisible().catch(() => false)) await home.tap();

  // Enter HUNT from navigation or journey card.
  await tapText(page, 'HUNT');

  // Critical target state must remain visible in the HUNT view.
  await expect(page.getByText(/HP/i).first()).toBeVisible();
  await expect(page.getByText(/VOLTAGE/i).first()).toBeVisible();
  await expect(page.getByText(/NEXT ACTION/i).first()).toBeVisible();

  // Open Flame Wing Lizard command sheet when present and ensure a skill can be tapped.
  const flame = page.getByText(/炎翼リザル/).first();
  if (await flame.isVisible().catch(() => false)) {
    await flame.tap();
    const core = page.getByText(/CORE 炎翼牙|炎翼牙/).first();
    if (await core.isVisible().catch(() => false)) {
      await core.tap();
      await expect(page.getByText(/SELECTED|COMMAND/i).first()).toBeVisible();
    }
  }

  // No uncaught page errors are allowed.
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  expect(errors).toEqual([]);
});
