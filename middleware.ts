import { NextResponse, type NextRequest } from 'next/server';

// Auth is enforced inside each protected page (requireAdmin) and each admin
// API route (isAdmin), so middleware doesn't need to call Clerk. Keeping
// Clerk out of the Edge bundle avoids the "unsupported modules" deploy
// error caused by Clerk's optional node-only dependencies.
//
// This middleware exists only so we can keep the matcher excluding static
// assets cleanly. If we ever need request-time logging or geo routing,
// it slots in here without re-introducing Clerk.

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)']
};
