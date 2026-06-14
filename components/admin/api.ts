'use client';

export interface ApiOk<T> { ok: true; data: T; count?: number }
export interface ApiErr  { ok: false; error: string }
export type ApiResult<T> = ApiOk<T> | ApiErr;

async function call<T>(method: string, url: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    });
    const json = await res.json().catch(() => ({ ok: false, error: 'Bad response' }));
    if (!res.ok) return { ok: false, error: json?.error ?? `Request failed (${res.status})` };
    return json as ApiResult<T>;
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Network error' };
  }
}

export const api = {
  list:   <T = any>(resource: string, params?: Record<string, string | number | undefined>) => {
    const qs = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    });
    const tail = qs.toString() ? `?${qs}` : '';
    return call<T[]>('GET', `/api/admin/${resource}${tail}`);
  },
  create: <T = any>(resource: string, body: Record<string, any>) =>
    call<T>('POST', `/api/admin/${resource}`, body),
  update: <T = any>(resource: string, id: string | number, patch: Record<string, any>) =>
    call<T>('PATCH', `/api/admin/${resource}`, { id, ...patch }),
  remove: (resource: string, id: string | number) =>
    call<null>('DELETE', `/api/admin/${resource}?id=${encodeURIComponent(String(id))}`),
  reorder: (resource: string, id: string, direction: 'up' | 'down') =>
    call<{ swapped: boolean }>('POST', `/api/admin/${resource}/reorder`, { id, direction }),
  uploadUrl: (bucket: string, filename: string, contentType?: string) =>
    call<{ signedUrl: string; token: string; path: string; publicUrl: string }>('POST', `/api/admin/upload-url`, { bucket, filename, contentType })
};

export async function uploadFile(bucket: string, file: File): Promise<{ publicUrl: string; path: string } | { error: string }> {
  const meta = await api.uploadUrl(bucket, file.name, file.type);
  if (!meta.ok) return { error: meta.error };
  const { signedUrl, publicUrl, path } = meta.data;
  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'content-type': file.type || 'application/octet-stream' },
    body: file
  });
  if (!res.ok) return { error: `Upload failed (${res.status})` };
  return { publicUrl, path };
}
