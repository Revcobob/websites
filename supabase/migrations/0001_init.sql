-- MHLC CMS schema — initial migration
-- All tables live in `public`. Row-level security is enabled everywhere.
-- The anon role can SELECT only published rows (or settings/singletons).
-- All write paths go through the Next.js API using the service role key.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ────────────────────────────────────────────────────────────────────────────
-- site_settings: singleton row (id = 1)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.site_settings (
  id                       smallint primary key default 1 check (id = 1),
  organization_name        text,
  project_name             text,
  foundation_name          text,
  ein                      text,
  primary_email            text,
  primary_phone            text,
  mailing_address          text,
  donate_url               text,
  default_cta_label        text,
  default_cta_href         text,
  main_nav                 jsonb default '[]'::jsonb,
  footer_nav               jsonb default '[]'::jsonb,
  footer_org_description   text,
  footer_subscribe_text    text,
  social_links             jsonb default '[]'::jsonb,
  default_seo_image        text,
  updated_at               timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- pages + page_sections: editable public page content
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.pages (
  slug              text primary key,
  display_name      text not null,
  seo_title         text,
  seo_description   text,
  og_title          text,
  og_description    text,
  og_image          text,
  canonical_path    text,
  updated_at        timestamptz not null default now()
);

create table if not exists public.page_sections (
  id              uuid primary key default gen_random_uuid(),
  page_slug       text not null references public.pages(slug) on delete cascade,
  section_key     text not null,
  display_label   text,
  eyebrow         text,
  heading         text,
  body            text,
  image_url       text,
  image_alt       text,
  cta_label       text,
  cta_href        text,
  fields          jsonb default '{}'::jsonb,
  order_index     int not null default 0,
  updated_at      timestamptz not null default now(),
  unique (page_slug, section_key)
);
create index if not exists idx_page_sections_page on public.page_sections(page_slug, order_index);

-- ────────────────────────────────────────────────────────────────────────────
-- subscribers: email signups from public forms
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         citext unique not null,
  source        text,
  source_label  text,
  consent_text  text,
  ip            inet,
  user_agent    text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_subscribers_created on public.subscribers(created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- contact_inquiries
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.contact_inquiries (
  id           uuid primary key default gen_random_uuid(),
  first_name   text,
  last_name    text,
  email        text,
  phone        text,
  topic        text,
  message      text,
  consent      boolean,
  source_page  text,
  ip           inet,
  user_agent   text,
  status       text not null default 'new' check (status in ('new','read','archived')),
  created_at   timestamptz not null default now()
);
create index if not exists idx_contact_created on public.contact_inquiries(created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- donation_inquiries (non-payment intent only)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.donation_inquiries (
  id              uuid primary key default gen_random_uuid(),
  first_name      text,
  last_name       text,
  email           text,
  phone           text,
  amount_cents    int,
  frequency       text,
  tribute_type    text,
  tribute_name    text,
  anonymous       boolean default false,
  message         text,
  source_page     text,
  ip              inet,
  user_agent      text,
  status          text not null default 'new' check (status in ('new','read','archived')),
  created_at      timestamptz not null default now()
);
create index if not exists idx_donation_created on public.donation_inquiries(created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- donation_content: singleton row controlling the Give page copy
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.donation_content (
  id                        smallint primary key default 1 check (id = 1),
  hero_eyebrow              text,
  hero_title                text,
  hero_body                 text,
  suggested_amounts_cents   int[] default '{}',
  frequency_labels          jsonb default '[]'::jsonb,
  other_ways_cards          jsonb default '[]'::jsonb,
  mailing_address           text,
  major_gift_text           text,
  planned_giving_text       text,
  corporate_text            text,
  ein_text                  text,
  tax_deductibility_text    text,
  faq                       jsonb default '[]'::jsonb,
  donate_url                text,
  donate_button_label       text,
  contact_link              text,
  updated_at                timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- honor_roll
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.honor_roll (
  id             uuid primary key default gen_random_uuid(),
  display_name   text,
  anonymous      boolean default false,
  category       text,
  level_label    text,
  tribute_type   text,
  honoree_name   text,
  display_note   text,
  order_index    int not null default 0,
  published      boolean not null default true,
  created_at     timestamptz not null default now()
);
create index if not exists idx_honor_order on public.honor_roll(order_index);

-- ────────────────────────────────────────────────────────────────────────────
-- letters_of_support
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.letters_of_support (
  id            uuid primary key default gen_random_uuid(),
  title         text,
  organization  text,
  signer_name   text,
  signer_title  text,
  category      text,
  description   text,
  letter_date   date,
  file_url      text,
  file_type     text,
  featured      boolean default false,
  order_index   int not null default 0,
  status        text not null default 'draft' check (status in ('draft','published','unpublished')),
  created_at    timestamptz not null default now()
);
create index if not exists idx_letters_cat on public.letters_of_support(category, order_index);

-- ────────────────────────────────────────────────────────────────────────────
-- documents
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id             uuid primary key default gen_random_uuid(),
  title          text,
  description    text,
  category       text,
  file_url       text,
  file_type      text,
  thumbnail_url  text,
  order_index    int not null default 0,
  status         text not null default 'draft' check (status in ('draft','published','unpublished')),
  created_at     timestamptz not null default now()
);
create index if not exists idx_documents_cat on public.documents(category, order_index);

-- ────────────────────────────────────────────────────────────────────────────
-- events
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique,
  title             text,
  event_date        date,
  start_time        time,
  end_time          time,
  timezone          text default 'America/Chicago',
  location          text,
  description       text,
  image_url         text,
  registration_url  text,
  category          text,
  status            text not null default 'draft' check (status in ('draft','published','canceled','past')),
  capacity          int,
  contact_email     text,
  order_index       int not null default 0,
  created_at        timestamptz not null default now()
);
create index if not exists idx_events_date on public.events(event_date);

-- ────────────────────────────────────────────────────────────────────────────
-- news_posts
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.news_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique,
  title           text,
  summary         text,
  body_md         text,
  category        text,
  post_date       date,
  image_url       text,
  external_url    text,
  status          text not null default 'draft' check (status in ('draft','published')),
  seo_title       text,
  seo_description text,
  og_image        text,
  published_at    timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists idx_news_pub on public.news_posts(status, published_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- timeline_milestones
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.timeline_milestones (
  id             uuid primary key default gen_random_uuid(),
  title          text,
  description    text,
  date_label     text,
  milestone_date date,
  icon_url       text,
  status         text not null default 'upcoming' check (status in ('upcoming','active','completed')),
  order_index    int not null default 0
);

-- ────────────────────────────────────────────────────────────────────────────
-- media_coverage
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.media_coverage (
  id                uuid primary key default gen_random_uuid(),
  source_name       text,
  headline          text,
  summary           text,
  publication_date  date,
  external_url      text,
  image_url         text,
  order_index       int not null default 0,
  created_at        timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- media_library
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.media_library (
  id                  uuid primary key default gen_random_uuid(),
  file_url            text not null,
  alt_text            text,
  mime_type           text,
  size_bytes          int,
  width               int,
  height              int,
  category            text,
  page_association    text,
  original_filename   text,
  uploaded_by         text,
  created_at          timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────────────────
-- updated_at trigger
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t record;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in ('site_settings','pages','page_sections','donation_content')
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I;
       create trigger set_updated_at before update on public.%I
       for each row execute function public.tg_set_updated_at();',
      t.tablename, t.tablename
    );
  end loop;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- Row-level security
--   anon → SELECT only on public-safe rows
--   service_role → bypasses RLS (used by our Next.js server)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.site_settings        enable row level security;
alter table public.pages                enable row level security;
alter table public.page_sections        enable row level security;
alter table public.subscribers          enable row level security;
alter table public.contact_inquiries    enable row level security;
alter table public.donation_inquiries   enable row level security;
alter table public.donation_content     enable row level security;
alter table public.honor_roll           enable row level security;
alter table public.letters_of_support   enable row level security;
alter table public.documents            enable row level security;
alter table public.events               enable row level security;
alter table public.news_posts           enable row level security;
alter table public.timeline_milestones  enable row level security;
alter table public.media_coverage       enable row level security;
alter table public.media_library        enable row level security;

-- Singletons + page content readable by anon
create policy anon_read_settings on public.site_settings    for select to anon using (true);
create policy anon_read_pages    on public.pages            for select to anon using (true);
create policy anon_read_sections on public.page_sections    for select to anon using (true);
create policy anon_read_giving   on public.donation_content for select to anon using (true);

-- Lists: anon reads only published rows
create policy anon_read_honor    on public.honor_roll
  for select to anon using (published = true);
create policy anon_read_letters  on public.letters_of_support
  for select to anon using (status = 'published');
create policy anon_read_docs     on public.documents
  for select to anon using (status = 'published');
create policy anon_read_events   on public.events
  for select to anon using (status in ('published','canceled','past'));
create policy anon_read_news     on public.news_posts
  for select to anon using (status = 'published');
create policy anon_read_timeline on public.timeline_milestones
  for select to anon using (true);
create policy anon_read_media_coverage on public.media_coverage
  for select to anon using (true);

-- Inquiry / subscriber tables: anon may NOT read.
-- All writes go through our service-role server endpoints.

-- media_library is admin-internal; anon cannot read.
