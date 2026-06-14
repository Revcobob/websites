/*
 * annotate-pages.js — one-shot transform that:
 *   1. Scans every cms-pages/mhlc-*.html file for editable section blocks.
 *   2. Adds data-cms attributes to the eyebrow, heading, body, and CTA
 *      elements in each section so the runtime middleware can patch
 *      CMS values into them.
 *   3. Emits cms-pages/_extracted.json — the real copy currently shown
 *      to public visitors, keyed by page_slug → section_key → fields.
 *      That JSON is then consumed by scripts/seed.ts so the admin
 *      editor opens with the same content the public site shows.
 *
 * Run from the repo root:  node scripts/annotate-pages.js
 */
const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'cms-pages');

// slug (used as page_slug in Supabase) → HTML filename
const PAGES = {
  homepage:     'mhlc-homepage.html',
  overview:     'mhlc-overview.html',
  foundation:   'mhlc-foundation.html',
  give:         'mhlc-give.html',
  events:       'mhlc-events.html',
  contributors: 'mhlc-contributors.html',
  letters:      'mhlc-letters-of-support.html',
  resources:    'mhlc-resources.html',
  contact:      'mhlc-contact.html'
};

// Per-page section model: the order matters — sections are matched in
// document order and assigned section_keys + human labels. The matcher
// looks for the first <section> whose markup contains the `anchor`
// string (an id, class, or any unique snippet), then extracts:
//   - eyebrow: first <p> whose class contains uppercase+tracking+clay/gold/sand-mute
//   - heading: first <h1> or <h2> with font-serif
//   - body:    first <p> following the heading with mt-* and either
//              text-sand or text-ink-soft styling (the lead paragraph)
//   - cta:     first <a> with rounded-full or donate-cta class
const SECTION_MODEL = {
  homepage: [
    { key: 'hero',        label: 'Hero',                       anchor: 'hero-gradient' },
    { key: 'vision',      label: 'The Vision',                 anchor: 'id="vision"' },
    { key: 'need',        label: 'Why Memory Care Matters',    anchor: 'id="need"' },
    { key: 'services',    label: 'What the Center Will Provide', anchor: 'id="model"' },
    { key: 'partners',    label: 'A Regional Resource',        anchor: 'id="partners"' },
    { key: 'support',     label: 'Support the Campaign',       anchor: 'id="give"' },
    { key: 'progress',    label: 'Project Progress',           anchor: 'id="progress"' },
    { key: 'families',    label: 'Families & Caregivers',      anchor: 'id="families"' },
    { key: 'updates',     label: 'Latest Updates',             anchor: 'News from the Memory Health' },
    { key: 'final_cta',   label: 'Final Donate / Contact',     anchor: 'id="contact"' }
  ],
  overview: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' },
    { key: 'mission',     label: 'The Mission',   anchor: 'id="mission"' },
    { key: 'site',        label: 'The Site',      anchor: 'id="site"' },
    { key: 'campus',      label: 'The Campus',    anchor: 'id="campus"' },
    { key: 'care_model',  label: 'Care Model',    anchor: 'id="care-model"' },
    { key: 'downloads',   label: 'Downloads',     anchor: 'id="downloads"' }
  ],
  foundation: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' },
    { key: 'charter',     label: 'Charter',       anchor: 'id="charter"' },
    { key: 'history',     label: 'History',       anchor: 'id="history"' },
    { key: 'board',       label: 'Board & Leadership', anchor: 'id="board"' }
  ],
  give: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' },
    { key: 'donate_form', label: 'Donate Form Intro', anchor: 'id="donate-form"' },
    { key: 'other_ways',  label: 'Other Ways to Give', anchor: 'Other ways to give' }
  ],
  events: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' },
    { key: 'upcoming',    label: 'Upcoming Events', anchor: 'id="upcoming"' },
    { key: 'notify',      label: 'Event Notifications', anchor: 'id="notify"' }
  ],
  contributors: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' },
    { key: 'founders',    label: 'Founders Roll', anchor: 'id="founders"' }
  ],
  letters: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' }
  ],
  resources: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' },
    { key: 'crisis',      label: 'Crisis Helpline', anchor: 'id="crisis"' }
  ],
  contact: [
    { key: 'hero',        label: 'Hero',          anchor: 'page-hero' },
    { key: 'form_intro',  label: 'Form Introduction', anchor: 'Send a Message' }
  ]
};

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Find the start of a <section> that contains the anchor string; return
// the [startIdx, endIdx] range (end is the matching </section> index).
function findSection(html, anchor, fromIdx) {
  const sectionRe = /<section\b[^>]*>/gi;
  sectionRe.lastIndex = fromIdx;
  let m;
  while ((m = sectionRe.exec(html))) {
    const start = m.index;
    // crude balancing: count <section> / </section> until balanced
    let depth = 1;
    let i = sectionRe.lastIndex;
    let end = -1;
    const open = /<section\b/gi;
    const close = /<\/section>/gi;
    open.lastIndex = i; close.lastIndex = i;
    while (depth > 0) {
      const o = open.exec(html);
      const c = close.exec(html);
      if (!c) { end = -1; break; }
      if (o && o.index < c.index) {
        depth++; open.lastIndex = o.index + 1; close.lastIndex = c.index;
      } else {
        depth--; i = c.index + '</section>'.length;
        end = i;
        open.lastIndex = i; close.lastIndex = i;
      }
    }
    if (end === -1) return null;
    const block = html.slice(start, end);
    if (block.includes(anchor)) return [start, end];
    sectionRe.lastIndex = end;
  }
  return null;
}

