import type { NextConfig } from "next";

// img-src stays permissive ('self' https: data:) on purpose — product
// images are hotlinked from arbitrary luxury-retailer domains a customer
// pastes in, which can't be enumerated in advance. Don't tighten this
// without changing how source_image_url is used in ProjectCard/ProjectImage.
//
// script-src/style-src include 'unsafe-inline' as a pragmatic baseline —
// Next.js's App Router injects inline hydration data and Tailwind emits
// some inline styles. A nonce-based CSP would be stricter; revisit if that
// becomes worth the added middleware complexity.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
