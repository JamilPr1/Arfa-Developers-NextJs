/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
