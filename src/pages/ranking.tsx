import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useOptionalAuth from '../hooks/useOptionalAuth'
import { Container, Header, Title, Button, Controls, SearchInput, ButtonGroup, UserList, UserItem, UserInfo, Username, Rank, Points, Pagination, PageButton, LoadingText } from '../styles/rankingStyles'

type RankedUser = {
  id: string
  username: string
  nom: string
  prenom: string
  total_depot: number
  rank_id: {
    nom: string
  } | null
  place: number
}

export default function Ranking() {
  const { user } = useOptionalAuth()
  const router = useRouter()
  const [users, setUsers] = useState<RankedUser[]>([])
  const [orderAsc, setOrderAsc] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const userRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    fetchClassement()
  }, [orderAsc])

  const fetchClassement = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, nom, prenom, total_depot, rank_id(nom)')

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const typedData = (data ?? []) as RankedUser[]

    // Tri CROISSANT (du meilleur au moins bon)
    const sorted = typedData.sort((a, b) => b.total_depot - a.total_depot)

    // Attribution de la place, fixe
    const withPlaces = sorted.map((user, index) => ({
      ...user,
      place: index + 1,
    }))

    setUsers(withPlaces)
    setLoading(false)
  }

  console.log('Users rankedList:', users)

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.prenom} ${u.nom}`.toLowerCase()
    return (
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase())
    )
  })

  const totalPages = Math.ceil(filteredUsers.length / perPage)
  const displayedUsers = [...filteredUsers]
    .sort((a, b) => {
      return orderAsc ? a.place - b.place : b.place - a.place
    })
    .slice((currentPage - 1) * perPage, currentPage * perPage)


  const goToUser = () => {
    if (!user) return
    const index = filteredUsers.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      const page = Math.floor(index / perPage) + 1
      setCurrentPage(page)

      // Scroll dans un petit délai pour attendre le re-render
      setTimeout(() => {
        userRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }

  return (
    <Container>
      <Header>
        <Title>Classement Général</Title>
        <Button variant="primary" onClick={() => router.push('/dashboard')}>
          Retour au dashboard
        </Button>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Rechercher un utilisateur"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ButtonGroup>
          <Button onClick={() => setOrderAsc(!orderAsc)}>
            {orderAsc ? 'Ordre décroissant' : 'Ordre croissant'}
          </Button>
          {user && (
            <Button variant="primary" onClick={goToUser}>
              Me localiser
            </Button>
          )}
        </ButtonGroup>
      </Controls>

      {loading ? (
        <LoadingText>Chargement...</LoadingText>
      ) : (
        <UserList>
          {displayedUsers.map((u, i) => {
            const globalIndex = (currentPage - 1) * perPage + i + 1

            // Ajout de la médaille pour les 3 premiers
            const getMedal = (place: number) => {
              if (place === 1) return '🥇'
              if (place === 2) return '🥈'
              if (place === 3) return '🥉'
              return `#${place}`
            }

            return (
              <UserItem key={u.id} highlight={user?.id === u.id} ref={u.id === user?.id ? userRef : null} topRank={u.place}>
                <UserInfo>
                  <Username>
                    {getMedal(u.place)} — {u.username || `${u.prenom} ${u.nom}`}
                  </Username>
                  <Rank>#{u.place} — Rang : {u.rank_id?.nom || 'N/A'}</Rank>
                </UserInfo>
                <Points>{u.total_depot} points</Points>
              </UserItem>
            )
          })}

          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <PageButton
                key={i}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
          </Pagination>
        </UserList>
      )}
    </Container>
  )
}