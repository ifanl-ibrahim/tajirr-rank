import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import '../styles/globals.css'
import GlobalStyle from '../styles/GlobalStyle'
import { ThemeProvider } from 'styled-components'
import { luxuryTheme } from '../lib/themes'
import { ThemeProvider2 } from '../lib/ThemeContext'
import HeaderBar from './components/HeaderBar'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

i18next.use(initReactI18next).use(Backend).init({
  backend: {
    loadPath: '/locales/{{ lng }}/common.json'
  },
  lng: 'en',
  fallbackLng: 'en'
})

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