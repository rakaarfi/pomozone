// next.config.ts
import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: false, // <-- Biarkan ini tetap false, registrasi manual kita sudah terbukti andal
  skipWaiting: true,
  // --- TAMBAHKAN KEMBALI BARIS INI ---
  // Ini akan memberitahu service worker untuk mengabaikan file yang menyebabkan error 404
  buildExcludes: ["app-build-manifest.json"],
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(nextConfig);
