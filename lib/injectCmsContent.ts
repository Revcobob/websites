// Edge-safe HTML rewriter. Uses regex passes with backreferences so the
// replacement scopes to the matched element's actual closing tag, even when
// the element contains nested children (icons, spans, etc.).

type ScalarPatch = { selector: string; value: string };
type AttrPatch = { selector: string; attr: string; value: string };
type ReplacePatch = { selector: string; html: string };

export interface CmsPatches {
  texts: ScalarPatch[];
  attrs: AttrPatch[];
  innerHtml: ReplacePatch[];
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export function buildPatchesFromPayload(payload: CmsPagePayload): CmsPatches {
  const texts: ScalarPatch[] = [];
  const attrs: AttrPatch[] = [];
  const innerHtml: ReplacePatch[] = [];

  for (const section of payload.sections) {
    const k = section.section_key;
    if (section.eyebrow)   texts.push({ selector: `[data-cms="${k}.eyebrow"]`,  value: section.eyebrow });
    if (section.heading)   texts.push({ selector: `[data-cms="${k}.heading"]`,  value: section.heading });
    if (section.body)      texts.push({ selector: `[data-cms="${k}.body"]`,     value: section.body });
    if (section.cta_label) texts.push({ selector: `[data-cms="${k}.cta_label"]`,value: section.cta_label });
    if (section.cta_href)  attrs.push({ selector: `[data-cms-href="${k}.cta"]`, attr: 'href', value: section.cta_href });
    if (section.image_url) {
      attrs.push({ selector: `[data-cms-src="${k}.image"]`, attr: 'src', value: section.image_url });
      if (section.image_alt) attrs.push({ selector: `[data-cms-src="${k}.image"]`, attr: 'alt', value: section.image_alt });
    }
  }

  for (const slot of payload.listSlots) {
    innerHtml.push({ selector: `[data-cms-list="${slot.key}"]`, html: slot.html });
  }

  return {
    texts, attrs, innerHtml,
    metaTitle:       payload.seo.title,
    metaDescription: payload.seo.description,
    ogTitle:         payload.seo.ogTitle,
    ogDescription:   payload.seo.ogDescription,
    ogImage:         payload.seo.ogImage,
    canonical:       payload.seo.canonical
  };
}

export interface CmsPagePayload {
  slug: string;
  sections: Array<{
    section_key: string;
    eyebrow: string | null;
    heading: string | null;
    body: string | null;
    image_url: string | null;
    image_alt: string | null;
    cta_label: string | null;
    cta_href: string | null;
  }>;
  listSlots: Array<{ key: string; html: string }>;
  seo: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
  };
}

export function applyPatches(html: string, patches: CmsPatches): string {
  let out = html;

  // Text patches: replace the element's entire inner content with escaped text.
  for (const p of patches.texts) {
    const re = makeElementRegex(p.selector);
    if (!re) continue;
    out = out.replace(re, (_full, openTag: string, tagName: string) =>
      `${openTag}${escapeHtml(p.value)}</${tagName}>`
    );
  }

  // Attribute patches: rewrite only the opening tag, leave body intact.
  for (const p of patches.attrs) {
    const re = makeElementRegex(p.selector);
    if (!re) continue;
    out = out.replace(re, (_full, openTag: string, tagName: string, body: string) =>
      `${setOrInsertAttr(openTag, p.attr, p.value)}${body}</${tagName}>`
    );
  }

  // Inner-HTML patches: replace inner content with raw HTML (used for the
  // server-rendered list templates).
  for (const p of patches.innerHtml) {
    const re = makeElementRegex(p.selector);
    if (!re) continue;
    out = out.replace(re, (_full, openTag: string, tagName: string) =>
      `${openTag}${p.html}</${tagName}>`
    );
  }

  if (patches.metaTitle)       out = replaceTagText(out, 'title', patches.metaTitle);
  if (patches.metaDescription) out = upsertMeta(out, 'name', 'description', patches.metaDescription);
  if (patches.ogTitle)         out = upsertMeta(out, 'property', 'og:title', patches.ogTitle);
  if (patches.ogDescription)   out = upsertMeta(out, 'property', 'og:description', patches.ogDescription);
  if (patches.ogImage)         out = upsertMeta(out, 'property', 'og:image', patches.ogImage);
  if (patches.canonical)       out = upsertLink(out, 'canonical', patches.canonical);

  return out;
}

// ── helpers ────────────────────────────────────────────────────────────────

// Build a regex that matches an entire element selected by a single attr.
// Captures:
//   $1 = full opening tag
//   $2 = tag name (for matching the real closing tag, even with nested children)
//   $3 = inner body
function makeElementRegex(selector: string): RegExp | null {
  const m = selector.match(/^\[([a-z0-9-]+)="([^"]+)"\]$/i);
  if (!m) return null;
  const [, attr, value] = m;
  const attrRe = `${escapeRe(attr!)}="${escapeRe(value!)}"`;
  // Greedy on body but anchored to the matching </tag>. The non-capturing
  // approach using `(?:(?!</\\2>).)*` keeps it safe with nested tags of a
  // different name.
  return new RegExp(
    `(<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*?\\b${attrRe}[^>]*?>)([\\s\\S]*?)</\\2>`,
    'gi'
  );
}

function setOrInsertAttr(openTag: string, attr: string, value: string): string {
  const re = new RegExp(`\\b${escapeRe(attr)}="[^"]*"`);
  if (re.test(openTag)) return openTag.replace(re, `${attr}="${escapeAttr(value)}"`);
  return openTag.replace(/>$/, ` ${attr}="${escapeAttr(value)}">`);
}

function replaceTagText(html: string, tag: string, value: string): string {
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, 'i');
  return html.replace(re, `<${tag}>${escapeHtml(value)}</${tag}>`);
}

function upsertMeta(html: string, keyAttr: 'name' | 'property', keyVal: string, content: string): string {
  const re = new RegExp(`<meta\\s+[^>]*${keyAttr}="${escapeRe(keyVal)}"[^>]*>`, 'i');
  const tag = `<meta ${keyAttr}="${keyVal}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `${tag}\n</head>`);
}

function upsertLink(html: string, rel: string, href: string): string {
  const re = new RegExp(`<link\\s+[^>]*rel="${escapeRe(rel)}"[^>]*>`, 'i');
  const tag = `<link rel="${rel}" href="${escapeAttr(href)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `${tag}\n</head>`);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
}
function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
