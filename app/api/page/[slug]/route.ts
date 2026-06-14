import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { buildPageContent } from '@/lib/resources/publicContent';
import { applyPatches, buildPatchesFromPayload } from '@/lib/injectCmsContent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Slug → filename map. Anything not in this map is a 404.
const SLUG_FILE: Record<string, string> = {
  homepage:    'mhlc-homepage.html',
  overview:    'mhlc-overview.html',
  foundation:  'mhlc-foundation.html',
  give:        'mhlc-give.html',
  events:      'mhlc-events.html',
  contributors:'mhlc-contributors.html',
  letters:     'mhlc-letters-of-support.html',
  resources:   'mhlc-resources.html',
  contact:     'mhlc-contact.html'
};

// Allow a few legacy slug aliases (the original file names without prefix).
const SLUG_ALIASES: Record<string, string> = {
  'letters-of-support': 'letters'
};

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = SLUG_ALIASES[params.slug] ?? params.slug;
  const filename = SLUG_FILE[slug];
  if (!filename) return new NextResponse('Not found', { status: 404 });

  let html: string;
  try {
    html = await fs.readFile(path.join(process.cwd(), 'cms-pages', filename), 'utf8');
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const payload = await buildPageContent({ slug });
    if (payload) {
      const patches = buildPatchesFromPayload(payload);
      html = applyPatches(html, patches);
    }
  } catch (err) {
    console.error('CMS injection failed for', slug, err);
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // No edge cache while the client is iterating on content. Each
      // request goes through to the route handler and back to Supabase
      // so edits show up immediately. Acceptable for a low-traffic
      // campaign site; we can layer in tagged revalidation later if
      // origin load ever becomes a concern.
      'cache-control': 'no-store, must-revalidate',
      'cdn-cache-control': 'no-store',
      'vercel-cdn-cache-control': 'no-store'
    }
  });
}
