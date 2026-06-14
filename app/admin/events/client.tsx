'use client';

import { ResourceTable, type Column } from '@/components/admin/ResourceTable';
import { StatusBadge } from '@/components/admin/ui';
import type { EventItem } from '@/lib/resources/types';

export function EventsListClient() {
  const columns: Column<EventItem>[] = [
    { key: 'title', header: 'Title', render: r => <span className="font-medium text-ink">{r.title ?? 'Untitled'}</span> },
    { key: 'event_date', header: 'Date', width: '160px', render: r => r.event_date ? new Date(r.event_date).toLocaleDateString() : '—' },
    { key: 'location', header: 'Location', render: r => <span className="text-ink-soft">{r.location ?? '—'}</span> },
    { key: 'status', header: 'Status', width: '110px', render: r => <StatusBadge status={r.status} /> }
  ];
  return (
    <ResourceTable<EventItem>
      resource="events"
      columns={columns}
      filters={{ status: ['draft','published','canceled','past'] }}
      search={{ placeholder: 'Search events…' }}
      defaultOrder="event_date"
      defaultDir="desc"
      rowHref={r => `/admin/events/${r.id}`}
      emptyTitle="No events yet"
      emptyBody="Create your first event to populate the public Events page."
    />
  );
}
