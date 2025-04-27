import { supabase } from '../lib/supabase'

export default function Home() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.log('Erreur connexion Google:', error.message)
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-800 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Tajirr Rank</h1>
        <p className="text-xl">Prove your success. Join the elite.</p>
        <div className="space-x-4">
          <button
            onClick={signInWithGoogle}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Connexion
          </button>
        </div>
      </div>
    </div>
  )
}
