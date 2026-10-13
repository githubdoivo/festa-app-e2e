import { expect, type Page } from '@playwright/test';

/** The appdoivo PWA, as a visitor sees it. */
export class AppPage {
  constructor(private readonly page: Page) {}

  async openLogin() {
    await this.page.goto('/');
    // Start every scenario in English, whatever the device's language.
    await this.page.evaluate(() => localStorage.setItem('appivo_lang', 'en'));
    await this.page.reload();
    await expect(this.page.locator('#token-input')).toBeVisible();
  }

  demoKey(role: string) {
    return this.page.locator('#demo-keys-list button', { hasText: role });
  }

  async tapDemoKey(role: string) {
    await this.demoKey(role).click();
    await expect(this.page.locator('#app')).toBeVisible();
  }

  /**
   * The welcome tour belongs to the account, so it only shows until someone
   * using that shared key skips it - present on a freshly woken demo, gone
   * afterwards. Handle both.
   */
  async skipTourIfShown() {
    const overlay = this.page.locator('#tutorial-overlay:not(.hidden)');
    if (!(await overlay.isVisible({ timeout: 3_000 }).catch(() => false))) return;
    // The tour opens on a language choice, and its first slide has no skip
    // button - only "next". Take whichever way out each step offers.
    for (let step = 0; step < 15 && (await overlay.isVisible()); step++) {
      const english = this.page.locator('#tutorial-lang-en');
      const skip = this.page.locator('#tutorial-skip');
      if (await english.isVisible()) await english.click();
      else if (await skip.isVisible()) await skip.click();
      else await this.page.locator('#tutorial-next').click();
    }
    await expect(overlay).toBeHidden();
  }

  async loginAs(role: string) {
    await this.openLogin();
    await this.tapDemoKey(role);
    await this.skipTourIfShown();
  }

  tab(name: string) {
    return this.page.locator(`.tab[data-tab="${name}"]`);
  }

  async openTab(name: string) {
    await this.tab(name).click();
    await expect(this.page.locator(`#tab-${name}`)).toBeVisible();
  }

  wallPosts() {
    return this.page.locator('#plaza-feed .plaza-post');
  }

  wallLink(label: string) {
    return this.page.locator('#plaza-feed a.plaza-link', { hasText: label });
  }

  async switchLanguage() {
    await this.page.locator('#lang-toggle').click();
  }

  heroOfCurrentTab() {
    return this.page.locator('.tab-panel:not(.hidden) .hero-line').first();
  }

  async pickNight(night: string) {
    await this.page.locator(`#theme-switch [data-theme="${night}"]`).click();
  }

  body() {
    return this.page.locator('body');
  }
}
