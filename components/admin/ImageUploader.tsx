'use client';

import { useState } from 'react';
import { uploadFile } from './api';
import { useToast } from './Toast';
import { Button } from './ui';

interface Props {
  bucket: 'letters' | 'documents' | 'media' | 'thumbnails';
  value: string | null;
  onChange: (url: string | null) => void;
  altText?: string | null;
  onAltChange?: (alt: string) => void;
  accept?: string;
  maxSizeMb?: number;
  hint?: string;
}

export function ImageUploader({
  bucket, value, onChange, altText, onAltChange, accept = 'image/*', maxSizeMb = 5, hint
}: Props) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function pick(file: File | null) {
    if (!file) return;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.push('error', `Files must be under ${maxSizeMb} MB.`);
      return;
    }
    setBusy(true);
    const result = await uploadFile(bucket, file);
    setBusy(false);
    if ('error' in result) { toast.push('error', result.error); return; }
    onChange(result.publicUrl);
    toast.push('success', 'Uploaded.');
  }

  return (
    <div>
      {value ? (
        <div className="rounded-xl border border-sand-deep overflow-hidden bg-sand">
          {/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(value)
            ? <img src={value} alt={altText ?? ''} className="w-full max-h-64 object-contain bg-white" />
            : <div className="p-6 text-sm text-ink-soft">{value.split('/').pop()}</div>
          }
          <div className="flex items-center justify-between p-3 bg-white border-t border-sand-deep">
            <a className="text-xs text-teal underline" href={value} target="_blank" rel="noopener">View file</a>
            <Button variant="ghost" onClick={() => onChange(null)}>Remove</Button>
          </div>
        </div>
      ) : (
        <label
          className="block rounded-xl border-2 border-dashed border-sand-deep bg-sand/40 p-6 text-center cursor-pointer hover:bg-sand/70 transition-colors"
        >
          <p className="text-sm text-ink-soft">Drag a file here or <span className="text-teal font-semibold">browse</span></p>
          <p className="text-xs text-ink-mute mt-1">Up to {maxSizeMb} MB</p>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => pick(e.target.files?.[0] ?? null)}
            disabled={busy}
          />
        </label>
      )}
      {onAltChange && (
        <div className="mt-3">
          <label className="label-base">Alt text (for accessibility)</label>
          <input
            type="text"
            value={altText ?? ''}
            onChange={e => onAltChange(e.target.value)}
            className="input-base"
            placeholder="Describe what's in the image"
          />
        </div>
      )}
      {hint && <p className="mt-2 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}
