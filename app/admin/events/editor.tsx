'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, Select, TextArea, TextInput } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { EventItem, EventStatus } from '@/lib/resources/types';

interface Props { mode: 'new' | 'edit'; id?: string }

const STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'draft',     label: 'Draft (not visible)' },
  { value: 'published', label: 'Published (live)' },
  { value: 'canceled',  label: 'Canceled' },
  { value: 'past',      label: 'Past event' }
];

const blank: Partial<EventItem> = {
  status: 'draft',
  timezone: 'America/Chicago',
  category: 'Foundation event'
};

export function EventEditor({ mode, id }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [row, setRow] = useState<Partial<EventItem>>(blank);
  const [loaded, setLoaded] = useState(mode === 'new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    api.list<EventItem>('events', { order: 'created_at', dir: 'desc', limit: 1000 }).then(res => {
      if (!res.ok) { toast.push('error', res.error); return; }
      const found = res.data.find(e => e.id === id);
      if (!found) { toast.push('error', 'Event not found'); return; }
      setRow(found);
      setLoaded(true);
    });
  }, [mode, id, toast]);

  const set = (patch: Partial<EventItem>) => setRow(r => ({ ...r, ...patch }));

  async function save(nextStatus?: EventStatus) {
    setSaving(true);
    const body: Partial<EventItem> = { ...row };
    if (nextStatus) body.status = nextStatus;
    if (!body.title?.trim()) { toast.push('error', 'Title is required.'); setSaving(false); return; }
    const res = mode === 'new'
      ? await api.create<EventItem>('events', body)
      : await api.update<EventItem>('events', id!, body);
    setSaving(false);
    if (!res.ok) { toast.push('error', res.error); return; }
    toast.push('success', 'Saved.');
    if (mode === 'new') router.push(`/admin/events/${(res.data as EventItem).id}`);
  }

  async function remove() {
    if (!id || !confirm('Delete this event permanently?')) return;
    const res = await api.remove('events', id);
    if (!res.ok) { toast.push('error', res.error); return; }
    toast.push('success', 'Deleted.');
    router.push('/admin/events');
  }

  if (!loaded) return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <Field label="Title" required>
            <TextInput value={row.title ?? ''} onChange={e => set({ title: e.target.value })} placeholder="Spring 2026 Caregiver Gathering" />
          </Field>
          <div className="mt-4">
            <Field label="Short description" hint="A one-paragraph summary shown on the event card.">
              <TextArea value={row.description ?? ''} onChange={e => set({ description: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <Field label="Date" required>
              <TextInput type="date" value={row.event_date ?? ''} onChange={e => set({ event_date: e.target.value })} />
            </Field>
            <Field label="Start time">
              <TextInput type="time" value={row.start_time ?? ''} onChange={e => set({ start_time: e.target.value })} />
            </Field>
            <Field label="End time">
              <TextInput type="time" value={row.end_time ?? ''} onChange={e => set({ end_time: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Location" hint="A venue name and city, e.g. “Quitman Senior Center, Quitman, TX”.">
              <TextInput value={row.location ?? ''} onChange={e => set({ location: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Category">
              <TextInput value={row.category ?? ''} onChange={e => set({ category: e.target.value })} placeholder="Foundation event / Caregiver workshop" />
            </Field>
            <Field label="Registration or details URL">
              <TextInput value={row.registration_url ?? ''} onChange={e => set({ registration_url: e.target.value })} placeholder="https://…" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Capacity (optional)">
              <TextInput type="number" value={row.capacity ?? ''} onChange={e => set({ capacity: e.target.value ? Number(e.target.value) : null })} />
            </Field>
            <Field label="Contact email (optional)">
              <TextInput type="email" value={row.contact_email ?? ''} onChange={e => set({ contact_email: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold mb-3">Featured image</h3>
          <ImageUploader
            bucket="media"
            value={row.image_url ?? null}
            onChange={url => set({ image_url: url })}
          />
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold">Status</h3>
          <p className="text-xs text-ink-mute mt-1">Draft events are saved but not visible to the public.</p>
          <div className="mt-3">
            <Select value={row.status ?? 'draft'} onChange={e => set({ status: e.target.value as EventStatus })}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {row.status !== 'published' && <Button onClick={() => save('published')} loading={saving}>Save &amp; publish</Button>}
            <Button variant="secondary" onClick={() => save()} loading={saving}>Save</Button>
            <Link href="/admin/events" className="btn-ghost text-center">Cancel</Link>
          </div>
        </Card>
        {mode === 'edit' && (
          <Card>
            <h3 className="font-serif text-lg text-ink font-semibold">Danger zone</h3>
            <p className="text-xs text-ink-mute mt-1">Permanently remove this event.</p>
            <div className="mt-3"><Button variant="danger" onClick={remove}>Delete event</Button></div>
          </Card>
        )}
      </div>
    </div>
  );
}
