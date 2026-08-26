import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "xlsx", "pdfjs-dist"],
  },

  transpilePackages: ["pdfjs-dist"],

  // ============================================================
  // 🔥 REDIRECCIONES (SIN /login → /public/login)
  // ============================================================
  async redirects() {
    return [
      // === PÁGINAS PÚBLICAS (/public) ===
      {
        source: "/proyectos",
        destination: "/public/proyectos",
        permanent: true,
      },
      {
        source: "/proyectos/:slug",
        destination: "/public/proyectos/:slug",
        permanent: true,
      },
      {
        source: "/servicios",
        destination: "/public/servicios",
        permanent: true,
      },
      {
        source: "/servicios/:slug",
        destination: "/public/servicios/:slug",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/public/contacto",
        permanent: true,
      },
      {
        source: "/nosotros",
        destination: "/public/nosotros",
        permanent: true,
      },
      // ❌ ELIMINADA: /login → /public/login (causa bucle)
      // {
      //   source: "/login",
      //   destination: "/public/login",
      //   permanent: true,
      // },
      {
        source: "/blog",
        destination: "/public/blog",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/public/blog/:slug",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/public/faq",
        permanent: true,
      },
      {
        source: "/testimonios",
        destination: "/public/testimonios",
        permanent: true,
      },

      // === PÁGINAS DEL ERP (/erp) ===
      {
        source: "/dashboard",
        destination: "/erp/dashboard",
        permanent: true,
      },
      {
        source: "/personal",
        destination: "/erp/personal",
        permanent: true,
      },
      {
        source: "/produccion",
        destination: "/erp/produccion",
        permanent: true,
      },
      {
        source: "/obras",
        destination: "/erp/obras",
        permanent: true,
      },
      {
        source: "/valorizaciones",
        destination: "/erp/valorizaciones",
        permanent: true,
      },
      {
        source: "/costos",
        destination: "/erp/costos",
        permanent: true,
      },
      {
        source: "/compras",
        destination: "/erp/compras",
        permanent: true,
      },
      {
        source: "/inventario",
        destination: "/erp/inventario",
        permanent: true,
      },
      {
        source: "/documentos",
        destination: "/erp/documentos",
        permanent: true,
      },
      {
        source: "/fotos",
        destination: "/erp/fotos",
        permanent: true,
      },
      {
        source: "/calidad",
        destination: "/erp/calidad",
        permanent: true,
      },
      {
        source: "/alertas",
        destination: "/erp/alertas",
        permanent: true,
      },
      {
        source: "/reportes",
        destination: "/erp/reportes",
        permanent: true,
      },
      {
        source: "/facturacion",
        destination: "/erp/facturacion",
        permanent: true,
      },
      {
        source: "/indicadores",
        destination: "/erp/indicadores",
        permanent: true,
      },

      // === PÁGINAS DEL CRM (/crm) ===
      {
        source: "/cotizaciones",
        destination: "/crm/cotizaciones",
        permanent: true,
      },
      {
        source: "/cotizaciones/:slug",
        destination: "/crm/cotizaciones/:slug",
        permanent: true,
      },
      {
        source: "/clientes",
        destination: "/crm/clientes",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
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
            `
              .replace(/\s+/g, " ")
              .trim(),
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