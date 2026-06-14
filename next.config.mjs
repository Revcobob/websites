/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The original static HTML files live in /cms-pages (outside /public so
  // Next.js doesn't short-circuit our route handler). Public requests for
  // `/mhlc-<slug>.html` are rewritten to an API route that reads the file,
  // injects CMS content from Supabase, and streams the rewritten HTML back.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/api/page/homepage' },
        { source: '/mhlc-:slug.html', destination: '/api/page/:slug' }
      ]
    };
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  }
};

export default nextConfig;
