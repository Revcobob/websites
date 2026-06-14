'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, Select, TextArea, TextInput } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { NewsPost } from '@/lib/resources/types';

interface Props { mode: 'new' | 'edit'; id?: string }

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
}

export function UpdateEditor({ mode, id }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [row, setRow] = useState<Partial<NewsPost>>({ status: 'draft', category: 'Foundation update' });
  const [loaded, setLoaded] = useState(mode === 'new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    api.list<NewsPost>('news_posts', { limit: 1000 }).then(res => {
      if (!res.ok) return toast.push('error', res.error);
      const found = res.data.find(p => p.id === id);
      if (!found) return toast.push('error', 'Update not found');
      setRow(found); setLoaded(true);
    });
  }, [mode, id, toast]);

  const set = (patch: Partial<NewsPost>) => setRow(r => ({ ...r, ...patch }));

  async function save(publish: boolean) {
    setSaving(true);
    const body: Partial<NewsPost> = { ...row };
    if (!body.title?.trim()) { toast.push('error', 'Title is required.'); setSaving(false); return; }
    if (!body.slug) body.slug = slugify(body.title);
    if (publish) {
      body.status = 'published';
      body.published_at = body.published_at ?? new Date().toISOString();
    }
    const res = mode === 'new'
      ? await api.create<NewsPost>('news_posts', body)
      : await api.update<NewsPost>('news_posts', id!, body);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', publish ? 'Published.' : 'Saved.');
    if (mode === 'new') router.push(`/admin/updates/${(res.data as NewsPost).id}`);
  }

  async function unpublish() {
    if (!id) return;
    const res = await api.update<NewsPost>('news_posts', id, { status: 'draft' });
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Moved to drafts.');
    setRow(r => ({ ...r, status: 'draft' }));
  }

  async function remove() {
    if (!id || !confirm('Delete this update permanently?')) return;
    const res = await api.remove('news_posts', id);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Deleted.');
    router.push('/admin/updates');
  }

  if (!loaded) return <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <Field label="Title" required>
            <TextInput value={row.title ?? ''} onChange={e => set({ title: e.target.value })} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Category">
              <TextInput value={row.category ?? ''} onChange={e => set({ category: e.target.value })} placeholder="Foundation update / Media coverage" />
            </Field>
            <Field label="Display date">
              <TextInput type="date" value={row.post_date ?? ''} onChange={e => set({ post_date: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Summary" hint="One sentence — shown on cards and at the top of the article.">
              <TextArea rows={2} value={row.summary ?? ''} onChange={e => set({ summary: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Body" hint="Markdown — headings, lists, links, bold/italic supported.">
              <TextArea rows={14} value={row.body_md ?? ''} onChange={e => set({ body_md: e.target.value })} className="font-mono text-xs" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="External URL (optional)" hint="If this update links to an external article instead of an internal post.">
              <TextInput value={row.external_url ?? ''} onChange={e => set({ external_url: e.target.value })} placeholder="https://…" />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold mb-3">Featured image</h3>
          <ImageUploader
            bucket="media"
            value={row.image_url ?? null}
            onChange={url => set({ image_url: url })}
          />
        </Card>

        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold">Search & social</h3>
          <p className="text-xs text-ink-mute mt-1">Used when this update is shared on Google or social media. Leave blank to use the title and summary.</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="SEO title">
              <TextInput value={row.seo_title ?? ''} onChange={e => set({ seo_title: e.target.value })} />
            </Field>
            <Field label="OG image URL">
              <TextInput value={row.og_image ?? ''} onChange={e => set({ og_image: e.target.value })} placeholder="https://…" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="SEO description">
              <TextArea rows={2} value={row.seo_description ?? ''} onChange={e => set({ seo_description: e.target.value })} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-serif text-lg text-ink font-semibold">Status</h3>
          <p className="text-xs text-ink-mute mt-1">{row.status === 'published' ? 'This update is live.' : 'This update is a draft.'}</p>
          <div className="mt-5 flex flex-col gap-2">
            {row.status !== 'published'
              ? <Button onClick={() => save(true)}  loading={saving}>Publish</Button>
              : <Button variant="secondary" onClick={unpublish}>Move to drafts</Button>}
            <Button variant="secondary" onClick={() => save(false)} loading={saving}>Save draft</Button>
            <Link href="/admin/updates" className="btn-ghost text-center">Cancel</Link>
          </div>
        </Card>
        {mode === 'edit' && (
          <Card>
            <h3 className="font-serif text-lg text-ink font-semibold">Danger zone</h3>
            <div className="mt-3"><Button variant="danger" onClick={remove}>Delete update</Button></div>
          </Card>
        )}
      </div>
    </div>
  );
}
