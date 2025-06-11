// next.config.js
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',               // Service worker output location
  register: true,              // Auto-register service worker
  skipWaiting: true,           // Activate new SW immediately
  disable: process.env.NODE_ENV === 'development', // Only enable in prod
});

const nextConfig = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
});

module.exports = nextConfig;
