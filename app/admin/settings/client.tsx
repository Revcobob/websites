'use client';

import { useState } from 'react';
import { api } from '@/components/admin/api';
import { useToast } from '@/components/admin/Toast';
import { Button, Card, Field, TextArea, TextInput } from '@/components/admin/ui';
import type { SiteSettings } from '@/lib/resources/types';

const BLANK: SiteSettings = {
  id: 1,
  organization_name: 'Wood County Health Care Foundation',
  project_name: 'Memory Health Life Center',
  foundation_name: 'Wood County Health Care Foundation',
  ein: '',
  primary_email: '',
  primary_phone: '(903) 760-9224',
  mailing_address: '405 East Lipscomb St.\nQuitman, TX 75783',
  donate_url: '',
  default_cta_label: 'Donate',
  default_cta_href: '/mhlc-give.html',
  main_nav: [],
  footer_nav: [],
  footer_org_description: '',
  footer_subscribe_text: 'Get monthly updates as the center is built.',
  social_links: [],
  default_seo_image: '',
  updated_at: new Date().toISOString()
};

export function SettingsClient({ initial }: { initial: SiteSettings | null }) {
  const toast = useToast();
  const [data, setData] = useState<SiteSettings>(initial ?? BLANK);
  const [saving, setSaving] = useState(false);

  const set = (patch: Partial<SiteSettings>) => setData(d => ({ ...d, ...patch }));

  function setSocial(i: number, p: Partial<{ platform: string; url: string }>) {
    setData(d => ({ ...d, social_links: d.social_links.map((s, idx) => idx === i ? { ...s, ...p } : s) }));
  }
  function addSocial() { setData(d => ({ ...d, social_links: [...d.social_links, { platform: '', url: '' }] })); }
  function removeSocial(i: number) { setData(d => ({ ...d, social_links: d.social_links.filter((_, idx) => idx !== i) })); }

  function setMainNav(i: number, p: Partial<{ label: string; href: string }>) {
    setData(d => ({ ...d, main_nav: d.main_nav.map((n, idx) => idx === i ? { ...n, ...p } : n) }));
  }
  function addMainNav() { setData(d => ({ ...d, main_nav: [...d.main_nav, { label: '', href: '' }] })); }
  function removeMainNav(i: number) { setData(d => ({ ...d, main_nav: d.main_nav.filter((_, idx) => idx !== i) })); }

  async function save() {
    setSaving(true);
    const res = await api.create('site_settings', data);
    setSaving(false);
    if (!res.ok) return toast.push('error', res.error);
    toast.push('success', 'Settings saved.');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={save} loading={saving}>Save settings</Button>
      </div>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Organization</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Organization name"><TextInput value={data.organization_name ?? ''} onChange={e => set({ organization_name: e.target.value })} /></Field>
          <Field label="Project name"><TextInput value={data.project_name ?? ''} onChange={e => set({ project_name: e.target.value })} /></Field>
          <Field label="Foundation name"><TextInput value={data.foundation_name ?? ''} onChange={e => set({ foundation_name: e.target.value })} /></Field>
          <Field label="EIN"><TextInput value={data.ein ?? ''} onChange={e => set({ ein: e.target.value })} /></Field>
          <Field label="Primary email"><TextInput type="email" value={data.primary_email ?? ''} onChange={e => set({ primary_email: e.target.value })} /></Field>
          <Field label="Primary phone"><TextInput value={data.primary_phone ?? ''} onChange={e => set({ primary_phone: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Mailing address"><TextArea rows={3} value={data.mailing_address ?? ''} onChange={e => set({ mailing_address: e.target.value })} /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Donate button</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Default donate button label"><TextInput value={data.default_cta_label ?? ''} onChange={e => set({ default_cta_label: e.target.value })} /></Field>
          <Field label="Donate URL (used everywhere)"><TextInput value={data.donate_url ?? ''} onChange={e => set({ donate_url: e.target.value })} placeholder="https://…" /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Footer</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Footer description"><TextArea rows={3} value={data.footer_org_description ?? ''} onChange={e => set({ footer_org_description: e.target.value })} /></Field>
          <Field label="Subscribe prompt text"><TextArea rows={3} value={data.footer_subscribe_text ?? ''} onChange={e => set({ footer_subscribe_text: e.target.value })} /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Main navigation</h3>
        <p className="text-xs text-ink-mute mt-1">Links shown in the public header.</p>
        <ul className="mt-4 space-y-2">
          {data.main_nav.map((n, i) => (
            <li key={i} className="flex gap-2">
              <TextInput placeholder="Label" value={n.label} onChange={e => setMainNav(i, { label: e.target.value })} />
              <TextInput placeholder="Link" value={n.href} onChange={e => setMainNav(i, { href: e.target.value })} />
              <Button variant="ghost" onClick={() => removeMainNav(i)}>×</Button>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="mt-3" onClick={addMainNav}>Add link</Button>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">Social links</h3>
        <ul className="mt-4 space-y-2">
          {data.social_links.map((s, i) => (
            <li key={i} className="flex gap-2">
              <TextInput placeholder="Platform" value={s.platform} onChange={e => setSocial(i, { platform: e.target.value })} />
              <TextInput placeholder="URL" value={s.url} onChange={e => setSocial(i, { url: e.target.value })} />
              <Button variant="ghost" onClick={() => removeSocial(i)}>×</Button>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="mt-3" onClick={addSocial}>Add social link</Button>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-ink font-semibold">SEO defaults</h3>
        <Field label="Default share image (Open Graph)" hint="Used by pages that don't set their own.">
          <TextInput value={data.default_seo_image ?? ''} onChange={e => set({ default_seo_image: e.target.value })} placeholder="https://…" />
        </Field>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} loading={saving}>Save settings</Button>
      </div>
    </div>
  );
}
