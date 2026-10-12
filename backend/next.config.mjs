/** @type {import('next').NextConfig} */
const allowedOrigin = process.env.ALLOWED_ORIGIN || process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3001');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: allowedOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id, x-user-role, x-workspace-id' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
