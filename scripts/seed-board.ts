/*
 * Seed the existing foundation roster into board_members. Idempotent —
 * skips anyone already in the table by name.
 *
 * Usage: npx tsx scripts/seed-board.ts
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

interface Seed { name: string; title: string; category: 'officers' | 'board' | 'staff'; bio: string }

const ROSTER: Seed[] = [
  // Officers
  { name: 'Debbie Robinson', title: 'President', category: 'officers',
    bio: 'Texas A&M BBA in Accounting. Certified Public Accountant. General Manager (retired), Wood County Electric Cooperative. Debbie and her husband Troy attend St Peter the Apostle Catholic Church in Mineola. She is a member of the Pilot Club of Quitman and enjoys serving the community.' },
  { name: 'Orval Lindsey', title: 'Vice President', category: 'officers',
    bio: 'Texas A&M Commerce BS, MA in agriculture. A Wood County resident since 1971, Orval retired from the pharmaceutical industry in 2011 and serves on six volunteer boards. He served on the Quitman School Board and, as president of the Wood County Farm Bureau, led the action that resulted in the Wood County Livestock and Market Show. Orval and his wife Carolyn were high school sweethearts; they have 3 children and 10 grandchildren.' },
  { name: 'Annette Simpkins', title: 'Secretary', category: 'officers',
    bio: 'Past President. Annette worked in the healthcare field as a Licensed Nursing Facility Administrator for 45 years. After retirement she served on the Wood County Central Hospital District Board, including as President for several years. She serves the Wood County Health Care Foundation, the Center for Memory Health and Education Leadership Team, and the UT Health East Texas, Quitman Board of Trustees. She is active in church and community.' },

  // Board members
  { name: 'Randy Dunn', title: 'Board Member', category: 'board',
    bio: 'Mayor of Quitman, Texas (elected 2019). Previously Mayor Pro Tem 2017-2019 and Alderman 2007-2017. Randy has a long history of service beginning with his appointment to the Quitman Development Corporation from 2004 to 2021. He is retired from Farm Bureau Insurance Company, where he served 1983-2016.' },
  { name: 'Brenda Hunter', title: 'Board Member', category: 'board',
    bio: 'Brenda retired from Peoples Telephone Cooperative after 28 years. She has been an active member of civic and community organizations, including service on the Board of Directors of Jones Water Supply Corporation. Brenda grew up in Quitman, graduated from Quitman High School, and attended Stephen F. Austin State University.' },
  { name: 'Larry F. Bowman', title: 'Board Member', category: 'board',
    bio: 'BS Accounting/Economics, University of Utah. Executive Vice President of Associates Banc Corp (a subsidiary of Associates First Capital), responsible for technology and communications for 2,200 branch offices and 5 major processing centers worldwide. He has served on many boards, including president roles with LaSalle Council Boy Scouts of America, Lone Star Council Boy Scouts of America, United Way of St. Joseph County, and Boys and Girls Club.' },
  { name: 'Pepper Aasgaard', title: 'Board Member', category: 'board',
    bio: 'Retired Product Developer with a background in marketing, media, and human resources, including supporting corporations as Chairman of Compliance for Workforce, Private Industry Councils, and on state and regional commissions. Certified Arbitrator Mediator specializing in business and labor law. Bellevue University, HR Management.' },
  { name: 'Dr. Rickey Cameron', title: 'Board Member', category: 'board',
    bio: 'A graduate of Quitman High School, Texas A&M, and the University of Texas Medical Branch, where he earned his medical degree. Dr. Cameron practiced Emergency Medicine in Tyler for 20 years and is now the Chief Medical Officer of a national healthcare company. He has been married to his wife, Michelle, for 32 years.' },
  { name: 'Tom Keenan', title: 'Board Member', category: 'board',
    bio: 'President of Strategic Healthcare Initiatives, Inc. Tom\'s diverse career in insurance, health care strategies, and healthy lifestyle programs has included consulting and executive roles in health care, working closely with insurance companies, hospital systems, and health care organizations providing start-up operations for HMOs and PPOs. President of the Wood County Economic Development Commission.' },
  { name: 'Craig Lindholm', title: 'Board Member', category: 'board',
    bio: 'Craig has an extensive background in city management, community and economic development, downtown redevelopment, housing, neighborhood revitalization, and leadership training. He has served in numerous city management and economic development roles assisting elected officials throughout East Texas.' },

  // Staff & advisors
  { name: 'Claudia Herber Pair', title: 'Administration Assistant', category: 'staff',
    bio: 'Texas State University BBS, Business/Accounting. Land for Non-Landmen Certification, Professional Development Institute, University of North Texas. Employment experience includes Accounting Manager, Director of Accounting, Director Accounts Payable, Senior Accountant, and Accounts Payable Officer.' },
  { name: 'Darrell Slabaugh', title: 'Advisor', category: 'staff',
    bio: 'Darrell served as Secretary of the Wood County Health Care Foundation and was Fundraising Chairperson for the Center for Memory Health and Education. He is retired, having served as executive director of an education foundation and chief development officer for colleges and universities. Darrell is an active member of First United Methodist Church in Quitman.' }
];

(async () => {
  for (let i = 0; i < ROSTER.length; i++) {
    const p = ROSTER[i]!;
    const { data: existing } = await sb.from('board_members').select('id').eq('name', p.name).maybeSingle();
    if (existing) { console.log(`· already present: ${p.name}`); continue; }
    const { error } = await sb.from('board_members').insert({
      name: p.name, title: p.title, category: p.category, bio: p.bio,
      order_index: i, published: true
    });
    if (error) console.error(`✗ ${p.name}: ${error.message}`);
    else console.log(`✓ ${p.name}`);
  }
  console.log('Done.');
})().catch(err => { console.error(err); process.exit(1); });
