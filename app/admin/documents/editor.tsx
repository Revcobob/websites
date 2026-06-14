'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, Select, TextArea, TextInput } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { DocumentItem, Status } from '@/lib/resources/types';

interface Props { mode: 'new' | 'edit'; id?: string }

const CATEGORIES = [
  { value: 'overview',   label: 'Project overview' },
  { value: 'deck',       label: 'Concept deck' },
  { value: 'renderings', label: 'Renderings' },
  { value: 'maps',       label: 'Maps' },
  { value: 'one_pager',  label: 'One-pagers' },
  { value: 'support',    label: 'Support letter files' },
  { value: 'campaign',   label: 'Campaign materials' },
  { value: 'report',     label: 'Reports / updates' }
];

export function DocumentEditor({ mode, id }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [row, setRow] = useState<Partial<DocumentItem>>({ status: 'draft', category: 'overview' });
  const [loaded, setLoaded] = useState(mode === 'new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    api.list<DocumentItem>('documents', { limit: 1000 }).then(res => {
      if (!res.ok) return toast.push('error', res.error);
      const found = res.data.find(d => d.id === id);
      if (!found) return toast.push('error', 'Document not found');
      setRow(found); setLoaded(true);
    });
  }, [mode, id, toast]);

  const set = (patch: Partial<DocumentItem>) => setRow(r => ({ ...r, ...patch }));

  async function save(nextStatus?: Status) {
    setSaving(true);
    const body: Partial<DocumentItem> = { ...row };
    if (nextStatus) body.status = nextStatus;
    if (!body.title?.trim()) { toast.push('error', 'Title is required.'); setSaving(false); return; }
    const res = mode === 'new'
      ? await api.create<DocumentItem>('documents', body)
      : await api.update<DocumentItem>('documents', id!, body);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Saved.');
    if (mode === 'new') router.push(`/admin/documents/${(res.data as DocumentItem).id}`);
  }

  async function remove() {
    if (!id || !confirm('Delete this document permanently?')) return;
    const res = await api.remove('documents', id);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Deleted.');
    router.push('/admin/documents');
  }

  if (!loaded) return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <Field label="Title" required>
            <TextInput value={row.title ?? ''} onChange={e => set({ title: e.target.value })} placeholder="MHLC Project Overview" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Category">
              <Select value={row.category ?? 'overview'} onChange={e => set({ category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </Select>
            </Field>
            <Field label="File type" hint="Set automatically when you upload a file.">
              <TextInput value={row.file_type ?? ''} onChange={e => set({ file_type: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Description">
              <TextArea value={row.description ?? ''} onChange={e => set({ description: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold mb-3">File</h3>
          <ImageUploader
            bucket="documents"
            value={row.file_url ?? null}
            onChange={url => {
              const ext = url ? (url.split('.').pop() ?? '').toLowerCase().split('?')[0] : null;
              set({ file_url: url, file_type: ext });
            }}
            accept="application/pdf,image/*"
            maxSizeMb={50}
            hint="PDF preferred. Up to 50 MB."
          />
          <h3 className="font-serif text-lg text-ink font-semibold mb-3 mt-6">Thumbnail (optional)</h3>
          <ImageUploader
            bucket="thumbnails"
            value={row.thumbnail_url ?? null}
            onChange={url => set({ thumbnail_url: url })}
            maxSizeMb={3}
            hint="A preview image shown on the download card."
          />
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold">Status</h3>
          <div className="mt-3">
            <Field label="Visibility">
              <Select value={row.status ?? 'draft'} onChange={e => set({ status: e.target.value as Status })}>
                <option value="draft">Draft (not visible)</option>
                <option value="published">Published (live)</option>
                <option value="unpublished">Unpublished (hidden)</option>
              </Select>
            </Field>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {row.status !== 'published' && <Button onClick={() => save('published')} loading={saving}>Save &amp; publish</Button>}
            <Button variant="secondary" onClick={() => save()} loading={saving}>Save</Button>
            <Link href="/admin/documents" className="btn-ghost text-center">Cancel</Link>
          </div>
        </Card>
        {mode === 'edit' && (
          <Card>
            <h3 className="font-serif text-lg text-ink font-semibold">Danger zone</h3>
            <div className="mt-3"><Button variant="danger" onClick={remove}>Delete document</Button></div>
          </Card>
        )}
      </div>
    </div>
  );
}
