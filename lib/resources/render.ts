// Server-rendered HTML fragments used by middleware to fill the
// [data-cms-list] placeholders. All markup reuses the public site's
// existing Tailwind classes so it visually matches the static design.

import type {
  EventItem, NewsPost, HonorRollEntry, LetterOfSupport,
  DocumentItem, TimelineMilestone, MediaCoverageItem
} from './types';

const esc = (s: string | null | undefined): string =>
  String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]!));

function fmtDate(d: string | null): string {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  } catch { return d; }
}

// ── Events ────────────────────────────────────────────────────────────────
export function renderEventsList(events: EventItem[], opts: { variant?: 'upcoming' | 'past' } = {}): string {
  if (events.length === 0) return renderEmpty(opts.variant === 'past' ? 'No past events yet.' : 'No upcoming events yet. Check back soon.');
  return events.map(e => {
    const date = fmtDate(e.event_date);
    const time = [e.start_time, e.end_time].filter(Boolean).join('–');
    const cta = e.registration_url
      ? `<a href="${esc(e.registration_url)}" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-deep">Register <span aria-hidden="true">→</span></a>`
      : '';
    const img = e.image_url
      ? `<img src="${esc(e.image_url)}" alt="${esc(e.title ?? '')}" class="w-full h-48 object-cover" loading="lazy" />`
      : '';
    return `
      <article class="card-base overflow-hidden flex flex-col">
        ${img}
        <div class="p-6 flex-1 flex flex-col">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-clay">${esc(e.category ?? 'Event')}</p>
          <h3 class="mt-2 font-serif text-xl text-ink font-semibold leading-snug">${esc(e.title)}</h3>
          <p class="mt-3 text-sm text-ink-mute">${esc(date)}${time ? ' · ' + esc(time) : ''}${e.location ? ' · ' + esc(e.location) : ''}</p>
          ${e.description ? `<p class="mt-3 text-sm text-ink-soft leading-relaxed">${esc(e.description)}</p>` : ''}
          ${cta}
        </div>
      </article>`;
  }).join('\n');
}

