'use client';

import { ResourceTable, type Column } from '@/components/admin/ResourceTable';
import { StatusBadge } from '@/components/admin/ui';
import type { NewsPost } from '@/lib/resources/types';

export function UpdatesListClient() {
  const columns: Column<NewsPost>[] = [
    { key: 'title', header: 'Title', render: r => <span className="font-medium text-ink">{r.title ?? 'Untitled'}</span> },
    { key: 'category', header: 'Category', render: r => <span className="text-ink-soft">{r.category ?? '—'}</span> },
    { key: 'post_date', header: 'Date', width: '140px', render: r => r.post_date ? new Date(r.post_date).toLocaleDateString() : '—' },
    { key: 'status', header: 'Status', width: '100px', render: r => <StatusBadge status={r.status} /> }
  ];
  return (
    <ResourceTable<NewsPost>
      resource="news_posts"
      columns={columns}
      filters={{ status: ['draft','published'] }}
      search={{ placeholder: 'Search updates…' }}
      defaultOrder="created_at"
      defaultDir="desc"
      rowHref={r => `/admin/updates/${r.id}`}
      emptyTitle="No updates yet"
      emptyBody="Create your first foundation update to replace the homepage placeholders."
    />
  );
}
