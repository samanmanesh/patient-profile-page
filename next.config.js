/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone build for better Vercel compatibility
  output: 'standalone',
  
  // Ensure images can be served from Vercel domains
  images: {
    domains: [
      'vercel.app',
      'localhost',
    ],
  },
  
  // Add any necessary rewrites or headers here
};

module.exports = nextConfig; 