import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'

type RankedUser = {
  id: string
  username: string
  nom: string
  prenom: string
  total_depot: number
  rank_id: {
    nom: string
  } | null
}

export default function Ranking() {
  const { user, userProfile } = useRequireAuth()
  const router = useRouter()
  const [users, setUsers] = useState<RankedUser[]>([])
  const [orderAsc, setOrderAsc] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userProfile) {
      fetchClassement()
    }
  }, [orderAsc, userProfile])

  const fetchClassement = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, nom, prenom, total_depot, rank_id(nom)')

    if (error) {
      console.error(error)
    } else {
      // ⚠️ Tri manuel sur le label du rang
      const typedData = (data ?? []) as RankedUser[]
      const sorted = typedData.sort((a, b) => {
        const nomA = a.rank_id?.nom || ''
        const nomB = b.rank_id?.nom || ''
        return orderAsc
          ? nomA.localeCompare(nomB)
          : nomB.localeCompare(nomA)
      })
      setUsers(sorted)
    }
    setLoading(false)
  }

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.prenom} ${u.nom}`.toLowerCase()
    return (
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase())
    )
  })

  const totalPages = Math.ceil(filteredUsers.length / perPage)
  const displayedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage)

  const goToUser = () => {
    const index = filteredUsers.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      const page = Math.floor(index / perPage) + 1
      setCurrentPage(page)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Classement Général</h1>
        <button
          className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
          onClick={() => router.push('/dashboard')}
        >
          Retour au dashboard
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un utilisateur"
          className="p-2 rounded text-black w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2 items-center">
          <button onClick={() => setOrderAsc(!orderAsc)} className="bg-gray-700 px-3 py-1 rounded">
            {orderAsc ? 'Ordre décroissant' : 'Ordre croissant'}
          </button>
          <button onClick={goToUser} className="bg-green-600 px-3 py-1 rounded">
            Me localiser
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-2">
          {displayedUsers.map((u, i) => (
            <div
              key={u.id}
              className={`p-4 rounded bg-gray-800 flex items-center gap-4 ${u.id === user.id ? 'border border-yellow-400' : ''
                }`}
            >
              {/* <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${u.username}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              /> */}
              <div>
                <p className="font-semibold">
                  {u.username || `${u.prenom} ${u.nom}`}
                </p>
                <p className="text-sm text-gray-400">Rang : {u.rank_id?.nom || 'N/A'}</p>
              </div>
              <div className="ml-auto text-right">
                <p>{u.total_depot} points</p>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
