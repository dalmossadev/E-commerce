/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite imagens de CDNs externos no futuro
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/img/catalogo/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 80, 85],
  },
  // Blinda headers de segurança em produção
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
