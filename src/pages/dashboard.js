import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)

        // Récupère le profil lié
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error("Erreur lors de la récupération du profil :", error.message)
        } else {
          setProfile(profileData)
        }

        setLoading(false)
      }
    }

    getSessionAndProfile()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Chargement...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Logo + Déconnexion */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-yellow-400 tracking-wide">
          🌟 Tajirr
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm">
          Déconnexion
        </button>
      </div>

      {/* Message de bienvenue */}
      <h1 className="text-3xl font-bold mb-4">
        Bienvenue {profile?.prenom} 👋
      </h1>

      {/* Bloc Profil */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-4">
        <h2 className="text-xl font-semibold mb-2">Ton Profil</h2>
        <ul className="space-y-2 text-gray-300">
          <li><strong>Nom :</strong> {profile?.nom}</li>
          <li><strong>Username :</strong> {profile?.username || "—"}</li>
          <li><strong>Email :</strong> {user?.email}</li>
          <li><strong>Rang :</strong> {profile?.rank}</li>
          <li><strong>Argent Déposé :</strong> {profile?.total_depot} €</li>
          <li><strong>Abonnement :</strong> {profile?.abonnement_actif ? profile?.type_abonnement : "Aucun"}</li>
        </ul>
      </div>
    </div>
  )
}
