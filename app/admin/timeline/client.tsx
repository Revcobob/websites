'use client';

import { useEffect, useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, EmptyState, Field, Select, TextArea, TextInput, StatusBadge } from '@/components/admin/ui';
import type { TimelineMilestone, MilestoneStatus } from '@/lib/resources/types';

const BLANK: Partial<TimelineMilestone> = { status: 'upcoming' };

export function TimelineClient() {
  const toast = useToast();
  const [rows, setRows] = useState<TimelineMilestone[] | null>(null);
  const [tick, setTick] = useState(0);
  const [draft, setDraft] = useState<Partial<TimelineMilestone>>(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<TimelineMilestone>>({});

  useEffect(() => {
    api.list<TimelineMilestone>('timeline_milestones', { order: 'order_index', dir: 'asc', limit: 200 })
      .then(res => res.ok ? setRows(res.data) : (toast.push('error', res.error), setRows([])));
  }, [tick, toast]);

  async function add() {
    if (!draft.title) return toast.push('error', 'Title is required.');
    const res = await api.create('timeline_milestones', { ...draft, order_index: rows?.length ?? 0 });
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Added.');
    setDraft(BLANK);
    setTick(t => t + 1);
  }
  async function save(id: string) {
    const res = await api.update('timeline_milestones', id, edit);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Saved.');
    setEditingId(null); setEdit({});
    setTick(t => t + 1);
  }
  async function move(id: string, dir: 'up' | 'down') {
    const res = await api.reorder('timeline_milestones', id, dir);
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }
  async function remove(id: string) {
    if (!confirm('Remove this milestone?')) return;
    const res = await api.remove('timeline_milestones', id);
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <h3 className="font-serif text-lg text-ink font-semibold">Add a milestone</h3>
        <div className="mt-3 space-y-3">
          <Field label="Title" required>
            <TextInput value={draft.title ?? ''} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Groundbreaking" />
          </Field>
          <Field label="Date label" hint="Free text — e.g. “Spring 2026” or “Q3 2025”.">
            <TextInput value={draft.date_label ?? ''} onChange={e => setDraft({ ...draft, date_label: e.target.value })} />
          </Field>
          <Field label="Description">
            <TextArea rows={3} value={draft.description ?? ''} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={draft.status ?? 'upcoming'} onChange={e => setDraft({ ...draft, status: e.target.value as MilestoneStatus })}>
              <option value="upcoming">Upcoming</option>
              <option value="active">In progress</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>
          <Button onClick={add}>Add milestone</Button>
        </div>
      </Card>

      <div className="lg:col-span-2">
        {rows === null
          ? <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>
          : rows.length === 0
            ? <EmptyState title="No milestones yet" body="Add the campaign and project milestones on the left." />
            : (
              <ul className="space-y-3">
                {rows.map((r, i) => (
                  <li key={r.id} className="card-base p-4">
                    {editingId === r.id ? (
                      <div className="space-y-3">
                        <TextInput placeholder="Title" value={edit.title ?? r.title ?? ''} onChange={e => setEdit({ ...edit, title: e.target.value })} />
                        <TextInput placeholder="Date label" value={edit.date_label ?? r.date_label ?? ''} onChange={e => setEdit({ ...edit, date_label: e.target.value })} />
                        <TextArea rows={3} placeholder="Description" value={edit.description ?? r.description ?? ''} onChange={e => setEdit({ ...edit, description: e.target.value })} />
                        <Select value={edit.status ?? r.status} onChange={e => setEdit({ ...edit, status: e.target.value as MilestoneStatus })}>
                          <option value="upcoming">Upcoming</option>
                          <option value="active">In progress</option>
                          <option value="completed">Completed</option>
                        </Select>
                        <div className="flex gap-2">
                          <Button onClick={() => save(r.id)}>Save</Button>
                          <Button variant="ghost" onClick={() => { setEditingId(null); setEdit({}); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2"><StatusBadge status={r.status} /> <p className="text-xs text-ink-mute">{r.date_label ?? ''}</p></div>
                          <p className="mt-2 font-serif text-lg text-ink font-semibold">{r.title}</p>
                          {r.description && <p className="mt-1 text-sm text-ink-soft">{r.description}</p>}
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
