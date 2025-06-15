// lib/themes.ts
export const darkTheme = {
  colors: {
    night: ' #121212',
    gold: ' #FFD700',
    text: ' #ffffff',
    background: ' #121212',
    ivory: ' #f5e9dc',
    degrader: 'linear-gradient(135deg, #1a1a1a, #2b2b2b)',
    lightTheme: ' #2b2b2b',
  },
  fonts: {
    serif: `'Playfair Display', serif`,
    sans: `'Poppins', sans-serif`,
  },
  borderRadius: '0.75rem',
  shadows: {
    glow: '0 0 10px #D4AF37',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.7)',
  }
}

export const lightTheme = {
  colors: {
    night: ' #f5f5f5',
    gold: ' #ab8430',
    text: ' #000000',
    background: ' #f5f5f5',
    ivory: ' #051623',
    degrader: 'linear-gradient(135deg, #efefef, #e9e9e9)',
    lightTheme: ' #e9e9e9',
  },
  fonts: {
    serif: `'Playfair Display', serif`,
    sans: `'Poppins', sans-serif`,
  },
  borderRadius: '0.75rem',
  shadows: {
    glow: '0 0 10px #D4AF37',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.7)',
  }
}

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
  }
}