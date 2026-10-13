import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('I open the demo', async ({ app }) => {
  await app.openLogin();
});

Given('I am logged in to the demo as the {word}', async ({ app }, role: string) => {
  await app.loginAs(role);
});

Then('I see a demo key for {string} and for {string}', async ({ app }, a: string, b: string) => {
  await expect(app.demoKey(a)).toBeVisible();
  await expect(app.demoKey(b)).toBeVisible();
});

When('I tap the {word} demo key', async ({ app }, role: string) => {
  await app.tapDemoKey(role);
});

When('I skip the welcome tour if it shows', async ({ app }) => {
  await app.skipTourIfShown();
});

Then('I am in the app on the Wall', async ({ app }) => {
  await expect(app.tab('plaza')).toHaveClass(/active/);
  await expect(app.wallPosts().first()).toBeVisible();
});

Then('the Wall shows an announcement, a poll and a list of links', async ({ page }) => {
  await expect(page.locator('#plaza-feed .plaza-post').first()).toBeVisible();
  await expect(page.locator('#plaza-feed .plaza-post-links')).toHaveCount(1);
  await expect(page.locator('#plaza-feed .plaza-post-type', { hasText: /poll/i })).toHaveCount(1);
  await expect(page.locator('#plaza-feed .plaza-post-type', { hasText: /post/i })).toHaveCount(1);
});

Then('the {string} link points to Google Maps for {string}', async ({ app }, label: string, place: string) => {
  const href = await app.wallLink(label).getAttribute('href');
  expect(href).toMatch(/^https:\/\/www\.google\.com\/maps\//);
  expect(decodeURIComponent(href ?? '')).toContain(place);
});

When('I switch the language', async ({ app }) => {
  await app.switchLanguage();
});

Then('the Wall heading reads {string}', async ({ app }, text: string) => {
  await expect(app.heroOfCurrentTab()).toHaveText(text);
});

When('I open the {string} tab', async ({ app }, name: string) => {
  await app.openTab(name);
});

When('I pick the {string} night', async ({ app }, night: string) => {
  await app.pickNight(night);
});

Then('the page takes on the {string} look', async ({ app }, night: string) => {
  await expect(app.body()).toHaveClass(new RegExp(`\\btheme-${night}\\b`));
});

When('I open the settings', async ({ page }) => {
  await page.goto('/settings.html');
});

Then('I can run the Snatch voting', async ({ page }) => {
  await page.locator('.tab[data-atab="outfit"]').click();
  await expect(page.locator('#voting-state-label')).toBeVisible();
});

Then('the admin tabs are hidden', async ({ page }) => {
  await expect(page.locator('#account-card')).toBeVisible();
  await expect(page.locator('.tab[data-atab="outfit"]')).toBeHidden();
});
