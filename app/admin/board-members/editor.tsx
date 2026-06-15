'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, Select, TextArea, TextInput } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { BoardMember, BoardCategory } from '@/lib/resources/types';

interface Props { mode: 'new' | 'edit'; id?: string }

const CATEGORY_OPTIONS: { value: BoardCategory; label: string; hint: string }[] = [
  { value: 'officers', label: 'Officer',          hint: 'Larger card under "The people stewarding the project". President / Vice President / Secretary, etc.' },
  { value: 'board',    label: 'Board Member',     hint: 'Grid under "Board Members". Voting members.' },
  { value: 'staff',    label: 'Staff or Advisor', hint: 'Grid under "Staff and advisors". Administration, advisors, consultants.' }
];

export function BoardMemberEditor({ mode, id }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [row, setRow] = useState<Partial<BoardMember>>({
    category: 'board',
    title: 'Board Member',
    published: true
  });
  const [loaded, setLoaded] = useState(mode === 'new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    api.list<BoardMember>('board_members', { limit: 1000 }).then(res => {
      if (!res.ok) return toast.push('error', res.error);
      const found = res.data.find(p => p.id === id);
      if (!found) return toast.push('error', 'Person not found');
      setRow(found);
      setLoaded(true);
    });
  }, [mode, id, toast]);

  const set = (patch: Partial<BoardMember>) => setRow(r => ({ ...r, ...patch }));

  async function save() {
    if (!row.name?.trim()) { toast.push('error', 'Name is required.'); return; }
    setSaving(true);
    const res = mode === 'new'
      ? await api.create<BoardMember>('board_members', row)
      : await api.update<BoardMember>('board_members', id!, row);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Saved.');
    if (mode === 'new') router.push(`/admin/board-members/${(res.data as BoardMember).id}`);
  }

  async function remove() {
    if (!id || !confirm('Remove this person from the foundation page? Their photo file stays in storage.')) return;
    const res = await api.remove('board_members', id);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Removed.');
    router.push('/admin/board-members');
  }

  if (!loaded) return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;

  const categoryHint = CATEGORY_OPTIONS.find(c => c.value === (row.category ?? 'board'))?.hint;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" required>
              <TextInput value={row.name ?? ''} onChange={e => set({ name: e.target.value })} placeholder="Jane Doe" />
            </Field>
            <Field label="Title / role label" hint="Shown above their name on the card. e.g. President, Board Member, Advisor.">
              <TextInput value={row.title ?? ''} onChange={e => set({ title: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Group" hint={categoryHint}>
              <Select value={row.category ?? 'board'} onChange={e => set({ category: e.target.value as BoardCategory })}>
                {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </Select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Bio" hint="A short paragraph. Shown on the public card.">
              <TextArea rows={6} value={row.bio ?? ''} onChange={e => set({ bio: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold mb-3">Photo</h3>
          <p className="text-xs text-ink-mute mb-3">A headshot, square works best. Shown as a circle next to the name. Optional — cards without a photo still display cleanly.</p>
          <ImageUploader
            bucket="media"
            value={row.image_url ?? null}
            onChange={url => set({ image_url: url })}
            altText={row.image_alt ?? row.name ?? ''}
            onAltChange={alt => set({ image_alt: alt })}
            maxSizeMb={5}
            hint="JPG or PNG, up to 5 MB. Square crop recommended."
          />
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold">Visibility</h3>
          <label className="mt-3 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              className="h-4 w-4 accent-clay"
              checked={!!row.published}
              onChange={e => set({ published: e.target.checked })}
            />
            Show on the public Foundation page
          </label>
          <p className="mt-2 text-xs text-ink-mute">Uncheck to keep the entry but hide it (useful for departures pending an announcement).</p>
          <div className="mt-5 flex flex-col gap-2">
            <Button onClick={save} loading={saving}>Save</Button>
            <Link href="/admin/board-members" className="btn-ghost text-center">Cancel</Link>
          </div>
        </Card>

        {mode === 'edit' && (
          <Card>
            <h3 className="font-serif text-lg text-ink font-semibold">Danger zone</h3>
            <p className="text-xs text-ink-mute mt-1">Permanently remove this person.</p>
            <div className="mt-3"><Button variant="danger" onClick={remove}>Remove person</Button></div>
          </Card>
        )}
      </div>
    </div>
  );
}
