# Memory Health Life Center — Site + CMS

The MHLC public site plus a production-ready CMS dashboard for the Wood
County Health Care Foundation. The public-facing site is the same set of
nine hand-coded HTML pages it has always been; a Next.js app now wraps them
to inject CMS-managed content, host the admin dashboard, and accept form
submissions.

## Stack

- **Next.js 14** (app router, TypeScript) — admin UI and API routes
- **Tailwind CSS** — admin styling; the public HTML continues to use the
  Tailwind CDN unchanged
- **Clerk** — admin authentication, with an email allowlist
- **Supabase** — Postgres for CMS content, plus Storage for letters,
  documents, and the media library
- **Vercel** — hosting

## Local setup

```bash
npm install
cp .env.example .env.local
# fill in Clerk + Supabase keys
npm run dev
```

Open <http://localhost:3000> for the public site and
<http://localhost:3000/admin> for the dashboard.

## First-time configuration

1. Create a Supabase project. In the SQL editor, apply
   `supabase/migrations/0001_init.sql` and `supabase/migrations/0002_storage.sql`.
2. Create a Clerk project. Add the publishable + secret keys to env vars and
   list the foundation emails allowed to access the dashboard in
   `ADMIN_ALLOWED_EMAILS` (comma-separated).
3. Run the seed script to populate starter content for every page,
   donation_content, and site_settings:

   ```bash
   npm run seed
   ```

4. (Optional) Push existing letters of support and project PDFs into
   Supabase Storage and create rows for them:

   ```bash
   npm run migrate-assets
   ```

## Environment variables

See `.env.example` for the complete list. The CMS is designed to fail open:
if Supabase keys are missing, the public HTML still ships untouched and the
admin shows clear configuration hints.

## Architecture in one paragraph

The original static HTML lives in `/cms-pages/` (out of `/public/` so it
isn't served directly). A Next.js rewrite sends every request for
`/mhlc-<slug>.html` to `/api/page/<slug>`, which reads the file, fetches
the page's CMS payload from Supabase, applies text/attribute/list-content
patches against `data-cms*` slots, and streams the rewritten HTML back.
Public forms POST JSON to `/api/public/*` (subscribe, contact,
donation-inquiry) which validate, rate-limit, optionally verify hCaptcha,
and write to Supabase. The admin lives entirely under `/admin/*`, gated by
Clerk + the email allowlist.

## Day-to-day for the client

- **Edit page text or images** → Page Content → pick the page → edit
  sections → Save.
- **Manage events, news, letters, documents, honor roll, timeline, media
  coverage** → use the matching sidebar item; each has a list view + new/edit.
- **See who subscribed** → Email Subscribers (with CSV export).
- **Edit the donate page** → Donations & Giving Content.
- **Site-wide settings** → Site Settings.
- **Search/social preview** → SEO Settings.

## Hand-off notes

- Draft / published states apply to **events, project updates, documents,
  and letters of support**. Everything else is "live on save."
- Honor Roll never displays donation amounts. Use the "Level label" field
  to show a recognition tier ("Founding Contributor", "Leadership Gift").
- The donation form stores donor name/email/phone/amount-selected/tribute
  details only. It then forwards the donor to the foundation's external
  payment provider URL (configured in Site Settings → Donate URL).
- The Foundation Login link sits in the legal row at the bottom of every
  page — visible to anyone who looks, invisible to casual visitors.
- Public CMS responses are edge-cached for 60 seconds; expect that delay
  before a change appears for visitors.
