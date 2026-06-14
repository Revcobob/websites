import { redirect } from 'next/navigation';

// The Next.js rewrite at next.config.mjs sends "/" to /api/page/homepage
// before this page is reached. This is a safety net.
export default function Index() {
  redirect('/api/page/homepage');
}
