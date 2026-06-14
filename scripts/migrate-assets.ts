/*
 * One-time migration: upload existing /public/assets to Supabase Storage
 * and create starter rows for letters_of_support and documents.
 *
 * Usage: npm run migrate-assets
 *
 * Safe to re-run — it skips files that already exist in the target bucket.
 */
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const ROOT = path.join(process.cwd(), 'public', 'assets');

function slug(s: string) { return s.toLowerCase().replace(/[^\w.]+/g, '_').replace(/_+/g, '_'); }
function inferType(name: string): string {
  const ext = name.split('.').pop()!.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['jpg','jpeg'].includes(ext)) return 'jpg';
  if (ext === 'png') return 'png';
  return ext;
}

async function uploadIfMissing(bucket: string, name: string, body: Buffer, contentType: string): Promise<string> {
  const target = slug(name);
  const { data: existing } = await sb.storage.from(bucket).list('', { search: target });
  if (existing && existing.some(e => e.name === target)) {
    return sb.storage.from(bucket).getPublicUrl(target).data.publicUrl;
  }
  const { error } = await sb.storage.from(bucket).upload(target, body, { contentType, upsert: true });
  if (error) throw new Error(`${bucket}/${target}: ${error.message}`);
  return sb.storage.from(bucket).getPublicUrl(target).data.publicUrl;
}

interface LetterMeta {
  filename: string;
  organization: string;
  signer_name?: string;
  signer_title?: string;
  category: string;
  letter_date?: string;
  featured?: boolean;
}

// Curated list — these correspond to files already in /public/assets.
const LETTERS: LetterMeta[] = [
  { filename: 'Alzheimers Association letter of support.jpg', organization: "Alzheimer's Association", category: 'partner' },
  { filename: 'Canton Texas Letter of Support.jpg',           organization: 'City of Canton',           category: 'municipal' },
  { filename: 'City of Alba Letter of Support.jpg',           organization: 'City of Alba',             category: 'municipal' },
  { filename: 'City of Emory Letter of Support.jpg',          organization: 'City of Emory',            category: 'municipal' },
  { filename: 'City of Winnsboro Letter of Support.jpg',      organization: 'City of Winnsboro',        category: 'municipal' },
  { filename: 'Gooden Letter of Support for Quitman Memory Health Center.pdf', organization: 'Gooden Family', category: 'community' },
  { filename: 'Lake Country Classic Car Club Letter of Support.jpg', organization: 'Lake Country Classic Car Club', category: 'civic' },
  { filename: 'Pilot Club Quitman Letter of Support.jpg',     organization: 'Pilot Club of Quitman',    category: 'civic' },
  { filename: 'Quitman Development Corporation Letter of Support.jpg', organization: 'Quitman Development Corporation', category: 'community' },
  { filename: 'Quitman Lake Fork Kiwanis Club Letter of Support.jpg',  organization: 'Quitman Lake Fork Kiwanis Club',  category: 'civic' },
  { filename: 'Senator Bryan Hughes Letter of Support.jpg',   organization: 'Office of Senator Bryan Hughes', signer_name: 'Senator Bryan Hughes', signer_title: 'Texas State Senate', category: 'state', featured: true },
  { filename: 'Upshur County Letter of Support.jpg',          organization: 'Upshur County',            category: 'county' },
  { filename: 'Willis UT Tyler Letter of Support.jpg',        organization: 'UT Tyler · Willis',         category: 'academic' },
  { filename: 'Yantis Lake Form Lions Club Letter of Support.jpg', organization: 'Yantis Lions Club',   category: 'civic' }
];

interface DocMeta { filename: string; title: string; description?: string; category: string }
const DOCS: DocMeta[] = [
  { filename: 'Brief Overview MHLC project.pdf',   title: 'Project Brief Overview', description: 'A short overview of the Memory Health Life Center project.', category: 'overview' },
  { filename: 'Concept Overview MHLC project.pdf', title: 'Concept Overview Deck',  description: 'The full concept deck for the Memory Health Life Center.', category: 'deck' }
];

async function run() {
  console.log('Uploading letters of support…');
  for (let i = 0; i < LETTERS.length; i++) {
    const meta = LETTERS[i];
    const src = path.join(ROOT, meta.filename);
    try {
      const body = await fs.readFile(src);
      const type = inferType(meta.filename);
      const ct = type === 'pdf' ? 'application/pdf' : type === 'png' ? 'image/png' : 'image/jpeg';
      const fileUrl = await uploadIfMissing('letters', meta.filename, body, ct);
      // Skip if a row already exists for this organization to avoid duplicates.
      const { data: existing } = await sb.from('letters_of_support').select('id').eq('organization', meta.organization).maybeSingle();
      if (existing) { console.log('  · already in DB:', meta.organization); continue; }
      const { error } = await sb.from('letters_of_support').insert({
        title: meta.organization,
        organization: meta.organization,
        signer_name: meta.signer_name ?? null,
        signer_title: meta.signer_title ?? null,
        category: meta.category,
        file_url: fileUrl,
        file_type: type,
        featured: meta.featured ?? false,
        order_index: i,
        status: 'published'
      });
      if (error) throw error;
      console.log('  ✓', meta.organization);
    } catch (e: any) {
      console.warn('  ✗', meta.filename, e.message);
    }
  }

  console.log('Uploading documents…');
  for (let i = 0; i < DOCS.length; i++) {
    const meta = DOCS[i];
    const src = path.join(ROOT, meta.filename);
    try {
      const body = await fs.readFile(src);
      const fileUrl = await uploadIfMissing('documents', meta.filename, body, 'application/pdf');
      const { data: existing } = await sb.from('documents').select('id').eq('title', meta.title).maybeSingle();
      if (existing) { console.log('  · already in DB:', meta.title); continue; }
      const { error } = await sb.from('documents').insert({
        title: meta.title,
        description: meta.description ?? null,
        category: meta.category,
        file_url: fileUrl,
        file_type: 'pdf',
        order_index: i,
        status: 'published'
      });
      if (error) throw error;
      console.log('  ✓', meta.title);
    } catch (e: any) {
      console.warn('  ✗', meta.filename, e.message);
    }
  }

  console.log('Done.');
}

run().catch(err => { console.error(err); process.exit(1); });
