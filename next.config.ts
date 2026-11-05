import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  // English pages keep their plain addresses (/about) and are served from the [lang] folder as /en/about.
  // Bangla pages are at /bn/about. afterFiles means photos in /public and the admin are matched first.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: "/:path((?!bn(?:/|$)|en(?:/|$)|admin(?:/|$)|_next/|_vercel/).+)", destination: "/en/:path" },
      ],
      fallback: [],
    };
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" },
    ],
  },
  experimental: {
    // Photos are resized in the browser before upload; results CSVs are small.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
