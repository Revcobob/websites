function readEnv(name: string, fallback = ''): string {
  const v = process.env[name];
  return v && v.length > 0 ? v : fallback;
}

export const env = {
  siteUrl:        readEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  supabaseUrl:    readEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnon:   readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseSvc:    readEnv('SUPABASE_SERVICE_ROLE_KEY'),
  clerkPub:       readEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
  clerkSecret:    readEnv('CLERK_SECRET_KEY'),
  adminAllowed:   readEnv('ADMIN_ALLOWED_EMAILS').split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
  hcaptchaSite:   readEnv('NEXT_PUBLIC_HCAPTCHA_SITE_KEY'),
  hcaptchaSecret: readEnv('HCAPTCHA_SECRET'),
  doNotTrack:     readEnv('DO_NOT_TRACK', 'false').toLowerCase() === 'true'
};

export function supabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnon);
}

export function clerkConfigured(): boolean {
  return Boolean(env.clerkPub && env.clerkSecret);
}