function injectAttr(tagHtml, attr) {
  // Inject attr into the opening tag if not present
  if (tagHtml.includes(attr.split('=')[0] + '=')) return tagHtml;
  return tagHtml.replace(/>$/, ` ${attr}>`);
}

function extractAndAnnotate(html, sectionKey, range) {
  const [start, end] = range;
  let block = html.slice(start, end);
  const out = { eyebrow: null, heading: null, body: null, cta_label: null, cta_href: null };

  // Eyebrow: first <p> with uppercase tracking inside the section
  const eyebrowRe = /<p\b([^>]*\bclass="[^"]*\b(?:uppercase|tracking-)[^"]*"[^>]*)>([\s\S]*?)<\/p>/i;
  const eyebrow = eyebrowRe.exec(block);
  if (eyebrow) {
    const text = eyebrow[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    out.eyebrow = text;
    const newOpen = injectAttr(eyebrow[0].slice(0, eyebrow[0].indexOf('>') + 1), `data-cms="${sectionKey}.eyebrow"`);
    const full = newOpen + eyebrow[2] + '</p>';
    block = block.slice(0, eyebrow.index) + full + block.slice(eyebrow.index + eyebrow[0].length);
  }

  // Heading: first <h1>, <h2>, or <h3> with font-serif
  const headingRe = /<(h[123])\b([^>]*\bclass="[^"]*\bfont-serif\b[^"]*"[^>]*)>([\s\S]*?)<\/\1>/i;
  const heading = headingRe.exec(block);
  if (heading) {
    const text = heading[3].replace(/<br[^>]*>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    out.heading = text;
    const openTag = heading[0].slice(0, heading[0].indexOf('>') + 1);
    const newOpen = injectAttr(openTag, `data-cms="${sectionKey}.heading"`);
    const full = newOpen + heading[3] + `</${heading[1]}>`;
    block = block.slice(0, heading.index) + full + block.slice(heading.index + heading[0].length);
  }

  // Body: first <p> after heading that's wide (mt-* + text-* with prose-ish styling)
  if (heading) {
    const afterHeadingIdx = block.indexOf(heading[3], heading.index) + heading[3].length;
    const bodyRe = /<p\b([^>]*\bclass="[^"]*\b(?:mt-\d+|text-(?:sand|ink-soft|ink|sand\/85))[^"]*"[^>]*)>([\s\S]*?)<\/p>/i;
    const after = block.slice(afterHeadingIdx);
    const body = bodyRe.exec(after);
    if (body && body[2].length > 30) {
      const text = body[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      out.body = text;
      const newOpen = injectAttr(body[0].slice(0, body[0].indexOf('>') + 1), `data-cms="${sectionKey}.body"`);
      const full = newOpen + body[2] + '</p>';
      const abs = afterHeadingIdx + body.index;
      block = block.slice(0, abs) + full + block.slice(abs + body[0].length);
    }
  }

  // CTA: first <a> with rounded-full or donate-cta class
  const ctaRe = /<a\b([^>]*\bclass="[^"]*\b(?:donate-cta|rounded-full)[^"]*"[^>]*)>([\s\S]*?)<\/a>/i;
  const cta = ctaRe.exec(block);
  if (cta) {
    const openTag = cta[0].slice(0, cta[0].indexOf('>') + 1);
    const hrefMatch = openTag.match(/\bhref="([^"]*)"/);
    out.cta_href = hrefMatch ? hrefMatch[1] : null;
    out.cta_label = cta[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const newOpen1 = injectAttr(openTag, `data-cms="${sectionKey}.cta_label"`);
    const newOpen2 = injectAttr(newOpen1, `data-cms-href="${sectionKey}.cta"`);
    const full = newOpen2 + cta[2] + '</a>';
    block = block.slice(0, cta.index) + full + block.slice(cta.index + cta[0].length);
  }

  return { block, content: out };
}

function processPage(slug, filename) {
  const filePath = path.join(PAGES_DIR, filename);
  let html = fs.readFileSync(filePath, 'utf8');
  const model = SECTION_MODEL[slug] || [];
  const extracted = {};
  let cursor = 0;

  for (const def of model) {
    const range = findSection(html, def.anchor, cursor);
    if (!range) {
      console.warn(`  ⚠ ${slug}.${def.key}: anchor "${def.anchor}" not found`);
      continue;
    }
    const { block, content } = extractAndAnnotate(html, def.key, range);
    html = html.slice(0, range[0]) + block + html.slice(range[1]);
    extracted[def.key] = { label: def.label, ...content };
    cursor = range[0] + block.length;
    const summary = [content.eyebrow, content.heading].filter(Boolean).join(' / ');
    console.log(`  ✓ ${slug}.${def.key} — ${summary.slice(0, 70)}`);
  }

  fs.writeFileSync(filePath, html);
  return extracted;
}

(function main() {
  const result = {};
  for (const [slug, filename] of Object.entries(PAGES)) {
    console.log(`\n${slug}:`);
    result[slug] = processPage(slug, filename);
  }
  const outPath = path.join(PAGES_DIR, '_extracted.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${outPath}`);
})();
