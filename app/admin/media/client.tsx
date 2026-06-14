'use client';

import { useEffect, useState } from 'react';
import { api, uploadFile } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, EmptyState, Field, TextInput } from '@/components/admin/ui';
import type { MediaLibraryItem } from '@/lib/resources/types';

export function MediaLibraryClient() {
  const toast = useToast();
  const [rows, setRows] = useState<MediaLibraryItem[] | null>(null);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.list<MediaLibraryItem>('media_library', { order: 'created_at', dir: 'desc', limit: 200 })
      .then(res => res.ok ? setRows(res.data) : (toast.push('error', res.error), setRows([])));
  }, [tick, toast]);

  async function upload(file: File | null) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.push('error', 'Files must be under 10 MB.');
    setBusy(true);
    const u = await uploadFile('media', file);
    if ('error' in u) { setBusy(false); return toast.push('error', u.error); }
    const res = await api.create<MediaLibraryItem>('media_library', {
      file_url: u.publicUrl,
      original_filename: file.name,
      mime_type: file.type,
      size_bytes: file.size
    });
    setBusy(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Uploaded.');
    setTick(t => t + 1);
  }

  async function updateAlt(id: string, alt_text: string) {
    const res = await api.update('media_library', id, { alt_text });
    if (!res.ok) toast.push('error', res.error);
  }

  async function remove(id: string) {
    if (!confirm('Remove this image from the library? The file will stay in storage.')) return;
    const res = await api.remove('media_library', id);
    if (!res.ok) return toast.push('error', res.error);
    setTick(t => t + 1);
  }

  return (
    <div>
      <div className="mb-6 card-base p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="block flex-1 cursor-pointer rounded-xl border-2 border-dashed border-sand-deep bg-sand/40 p-4 text-center hover:bg-sand/70 transition-colors">
          <p className="text-sm text-ink-soft">{busy ? 'Uploading…' : 'Drag or browse to upload an image'}</p>
          <input type="file" accept="image/*" className="hidden" onChange={e => upload(e.target.files?.[0] ?? null)} disabled={busy} />
        </label>
        <p className="text-xs text-ink-mute max-w-xs">PNG, JPG, or WEBP. Up to 10 MB. Keep file sizes small so the public site stays fast.</p>
      </div>

      {rows === null ? (
        <div className="card-base p-10 text-center text-sm text-ink-mute">Loading…</div>
      ) : rows.length === 0 ? (
        <EmptyState title="No images uploaded yet" body="Upload your first image above." />
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(r => (
            <li key={r.id} className="card-base overflow-hidden">
              <img src={r.file_url} alt={r.alt_text ?? ''} className="w-full h-44 object-cover bg-sand" loading="lazy" />
              <div className="p-4 space-y-3">
                <Field label="Alt text">
                  <TextInput defaultValue={r.alt_text ?? ''} onBlur={e => updateAlt(r.id, e.target.value)} />
                </Field>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <button onClick={() => { navigator.clipboard.writeText(r.file_url); toast.push('info', 'URL copied.'); }} className="text-teal hover:text-teal-deep underline">Copy URL</button>
                  <Button variant="ghost" onClick={() => remove(r.id)}>Remove</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
