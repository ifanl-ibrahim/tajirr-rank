import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
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
          <Button variant="primary" onClick={goToUser}>
            Me localiser
          </Button>
        </ButtonGroup>
      </Controls>

      {loading ? (
        <LoadingText>Chargement...</LoadingText>
      ) : (
        <UserList>
          {displayedUsers.map((u) => (
            <UserItem key={u.id} highlight={u.id === user.id}>
              <UserInfo>
                <Username>{u.username || `${u.prenom} ${u.nom}`}</Username>
                <Rank>Rang : {u.rank_id?.nom || 'N/A'}</Rank>
              </UserInfo>
              <Points>{u.total_depot} points</Points>
            </UserItem>
          ))}

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