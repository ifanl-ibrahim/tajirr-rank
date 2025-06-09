import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import '../styles/globals.css'
import GlobalStyle from '../styles/GlobalStyle'
import { ThemeProvider } from 'styled-components'
import { luxuryTheme } from '../styles/theme'
import { ThemeProvider2 } from '../lib/ThemeContext'
import HeaderBar from './components/HeaderBar'

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Stocke la session sur le device
        localStorage.setItem('supabase.auth.token', JSON.stringify(session))
      } else {
        localStorage.removeItem('supabase.auth.token')
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return (
    <ThemeProvider theme={luxuryTheme}>
      <ThemeProvider2>
        <GlobalStyle />
        <HeaderBar />
        <Component {...pageProps} />
      </ThemeProvider2>
    </ThemeProvider>
  )
}

export default MyApp
