import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/clerk';
import { supabaseService } from '@/lib/supabase/server';
import { RESOURCE_TABLES, type ResourceKey } from '@/lib/resources/types';

export const runtime = 'nodejs';

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function requireAuth(): Promise<{ ok: true } | NextResponse> {
  const a = await isAdmin();
  if (!a.ok) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  return { ok: true };
}

function resolveResource(key: string) {
  return RESOURCE_TABLES[key as ResourceKey];
}

// ── LIST ──────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: { resource: string } }) {
  const authed = await requireAuth(); if (authed instanceof NextResponse) return authed;
  const meta = resolveResource(params.resource); if (!meta) return jsonError('Unknown resource', 404);
  const sb = supabaseService();
  const url = new URL(req.url);
  const limit  = Math.min(Number(url.searchParams.get('limit') ?? 100), 1000);
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0);
  const order  = url.searchParams.get('order') ?? defaultOrder(params.resource);
  const dir    = url.searchParams.get('dir') === 'asc' ? 'asc' : 'desc';
  const q      = url.searchParams.get('q');
  const status = url.searchParams.get('status');

  let query = sb.from(meta.table).select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);
  if (q) query = applySearch(query, params.resource, q);
  query = query.order(order, { ascending: dir === 'asc' }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true, data, count });
}

// ── CREATE ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: { resource: string } }) {
  const authed = await requireAuth(); if (authed instanceof NextResponse) return authed;
  const meta = resolveResource(params.resource); if (!meta) return jsonError('Unknown resource', 404);
  let body: any;
  try { body = await req.json(); } catch { return jsonError('Invalid JSON'); }
  const sb = supabaseService();

  if (meta.singleton) {
    const row = { ...body, id: 1 };
    const { data, error } = await sb.from(meta.table).upsert(row, { onConflict: 'id' }).select().single();
    if (error) return jsonError(error.message, 500);
    return NextResponse.json({ ok: true, data });
  }
  const { data, error } = await sb.from(meta.table).insert(body).select().single();
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true, data });
}

// ── UPDATE ────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: { params: { resource: string } }) {
  const authed = await requireAuth(); if (authed instanceof NextResponse) return authed;
  const meta = resolveResource(params.resource); if (!meta) return jsonError('Unknown resource', 404);
  let body: any;
  try { body = await req.json(); } catch { return jsonError('Invalid JSON'); }
  const id = body?.id;
  if (id === undefined) return jsonError('Missing id');
  const patch = { ...body }; delete patch.id;
  const sb = supabaseService();
  const { data, error } = await sb.from(meta.table).update(patch).eq(meta.pk, id).select().single();
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true, data });
}

// ── DELETE ────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: { resource: string } }) {
  const authed = await requireAuth(); if (authed instanceof NextResponse) return authed;
  const meta = resolveResource(params.resource); if (!meta) return jsonError('Unknown resource', 404);
  if (meta.singleton) return jsonError('Singleton rows cannot be deleted', 400);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return jsonError('Missing id');
  const sb = supabaseService();
  const { error } = await sb.from(meta.table).delete().eq(meta.pk, id);
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true });
}

function defaultOrder(resource: string): string {
  switch (resource) {
    case 'honor_roll':
    case 'letters_of_support':
    case 'documents':
    case 'timeline_milestones':
    case 'media_coverage':
    case 'page_sections':
      return 'order_index';
    case 'events':
      return 'event_date';
    case 'news_posts':
      return 'published_at';
    case 'pages':
      return 'slug';
    default:
      return 'created_at';
  }
}

function applySearch(query: any, resource: string, q: string) {
  const term = `%${q.replace(/[%_]/g, ' ')}%`;
  switch (resource) {
    case 'subscribers':
      return query.ilike('email', term);
    case 'contact_inquiries':
      return query.or(`email.ilike.${term},first_name.ilike.${term},last_name.ilike.${term},message.ilike.${term}`);
    case 'donation_inquiries':
      return query.or(`email.ilike.${term},first_name.ilike.${term},last_name.ilike.${term}`);
    case 'events':
    case 'news_posts':
    case 'documents':
    case 'letters_of_support':
    case 'media_coverage':
      return query.or(`title.ilike.${term},description.ilike.${term}`);
    case 'honor_roll':
      return query.or(`display_name.ilike.${term},honoree_name.ilike.${term}`);
    default:
      return query;
  }
}
