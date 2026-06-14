'use client';

import { ResourceTable, type Column } from '@/components/admin/ResourceTable';
import { StatusBadge } from '@/components/admin/ui';
import type { LetterOfSupport } from '@/lib/resources/types';

export function LettersListClient() {
  const columns: Column<LetterOfSupport>[] = [
    { key: 'title', header: 'Title', render: r => <span className="font-medium text-ink">{r.title ?? r.organization ?? 'Untitled'}</span> },
    { key: 'organization', header: 'Organization', render: r => <span className="text-ink-soft">{r.organization ?? '—'}</span> },
    { key: 'category', header: 'Category', render: r => r.category ?? '—' },
    { key: 'featured', header: 'Featured', width: '90px', render: r => r.featured ? <span className="text-gold-deep font-semibold">★</span> : '' },
    { key: 'status', header: 'Status', width: '110px', render: r => <StatusBadge status={r.status} /> }
  ];
  return (
    <ResourceTable<LetterOfSupport>
      resource="letters_of_support"
      columns={columns}
      filters={{ status: ['draft','published','unpublished'] }}
      search={{ placeholder: 'Search letters…' }}
      defaultOrder="order_index"
      defaultDir="asc"
      reorderable
      rowHref={r => `/admin/letters/${r.id}`}
      emptyTitle="No letters yet"
      emptyBody="Upload PDFs or photos of letters of support to feature them on the public Letters of Support page."
    />
  );
}
