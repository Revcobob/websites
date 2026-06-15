import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { buildPageContent } from '@/lib/resources/publicContent';
import { applyPatches, buildPatchesFromPayload } from '@/lib/injectCmsContent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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

const SLUG_ALIASES: Record<string, string> = {
  'letters-of-support': 'letters'
};

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  noStore();
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
      // Stack every cache-bypass directive we have. Vercel CDN, Cloudflare,
      // browsers, and proxies all read different ones.
      'cache-control':            'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, private',
      'cdn-cache-control':        'no-store',
      'vercel-cdn-cache-control': 'no-store',
      'pragma':                   'no-cache',
      'expires':                  '0',
      // Echo a build/render timestamp so it's trivial to confirm in DevTools
      // whether you're looking at a fresh response or a cached one.
      'x-rendered-at':            new Date().toISOString()
    }
  });
}
