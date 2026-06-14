import { NextRequest, NextResponse } from 'next/server';
import { SubscribeSchema } from '@/lib/validation';
import { supabaseService } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rateLimit';
import { verifyHCaptcha } from '@/lib/hcaptcha';
import { clientIp } from '@/lib/ip';
import { env, supabaseConfigured } from '@/lib/env';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let raw: unknown;
  try { raw = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = SubscribeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 });
  }
  const { email, source, source_label, consent_text, honeypot, captchaToken } = parsed.data;
  if (honeypot && honeypot.length > 0) {
    // Silently succeed for bots
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`subscribe:${ip}`, { windowMs: 10 * 60 * 1000, max: 8 });
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  const captchaOk = await verifyHCaptcha(captchaToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ ok: false, error: 'Spam check failed. Please try again.' }, { status: 400 });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, queued: true });
  }
  const sb = supabaseService();
  const { error } = await sb.from('subscribers').upsert(
    {
      email: email.toLowerCase(),
      source,
      source_label,
      consent_text,
      ip: env.doNotTrack ? null : ip,
      user_agent: env.doNotTrack ? null : (req.headers.get('user-agent') ?? null)
    },
    { onConflict: 'email' }
  );
  if (error) {
    console.error('subscribe insert failed', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
