/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external flag images
  images: {
    domains: ['flagcdn.com', 'upload.wikimedia.org'],
  },

  // ⚠️  Skip TypeScript errors during production builds
  //     (local `next dev` still shows them in your editor)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
