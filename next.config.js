/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['image.pollinations.ai'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig