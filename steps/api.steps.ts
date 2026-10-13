import { expect } from '@playwright/test';
import { Given, When, Then, type World } from './fixtures';

async function loadKeys(request: import('@playwright/test').APIRequestContext, world: World) {
  if (Object.keys(world.keys).length) return world.keys;
  const res = await request.get('/api/demo');
  expect(res.ok()).toBeTruthy();
  const { keys } = await res.json();
  world.keys = Object.fromEntries(keys.map((k: { role: string; key: string }) => [k.role, k.key]));
  return world.keys;
}

async function remember(world: World, res: import('@playwright/test').APIResponse) {
  world.status = res.status();
  world.body = await res.json().catch(() => ({}));
}

Given('the demo is running', async ({ request }) => {
  const res = await request.get('/api/version');
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).env).toBe('demo');
});

When('I ask the demo for its shared keys', async ({ request, world }) => {
  await loadKeys(request, world);
});

Then('I get a {string} key and an {string} key', async ({ world }, first: string, second: string) => {
  expect(Object.keys(world.keys).sort()).toEqual([first, second].sort());
  for (const key of Object.values(world.keys)) expect(key).toMatch(/^[a-z]+\d{4}$/);
});

When('I log in through the API with the {word} key', async ({ request, world }, role: string) => {
  const keys = await loadKeys(request, world);
  await remember(world, await request.post('/api/auth/login', { data: { token: keys[role] } }));
  world.keys.current = keys[role];
});

When('I log in through the API with the {word} key in capitals', async ({ request, world }, role: string) => {
  const keys = await loadKeys(request, world);
  await remember(world, await request.post('/api/auth/login', { data: { token: keys[role].toUpperCase() } }));
});

When('I log in through the API with the key {string}', async ({ request, world }, key: string) => {
  await remember(world, await request.post('/api/auth/login', { data: { token: key } }));
});

Then('the login succeeds', async ({ world }) => {
  expect(world.status, JSON.stringify(world.body)).toBe(200);
});

Then('the account is an admin: {word}', async ({ request, world }, answer: string) => {
  const me = await (await request.get('/api/me', { headers: { Authorization: `Bearer ${world.keys.current}` } })).json();
  expect(me.isAdmin).toBe(answer === 'yes');
});

Then('the account is the owner: {word}', async ({ request, world }, answer: string) => {
  const me = await (await request.get('/api/me', { headers: { Authorization: `Bearer ${world.keys.current}` } })).json();
  expect(me.isOwner).toBe(answer === 'yes');
});

When('I call {string} without a key', async ({ request, world }, call: string) => {
  const [method, path] = call.split(' ');
  await remember(world, await request.fetch(path, { method }));
});

When('the {word} calls {string} with body: {}', async ({ request, world }, role: string, call: string, body: string) => {
  const keys = await loadKeys(request, world);
  const [method, path] = call.split(' ');
  await remember(world, await request.fetch(path, {
    method,
    headers: { Authorization: `Bearer ${keys[role]}`, 'Content-Type': 'application/json' },
    data: body.trim() ? JSON.parse(body) : undefined,
  }));
});

Given('the guest tried to change the shared key', async ({ request, world }) => {
  const keys = await loadKeys(request, world);
  const res = await request.post('/api/me/change-token', {
    headers: { Authorization: `Bearer ${keys.guest}` },
    data: { currentToken: keys.guest, newToken: 'hijacked123' },
  });
  expect(res.status()).toBe(403);
});

Then('the API answers {int}', async ({ world }, status: number) => {
  expect(world.status, JSON.stringify(world.body)).toBe(status);
});

Then('the API answers {int} with error {string}', async ({ world }, status: number, error: string) => {
  expect(world.status, JSON.stringify(world.body)).toBe(status);
  expect(world.body?.error).toBe(error);
});
