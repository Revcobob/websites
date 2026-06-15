'use client';

import { ResourceTable, type Column } from '@/components/admin/ResourceTable';
import { StatusBadge } from '@/components/admin/ui';
import type { BoardMember } from '@/lib/resources/types';

const CAT_LABEL: Record<string, string> = {
  officers: 'Officer',
  board: 'Board Member',
  staff: 'Staff / Advisor'
};

export function BoardMembersListClient() {
  const columns: Column<BoardMember>[] = [
    {
      key: 'name',
      header: 'Name',
      render: r => (
        <div className="flex items-center gap-3">
          {r.image_url
            ? <img src={r.image_url} alt={r.image_alt ?? r.name} className="w-9 h-9 rounded-full object-cover border border-sand-deep" />
            : <div className="w-9 h-9 rounded-full bg-sand-deep" aria-hidden="true" />}
          <div>
            <p className="font-medium text-ink">{r.name}</p>
            {r.title && <p className="text-xs text-ink-mute">{r.title}</p>}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Group',
      width: '160px',
      render: r => <span className="text-ink-soft">{CAT_LABEL[r.category] ?? r.category}</span>
    },
    {
      key: 'published',
      header: 'Visible',
      width: '90px',
      render: r => <StatusBadge status={r.published ? 'published' : 'draft'} />
    }
  ];

  return (
    <ResourceTable<BoardMember>
      resource="board_members"
      columns={columns}
      search={{ placeholder: 'Search by name…' }}
      defaultOrder="order_index"
      defaultDir="asc"
      reorderable
      rowHref={r => `/admin/board-members/${r.id}`}
      emptyTitle="No people listed yet"
      emptyBody="Add officers, board members, and staff or advisors here. They appear on the Foundation page in three groups."
    />
  );
}
