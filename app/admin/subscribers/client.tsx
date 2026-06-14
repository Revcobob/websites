'use client';

import { ResourceTable, type Column } from '@/components/admin/ResourceTable';
import { Button } from '@/components/admin/ui';
import type { Subscriber } from '@/lib/resources/types';

const SOURCE_LABELS: Record<string, string> = {
  homepage_family:    'Homepage · Stay Informed',
  events_reminders:   'Events page · Reminders',
  'footer:homepage':  'Footer · Homepage',
  'footer:overview':  'Footer · Project Overview',
  'footer:foundation':'Footer · About the Foundation',
  'footer:give':      'Footer · Give',
  'footer:events':    'Footer · Events',
  'footer:contributors': 'Footer · Honor Roll',
  'footer:letters':   'Footer · Letters of Support',
  'footer:resources': 'Footer · Resources',
  'footer:contact':   'Footer · Contact'
};

function prettySource(s: string | null): string {
  if (!s) return '—';
  return SOURCE_LABELS[s] ?? s.replace(/[:_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function SubscribersClient() {
  const columns: Column<Subscriber>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (r) => <span className="font-medium text-ink">{r.email}</span>
    },
    {
      key: 'source',
      header: 'Signup source',
      render: (r) => <span className="text-ink-soft">{prettySource(r.source)}</span>
    },
    {
      key: 'created_at',
      header: 'Signed up',
      width: '180px',
      render: (r) => <span className="text-ink-mute">{new Date(r.created_at).toLocaleString()}</span>
    }
  ];

  return (
    <ResourceTable<Subscriber>
      resource="subscribers"
      columns={columns}
      search={{ placeholder: 'Search by email…' }}
      defaultOrder="created_at"
      defaultDir="desc"
      emptyTitle="No subscribers yet"
      emptyBody="When someone fills out a Stay Informed or footer Subscribe form on the public site, they'll appear here."
      newAction={<a className="btn-secondary" href="/api/admin/subscribers/export">Export CSV</a>}
    />
  );
}
