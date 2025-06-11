/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ Replaces deprecated "domains" option
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

  // 🟡 Allow build to proceed even with TS errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
