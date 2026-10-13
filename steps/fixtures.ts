import { test as base } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { AppPage } from '../pages/AppPage';

/** State one scenario's steps share: the demo's keys and the last API reply. */
export type World = {
  keys: Record<string, string>;
  status?: number;
  body?: Record<string, unknown>;
};

export const test = base.extend<{ world: World; app: AppPage }>({
  world: async ({}, use) => use({ keys: {} }),
  app: async ({ page }, use) => use(new AppPage(page)),
});

export const { Given, When, Then } = createBdd(test);
