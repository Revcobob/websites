import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/clerk';
import { supabaseService } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const TABLES: Record<string, { table: string; fields: string[]; filename: string }> = {
  contact:  {
    table: 'contact_inquiries',
    fields: ['first_name','last_name','email','phone','topic','message','consent','source_page','status','created_at'],
    filename: 'contact-inquiries'
  },
  donation: {
    table: 'donation_inquiries',
    fields: ['first_name','last_name','email','phone','amount_cents','frequency','tribute_type','tribute_name','anonymous','message','source_page','status','created_at'],
    filename: 'donation-inquiries'
  }
};

export async function GET(req: NextRequest) {
  const a = await isAdmin();
  if (!a.ok) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const kind = new URL(req.url).searchParams.get('kind') ?? 'contact';
  const cfg = TABLES[kind];
  if (!cfg) return NextResponse.json({ ok: false, error: 'Unknown kind' }, { status: 400 });
  const sb = supabaseService();
  const { data, error } = await sb.from(cfg.table).select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const headers = cfg.fields;
  const rows = (data ?? []).map(r => headers.map(h => csvEscape((r as any)[h])).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${cfg.filename}-${new Date().toISOString().slice(0,10)}.csv"`
    }
  });
}
