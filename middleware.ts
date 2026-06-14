import { NextResponse, type NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/admin/dashboard(.*)',
  '/admin/pages(.*)',
  '/admin/updates(.*)',
  '/admin/events(.*)',
  '/admin/timeline(.*)',
  '/admin/honor-roll(.*)',
  '/admin/giving(.*)',
  '/admin/letters(.*)',
  '/admin/documents(.*)',
  '/admin/media-coverage(.*)',
  '/admin/media(.*)',
  '/admin/subscribers(.*)',
  '/admin/contact(.*)',
  '/admin/seo(.*)',
  '/admin/settings(.*)',
  '/api/admin/(.*)'
]);

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) await auth.protect();
  }
});

// When Clerk isn't configured, skip Clerk entirely so the public site still
// boots cleanly. Admin pages render a configuration hint instead of crashing.
export default function middleware(req: NextRequest, ev: any) {
  if (!clerkConfigured) return NextResponse.next();
  return (clerk as any)(req, ev);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)', '/', '/(api|trpc)(.*)']
};
