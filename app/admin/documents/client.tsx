'use client';

import { ResourceTable, type Column } from '@/components/admin/ResourceTable';
import { StatusBadge } from '@/components/admin/ui';
import type { DocumentItem } from '@/lib/resources/types';

export function DocumentsListClient() {
  const columns: Column<DocumentItem>[] = [
    { key: 'title', header: 'Title', render: r => <span className="font-medium text-ink">{r.title ?? 'Untitled'}</span> },
    { key: 'category', header: 'Category', render: r => r.category ?? '—' },
    { key: 'file_type', header: 'Type', width: '80px', render: r => (r.file_type ?? '').toUpperCase() || '—' },
    { key: 'status', header: 'Status', width: '110px', render: r => <StatusBadge status={r.status} /> }
  ];
  return (
    <ResourceTable<DocumentItem>
      resource="documents"
      columns={columns}
      filters={{ status: ['draft','published','unpublished'] }}
      search={{ placeholder: 'Search documents…' }}
      defaultOrder="order_index"
      defaultDir="asc"
      reorderable
      rowHref={r => `/admin/documents/${r.id}`}
      emptyTitle="No documents yet"
      emptyBody="Upload the project overview, concept deck, maps, and one-pagers to feature them on the public Resources page."
    />
  );
}
