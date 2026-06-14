'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { useToast } from './Toast';
import { Button, EmptyState } from './ui';
import { StatusBadge } from './ui';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface Props<T> {
  resource: string;
  columns: Column<T>[];
  filters?: { status?: string[] };
  search?: { placeholder?: string };
  defaultOrder?: string;
  defaultDir?: 'asc' | 'desc';
  reorderable?: boolean;
  rowHref?: (row: T) => string;
  onRowClick?: (row: T) => void;
  newAction?: React.ReactNode;
  refreshKey?: number;
  emptyTitle?: string;
  emptyBody?: string;
}

export function ResourceTable<T extends { id: string }>({
  resource, columns, filters, search, defaultOrder, defaultDir,
  reorderable, rowHref, onRowClick, newAction, refreshKey, emptyTitle, emptyBody
}: Props<T>) {
  const toast = useToast();
  const [rows, setRows] = useState<T[] | null>(null);
  const [count, setCount] = useState(0);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    api.list<T>(resource, {
      q: q || undefined,
      status: status || undefined,
      order: defaultOrder,
      dir: defaultDir,
      limit: 200
    }).then(res => {
      if (cancel) return;
      if (res.ok) { setRows(res.data); setCount(res.count ?? res.data.length); }
      else { toast.push('error', res.error); setRows([]); }
      setLoading(false);
    });
    return () => { cancel = true; };
  }, [resource, q, status, defaultOrder, defaultDir, refreshKey, tick]); // eslint-disable-line

  async function move(id: string, direction: 'up' | 'down') {
    const res = await api.reorder(resource, id, direction);
    if (!res.ok) { toast.push('error', res.error); return; }
    setTick(t => t + 1);
  }

  async function remove(id: string) {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    const res = await api.remove(resource, id);
    if (!res.ok) { toast.push('error', res.error); return; }
    toast.push('success', 'Deleted.');
    setTick(t => t + 1);
  }

  const hasFilters = (filters?.status?.length ?? 0) > 0;

  if (rows === null) {
    return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;
  }
  if (rows.length === 0 && !q && !status) {
    return (
      <EmptyState
        title={emptyTitle ?? 'Nothing here yet'}
        body={emptyBody}
        action={newAction}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {search && (
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={search.placeholder ?? 'Search…'}
            className="input-base max-w-xs"
          />
        )}
        {hasFilters && (
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-base bg-white max-w-xs">
            <option value="">All statuses</option>
            {filters!.status!.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <span className="text-xs text-ink-mute">{count.toLocaleString()} total</span>
        <div className="ml-auto flex items-center gap-2">{newAction}</div>
      </div>

      <div className="card-base overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sand text-ink-mute text-xs uppercase tracking-wider">
            <tr>
              {columns.map(c => (
                <th key={c.key} className="text-left font-semibold px-4 py-3" style={{ width: c.width }}>{c.header}</th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-deep">
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={onRowClick || rowHref ? 'hover:bg-sand/60 cursor-pointer' : ''}
                onClick={() => {
                  if (rowHref) window.location.href = rowHref(row);
                  else onRowClick?.(row);
                }}
              >
                {columns.map(c => (
                  <td key={c.key} className="px-4 py-3 align-top">{c.render ? c.render(row) : (row as any)[c.key]}</td>
                ))}
                <td className="px-4 py-3 align-top text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  {reorderable && (
                    <>
                      <Button variant="ghost" onClick={() => move(row.id, 'up')} disabled={i === 0} aria-label="Move up">↑</Button>
                      <Button variant="ghost" onClick={() => move(row.id, 'down')} disabled={i === rows.length - 1} aria-label="Move down">↓</Button>
                    </>
                  )}
                  <Button variant="ghost" onClick={() => remove(row.id)} aria-label="Delete">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <p className="mt-3 text-xs text-ink-mute">Loading…</p>}
    </div>
  );
}

export function badge(status: string) { return <StatusBadge status={status} />; }
