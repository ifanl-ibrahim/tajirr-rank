import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    // Vérifications locales
    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.")
      setLoading(false)
      return
    }

    // Création de l'utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      if (error.message.includes("already registered")) {
        setErrorMessage("Cet email est déjà utilisé.")
      } else {
        setErrorMessage(error.message)
      }
      setLoading(false)
      return
    }

    const user = data.user
    if (user) {
      // Création du profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email,
          nom,
          prenom,
          username
        }])

      if (profileError) {
        if (profileError.message.includes("duplicate key")) {
          setErrorMessage("Ce nom d'utilisateur ou cet email existe déjà.")
        } else {
          setErrorMessage("Erreur lors de la création du profil : " + profileError.message)
        }
        setLoading(false)
        return
      }

      // alert('Compte créé avec succès ! Vérifie ton e-mail.')
      alert('Compte créé avec succès !')
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>

      <form onSubmit={handleSignUp} className="space-y-4 w-full max-w-sm">
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)}
          className="w-full p-2 rounded text-black" required/>
        <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)}
          className="w-full p-2 rounded text-black" required/>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded text-black" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded text-black" required />
        <input type="password" placeholder="Mot de passe (min. 6 caractères)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded text-black" required />
        <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 rounded text-black" required />

        {errorMessage && (
          <div className="text-red-400 text-sm">{errorMessage}</div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
      </form>
    </div>
  )
}
