/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow placeholder images from picsum.photos and local Laravel API
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.openai.com',
      },
    ],
    // Support modern formats
    formats: ['image/webp'],
  },
};

export default nextConfig;
