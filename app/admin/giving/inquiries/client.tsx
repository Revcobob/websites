'use client';

import { useEffect, useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, EmptyState, StatusBadge } from '@/components/admin/ui';
import type { DonationInquiry } from '@/lib/resources/types';

function fmtCents(c: number | null): string {
  if (!c) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c / 100);
}

export function DonationInquiriesClient() {
  const toast = useToast();
  const [rows, setRows] = useState<DonationInquiry[] | null>(null);
  const [open, setOpen] = useState<DonationInquiry | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    api.list<DonationInquiry>('donation_inquiries', { order: 'created_at', dir: 'desc', limit: 200 })
      .then(res => res.ok ? setRows(res.data) : (toast.push('error', res.error), setRows([])));
  }, [tick, toast]);

  async function setStatus(id: string, status: DonationInquiry['status']) {
    const res = await api.update<DonationInquiry>('donation_inquiries', id, { status });
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
    if (open?.id === id) setOpen({ ...open, status });
  }

  async function remove(id: string) {
    if (!confirm('Delete this inquiry permanently?')) return;
    const res = await api.remove('donation_inquiries', id);
    if (!res.ok) return toast.push('error', res.error);
    setOpen(null); setTick(t => t + 1);
  }

  if (rows === null) return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;
  if (rows.length === 0) return <EmptyState title="No donation inquiries yet" body="When someone submits the donation form, the non-payment details show up here." action={<a className="btn-secondary" href="/api/admin/inquiries/export?kind=donation">Export CSV</a>} />;

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <a className="btn-secondary" href="/api/admin/inquiries/export?kind=donation">Export CSV</a>
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
                  <p className="font-medium text-ink text-sm">{r.anonymous ? 'Anonymous donor' : `${r.first_name ?? ''} ${r.last_name ?? ''}`}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-ink-mute mt-1">{fmtCents(r.amount_cents)} · {r.frequency ?? 'one-time'}</p>
                <p className="text-xs text-ink-mute mt-1">{new Date(r.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          {open ? (
            <div className="card-base p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-clay font-semibold">Donation inquiry</p>
                  <h2 className="font-serif text-xl text-ink font-semibold mt-2">
                    {open.anonymous ? 'Anonymous donor' : `${open.first_name ?? ''} ${open.last_name ?? ''}`}
                  </h2>
                  {!open.anonymous && (
                    <p className="text-sm text-ink-soft mt-1">
                      <a href={`mailto:${open.email}`} className="underline">{open.email}</a>
                      {open.phone && <> · {open.phone}</>}
                    </p>
                  )}
                  <p className="text-xs text-ink-mute mt-1">{new Date(open.created_at).toLocaleString()}{open.source_page ? ` · from ${open.source_page}` : ''}</p>
                </div>
                <StatusBadge status={open.status} />
              </div>
              <dl className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                <Pair label="Amount" value={fmtCents(open.amount_cents)} />
                <Pair label="Frequency" value={open.frequency ?? '—'} />
                <Pair label="Tribute" value={open.tribute_type ? `${open.tribute_type.replace('_', ' ')}: ${open.tribute_name ?? '—'}` : '—'} />
                <Pair label="Anonymous" value={open.anonymous ? 'Yes' : 'No'} />
              </dl>
              {open.message && (
                <div className="mt-6 rounded-lg bg-sand p-4 text-sm whitespace-pre-wrap text-ink leading-relaxed">{open.message}</div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                {open.status !== 'read'     && <Button variant="secondary" onClick={() => setStatus(open.id, 'read')}>Mark as read</Button>}
                {open.status !== 'archived' && <Button variant="secondary" onClick={() => setStatus(open.id, 'archived')}>Archive</Button>}
                <Button variant="danger" onClick={() => remove(open.id)}>Delete</Button>
              </div>
            </div>
          ) : (
            <div className="card-base p-10 text-center text-sm text-ink-mute">Select an inquiry to view its details.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-ink-mute font-semibold">{label}</dt>
      <dd className="text-ink mt-1">{value}</dd>
    </div>
  );
}
