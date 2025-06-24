/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable and no longer needs to be in experimental
  experimental: {
    optimizePackageImports: [
      'react-dnd',
      'react-dnd-html5-backend',
      'react-i18next',
      'i18next'
    ]
  }
};

export default nextConfig;
