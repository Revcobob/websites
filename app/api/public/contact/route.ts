import { NextRequest, NextResponse } from 'next/server';
import { ContactSchema } from '@/lib/validation';
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

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Please check the highlighted fields and try again.' }, { status: 400 });
  }
  const data = parsed.data;
  if (data.honeypot && data.honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }
  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`, { windowMs: 10 * 60 * 1000, max: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }
  const captchaOk = await verifyHCaptcha(data.captchaToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ ok: false, error: 'Spam check failed. Please try again.' }, { status: 400 });
  }

  if (!supabaseConfigured()) return NextResponse.json({ ok: true, queued: true });
  const sb = supabaseService();
  const { error } = await sb.from('contact_inquiries').insert({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone ?? null,
    topic: data.topic ?? null,
    message: data.message,
    consent: data.consent,
    source_page: data.source_page ?? null,
    ip: env.doNotTrack ? null : ip,
    user_agent: env.doNotTrack ? null : (req.headers.get('user-agent') ?? null)
  });
  if (error) {
    console.error('contact insert failed', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
