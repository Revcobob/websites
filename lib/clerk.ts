import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { env } from '@/lib/env';

export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const { userId } = await auth();
  if (!userId) redirect('/admin');
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? '';
  if (!email) redirect('/admin?denied=1');
  if (env.adminAllowed.length > 0 && !env.adminAllowed.includes(email)) {
    redirect('/admin?denied=1');
  }
  return { userId, email };
}

export async function isAdmin(): Promise<{ ok: true; userId: string; email: string } | { ok: false; reason: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: 'unauthenticated' };
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? '';
  if (!email) return { ok: false, reason: 'no_email' };
  if (env.adminAllowed.length > 0 && !env.adminAllowed.includes(email)) {
    return { ok: false, reason: 'not_allowed' };
  }
  return { ok: true, userId, email };
}