// ── News ──────────────────────────────────────────────────────────────────
export function renderNewsList(posts: NewsPost[]): string {
  if (posts.length === 0) return renderEmpty('No updates posted yet.');
  return posts.map(p => {
    const link = p.external_url || (p.slug ? `/updates/${esc(p.slug)}` : '#');
    const img = p.image_url
      ? `<img src="${esc(p.image_url)}" alt="${esc(p.title ?? '')}" class="w-full h-48 object-cover" loading="lazy" />`
      : '';
    return `
      <article class="card-base overflow-hidden flex flex-col">
        ${img}
        <div class="p-6 flex-1 flex flex-col">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-clay">${esc(p.category ?? 'Update')}</p>
          <h3 class="mt-2 font-serif text-xl text-ink font-semibold leading-snug">${esc(p.title)}</h3>
          <p class="mt-2 text-xs text-ink-mute">${esc(fmtDate(p.published_at ?? p.post_date))}</p>
          ${p.summary ? `<p class="mt-3 text-sm text-ink-soft leading-relaxed">${esc(p.summary)}</p>` : ''}
          <a href="${esc(link)}" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-deep">Read more <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
  }).join('\n');
}

// ── Honor Roll ────────────────────────────────────────────────────────────
export function renderHonorRoll(entries: HonorRollEntry[]): string {
  if (entries.length === 0) return renderEmpty('Honor roll entries will appear here as donors are added.');
  const byCategory = new Map<string, HonorRollEntry[]>();
  for (const e of entries) {
    const cat = e.category || 'Founding Contributors';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(e);
  }
  const groups: string[] = [];
  for (const [cat, items] of byCategory) {
    const rows = items.map(e => {
      const name = e.anonymous ? 'Anonymous' : (e.display_name || 'Anonymous');
      const tribute = e.tribute_type && e.honoree_name
        ? `<p class="text-xs text-ink-mute italic">${esc(e.tribute_type === 'in_memory_of' ? 'In memory of' : 'In honor of')} ${esc(e.honoree_name)}</p>`
        : '';
      const level = e.level_label ? `<p class="text-xs uppercase tracking-wider text-gold-deep font-semibold">${esc(e.level_label)}</p>` : '';
      const note = e.display_note ? `<p class="text-sm text-ink-soft mt-1">${esc(e.display_note)}</p>` : '';
      return `
        <li class="card-base p-5">
          ${level}
          <p class="mt-1 font-serif text-lg text-ink font-semibold">${esc(name)}</p>
          ${tribute}
          ${note}
        </li>`;
    }).join('\n');
    groups.push(`
      <section class="mb-12">
        <h2 class="font-serif text-2xl text-ink font-semibold">${esc(cat)}</h2>
        <div class="marker-line mt-3"></div>
        <ul class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${rows}</ul>
      </section>`);
  }
  return groups.join('\n');
}

// ── Letters ───────────────────────────────────────────────────────────────
export function renderLetters(letters: LetterOfSupport[]): string {
  if (letters.length === 0) return renderEmpty('Letters of support will appear here as they are uploaded.');
  return letters.map(l => `
    <article class="card-base p-6 flex flex-col">
      ${l.featured ? '<p class="text-xs uppercase tracking-wider text-gold-deep font-semibold">Featured</p>' : ''}
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-clay mt-1">${esc(l.category ?? '')}</p>
      <h3 class="mt-2 font-serif text-lg text-ink font-semibold leading-snug">${esc(l.title ?? l.organization)}</h3>
      ${l.organization && l.title ? `<p class="mt-1 text-sm text-ink-mute">${esc(l.organization)}</p>` : ''}
      ${l.signer_name ? `<p class="mt-1 text-sm text-ink-soft">${esc(l.signer_name)}${l.signer_title ? ', ' + esc(l.signer_title) : ''}</p>` : ''}
      ${l.description ? `<p class="mt-3 text-sm text-ink-soft leading-relaxed">${esc(l.description)}</p>` : ''}
      ${l.letter_date ? `<p class="mt-3 text-xs text-ink-mute">${esc(fmtDate(l.letter_date))}</p>` : ''}
      ${l.file_url ? `<a href="${esc(l.file_url)}" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-deep">Read the full letter <span aria-hidden="true">→</span></a>` : ''}
    </article>`).join('\n');
}

// ── Documents ─────────────────────────────────────────────────────────────
export function renderDocuments(docs: DocumentItem[]): string {
  if (docs.length === 0) return renderEmpty('Downloads will appear here as they are uploaded.');
  return docs.map(d => `
    <article class="card-base overflow-hidden flex flex-col">
      ${d.thumbnail_url ? `<img src="${esc(d.thumbnail_url)}" alt="${esc(d.title ?? '')}" class="w-full h-48 object-cover" loading="lazy" />` : ''}
      <div class="p-6 flex-1 flex flex-col">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-clay">${esc(d.category ?? 'Download')}</p>
        <h3 class="mt-2 font-serif text-lg text-ink font-semibold">${esc(d.title)}</h3>
        ${d.description ? `<p class="mt-2 text-sm text-ink-soft">${esc(d.description)}</p>` : ''}
        ${d.file_url ? `<a href="${esc(d.file_url)}" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-deep">Download ${esc((d.file_type ?? '').toUpperCase())} <span aria-hidden="true">↓</span></a>` : ''}
      </div>
    </article>`).join('\n');
}

// ── Timeline ──────────────────────────────────────────────────────────────
export function renderTimeline(milestones: TimelineMilestone[]): string {
  if (milestones.length === 0) return renderEmpty('Timeline milestones will appear here.');
  return milestones.map(m => {
    const dot = m.status === 'completed' ? 'bg-teal'
              : m.status === 'active'    ? 'bg-gold'
              :                            'bg-sand-deep';
    const label = m.status === 'completed' ? 'Done'
               : m.status === 'active'    ? 'In progress'
               :                            'Upcoming';
    return `
      <li class="card-base p-5">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2.5 h-2.5 rounded-full ${dot}"></span>
          <p class="text-xs uppercase tracking-wider text-ink-mute font-semibold">${esc(label)}</p>
        </div>
        <h3 class="mt-3 font-serif text-lg text-ink font-semibold">${esc(m.title)}</h3>
        ${m.date_label ? `<p class="mt-1 text-xs text-ink-mute">${esc(m.date_label)}</p>` : ''}
        ${m.description ? `<p class="mt-2 text-sm text-ink-soft leading-relaxed">${esc(m.description)}</p>` : ''}
      </li>`;
  }).join('\n');
}

// ── Media Coverage ────────────────────────────────────────────────────────
export function renderMediaCoverage(items: MediaCoverageItem[]): string {
  if (items.length === 0) return renderEmpty('Press coverage will appear here.');
  return items.map(m => `
    <article class="card-base overflow-hidden flex flex-col">
      ${m.image_url ? `<img src="${esc(m.image_url)}" alt="${esc(m.headline ?? '')}" class="w-full h-44 object-cover" loading="lazy" />` : ''}
      <div class="p-6 flex-1 flex flex-col">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-clay">${esc(m.source_name ?? '')}</p>
        <h3 class="mt-2 font-serif text-lg text-ink font-semibold leading-snug">${esc(m.headline)}</h3>
        <p class="mt-2 text-xs text-ink-mute">${esc(fmtDate(m.publication_date))}</p>
        ${m.summary ? `<p class="mt-3 text-sm text-ink-soft leading-relaxed">${esc(m.summary)}</p>` : ''}
        ${m.external_url ? `<a href="${esc(m.external_url)}" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-deep">Read the article <span aria-hidden="true">→</span></a>` : ''}
      </div>
    </article>`).join('\n');
}

function renderEmpty(msg: string): string {
  return `<div class="text-center text-ink-mute py-10 text-sm">${esc(msg)}</div>`;
}
