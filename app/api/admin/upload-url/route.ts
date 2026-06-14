import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/clerk';
import { supabaseService } from '@/lib/supabase/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const ALLOWED_BUCKETS = ['letters', 'documents', 'media', 'thumbnails'] as const;
const Schema = z.object({
  bucket: z.enum(ALLOWED_BUCKETS),
  filename: z.string().min(1).max(255),
  contentType: z.string().max(120).optional()
});

function safeName(name: string) {
  return name
    .replace(/[^\w.\-]+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

// POST → returns { uploadUrl, path, publicUrl }
// Client uploads the file directly to Supabase storage with the signed URL.
export async function POST(req: NextRequest) {
  const a = await isAdmin();
  if (!a.ok) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  let raw: unknown;
  try { raw = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  const { bucket, filename } = parsed.data;

  const stamp = Date.now().toString(36);
  const path = `${stamp}-${safeName(filename)}`;
  const sb = supabaseService();
  const { data, error } = await sb.storage.from(bucket).createSignedUploadUrl(path);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const publicUrl = sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  return NextResponse.json({ ok: true, ...data, path, publicUrl });
}
