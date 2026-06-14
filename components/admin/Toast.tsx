'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clsx } from 'clsx';

type ToastKind = 'success' | 'error' | 'info';
interface Toast { id: number; kind: ToastKind; message: string }

interface ToastCtx { push: (kind: ToastKind, message: string) => void }
const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, kind, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const value = useMemo<ToastCtx>(() => ({ push }), [push]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <div
            key={t.id}
            className={clsx(
              'rounded-lg px-4 py-3 text-sm shadow-lift border',
              t.kind === 'success' && 'bg-sage-pale border-sage/40 text-sage-deep',
              t.kind === 'error'   && 'bg-clay-pale border-clay/40 text-clay-deep',
              t.kind === 'info'    && 'bg-white border-sand-deep text-ink'
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast must be used inside ToastProvider');
  return v;
}
