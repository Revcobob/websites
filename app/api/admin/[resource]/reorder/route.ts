import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/clerk';
import { supabaseService } from '@/lib/supabase/server';
import { RESOURCE_TABLES, type ResourceKey } from '@/lib/resources/types';

export const runtime = 'nodejs';

// POST /api/admin/<resource>/reorder
// Body: { id: string, direction: 'up' | 'down' }
// Swaps the order_index with the adjacent row.
export async function POST(req: NextRequest, { params }: { params: { resource: string } }) {
  const a = await isAdmin();
  if (!a.ok) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const meta = RESOURCE_TABLES[params.resource as ResourceKey];
  if (!meta) return NextResponse.json({ ok: false, error: 'Unknown resource' }, { status: 404 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }
  const id: string | undefined = body?.id;
  const direction: 'up' | 'down' | undefined = body?.direction;
  if (!id || (direction !== 'up' && direction !== 'down')) {
    return NextResponse.json({ ok: false, error: 'Missing id/direction' }, { status: 400 });
  }

  const sb = supabaseService();
  const { data: target } = await sb.from(meta.table).select('id, order_index').eq('id', id).single();
  if (!target) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  const cmp = direction === 'up' ? 'lt' : 'gt';
  const ord = direction === 'up' ? 'desc' : 'asc';
  const { data: neighbor } = await sb.from(meta.table)
    .select('id, order_index')
    .filter('order_index', cmp, target.order_index)
    .order('order_index', { ascending: ord === 'asc' })
    .limit(1)
    .maybeSingle();

  if (!neighbor) return NextResponse.json({ ok: true, swapped: false });

  // Swap
  await sb.from(meta.table).update({ order_index: neighbor.order_index }).eq('id', target.id);
  await sb.from(meta.table).update({ order_index: target.order_index }).eq('id', neighbor.id);

  return NextResponse.json({ ok: true, swapped: true });
}
