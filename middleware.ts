import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Required by Clerk v6: auth() in server components and route handlers
// throws when clerkMiddleware() is not present in the middleware chain.
// Keep this file as the canonical "no wrapper" pattern Clerk publishes —
// any custom wrapping has caused Vercel's Edge bundler to choke on
// Clerk's node-only optional imports.

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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip static files and Next internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
