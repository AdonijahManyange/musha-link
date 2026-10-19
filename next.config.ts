import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ychxinswocomccmnwcdo.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ============================================================
  // SECURITY HEADERS
  // Applied to every route served by the Next.js application.
  // ============================================================

  async headers() {
    return [
      {
        source: "/:path*",

        headers: [
          // Prevent browsers from interpreting files as a
          // different MIME type than the server declares.
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Reduce the amount of referrer information sent
          // to external websites.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Prevent other websites from embedding MushaLink
          // in a frame, helping protect against clickjacking.
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // Restrict browser features that MushaLink doesn't
          // currently need.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;