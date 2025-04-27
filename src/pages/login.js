import { supabase } from '../lib/supabase'

export default function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.log('Erreur connexion Google:', error.message)
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-800 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Connexion</h1>
        <button
          onClick={signInWithGoogle}
          className="mt-6 bg-red-500 px-6 py-3 rounded-lg text-white hover:bg-red-600"
        >
          Se connecter avec Google
        </button>
      </div>
    </div>
  )
}
