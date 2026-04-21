/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow placeholder images from picsum.photos and local/production API
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn1.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn2.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      /* 
       * AJOUTER ICI VOTRE DOMAINE DE PRODUCTION POUR LES IMAGES 
       * Exemple: { protocol: 'https', hostname: 'api.lencre.ci' }
       */
    ],
    // Support modern formats
    formats: ['image/webp'],
  },
};

export default nextConfig;
