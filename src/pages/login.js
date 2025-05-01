import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/')
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    let emailToUse = emailOrUsername.trim()

    // Si c’est un username (pas d’@)
    if (!emailToUse.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailToUse)
        .single()

      if (error || !data?.email) {
        setErrorMessage("Nom d'utilisateur introuvable.")
        setLoading(false)
        return
      }

      emailToUse = data.email
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password
    })

    if (error) {
      setErrorMessage("Identifiants incorrects.")
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>

      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Email ou nom d'utilisateur"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full p-2 rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded text-black"
          required
        />

        {errorMessage && (
          <div className="text-red-400 text-sm">{errorMessage}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
