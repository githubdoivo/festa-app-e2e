// The demo stops when nobody is using it, and the first request after that
// wakes it up. Wake it once here, so no individual test pays for the cold
// start or mistakes it for a failure.
export default async function globalSetup() {
  const base = process.env.BASE_URL ?? 'https://appdoivo-demo.fly.dev';
  const deadline = Date.now() + 90_000;
  let last = '';
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/api/version`);
      if (res.ok) {
        const { version, env } = await res.json();
        console.log(`Testing appdoivo ${version} (${env ?? 'unknown env'}) at ${base}`);
        return;
      }
      last = `HTTP ${res.status}`;
    } catch (e) {
      last = (e as Error).message;
    }
    await new Promise((r) => setTimeout(r, 3_000));
  }
  throw new Error(`The app at ${base} did not wake up within 90s (last: ${last})`);
}
