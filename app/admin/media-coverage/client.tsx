'use client';

import { useEffect, useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, EmptyState, Field, TextArea, TextInput } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { MediaCoverageItem } from '@/lib/resources/types';

const BLANK: Partial<MediaCoverageItem> = {};

export function MediaCoverageClient() {
  const toast = useToast();
  const [rows, setRows] = useState<MediaCoverageItem[] | null>(null);
  const [tick, setTick] = useState(0);
  const [draft, setDraft] = useState<Partial<MediaCoverageItem>>(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<MediaCoverageItem>>({});

  useEffect(() => {
    api.list<MediaCoverageItem>('media_coverage', { order: 'order_index', dir: 'asc', limit: 200 })
      .then(res => res.ok ? setRows(res.data) : (toast.push('error', res.error), setRows([])));
  }, [tick, toast]);

  async function add() {
    if (!draft.headline) return toast.push('error', 'Headline is required.');
    const res = await api.create('media_coverage', { ...draft, order_index: rows?.length ?? 0 });
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Added.');
    setDraft(BLANK);
    setTick(t => t + 1);
  }
  async function save(id: string) {
    const res = await api.update('media_coverage', id, edit);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Saved.');
    setEditingId(null); setEdit({});
    setTick(t => t + 1);
  }
  async function move(id: string, dir: 'up' | 'down') {
    const res = await api.reorder('media_coverage', id, dir);
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }
  async function remove(id: string) {
    if (!confirm('Remove this article?')) return;
    const res = await api.remove('media_coverage', id);
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <h3 className="font-serif text-lg text-ink font-semibold">Add a press item</h3>
        <div className="mt-3 space-y-3">
          <Field label="Source name"><TextInput value={draft.source_name ?? ''} onChange={e => setDraft({ ...draft, source_name: e.target.value })} placeholder="Texas Tribune" /></Field>
          <Field label="Headline"><TextInput value={draft.headline ?? ''} onChange={e => setDraft({ ...draft, headline: e.target.value })} /></Field>
          <Field label="Summary"><TextArea rows={2} value={draft.summary ?? ''} onChange={e => setDraft({ ...draft, summary: e.target.value })} /></Field>
          <Field label="Publication date"><TextInput type="date" value={draft.publication_date ?? ''} onChange={e => setDraft({ ...draft, publication_date: e.target.value })} /></Field>
          <Field label="External URL"><TextInput value={draft.external_url ?? ''} onChange={e => setDraft({ ...draft, external_url: e.target.value })} placeholder="https://…" /></Field>
          <Field label="Image">
            <ImageUploader bucket="media" value={draft.image_url ?? null} onChange={url => setDraft({ ...draft, image_url: url ?? undefined })} />
          </Field>
          <Button onClick={add}>Add article</Button>
        </div>
      </Card>

      <div className="lg:col-span-2">
        {rows === null
          ? <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>
          : rows.length === 0
            ? <EmptyState title="No press coverage yet" body="Add the first article on the left." />
            : (
              <ul className="space-y-3">
                {rows.map((r, i) => (
                  <li key={r.id} className="card-base p-4">
                    {editingId === r.id ? (
                      <div className="space-y-3">
                        <TextInput placeholder="Source" value={edit.source_name ?? r.source_name ?? ''} onChange={e => setEdit({ ...edit, source_name: e.target.value })} />
                        <TextInput placeholder="Headline" value={edit.headline ?? r.headline ?? ''} onChange={e => setEdit({ ...edit, headline: e.target.value })} />
                        <TextArea rows={2} placeholder="Summary" value={edit.summary ?? r.summary ?? ''} onChange={e => setEdit({ ...edit, summary: e.target.value })} />
                        <TextInput type="date" value={edit.publication_date ?? r.publication_date ?? ''} onChange={e => setEdit({ ...edit, publication_date: e.target.value })} />
                        <TextInput placeholder="URL" value={edit.external_url ?? r.external_url ?? ''} onChange={e => setEdit({ ...edit, external_url: e.target.value })} />
                        <ImageUploader bucket="media" value={edit.image_url ?? r.image_url ?? null} onChange={url => setEdit({ ...edit, image_url: url })} />
                        <div className="flex gap-2">
                          <Button onClick={() => save(r.id)}>Save</Button>
                          <Button variant="ghost" onClick={() => { setEditingId(null); setEdit({}); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.18em] text-clay font-semibold">{r.source_name ?? '—'}</p>
                          <p className="mt-1 font-serif text-lg text-ink font-semibold">{r.headline}</p>
                          {r.publication_date && <p className="text-xs text-ink-mute mt-1">{new Date(r.publication_date).toLocaleDateString()}</p>}
                          {r.summary && <p className="text-sm text-ink-soft mt-2">{r.summary}</p>}
                          {r.external_url && <a className="text-xs text-teal underline mt-2 inline-block" href={r.external_url} target="_blank" rel="noopener">{r.external_url}</a>}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div>
                            <Button variant="ghost" onClick={() => move(r.id, 'up')} disabled={i === 0}>↑</Button>
                            <Button variant="ghost" onClick={() => move(r.id, 'down')} disabled={i === rows.length - 1}>↓</Button>
                          </div>
                          <Button variant="ghost" onClick={() => { setEditingId(r.id); setEdit({}); }}>Edit</Button>
                          <Button variant="ghost" onClick={() => remove(r.id)}>Delete</Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )
        }
      </div>
    </div>
  );
}
