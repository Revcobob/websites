'use client';

import { useEffect, useState } from 'react';
import { api } from '@/components/admin/api';
import { Button, EmptyState, StatusBadge } from '@/components/admin/ui';
import { useToast } from '@/components/admin/Toast';
import type { ContactInquiry } from '@/lib/resources/types';

export function ContactClient() {
  const toast = useToast();
  const [rows, setRows] = useState<ContactInquiry[] | null>(null);
  const [open, setOpen] = useState<ContactInquiry | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    api.list<ContactInquiry>('contact_inquiries', { order: 'created_at', dir: 'desc', limit: 200 })
      .then(res => res.ok ? setRows(res.data) : (toast.push('error', res.error), setRows([])));
  }, [tick, toast]);

  async function setStatus(id: string, status: ContactInquiry['status']) {
    const res = await api.update<ContactInquiry>('contact_inquiries', id, { status });
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Updated.');
    setTick(t => t + 1);
    if (open && open.id === id) setOpen({ ...open, status });
  }

  async function remove(id: string) {
    if (!confirm('Delete this inquiry permanently?')) return;
    const res = await api.remove('contact_inquiries', id);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Deleted.');
    setOpen(null);
    setTick(t => t + 1);
  }

  if (rows === null) return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;
  if (rows.length === 0) {
    return <EmptyState
      title="No inquiries yet"
      body="Messages from the public Contact form will appear here."
      action={<a className="btn-secondary" href="/api/admin/inquiries/export?kind=contact">Export CSV</a>}
    />;
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <a className="btn-secondary" href="/api/admin/inquiries/export?kind=contact">Export CSV</a>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ul className="card-base divide-y divide-sand-deep">
            {rows.map(r => (
              <li
                key={r.id}
                className={`px-4 py-3 cursor-pointer ${open?.id === r.id ? 'bg-sand' : 'hover:bg-sand/60'}`}
                onClick={() => setOpen(r)}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-ink text-sm">{r.first_name} {r.last_name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-ink-mute mt-1">{r.email}</p>
                <p className="text-xs text-ink-mute mt-1">{new Date(r.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          {open ? (
            <div className="card-base p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-clay font-semibold">{open.topic ?? 'Inquiry'}</p>
                  <h2 className="font-serif text-xl text-ink font-semibold mt-2">{open.first_name} {open.last_name}</h2>
                  <p className="text-sm text-ink-soft mt-1"><a href={`mailto:${open.email}`} className="underline">{open.email}</a> {open.phone && <>· {open.phone}</>}</p>
                  <p className="text-xs text-ink-mute mt-1">{new Date(open.created_at).toLocaleString()}{open.source_page ? ` · from ${open.source_page}` : ''}</p>
                </div>
                <StatusBadge status={open.status} />
              </div>
              <div className="mt-6 rounded-lg bg-sand p-4 text-sm whitespace-pre-wrap text-ink leading-relaxed">{open.message}</div>
              <div className="mt-6 flex flex-wrap gap-2">
                {open.status !== 'read'     && <Button variant="secondary" onClick={() => setStatus(open.id, 'read')}>Mark as read</Button>}
                {open.status !== 'archived' && <Button variant="secondary" onClick={() => setStatus(open.id, 'archived')}>Archive</Button>}
                {open.status === 'archived' && <Button variant="secondary" onClick={() => setStatus(open.id, 'new')}>Reopen</Button>}
                <Button variant="danger" onClick={() => remove(open.id)}>Delete</Button>
              </div>
            </div>
          ) : (
            <div className="card-base p-10 text-center text-sm text-ink-mute">Select an inquiry from the list to view it.</div>
          )}
        </div>
      </div>
    </div>
  );
}
