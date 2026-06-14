'use client';

import { useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, TextArea, TextInput } from '@/components/admin/ui';
import type { PageRow } from '@/lib/resources/types';

interface Entry { page: PageRow; label: string }

export function SeoClient({ initial }: { initial: Entry[] }) {
  const toast = useToast();
  const [pages, setPages] = useState<Entry[]>(initial);
  const [saving, setSaving] = useState<string | null>(null);

  function patch(slug: string, p: Partial<PageRow>) {
    setPages(arr => arr.map(e => e.page.slug === slug ? { ...e, page: { ...e.page, ...p } } : e));
  }

  async function save(slug: string) {
    setSaving(slug);
    const entry = pages.find(e => e.page.slug === slug)!;
    const res = await api.create('pages', entry.page);
    setSaving(null);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Saved.');
  }

  return (
    <div className="space-y-6">
      {pages.map(({ page, label }) => (
        <Card key={page.slug}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-clay font-semibold">{label}</p>
              <h3 className="font-serif text-lg text-ink font-semibold mt-1">/mhlc-{page.slug === 'letters' ? 'letters-of-support' : page.slug}.html</h3>
            </div>
            <Button onClick={() => save(page.slug)} loading={saving === page.slug}>Save</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Search title" hint="Up to 60 characters works best.">
              <TextInput value={page.seo_title ?? ''} onChange={e => patch(page.slug, { seo_title: e.target.value })} />
            </Field>
            <Field label="Canonical path (optional)"><TextInput value={page.canonical_path ?? ''} onChange={e => patch(page.slug, { canonical_path: e.target.value })} placeholder="/mhlc-homepage.html" /></Field>
          </div>
          <div className="mt-4">
            <Field label="Search description" hint="Up to ~160 characters.">
              <TextArea rows={2} value={page.seo_description ?? ''} onChange={e => patch(page.slug, { seo_description: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Social share title (OG)"><TextInput value={page.og_title ?? ''} onChange={e => patch(page.slug, { og_title: e.target.value })} /></Field>
            <Field label="Social share image (OG)"><TextInput value={page.og_image ?? ''} onChange={e => patch(page.slug, { og_image: e.target.value })} placeholder="https://…" /></Field>
          </div>
          <div className="mt-4">
            <Field label="Social share description (OG)">
              <TextArea rows={2} value={page.og_description ?? ''} onChange={e => patch(page.slug, { og_description: e.target.value })} />
            </Field>
          </div>
          <div className="mt-5 rounded-lg bg-sand p-4">
            <p className="text-xs uppercase tracking-wider text-ink-mute font-semibold">Search preview</p>
            <p className="mt-1 text-teal font-medium text-base">{page.seo_title || `Page · Memory Health Life Center`}</p>
            <p className="text-xs text-sage-deep">memoryhealthlifecenter.org{page.canonical_path ?? `/mhlc-${page.slug}.html`}</p>
            <p className="mt-1 text-sm text-ink-soft">{page.seo_description || 'A description will appear here when set.'}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
