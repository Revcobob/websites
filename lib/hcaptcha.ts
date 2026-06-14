import { env } from '@/lib/env';

// Verify an hCaptcha response token against the hCaptcha siteverify endpoint.
// When HCAPTCHA_SECRET is not configured, verification is skipped (returns
// true) — this lets dev/preview environments work without keys.
export async function verifyHCaptcha(token: string | undefined | null, remoteIp?: string | null): Promise<boolean> {
  if (!env.hcaptchaSecret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.hcaptchaSecret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);
  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!res.ok) return false;
    const json: { success?: boolean } = await res.json();
    return Boolean(json.success);
  } catch {
    return false;
  }
}
