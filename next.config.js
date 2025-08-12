// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // équivalent de next export
  // i18n: {
  //   locales: ['en', 'fr'],
  //   defaultLocale: 'en',       // Définit 'en' comme langue par défaut
  //   localeDetection: false     // Empêche le redirect automatique basé sur le navigateur
  // },
  images: {
    domains: ['rdsxttvdekzinhdpfkoh.supabase.co'], // ← ton domaine Supabase
    unoptimized: true, // nécessaire pour export statique
  },
};

module.exports = nextConfig;