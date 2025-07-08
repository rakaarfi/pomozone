// next.config.ts
import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: false,
  skipWaiting: true,
  buildExcludes: ["app-build-manifest.json"],
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(nextConfig);
