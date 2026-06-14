'use client';

import { useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, TextArea, TextInput } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { PageRow, PageSection } from '@/lib/resources/types';

interface Props {
  slug: string;
  initialPage: PageRow | null;
  initialSections: PageSection[];
}

export function PageEditor({ slug, initialPage, initialSections }: Props) {
  const toast = useToast();
  const [page, setPage] = useState<Partial<PageRow>>(initialPage ?? { slug, display_name: slug });
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [saving, setSaving] = useState(false);

  async function saveAll() {
    setSaving(true);
    let ok = true;
    const pageRes = await api.create('pages', { ...page, slug });
    if (!pageRes.ok) { ok = false; toast.push('error', `Page metadata: ${pageRes.error}`); }
    for (const s of sections) {
      const res = await api.update('page_sections', s.id, {
        eyebrow: s.eyebrow, heading: s.heading, body: s.body,
        image_url: s.image_url, image_alt: s.image_alt,
        cta_label: s.cta_label, cta_href: s.cta_href,
        fields: s.fields, order_index: s.order_index
      });
      if (!res.ok) { ok = false; toast.push('error', `${s.display_label ?? s.section_key}: ${res.error}`); }
    }
    setSaving(false);
    if (ok) toast.push('success', 'Page saved. Public site will refresh within a minute.');
  }

  function patchSection(id: string, patch: Partial<PageSection>) {
    setSections(sec => sec.map(s => s.id === id ? { ...s, ...patch } : s));
  }

  if (sections.length === 0 && !initialPage) {
    return (
      <Card>
        <p className="text-sm text-ink-soft">
          This page hasn't been initialized yet. Run the seed script (or click the button below) to create editable
          sections based on the current static HTML — once Supabase is configured.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => window.open(`/mhlc-${slug === 'letters' ? 'letters-of-support' : slug === 'homepage' ? 'homepage' : slug}.html`, '_blank')}>
          View public page
        </Button>
        <Button onClick={saveAll} loading={saving}>Save all changes</Button>
      </div>

      <div className="space-y-6">
        {sections.map(s => (
          <Card key={s.id}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-clay font-semibold">Section</p>
                <h3 className="font-serif text-lg text-ink font-semibold mt-1">{s.display_label ?? s.section_key}</h3>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Heading">
                <TextInput value={s.heading ?? ''} onChange={e => patchSection(s.id, { heading: e.target.value })} />
              </Field>
              <Field label="Eyebrow / small label">
                <TextInput value={s.eyebrow ?? ''} onChange={e => patchSection(s.id, { eyebrow: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Body text">
                <TextArea rows={4} value={s.body ?? ''} onChange={e => patchSection(s.id, { body: e.target.value })} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field label="Button label">
                <TextInput value={s.cta_label ?? ''} onChange={e => patchSection(s.id, { cta_label: e.target.value })} />
              </Field>
              <Field label="Button link">
                <TextInput value={s.cta_href ?? ''} onChange={e => patchSection(s.id, { cta_href: e.target.value })} placeholder="https://… or /mhlc-give.html" />
              </Field>
            </div>
            {(s.section_key.includes('hero') || s.image_url) && (
              <div className="mt-5">
                <p className="label-base">Section image</p>
                <ImageUploader
                  bucket="media"
                  value={s.image_url ?? null}
                  onChange={url => patchSection(s.id, { image_url: url })}
                  altText={s.image_alt ?? ''}
                  onAltChange={alt => patchSection(s.id, { image_alt: alt })}
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
