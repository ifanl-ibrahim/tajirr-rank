import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useOptionalAuth from '../hooks/useOptionalAuth'
import { Container, HeaderRanking, Title, Button, Controls, SearchInput, ButtonGroup, UserList, UserItem, UserInfo, Username, Rank, Points, Pagination, PageButton, LoadingText } from '../styles/rankingStyles'
import { useTranslation } from 'react-i18next'
import Head from 'next/head'
import Image from 'next/image'

type SupabaseUser = {
  username: string
  nom: string
  prenom: string
  total_depot: number
  rank_id: {
    nom: string
    badge_path: string
  } | null
}

type RankedUser = SupabaseUser & {
  place: number
}

export default function Ranking() {
  const { userProfile } = useOptionalAuth()
  console.log("localUser", userProfile);
  
  const router = useRouter()
  const [users, setUsers] = useState<RankedUser[]>([])
  const [orderAsc, setOrderAsc] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const userRef = useRef<HTMLLIElement | null>(null)
  const { t } = useTranslation('en', { useSuspense: false })

  const fetchClassement = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        username, 
        nom, 
        prenom, 
        total_depot, 
        rank_id (
          nom,
          badge_path
        )
      `)

    if (error || !data) {
      console.error(error)
      setLoading(false)
      return
    }

    const typedData = (data ?? []).map((user: any) => ({
      ...user,
      rank_id: Array.isArray(user.rank_id) ? user.rank_id[0] : user.rank_id,
    })) as SupabaseUser[]

    // Tri CROISSANT (du meilleur au moins bon)
    const sorted = typedData.sort((a, b) => b.total_depot - a.total_depot)

    // Attribution de la place, fixe
    const withPlaces: RankedUser[] = sorted.map((user, index) => ({
      ...user,
      place: index + 1,
    }))

    setUsers(withPlaces)
    setLoading(false)
  }

  useEffect(() => {
    fetchClassement()
  }, [orderAsc])

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
    if (!userProfile) return
    const index = filteredUsers.findIndex((u) => u.username === userProfile?.username)
    
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
      <Head> <title>Tajirr | {t('ranking.title')}</title> </Head>
      <HeaderRanking>
        <Title>{t('ranking.title')}</Title>
        <Button variant="primary" onClick={() => router.push('/dashboard')}>
          {t('ranking.back')}
        </Button>
      </HeaderRanking>

      <Controls>
        <SearchInput
          type="text"
          placeholder={t('ranking.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ButtonGroup>
          <Button onClick={() => setOrderAsc(!orderAsc)}>
            {orderAsc ? t('ranking.descending') : t('ranking.ascending')}
          </Button>
          {userProfile && (
            <Button variant="primary" onClick={goToUser}>
              {t('ranking.locate')}
            </Button>
          )}
        </ButtonGroup>
      </Controls>

      {loading ? (
        <LoadingText>{t('ranking.load')}</LoadingText>
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
              <UserItem key={u.username} highlight={userProfile?.username === u.username} ref={u.username === userProfile?.username ? userRef : null} topRank={u.place}>
                <UserInfo>
                  <Username>
                    {getMedal(u.place)} - {u.username ? `@${u.username}` : `${u.prenom} ${u.nom}`}
                  </Username>
                  <Rank>#{u.place} - {t('ranking.rank')} : {u.rank_id?.nom || 'N/A'}</Rank>
                </UserInfo>
                {u.rank_id?.badge_path && (
                  <Image
                    src={`https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges/${u.rank_id.badge_path}`}
                    alt={`Badge de ${u.username}`}
                    width={100}
                    height={100}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid gold',
                      marginLeft: 'auto',
                    }}
                  />
                )}
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