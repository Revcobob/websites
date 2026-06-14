'use client';

import { useEffect, useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, EmptyState, Field, Select, TextArea, TextInput } from '@/components/admin/ui';
import type { HonorRollEntry } from '@/lib/resources/types';

const BLANK: Partial<HonorRollEntry> = { anonymous: false, published: true, tribute_type: null };

export function HonorRollClient() {
  const toast = useToast();
  const [rows, setRows] = useState<HonorRollEntry[] | null>(null);
  const [tick, setTick] = useState(0);
  const [draft, setDraft] = useState<Partial<HonorRollEntry>>(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<HonorRollEntry>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.list<HonorRollEntry>('honor_roll', { order: 'order_index', dir: 'asc', limit: 500 })
      .then(res => res.ok ? setRows(res.data) : (toast.push('error', res.error), setRows([])));
  }, [tick, toast]);

  async function add() {
    if (!draft.display_name && !draft.anonymous) {
      toast.push('error', 'Enter a name or mark as anonymous.'); return;
    }
    setSaving(true);
    const body: Partial<HonorRollEntry> = {
      ...draft,
      order_index: (rows?.length ?? 0)
    };
    const res = await api.create<HonorRollEntry>('honor_roll', body);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Added.');
    setDraft(BLANK);
    setTick(t => t + 1);
  }

  async function save(id: string) {
    setSaving(true);
    const res = await api.update<HonorRollEntry>('honor_roll', id, edit);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Saved.');
    setEditingId(null); setEdit({});
    setTick(t => t + 1);
  }

  async function move(id: string, dir: 'up' | 'down') {
    const res = await api.reorder('honor_roll', id, dir);
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }

  async function toggle(row: HonorRollEntry) {
    const res = await api.update('honor_roll', row.id, { published: !row.published });
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }

  async function remove(id: string) {
    if (!confirm('Remove this entry?')) return;
    const res = await api.remove('honor_roll', id);
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold">Add an entry</h3>
          <p className="text-xs text-ink-mute mt-1">Donation amounts are never displayed — only the level label is shown if you set one.</p>
          <div className="mt-4 space-y-3">
            <Field label="Display name">
              <TextInput value={draft.display_name ?? ''} onChange={e => setDraft({ ...draft, display_name: e.target.value })} placeholder="Jane &amp; John Doe" />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-clay" checked={!!draft.anonymous} onChange={e => setDraft({ ...draft, anonymous: e.target.checked })} />
              Show as Anonymous
            </label>
            <Field label="Category">
              <TextInput value={draft.category ?? ''} onChange={e => setDraft({ ...draft, category: e.target.value })} placeholder="Founding Contributors" />
            </Field>
            <Field label="Level label (optional)" hint="Shown above the name. Leave blank to hide.">
              <TextInput value={draft.level_label ?? ''} onChange={e => setDraft({ ...draft, level_label: e.target.value })} placeholder="Leadership Gift" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tribute type">
                <Select value={draft.tribute_type ?? ''} onChange={e => setDraft({ ...draft, tribute_type: e.target.value || null })}>
                  <option value="">None</option>
                  <option value="in_honor_of">In honor of</option>
                  <option value="in_memory_of">In memory of</option>
                </Select>
              </Field>
              <Field label="Honoree name">
                <TextInput value={draft.honoree_name ?? ''} onChange={e => setDraft({ ...draft, honoree_name: e.target.value })} />
              </Field>
            </div>
            <Field label="Display note">
              <TextArea rows={2} value={draft.display_note ?? ''} onChange={e => setDraft({ ...draft, display_note: e.target.value })} />
            </Field>
            <Button onClick={add} loading={saving}>Add to honor roll</Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {rows === null
          ? <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>
          : rows.length === 0
            ? <EmptyState title="No honorees yet" body="Use the form on the left to add the first entry." />
            : (
              <ul className="space-y-3">
                {rows.map((r, i) => (
                  <li key={r.id} className={`card-base p-4 ${r.published ? '' : 'opacity-60'}`}>
                    {editingId === r.id ? (
                      <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <TextInput placeholder="Display name" value={edit.display_name ?? r.display_name ?? ''} onChange={e => setEdit({ ...edit, display_name: e.target.value })} />
                          <TextInput placeholder="Level label" value={edit.level_label ?? r.level_label ?? ''} onChange={e => setEdit({ ...edit, level_label: e.target.value })} />
                          <TextInput placeholder="Category" value={edit.category ?? r.category ?? ''} onChange={e => setEdit({ ...edit, category: e.target.value })} />
                          <TextInput placeholder="Honoree name" value={edit.honoree_name ?? r.honoree_name ?? ''} onChange={e => setEdit({ ...edit, honoree_name: e.target.value })} />
                        </div>
                        <TextArea placeholder="Display note" rows={2} value={edit.display_note ?? r.display_note ?? ''} onChange={e => setEdit({ ...edit, display_note: e.target.value })} />
                        <div className="flex gap-2">
                          <Button onClick={() => save(r.id)} loading={saving}>Save</Button>
                          <Button variant="ghost" onClick={() => { setEditingId(null); setEdit({}); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {r.level_label && <p className="text-xs uppercase tracking-wider text-gold-deep font-semibold">{r.level_label}</p>}
                          <p className="font-serif text-lg text-ink font-semibold">{r.anonymous ? 'Anonymous' : (r.display_name || '—')}</p>
                          {(r.tribute_type && r.honoree_name) && <p className="text-xs text-ink-mute italic">{r.tribute_type === 'in_memory_of' ? 'In memory of' : 'In honor of'} {r.honoree_name}</p>}
                          {r.display_note && <p className="text-sm text-ink-soft mt-1">{r.display_note}</p>}
                          {r.category && <p className="text-xs text-ink-mute mt-2">{r.category}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div>
                            <Button variant="ghost" onClick={() => move(r.id, 'up')} disabled={i === 0}>↑</Button>
                            <Button variant="ghost" onClick={() => move(r.id, 'down')} disabled={i === rows.length - 1}>↓</Button>
                          </div>
                          <Button variant="ghost" onClick={() => { setEditingId(r.id); setEdit({}); }}>Edit</Button>
                          <Button variant="ghost" onClick={() => toggle(r)}>{r.published ? 'Hide' : 'Show'}</Button>
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
