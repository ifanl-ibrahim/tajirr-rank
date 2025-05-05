import useRequireAuth from '../hooks/useRequireAuth'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ProfileModal from './ProfileModal'

export default function Dashboard() {
  const { user, userProfile, loading, isError } = useRequireAuth()
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localProfile, setLocalProfile] = useState(null)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    if (userProfile) {
      setLocalProfile(userProfile)
    }
  }, [userProfile])


  const handleProfileUpdated = (updatedProfile: any) => {
    setLocalProfile(updatedProfile)
    closeModal()
  }

  if (loading) return <div>Chargement du profil...</div>
  if (isError) return <div>Erreur lors du chargement des informations</div>
  if (!user || !userProfile) return <div>Utilisateur non trouvé</div>
  if (!localProfile) return <div>Chargement du profil local...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-yellow-400">🌟 Tajirr</div>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </div>

      <h1 className="text-3xl font-semibold mb-2">Bienvenue {localProfile.prenom} 👋</h1>
      <p className="mb-6 text-gray-400">Tu es un investisseur dans l’âme 💸</p>

      <div className="bg-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
        <div>
          <p>🏅 Rang actuel : <strong>{localProfile.rank_name}</strong></p>
          <p>📈 Position dans le classement : {localProfile.position || '—'}e</p>
          <p>💰 Tu as acquis {localProfile.total_points || 0} points — tu es à {localProfile.rank_progress || 0}% du rang Or !</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => router.push('/ranking')}
            className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mt-4"
          >
            Voir le classement
          </button>
          <button
            onClick={openModal}
            className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Modifier mon profil
          </button>
          <ProfileModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            userProfile={localProfile}
            onProfileUpdated={handleProfileUpdated}
          />
          <button
            onClick={() => router.push('/abonnements')}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Voir les offres
          </button>
        </div>
      </div>
    </div>
  )
}
