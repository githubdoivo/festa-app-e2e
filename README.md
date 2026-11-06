# lodge-app-e2e

[![E2E](https://github.com/githubdoivo/lodge-app-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/githubdoivo/lodge-app-e2e/actions/workflows/e2e.yml)
&nbsp;**[Latest test report →](https://githubdoivo.github.io/lodge-app-e2e/)**

Behaviour-driven end-to-end tests for **[lodge-app](https://github.com/githubdoivo/lodge-app)** (Lodge, the party app),
running against its public demo at **[lodge-demo.appdoivo.com](https://lodge-demo.appdoivo.com)**.

The scenarios are written in **Gherkin** and run with **Playwright** through
[playwright-bdd](https://github.com/vitalets/playwright-bdd), in TypeScript:
API tests, plus UI tests on an **iPhone (WebKit)** and a **desktop browser
(Chromium)**. GitHub Actions runs the suite on every push and every morning,
and publishes the HTML report.

## What is covered

| Feature | Layer | What it checks |
|---|---|---|
| [Shared demo logins](features/api/demo-access.feature) | API | The demo offers a guest and an admin key; each logs in with exactly its own rights; keys are case-insensitive; unknown or missing keys are rejected |
| [Demo guard rails](features/api/demo-guard.feature) | API | A data-driven table of actions a stranger must not be able to take (changing the shared key, the anonymous chat, link posts, wipes, deletions, settings) - each refused with `err_demo_disabled`, and the shared key still works after an attempt |
| [Logging in](features/ui/login.feature) | UI | One tap from the login screen into the app as either role; the admin key opens the admin panel, the guest key does not |
| [Using the app](features/ui/app.feature) | UI | The Wall's posts, the Location link, switching between English and Portuguese, and each Snatch night's theme |

## How it is put together

```
features/       Gherkin scenarios - the tests themselves
steps/          step definitions (API and UI) and the shared fixtures
pages/          AppPage: the page object for the app
global-setup.ts wakes the demo before the run
```

A few decisions worth knowing about:

- **Read-only by design.** The demo is shared with real visitors, so no
  scenario changes its data: the guard-rail checks only send actions the demo
  refuses, and nothing else writes. Runs can't interfere with each other or
  with anyone browsing the demo, and every run sees the same state.
- **The cold start is handled once, not per test.** The demo sleeps when idle;
  `global-setup.ts` wakes it before anything runs, so no scenario pays for the
  first slow request or mistakes it for a failure.
- **State that depends on other visitors is handled, not assumed.** The
  welcome tour belongs to the account, so it shows on a freshly woken demo and
  not after someone has skipped it. The tour step copes with both.
- **One retry, on CI only, and never hidden.** A test that only passes on its
  retry is reported as *flaky* in the HTML report.
- **Point it anywhere.** `BASE_URL=http://localhost:3000 npm test` runs the
  same suite against a local or QA copy of the app.

## Running it

```bash
npm install
npx playwright install chromium webkit
npm test              # everything
npm run test:api      # API scenarios only
npm run test:ui       # UI scenarios on iPhone and desktop
npm run test:smoke    # just the @smoke scenarios
npm run report        # open the HTML report
```
