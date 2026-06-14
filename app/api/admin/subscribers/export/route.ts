import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/clerk';
import { supabaseService } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export async function GET() {
  const a = await isAdmin();
  if (!a.ok) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const sb = supabaseService();
  const { data, error } = await sb.from('subscribers').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const headers = ['email', 'source', 'source_label', 'consent_text', 'created_at'];
  const rows = (data ?? []).map(r => headers.map(h => csvEscape((r as any)[h])).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0,10)}.csv"`
    }
  });
}
