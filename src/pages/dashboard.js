import { supabase } from '../lib/supabase'
import useRequireAuth from '../hooks/useRequireAuth'

export default function Dashboard() {
  const { user, loading } = useRequireAuth()

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-yellow-400 tracking-wide">
          🌟 Tajirr
        </div>
        <button onClick={async () => {
          await supabase.auth.signOut()
          location.href = '/'
        }} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm">
          Déconnexion
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">Bienvenue {user?.email} 👋</h1>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-4">
        <h2 className="text-xl font-semibold mb-2">Classement & Badges (à venir)</h2>
        <p className="text-gray-400">Ton rang, ton badge, ta position… bientôt ici !</p>
      </div>
    </div>
  )
}
