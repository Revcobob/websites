import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

interface NavItem { href: string; label: string; group: string; }
const NAV: NavItem[] = [
  { href: '/admin/dashboard',     label: 'Dashboard',          group: 'overview' },
  { href: '/admin/pages',         label: 'Page Content',       group: 'content' },
  { href: '/admin/updates',       label: 'Project Updates',    group: 'content' },
  { href: '/admin/events',        label: 'Events',             group: 'content' },
  { href: '/admin/timeline',      label: 'Project Timeline',   group: 'content' },
  { href: '/admin/honor-roll',    label: 'Honor Roll',         group: 'campaign' },
  { href: '/admin/giving',        label: 'Donation Page',      group: 'campaign' },
  { href: '/admin/giving/inquiries', label: 'Donation Inquiries', group: 'campaign' },
  { href: '/admin/letters',       label: 'Letters of Support', group: 'library' },
  { href: '/admin/documents',     label: 'Documents',          group: 'library' },
  { href: '/admin/media-coverage',label: 'Media Coverage',     group: 'library' },
  { href: '/admin/media',         label: 'Media Library',      group: 'library' },
  { href: '/admin/subscribers',   label: 'Email Subscribers',  group: 'people' },
  { href: '/admin/contact',       label: 'Contact Inquiries',  group: 'people' },
  { href: '/admin/seo',           label: 'SEO Settings',       group: 'settings' },
  { href: '/admin/settings',      label: 'Site Settings',      group: 'settings' }
];

const GROUPS: { key: string; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'content',  label: 'Public Content' },
  { key: 'campaign', label: 'Campaign' },
  { key: 'library',  label: 'Library' },
  { key: 'people',   label: 'People' },
  { key: 'settings', label: 'Settings' }
];

export function AdminShell({
  title, subtitle, actions, children
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand text-ink">
      <div className="flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-sand-deep bg-white min-h-screen">
          <div className="p-6 border-b border-sand-deep">
            <Link href="/admin/dashboard" className="block">
              <p className="text-xs uppercase tracking-[0.18em] text-clay font-semibold">Foundation CMS</p>
              <p className="mt-1 font-serif text-lg text-ink font-semibold leading-tight">Memory Health Life Center</p>
            </Link>
          </div>
          <nav className="px-3 py-4">
            {GROUPS.map(g => {
              const items = NAV.filter(n => n.group === g.key);
              if (items.length === 0) return null;
              return (
                <div key={g.key} className="mb-5">
                  <p className="px-3 text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-mute mb-1.5">{g.label}</p>
                  <ul>
                    {items.map(n => (
                      <li key={n.href}>
                        <Link
                          href={n.href}
                          className="block px-3 py-2 rounded-md text-sm text-ink-soft hover:bg-sand hover:text-teal transition-colors"
                        >
                          {n.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-sand-deep">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <h1 className="font-serif text-2xl text-ink font-semibold leading-tight truncate">{title}</h1>
                {subtitle && <p className="text-sm text-ink-mute mt-0.5 truncate">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {actions}
                <UserButton afterSignOutUrl="/admin" />
              </div>
            </div>
          </header>
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
