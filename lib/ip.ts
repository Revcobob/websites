import type { NextRequest } from 'next/server';

export function clientIp(req: NextRequest | Request): string {
  const h = (req as any).headers as Headers;
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return h.get('x-real-ip') ?? h.get('cf-connecting-ip') ?? '0.0.0.0';
}
