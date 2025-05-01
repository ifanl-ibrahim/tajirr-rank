import { useEffect, useState  } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      } else {
        setCheckingSession(false) // On n’est pas connecté, on peut afficher la page d’accueil
      }
    }

    checkSession()
  }, [router])

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Chargement...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Tajirr Rank</h1>
        <p className="text-xl">Prove your success. Join the elite.</p>
          <div>
            <Link href="/signup">
              <button /* onClick={signInWithGoogle} */ className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg">
                Créer un compte
              </button>
            </Link>
            <Link href="/login">
              <button /* onClick={signInWithGoogle} */ className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg">
                Se connecter
              </button>
            </Link>
          </div>
      </div>
    </div>
  )
}
