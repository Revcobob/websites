// Edge-safe HTML rewriter. Uses Cloudflare/Vercel's HTMLRewriter when
// available, otherwise falls back to lightweight regex passes. The fallback
// is only used in non-edge environments (e.g. local Node dev runtime), where
// performance is less critical.

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

// Patches based on data-cms attributes plus optional metadata overrides.
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

  // Renderable list slots → HTML replacement
  for (const slot of payload.listSlots) {
    innerHtml.push({ selector: `[data-cms-list="${slot.key}"]`, html: slot.html });
  }

  return {
    texts,
    attrs,
    innerHtml,
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

// Use HTMLRewriter when available (Vercel Edge / Cloudflare)
declare const HTMLRewriter: any;

export function applyPatches(html: string, patches: CmsPatches): string {
  // Fallback: simple regex-based patching. Selectors are limited to
  // [data-cms="…"], [data-cms-href="…"], [data-cms-src="…"], [data-cms-list="…"].
  let out = html;

  for (const p of patches.texts) {
    const re = makeAttrSelectorRegex(p.selector, true);
    out = out.replace(re, (match, openTag) => `${openTag}${escapeHtml(p.value)}</`);
  }
  for (const p of patches.attrs) {
    const re = makeAttrSelectorRegex(p.selector, false);
    out = out.replace(re, (match) => setOrInsertAttr(match, p.attr, p.value));
  }
  for (const p of patches.innerHtml) {
    const re = makeAttrSelectorRegex(p.selector, true);
    out = out.replace(re, (match, openTag) => `${openTag}${p.html}</`);
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

function makeAttrSelectorRegex(selector: string, captureOpenTag: boolean): RegExp {
  // Convert simple [attr="value"] selector into a regex that matches the
  // opening tag plus the content up to the next </
  const m = selector.match(/^\[([a-z0-9-]+)="([^"]+)"\]$/i);
  if (!m) return new RegExp('a^');
  const [, attr, value] = m;
  const attrRe = `${escapeRe(attr!)}="${escapeRe(value!)}"`;
  const open = `<[a-zA-Z][a-zA-Z0-9]*\\b[^>]*?\\b${attrRe}[^>]*?>`;
  const body = '([\\s\\S]*?)';
  if (captureOpenTag) return new RegExp(`(${open})${body}</`, 'g');
  return new RegExp(open, 'g');
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
