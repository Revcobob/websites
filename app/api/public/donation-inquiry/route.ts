import { NextRequest, NextResponse } from 'next/server';
import { DonationInquirySchema } from '@/lib/validation';
import { supabaseService } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rateLimit';
import { verifyHCaptcha } from '@/lib/hcaptcha';
import { clientIp } from '@/lib/ip';
import { env, supabaseConfigured } from '@/lib/env';
import { fetchDonationContent } from '@/lib/resources/publicContent';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let raw: unknown;
  try { raw = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = DonationInquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Please check the highlighted fields.' }, { status: 400 });
  }
  const data = parsed.data;
  if (data.honeypot && data.honeypot.length > 0) {
    return NextResponse.json({ ok: true, redirect: null });
  }
  const ip = clientIp(req);
  const rl = rateLimit(`donate:${ip}`, { windowMs: 10 * 60 * 1000, max: 6 });
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }
  const captchaOk = await verifyHCaptcha(data.captchaToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ ok: false, error: 'Spam check failed. Please try again.' }, { status: 400 });
  }

  let donateUrl: string | null = null;
  if (supabaseConfigured()) {
    const sb = supabaseService();
    const { error } = await sb.from('donation_inquiries').insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone ?? null,
      amount_cents: data.amount_cents ?? null,
      frequency: data.frequency ?? null,
      tribute_type: data.tribute_type ?? null,
      tribute_name: data.tribute_name ?? null,
      anonymous: data.anonymous ?? false,
      message: data.message ?? null,
      source_page: data.source_page ?? null,
      ip: env.doNotTrack ? null : ip,
      user_agent: env.doNotTrack ? null : (req.headers.get('user-agent') ?? null)
    });
    if (error) {
      console.error('donation inquiry insert failed', error);
      return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
    const content = await fetchDonationContent();
    donateUrl = content?.donate_url ?? null;
  }

  return NextResponse.json({ ok: true, redirect: donateUrl });
}
