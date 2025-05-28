import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  /* Reset basique */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body, html, #__next {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.sans};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-y: scroll; /* Toujours afficher la scrollbar verticale pour éviter le saut de page */
  }

  a {
    color: ${({ theme }) => theme.colors.gold};
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.ivory};
    text-decoration: underline;
  }

  button {
    font-family: ${({ theme }) => theme.fonts.sans};
    cursor: pointer;
  }

  input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.sans};
    color: ${({ theme }) => theme.colors.text};
  }

  /* Scrollbar personnalisée (Chrome, Edge, Safari) */
  ::-webkit-scrollbar {
    width: 8px;
    background-color: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.gold};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.ivory};
  }

  /* Animation subtile sur le body pour un léger glow doré */
  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 10px ${({ theme }) => theme.colors.gold};
    }
    50% {
      text-shadow: 0 0 20px ${({ theme }) => theme.colors.ivory};
    }
  }

  body {
    animation: glow 8s ease-in-out infinite alternate;
  }
`

export default GlobalStyle