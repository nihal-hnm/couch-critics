import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * WHY remotePatterns?
 * ──────────────────
 * By default, Next.js blocks external images for security. Since we
 * load movie posters from TMDB's CDN (image.tmdb.org), we need to
 * explicitly whitelist that domain. This only applies to <Image />
 * from next/image — we're using <img> for now, but this config is
 * ready if you switch to the optimized Image component later.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
