import useRequireAuth from '../hooks/useRequireAuth'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ProfileModal from './ProfileModal'
import { useTheme } from 'styled-components'
import HeaderBar from './components/HeaderBar'
import { Container, Header, Brand, Button, Card, Avatar, FlexRow, ProgressBar, ProgressInner, RightText, ButtonGroup, Backdrop } from '../styles/dashboardStyles'

export default function Dashboard() {
  const theme = useTheme()
  const { user, userProfile, loading, isError } = useRequireAuth()
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localProfile, setLocalProfile] = useState(null)
  const [rankInfo, setRankInfo] = useState(null)
  const [nextRank, setNextRank] = useState(null)
  const [position, setPosition] = useState(null)
  const [rankProgress, setRankProgress] = useState(0)
  const [badgeUrl, setBadgeUrl] = useState(null)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false)
  const [isBadgeModalVisible, setIsBadgeModalVisible] = useState(false) // contrôle l'affichage réel

  const openBadgeModal = () => {
    setIsBadgeModalVisible(true)
    // lancement animation fade-in via classe CSS
    setTimeout(() => setIsBadgeModalOpen(true), 10) // léger delay pour forcer animation
  }

  const closeBadgeModal = () => {
    setIsBadgeModalOpen(false)
    // après la durée de l'animation, on retire le modal du DOM
    setTimeout(() => setIsBadgeModalVisible(false), 300)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile) return

      setLocalProfile(userProfile)

      const { data: ranks } = await supabase
        .from('ranks')
        .select('*')
        .order('seuil', { ascending: true })

      const currentRank = ranks.find((r) => r.id === userProfile.rank_id)
      const currentIndex = ranks.findIndex((r) => r.id === currentRank.id)
      if (!currentRank) return console.warn('Rang introuvable pour cet utilisateur.')
      const upcomingRank = ranks[currentIndex + 1] || null

      setRankInfo(currentRank)
      setNextRank(upcomingRank)

      if (upcomingRank) {
        const percent = Math.min(
          ((userProfile.total_depot - currentRank.seuil) / (upcomingRank.seuil - currentRank.seuil)) * 100,
          100
        )
        setRankProgress(percent.toFixed(1))
      } else {
        setRankProgress(100)
      }

      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, total_depot')

      const sorted = allUsers.sort((a, b) => b.total_depot - a.total_depot)
      const rankIndex = sorted.findIndex((u) => u.id === userProfile.id) + 1
      setPosition(rankIndex)
    }

    fetchData()
  }, [userProfile])

  useEffect(() => {
    if (!rankInfo?.badge_path) return

    const publicUrl = `https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges/${rankInfo.badge_path}`
    setBadgeUrl(publicUrl)
  }, [rankInfo])

  const handleProfileUpdated = (updatedProfile: any) => {
    setLocalProfile(updatedProfile)
    closeModal()
  }

  if (loading) return <div>Chargement du profil...</div>
  if (isError) return <div>Erreur lors du chargement</div>
  if (!user || !userProfile || !localProfile) return <div>Utilisateur non trouvé</div>

  return (
    <Container>
      <HeaderBar />
      <Card>
        <FlexRow>
          <Avatar>
            {badgeUrl ? (
              <img
                src={badgeUrl}
                alt={rankInfo?.nom}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
                onClick={openBadgeModal}
              />
            ) : (
              localProfile.username?.charAt(0) || 'U'
            )}
          </Avatar>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{localProfile.prenom} {localProfile.nom}</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>@{localProfile.username}</p>
            <p style={{ marginTop: 8 }}>Rang : <strong>{rankInfo?.nom}</strong></p>
          </div>
        </FlexRow>
        {isBadgeModalVisible && (
          <Backdrop isOpen={isBadgeModalOpen} onClick={closeBadgeModal}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative' }}
            >
              <button
                onClick={closeBadgeModal}
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  color: 'white',
                  width: 30,
                  height: 30,
                  fontSize: 20,
                  cursor: 'pointer',
                  zIndex: 10000,
                  lineHeight: 1,
                }}
                aria-label="Fermer la modale"
              >
                &times;
              </button>
              <img
                src={badgeUrl}
                alt={rankInfo?.nom}
                style={{
                  borderRadius: '50%',
                  maxWidth: '80vw',
                  maxHeight: '80vh',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
                  cursor: 'default',
                  display: 'block',
                }}
              />
            </div>
          </Backdrop>
        )}

        <div style={{ marginTop: 24 }}>
          <div>
            {nextRank
              ? `${localProfile.total_depot} / ${nextRank.seuil} points`
              : `Rang maximum atteint`}
          </div>
          <ProgressBar>
            <ProgressInner percent={rankProgress} />
          </ProgressBar>
          <RightText>{rankProgress}%</RightText>
        </div>

        <Button onClick={openModal} style={{ marginTop: 24 }}>Modifier le profil</Button>
        <ProfileModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          userProfile={localProfile}
          onProfileUpdated={handleProfileUpdated}
        />
      </Card>

      <Card>
        <h2 style={{ marginBottom: 16 }}>💰 Total de points</h2>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{localProfile.total_depot} pts</p>
        <ButtonGroup>
          <Button onClick={() => router.push('/packs')}>➕ Acheter un Pack</Button>
          <Button onClick={() => router.push('/abonnements')}>🔁 S’abonner</Button>
        </ButtonGroup>
      </Card>

      <Card>
        <h2>🏆 Classement</h2>
        <p>Tu es <strong style={{ color: theme.colors.gold }}>#{position}</strong></p>
        <Button
          style={{ marginTop: 16 }}
          onClick={() => router.push('/ranking')}
        >
          Voir le classement global
        </Button>
      </Card>
    </Container>
  )
}