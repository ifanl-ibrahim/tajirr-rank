// next.config.js

module.exports = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',       // Définit 'en' comme langue par défaut
    localeDetection: false     // Empêche le redirect automatique basé sur le navigateur
  },
  images: {
    domains: ['rdsxttvdekzinhdpfkoh.supabase.co'], // ← ici ton domaine Supabase
  },
}