/** @type {import('next').NextConfig} */
const nextConfig = {
  // Eliminar console.logs en producción
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // ⚠️ Ignorar errores de ESLint durante el build (temporal)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimización de imágenes
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  
  // Experimentales para mejor rendimiento
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "xlsx",
      "pdfjs-dist",
    ],
  },
  
  // Transpilación de paquetes
  transpilePackages: ["pdfjs-dist"],
  
  // Headers de seguridad y caché
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
  
  // Compresión
  compress: true,
  
  // Salida standalone para despliegue optimizado
  output: "standalone",
};

export default nextConfig;