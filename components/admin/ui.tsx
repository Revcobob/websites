'use client';

import { clsx } from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('card-base p-6', className)}>{children}</div>;
}

export function Field({
  label, hint, error, children, required
}: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-base">
        {label} {required && <span className="text-clay">*</span>}
      </span>
      {children}
      {hint && !error && <span className="block mt-1 text-xs text-ink-mute">{hint}</span>}
      {error && <span className="block mt-1 text-xs text-clay">{error}</span>}
    </label>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput(props, ref) {
    return <input ref={ref} {...props} className={clsx('input-base', props.className)} />;
  }
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea(props, ref) {
    return <textarea ref={ref} rows={4} {...props} className={clsx('input-base resize-y', props.className)} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select(props, ref) {
    return <select ref={ref} {...props} className={clsx('input-base bg-white', props.className)} />;
  }
);

export function Button({
  variant = 'primary',
  loading,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; loading?: boolean }) {
  const cls = variant === 'primary' ? 'btn-primary'
            : variant === 'secondary' ? 'btn-secondary'
            : variant === 'danger' ? 'btn-danger'
            : 'btn-ghost';
  return (
    <button {...rest} disabled={rest.disabled || loading} className={clsx(cls, rest.className)}>
      {loading && (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-r-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = {
    draft:        'bg-sand-deep text-ink-mute',
    published:    'bg-sage-pale text-sage-deep',
    unpublished:  'bg-clay-pale text-clay-deep',
    canceled:     'bg-clay-pale text-clay-deep',
    past:         'bg-sand-deep text-ink-mute',
    upcoming:     'bg-gold-pale text-gold-deep',
    active:       'bg-teal-pale text-teal-deep',
    completed:    'bg-sage-pale text-sage-deep',
    new:          'bg-gold-pale text-gold-deep',
    read:         'bg-sand-deep text-ink-mute',
    archived:     'bg-sand-deep text-ink-mute'
  }[status] ?? 'bg-sand-deep text-ink-mute';
  return (
    <span className={clsx('inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full', tone)}>
      {status}
    </span>
  );
}

export function EmptyState({
  title, body, action
}: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="card-base p-10 text-center">
      <p className="font-serif text-xl text-ink font-semibold">{title}</p>
      {body && <p className="mt-2 text-sm text-ink-mute max-w-md mx-auto">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageActions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 mb-4">{children}</div>;
}
