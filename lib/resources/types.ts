// Shared TypeScript types for CMS resources. The DB schema is the source of
// truth; these mirror it. Optional fields default to null in the DB.

export type Status = 'draft' | 'published' | 'unpublished';
export type EventStatus = 'draft' | 'published' | 'canceled' | 'past';
export type MilestoneStatus = 'upcoming' | 'active' | 'completed';
export type InquiryStatus = 'new' | 'read' | 'archived';

export interface SiteSettings {
  id: 1;
  organization_name: string | null;
  project_name: string | null;
  foundation_name: string | null;
  ein: string | null;
  primary_email: string | null;
  primary_phone: string | null;
  mailing_address: string | null;
  donate_url: string | null;
  default_cta_label: string | null;
  default_cta_href: string | null;
  main_nav: { label: string; href: string }[];
  footer_nav: { group: string; links: { label: string; href: string }[] }[];
  footer_org_description: string | null;
  footer_subscribe_text: string | null;
  social_links: { platform: string; url: string }[];
  default_seo_image: string | null;
  updated_at: string;
}

export interface PageRow {
  slug: string;
  display_name: string;
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_path: string | null;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  display_label: string | null;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
  cta_label: string | null;
  cta_href: string | null;
  fields: Record<string, any>;
  order_index: number;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  source_label: string | null;
  consent_text: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  topic: string | null;
  message: string | null;
  consent: boolean | null;
  source_page: string | null;
  ip: string | null;
  user_agent: string | null;
  status: InquiryStatus;
  created_at: string;
}

export interface DonationInquiry {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  amount_cents: number | null;
  frequency: string | null;
  tribute_type: string | null;
  tribute_name: string | null;
  anonymous: boolean | null;
  message: string | null;
  source_page: string | null;
  ip: string | null;
  user_agent: string | null;
  status: InquiryStatus;
  created_at: string;
}

export interface DonationContent {
  id: 1;
  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_body: string | null;
  suggested_amounts_cents: number[];
  frequency_labels: { value: string; label: string }[];
  other_ways_cards: { icon?: string; title: string; body: string; cta_label?: string; cta_href?: string }[];
  mailing_address: string | null;
  major_gift_text: string | null;
  planned_giving_text: string | null;
  corporate_text: string | null;
  ein_text: string | null;
  tax_deductibility_text: string | null;
  faq: { question: string; answer: string }[];
  donate_url: string | null;
  donate_button_label: string | null;
  contact_link: string | null;
  updated_at: string;
}

export interface HonorRollEntry {
  id: string;
  display_name: string | null;
  anonymous: boolean;
  category: string | null;
  level_label: string | null;
  tribute_type: string | null;
  honoree_name: string | null;
  display_note: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
}

export interface LetterOfSupport {
  id: string;
  title: string | null;
  organization: string | null;
  signer_name: string | null;
  signer_title: string | null;
  category: string | null;
  description: string | null;
  letter_date: string | null;
  file_url: string | null;
  file_type: string | null;
  featured: boolean;
  order_index: number;
  status: Status;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  file_url: string | null;
  file_type: string | null;
  thumbnail_url: string | null;
  order_index: number;
  status: Status;
  created_at: string;
}

export interface EventItem {
  id: string;
  slug: string | null;
  title: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  timezone: string;
  location: string | null;
  description: string | null;
  image_url: string | null;
  registration_url: string | null;
  category: string | null;
  status: EventStatus;
  capacity: number | null;
  contact_email: string | null;
  order_index: number;
  created_at: string;
}

export interface NewsPost {
  id: string;
  slug: string | null;
  title: string | null;
  summary: string | null;
  body_md: string | null;
  category: string | null;
  post_date: string | null;
  image_url: string | null;
  external_url: string | null;
  status: 'draft' | 'published';
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  published_at: string | null;
  created_at: string;
}

export interface TimelineMilestone {
  id: string;
  title: string | null;
  description: string | null;
  date_label: string | null;
  milestone_date: string | null;
  icon_url: string | null;
  status: MilestoneStatus;
  order_index: number;
}

export type BoardCategory = 'officers' | 'board' | 'staff';

export interface BoardMember {
  id: string;
  name: string;
  title: string | null;
  category: BoardCategory;
  bio: string | null;
  image_url: string | null;
  image_alt: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaCoverageItem {
  id: string;
  source_name: string | null;
  headline: string | null;
  summary: string | null;
  publication_date: string | null;
  external_url: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
}

export interface MediaLibraryItem {
  id: string;
  file_url: string;
  alt_text: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  category: string | null;
  page_association: string | null;
  original_filename: string | null;
  uploaded_by: string | null;
  created_at: string;
}

// Resource registry — used by the generic /api/admin/[resource] route to
// gate which tables are mutable through the admin API.
export const RESOURCE_TABLES = {
  site_settings:       { table: 'site_settings',       singleton: true,  pk: 'id' },
  pages:               { table: 'pages',               singleton: false, pk: 'slug' },
  page_sections:       { table: 'page_sections',       singleton: false, pk: 'id' },
  subscribers:         { table: 'subscribers',         singleton: false, pk: 'id' },
  contact_inquiries:   { table: 'contact_inquiries',   singleton: false, pk: 'id' },
  donation_inquiries:  { table: 'donation_inquiries',  singleton: false, pk: 'id' },
  donation_content:    { table: 'donation_content',    singleton: true,  pk: 'id' },
  honor_roll:          { table: 'honor_roll',          singleton: false, pk: 'id' },
  letters_of_support:  { table: 'letters_of_support',  singleton: false, pk: 'id' },
  documents:           { table: 'documents',           singleton: false, pk: 'id' },
  events:              { table: 'events',              singleton: false, pk: 'id' },
  news_posts:          { table: 'news_posts',          singleton: false, pk: 'id' },
  timeline_milestones: { table: 'timeline_milestones', singleton: false, pk: 'id' },
  media_coverage:      { table: 'media_coverage',      singleton: false, pk: 'id' },
  board_members:       { table: 'board_members',       singleton: false, pk: 'id' },
  media_library:       { table: 'media_library',       singleton: false, pk: 'id' }
} as const;

export type ResourceKey = keyof typeof RESOURCE_TABLES;
