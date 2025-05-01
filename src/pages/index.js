import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [loading, setLoading] = useState(false)

  // const signInWithGoogle = async () => {
  //   setLoading(true)
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //   })
  //   if (error) {
  //     console.log('Erreur connexion Google:', error.message)
  //     setLoading(false) // Si erreur ➔ on arrête le loading
  //   }
  // }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Tajirr Rank</h1>
        <p className="text-xl">Prove your success. Join the elite.</p>
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
            <p className="text-xl font-semibold">Connexion en cours...</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
