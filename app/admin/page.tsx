import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { clerkConfigured } from '@/lib/env';

export default async function AdminSignInPage({ searchParams }: { searchParams: { denied?: string } }) {
  if (!clerkConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand p-6">
        <div className="card-base p-8 max-w-md text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Foundation CMS</p>
          <h1 className="mt-3 font-serif text-2xl text-ink font-semibold">Sign-in is not yet configured.</h1>
          <p className="mt-3 text-sm text-ink-soft">
            The admin dashboard expects Clerk publishable and secret keys in environment variables.
            Set <code className="bg-sand-deep/40 px-1 rounded">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>,{' '}
            <code className="bg-sand-deep/40 px-1 rounded">CLERK_SECRET_KEY</code>, and{' '}
            <code className="bg-sand-deep/40 px-1 rounded">ADMIN_ALLOWED_EMAILS</code> in Vercel, then redeploy.
          </p>
          <Link href="/" className="btn-secondary mt-6 inline-flex">Back to site</Link>
        </div>
      </div>
    );
  }

  const { userId } = await auth();
  if (userId) redirect('/admin/dashboard');

  return (
    <div className="min-h-screen bg-sand grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-teal-deep text-sand">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-pale">Foundation CMS</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold">Memory Health Life Center</h1>
          <p className="mt-4 text-sand/80 max-w-sm leading-relaxed">
            A workspace for the Wood County Health Care Foundation to update the campaign site,
            manage supporter information, and publish project news.
          </p>
        </div>
        <p className="text-xs text-sand/60">
          You're signing in to manage the public website. Only foundation staff with approved access can continue.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        {searchParams?.denied && (
          <div className="mb-6 max-w-sm w-full rounded-lg bg-clay-pale border border-clay/30 px-4 py-3 text-sm text-clay-deep">
            That email isn't on the foundation's approved access list. If you should have access, contact the site administrator.
          </div>
        )}
        <SignIn
          path="/admin"
          routing="path"
          afterSignInUrl="/admin/dashboard"
          afterSignUpUrl="/admin/dashboard"
          signUpUrl="/admin"
        />
        <Link href="/" className="mt-6 text-sm text-ink-mute hover:text-teal">← Return to the public site</Link>
      </div>
    </div>
  );
}
