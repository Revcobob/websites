'use client';

import { useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, TextArea, TextInput } from '@/components/admin/ui';
import type { DonationContent } from '@/lib/resources/types';

const BLANK: DonationContent = {
  id: 1,
  hero_eyebrow: 'Support the Campaign',
  hero_title: 'Help build it.',
  hero_body: 'Every gift moves this closer to opening day.',
  suggested_amounts_cents: [2500, 10000, 25000, 50000, 100000, 250000],
  frequency_labels: [
    { value: 'once',    label: 'One-time' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual',  label: 'Annual' }
  ],
  other_ways_cards: [],
  mailing_address: 'Wood County Health Care Foundation\n405 East Lipscomb St.\nQuitman, TX 75783',
  major_gift_text: '',
  planned_giving_text: '',
  corporate_text: '',
  ein_text: '',
  tax_deductibility_text: 'The Wood County Health Care Foundation is a 501(c)(3) nonprofit. Contributions are tax-deductible to the fullest extent allowed by law.',
  faq: [],
  donate_url: '',
  donate_button_label: 'Give Now',
  contact_link: '/mhlc-contact.html',
  updated_at: new Date().toISOString()
};

export function GivingEditor({ initial }: { initial: DonationContent | null }) {
  const toast = useToast();
  const [data, setData] = useState<DonationContent>(initial ?? BLANK);
  const [saving, setSaving] = useState(false);

  const set = (patch: Partial<DonationContent>) => setData(d => ({ ...d, ...patch }));

  function patchFaq(i: number, patch: Partial<{ question: string; answer: string }>) {
    setData(d => ({ ...d, faq: d.faq.map((f, idx) => idx === i ? { ...f, ...patch } : f) }));
  }
  function addFaq() {
    setData(d => ({ ...d, faq: [...d.faq, { question: '', answer: '' }] }));
  }
  function removeFaq(i: number) {
    setData(d => ({ ...d, faq: d.faq.filter((_, idx) => idx !== i) }));
  }

  function patchAmount(i: number, value: number) {
    setData(d => ({ ...d, suggested_amounts_cents: d.suggested_amounts_cents.map((a, idx) => idx === i ? value : a) }));
  }
  function addAmount() { setData(d => ({ ...d, suggested_amounts_cents: [...d.suggested_amounts_cents, 10000] })); }
  function removeAmount(i: number) { setData(d => ({ ...d, suggested_amounts_cents: d.suggested_amounts_cents.filter((_, idx) => idx !== i) })); }

  async function save() {
    setSaving(true);
    const res = await api.create('donation_content', data);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Donation page saved.');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={save} loading={saving}>Save donation page</Button>
      </div>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Hero section</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Eyebrow"><TextInput value={data.hero_eyebrow ?? ''} onChange={e => set({ hero_eyebrow: e.target.value })} /></Field>
          <Field label="Title"><TextInput value={data.hero_title ?? ''} onChange={e => set({ hero_title: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Body"><TextArea value={data.hero_body ?? ''} onChange={e => set({ hero_body: e.target.value })} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Donate button label"><TextInput value={data.donate_button_label ?? ''} onChange={e => set({ donate_button_label: e.target.value })} /></Field>
          <Field label="Donate URL (where the button goes)"><TextInput value={data.donate_url ?? ''} onChange={e => set({ donate_url: e.target.value })} placeholder="https://…" /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Suggested amounts</h3>
        <p className="text-xs text-ink-mute mt-1">Shown on the donation form. Amounts are stored in cents.</p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {data.suggested_amounts_cents.map((a, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1 flex items-center input-base !p-0 overflow-hidden">
                <span className="px-3 text-ink-mute">$</span>
                <input
                  type="number"
                  className="flex-1 py-2.5 outline-none"
                  value={a / 100}
                  onChange={e => patchAmount(i, Math.round(Number(e.target.value) * 100))}
                />
              </div>
              <Button variant="ghost" onClick={() => removeAmount(i)}>×</Button>
            </div>
          ))}
        </div>
        <Button variant="secondary" className="mt-3" onClick={addAmount}>Add amount</Button>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Other ways to give</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Mailing address (for checks)"><TextArea rows={4} value={data.mailing_address ?? ''} onChange={e => set({ mailing_address: e.target.value })} /></Field>
          <Field label="EIN / 501(c)(3) language"><TextArea rows={4} value={data.ein_text ?? ''} onChange={e => set({ ein_text: e.target.value })} /></Field>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <Field label="Major gift language"><TextArea rows={4} value={data.major_gift_text ?? ''} onChange={e => set({ major_gift_text: e.target.value })} /></Field>
          <Field label="Planned giving language"><TextArea rows={4} value={data.planned_giving_text ?? ''} onChange={e => set({ planned_giving_text: e.target.value })} /></Field>
          <Field label="Corporate sponsorship language"><TextArea rows={4} value={data.corporate_text ?? ''} onChange={e => set({ corporate_text: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Tax-deductibility disclosure">
            <TextArea rows={3} value={data.tax_deductibility_text ?? ''} onChange={e => set({ tax_deductibility_text: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">FAQ</h3>
        <p className="text-xs text-ink-mute mt-1">Common donor questions and answers.</p>
        <ul className="mt-4 space-y-4">
          {data.faq.map((f, i) => (
            <li key={i} className="rounded-lg border border-sand-deep p-4">
              <Field label="Question"><TextInput value={f.question} onChange={e => patchFaq(i, { question: e.target.value })} /></Field>
              <div className="mt-3">
                <Field label="Answer"><TextArea value={f.answer} onChange={e => patchFaq(i, { answer: e.target.value })} /></Field>
              </div>
              <div className="mt-3 text-right">
                <Button variant="ghost" onClick={() => removeFaq(i)}>Remove</Button>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="mt-4" onClick={addFaq}>Add question</Button>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} loading={saving}>Save donation page</Button>
      </div>
    </div>
  );
}
