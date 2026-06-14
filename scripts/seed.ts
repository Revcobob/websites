/*
 * Seed the Supabase database with starter content for every editable page,
 * the donation page, and global site settings. Idempotent — re-running
 * upserts rather than duplicating.
 *
 * Usage: npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env
 * (e.g. .env.local). Run after the SQL migrations are applied.
 */
import './loadEnv';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

interface PageSeed {
  slug: string;
  display_name: string;
  seo_title: string;
  seo_description: string;
  sections: SectionSeed[];
}
interface SectionSeed {
  section_key: string;
  display_label: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  image_url?: string;
  image_alt?: string;
  cta_label?: string;
  cta_href?: string;
}

const PAGES: PageSeed[] = [
  {
    slug: 'homepage',
    display_name: 'Homepage',
    seo_title: 'Memory Health Life Center · Quitman, Texas',
    seo_description: 'A 54-bed, Hogeweyk-inspired memory care campus for East Texas, built by the Wood County Health Care Foundation in Quitman, Texas.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'Coming to East Texas',
        heading: 'A new kind of memory care, coming to East Texas.',
        body: 'A 54-bed, Hogeweyk-inspired memory care campus in Quitman, Texas — built around daily life, not a hallway.',
        cta_label: 'Give to Build It', cta_href: '/mhlc-give.html'
      },
      { section_key: 'vision', display_label: 'The Vision',
        eyebrow: 'The Project',
        heading: 'A dementia care campus built around daily life.',
        body: 'Three care neighborhoods, gardens, a working barn, and a community space — designed so residents can keep living a life, not just receiving care.'
      },
      { section_key: 'need', display_label: 'Why Memory Care Matters',
        eyebrow: 'The Need',
        heading: 'Rural East Texas families are facing dementia alone.',
        body: 'The closest specialized memory care is hours away. Families drive or relocate. Caregivers burn out. The Memory Health Life Center brings that care home.'
      },
      { section_key: 'services', display_label: 'What the Center Will Provide',
        eyebrow: 'Care Model',
        heading: 'Care that looks like a life — not a hallway.',
        body: 'Sixteen residents per neighborhood. Real homes. Real kitchens. Real rhythms.'
      },
      { section_key: 'partners', display_label: 'A Regional Resource',
        eyebrow: 'Built Together',
        heading: 'Built in Quitman. Built for the region.',
        body: 'In partnership with UT Tyler, UT Health East Texas, the Wood County Hospital District, and the City of Quitman.',
        cta_label: 'Become a partner', cta_href: '/mhlc-contact.html'
      },
      { section_key: 'support', display_label: 'Support the Campaign',
        eyebrow: 'Support',
        heading: 'Help build it.',
        body: 'Every gift moves this closer to opening day.',
        cta_label: 'Give Now', cta_href: '/mhlc-give.html'
      },
      { section_key: 'progress', display_label: 'Project Progress',
        eyebrow: 'Where we are',
        heading: 'Where we are right now.',
        body: 'Track the campaign from vision to opening day.',
        cta_label: 'See full timeline', cta_href: '/mhlc-overview.html'
      },
      { section_key: 'families', display_label: 'Families & Caregivers',
        eyebrow: 'For Families',
        heading: 'If you’re caring for someone with dementia — we see you.',
        body: 'Curated resources, upcoming events, and updates as the center is built.'
      },
      { section_key: 'updates', display_label: 'Latest Updates',
        eyebrow: 'News',
        heading: 'News from the Memory Health Life Center',
        body: 'Foundation updates, press coverage, and milestones.'
      },
      { section_key: 'final_cta', display_label: 'Final Donate / Contact',
        eyebrow: 'Get involved',
        heading: 'Every gift moves this closer to opening day.',
        body: 'Talk to a real person, or give today.',
        cta_label: 'Give Now', cta_href: '/mhlc-give.html'
      }
    ]
  },
  {
    slug: 'overview', display_name: 'Project Overview',
    seo_title: 'Project Overview · Memory Health Life Center',
    seo_description: 'A regional memory care campus for East Texas: vision, care model, campus, and downloads.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'The Project', heading: 'The Memory Health Life Center.',
        body: 'A 54-bed campus designed around daily life.' }
    ]
  },
  {
    slug: 'foundation', display_name: 'About the Foundation',
    seo_title: 'Wood County Health Care Foundation',
    seo_description: 'The 501(c)(3) foundation behind the Memory Health Life Center campaign.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'Who we are', heading: 'A community foundation, for our community.',
        body: 'The Wood County Health Care Foundation has served East Texas since 1986.' }
    ]
  },
  {
    slug: 'give', display_name: 'Give',
    seo_title: 'Support the Campaign · Memory Health Life Center',
    seo_description: 'Every gift helps build the Memory Health Life Center.',
    sections: []
  },
  {
    slug: 'events', display_name: 'Events',
    seo_title: 'Events · Memory Health Life Center',
    seo_description: 'Caregiver workshops, foundation events, and groundbreaking.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'Events', heading: 'Caregiver events and foundation gatherings.',
        body: 'Workshops, community open houses, and campaign events as the center is built.' }
    ]
  },
  {
    slug: 'contributors', display_name: 'Honor Roll',
    seo_title: 'Honor Roll · Memory Health Life Center',
    seo_description: 'The founding contributors who built this campaign — gift by gift.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'Thank you', heading: 'Built by neighbors.',
        body: 'Every name on this honor roll is a household that helped make this real.' }
    ]
  },
  {
    slug: 'letters', display_name: 'Letters of Support',
    seo_title: 'Letters of Support · Memory Health Life Center',
    seo_description: 'Letters from officials, partners, and community organizations.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'On record', heading: 'A region behind one project.',
        body: 'Letters of support from federal, state, academic, medical, civic, and community partners.' }
    ]
  },
  {
    slug: 'resources', display_name: 'Resources',
    seo_title: 'Resources for Families · Memory Health Life Center',
    seo_description: 'Helpline numbers, downloads, and curated resources for caregivers.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'For Families', heading: 'If you’re caring for someone with dementia — we see you.',
        body: 'Curated resources, downloads, and 24/7 helpline information.' }
    ]
  },
  {
    slug: 'contact', display_name: 'Contact',
    seo_title: 'Contact · Memory Health Life Center',
    seo_description: 'Talk to a real person at the Wood County Health Care Foundation.',
    sections: [
      { section_key: 'hero', display_label: 'Hero',
        eyebrow: 'Get in touch', heading: 'We read every message.',
        body: 'A member of the foundation team will respond within one business day.' }
    ]
  }
];

