/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "xlsx", "pdfjs-dist"],
  },
  
  transpilePackages: ["pdfjs-dist"],
  
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // 🔒 Seguridad básica
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // 🔒 Content Security Policy (CSP) básica
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https://*.supabase.co;
              connect-src 'self' https://*.supabase.co https://api.resend.com;
              frame-src 'self' https://www.google.com;
            `.replace(/\s+/g, " ").trim(),
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  
  compress: true,
};

export default nextConfig;