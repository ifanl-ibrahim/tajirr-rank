export const luxuryTheme = {
  colors: {
    // Valeurs secondaires ajoutées pour styled-components
    primary: '#D4AF37',            // Même que gold (pour cohérence)
    formBackground: '#1a1a1a',    // Fond des formulaires, sombre et contrasté
    inputBackground: '#222222',   // Fond des inputs
    inputText: '#F5E9DC',         // Couleur texte dans inputs, même que ivory
    buttonBackground: '#D4AF37',  // Fond des boutons = gold
    buttonHover: '#bfa341',       // Or un peu plus foncé au hover
    footerText: '#F5E9DC',        // Texte du footer (même que ivory)
    error: '#ff4d4f',             // Rouge pour les erreurs (ajout personnalisé)
  },
  fonts: {
    serif: `'Playfair Display', serif`,
    sans: `'Poppins', sans-serif`,
  },
  // Ajout borderRadius global
  borderRadius: '0.75rem',

  // Ajout shadows
  shadows: {
    glow: '0 0 10px #D4AF37',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.7)',
  }
}

export default luxuryTheme;