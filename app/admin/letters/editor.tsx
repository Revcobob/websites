'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, Select, TextArea, TextInput } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { LetterOfSupport, Status } from '@/lib/resources/types';

interface Props { mode: 'new' | 'edit'; id?: string }

const CATEGORIES = [
  'federal','state','academic','medical','municipal','county','civic','community','foundation','partner'
];

export function LetterEditor({ mode, id }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [row, setRow] = useState<Partial<LetterOfSupport>>({ status: 'draft', featured: false, category: 'community' });
  const [loaded, setLoaded] = useState(mode === 'new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    api.list<LetterOfSupport>('letters_of_support', { limit: 1000 }).then(res => {
      if (!res.ok) return toast.push('error', res.error);
      const found = res.data.find(l => l.id === id);
      if (!found) return toast.push('error', 'Letter not found');
      setRow(found); setLoaded(true);
    });
  }, [mode, id, toast]);

  const set = (patch: Partial<LetterOfSupport>) => setRow(r => ({ ...r, ...patch }));

  async function save(nextStatus?: Status) {
    setSaving(true);
    const body: Partial<LetterOfSupport> = { ...row };
    if (nextStatus) body.status = nextStatus;
    if (!body.organization?.trim() && !body.title?.trim()) {
      toast.push('error', 'Add a title or organization.'); setSaving(false); return;
    }
    const res = mode === 'new'
      ? await api.create<LetterOfSupport>('letters_of_support', body)
      : await api.update<LetterOfSupport>('letters_of_support', id!, body);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Saved.');
    if (mode === 'new') router.push(`/admin/letters/${(res.data as LetterOfSupport).id}`);
  }

  async function remove() {
    if (!id || !confirm('Delete this letter permanently? The file itself will remain in storage.')) return;
    const res = await api.remove('letters_of_support', id);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Deleted.');
    router.push('/admin/letters');
  }

  if (!loaded) return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title" hint="If blank, the organization name is used.">
              <TextInput value={row.title ?? ''} onChange={e => set({ title: e.target.value })} />
            </Field>
            <Field label="Organization" required>
              <TextInput value={row.organization ?? ''} onChange={e => set({ organization: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Signer name">
              <TextInput value={row.signer_name ?? ''} onChange={e => set({ signer_name: e.target.value })} />
            </Field>
            <Field label="Signer title">
              <TextInput value={row.signer_title ?? ''} onChange={e => set({ signer_title: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Category">
              <Select value={row.category ?? 'community'} onChange={e => set({ category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Letter date">
              <TextInput type="date" value={row.letter_date ?? ''} onChange={e => set({ letter_date: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Description" hint="A short summary shown on the letter card.">
              <TextArea value={row.description ?? ''} onChange={e => set({ description: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold mb-3">Letter file</h3>
          <ImageUploader
            bucket="letters"
            value={row.file_url ?? null}
            onChange={url => {
              const ext = url ? (url.split('.').pop() ?? '').toLowerCase().split('?')[0] : null;
              set({ file_url: url, file_type: ext });
            }}
            accept="application/pdf,image/jpeg,image/png"
            maxSizeMb={25}
            hint="PDF, JPG, or PNG. Up to 25 MB."
          />
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold">Status & display</h3>
          <div className="mt-3 space-y-3">
            <Field label="Status">
              <Select value={row.status ?? 'draft'} onChange={e => set({ status: e.target.value as Status })}>
                <option value="draft">Draft (not visible)</option>
                <option value="published">Published (live)</option>
                <option value="unpublished">Unpublished (hidden)</option>
              </Select>
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" className="h-4 w-4 accent-clay" checked={!!row.featured} onChange={e => set({ featured: e.target.checked })} />
              Show as a featured letter
            </label>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {row.status !== 'published' && <Button onClick={() => save('published')} loading={saving}>Save &amp; publish</Button>}
            <Button variant="secondary" onClick={() => save()} loading={saving}>Save</Button>
            <Link href="/admin/letters" className="btn-ghost text-center">Cancel</Link>
          </div>
        </Card>
        {mode === 'edit' && (
          <Card>
            <h3 className="font-serif text-lg text-ink font-semibold">Danger zone</h3>
            <div className="mt-3"><Button variant="danger" onClick={remove}>Delete letter</Button></div>
          </Card>
        )}
      </div>
    </div>
  );
}
