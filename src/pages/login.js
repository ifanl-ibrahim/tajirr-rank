// import { supabase } from '../lib/supabase'

// export default function Login() {
//   const signInWithGoogle = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//     })
//     if (error) console.log('Erreur connexion Google:', error.message)
//   }

//   return (
//     <div className="flex min-h-screen justify-center items-center bg-gray-800 text-white">
//       <div className="text-center space-y-4">
//         <h1 className="text-4xl font-bold">Connexion</h1>
//         <button
//           onClick={signInWithGoogle}
//           className="mt-6 bg-red-500 px-6 py-3 rounded-lg text-white hover:bg-red-600"
//         >
//           Se connecter avec Google
//         </button>
//       </div>
//     </div>
//   )
// }



import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-black" required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded text-black" required />
        <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Se connecter</button>
      </form>
    </div>
  )
}