async function upsertPage(p: PageSeed) {
  const { error: e1 } = await sb.from('pages').upsert({
    slug: p.slug,
    display_name: p.display_name,
    seo_title: p.seo_title,
    seo_description: p.seo_description
  }, { onConflict: 'slug' });
  if (e1) throw e1;
  let i = 0;
  for (const s of p.sections) {
    const { error } = await sb.from('page_sections').upsert({
      page_slug: p.slug,
      section_key: s.section_key,
      display_label: s.display_label,
      eyebrow: s.eyebrow ?? null,
      heading: s.heading ?? null,
      body: s.body ?? null,
      image_url: s.image_url ?? null,
      image_alt: s.image_alt ?? null,
      cta_label: s.cta_label ?? null,
      cta_href: s.cta_href ?? null,
      order_index: i++
    }, { onConflict: 'page_slug,section_key' });
    if (error) throw error;
  }
}

async function seedSettings() {
  const { error } = await sb.from('site_settings').upsert({
    id: 1,
    organization_name: 'Wood County Health Care Foundation',
    project_name: 'Memory Health Life Center',
    foundation_name: 'Wood County Health Care Foundation',
    ein: null,
    primary_email: null,
    primary_phone: '(903) 760-9224',
    mailing_address: '405 East Lipscomb St.\nQuitman, TX 75783',
    donate_url: '',
    default_cta_label: 'Donate',
    default_cta_href: '/mhlc-give.html',
    main_nav: [
      { label: 'The Project', href: '/mhlc-overview.html' },
      { label: 'The Need',    href: '/mhlc-homepage.html#need' },
      { label: 'Progress',    href: '/mhlc-homepage.html#progress' },
      { label: 'Families',    href: '/mhlc-resources.html' },
      { label: 'Partners',    href: '/mhlc-letters-of-support.html' },
      { label: 'Contact',     href: '/mhlc-contact.html' }
    ],
    footer_nav: [],
    footer_org_description: 'The Wood County Health Care Foundation has served East Texas since 1986.',
    footer_subscribe_text: 'Get monthly updates as the center is built.',
    social_links: [],
    default_seo_image: ''
  }, { onConflict: 'id' });
  if (error) throw error;
}

async function seedDonation() {
  const { error } = await sb.from('donation_content').upsert({
    id: 1,
    hero_eyebrow: 'Support the Campaign',
    hero_title: 'Help build it.',
    hero_body: 'Every gift moves this closer to opening day.',
    suggested_amounts_cents: [5000, 10000, 25000, 50000, 100000, 500000],
    frequency_labels: [
      { value: 'one-time', label: 'One-time' },
      { value: 'monthly',  label: 'Monthly' }
    ],
    other_ways_cards: [],
    mailing_address: 'Wood County Health Care Foundation\n405 East Lipscomb St.\nQuitman, TX 75783',
    major_gift_text: 'Major gifts and naming opportunities are available. Contact the foundation to discuss.',
    planned_giving_text: 'Include the foundation in your estate plans through a bequest, IRA, DAF, or stock gift.',
    corporate_text: 'Corporate sponsorship opportunities support the campaign and the region.',
    ein_text: 'EIN pending',
    tax_deductibility_text: 'The Wood County Health Care Foundation is a 501(c)(3) nonprofit. Contributions are tax-deductible to the fullest extent allowed by law.',
    faq: [
      { question: 'Is my gift tax-deductible?', answer: 'Yes. The foundation is a 501(c)(3) and gifts are tax-deductible to the fullest extent allowed.' },
      { question: 'Can I give by check?', answer: 'Yes. Mail checks to the foundation’s mailing address on this page.' }
    ],
    donate_url: '',
    donate_button_label: 'Give Now',
    contact_link: '/mhlc-contact.html'
  }, { onConflict: 'id' });
  if (error) throw error;
}

(async () => {
  console.log('Seeding pages…');
  for (const p of PAGES) {
    await upsertPage(p);
    console.log('  ✓', p.slug);
  }
  console.log('Seeding site settings…');
  await seedSettings();
  console.log('Seeding donation content…');
  await seedDonation();
  console.log('Done.');
})().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
