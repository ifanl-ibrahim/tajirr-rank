import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
      authListener?.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
