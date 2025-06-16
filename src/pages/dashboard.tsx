import useRequireAuth from '../hooks/useRequireAuth'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ProfileModal from './components/ProfileModal'
import { useTheme } from 'styled-components'
import { Container, Button, Card, Avatar, FlexRow, ProgressBar, ProgressInner, RightText, ButtonGroup, Backdrop } from '../styles/dashboardStyles'
import { useTranslation } from 'react-i18next'
import ContactTrigger from './components/ContactTrigger'
import Head from 'next/head'
import Image from 'next/image'

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
  const { t } = useTranslation('en', { useSuspense: false })

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
      if (!currentRank) return console.warn(t('dashboard.errorMessage'))
      const upcomingRank = ranks[currentIndex + 1] || null

      setRankInfo(currentRank)
      setNextRank(upcomingRank)

      if (upcomingRank) {
        const percent = Math.min(
          ((userProfile.total_depot - currentRank.seuil) / (upcomingRank.seuil - currentRank.seuil)) * 100,
          100
        )
        setRankProgress(parseFloat(percent.toFixed(1)))
      } else {
        setRankProgress(100)
      }

      const { data: allUsers } = await supabase
        .from('profiles')
        .select('username, total_depot')

      const sorted = allUsers.sort((a, b) => b.total_depot - a.total_depot)
      const rankIndex = sorted.findIndex((u) => u.username === userProfile.username) + 1
      setPosition(rankIndex)
    }

    fetchData()
  }, [userProfile, t])

  useEffect(() => {
    if (!rankInfo?.badge_path) return

    const publicUrl = `https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges/${rankInfo.badge_path}`
    setBadgeUrl(publicUrl)
  }, [rankInfo])

  const handleProfileUpdated = (updatedProfile: any) => {
    setLocalProfile(updatedProfile)
    closeModal()
  }

  if (loading) return <div style={{ margin: '5em' }}>{t('dashboard.loading')}</div>
  if (isError) return <div style={{ margin: '5em' }}>{t('dashboard.loadingError')}</div>
  if (!user || !userProfile || !localProfile) return <div style={{ margin: '5em' }}>{t('dashboard.loadingValid')}</div>

  const handleCopyProfileLink = () => {
    if (!localProfile?.username) return
    const publicUrl = `${process.env.NEXT_PUBLIC_API_HOST}/u/${localProfile.username}`
    navigator.clipboard.writeText(publicUrl)
      .then(() => alert(t('dashboard.linkCopied')))
      .catch(() => alert(t('dashboard.copyError')))
  }

  return (
    <Container>
      <Head> <title>Tajirr</title> </Head>
      <Card>
        <FlexRow>
          <Avatar>
            {badgeUrl ? (
              <Image
                src={badgeUrl}
                alt={rankInfo?.nom}
                width={100}
                height={100}
                style={{
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
            <h2 style={{ margin: 0 }}>{localProfile.prenom} {localProfile.nom}</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>@{localProfile.username}</p>
            <p style={{ marginTop: 8 }}>{t('dashboard.rank')} : <strong>{rankInfo?.nom}</strong></p>
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
                aria-label={t('dashboard.closeModal')}
              >
                &times;
              </button>
              <Image
                src={badgeUrl}
                alt={rankInfo?.nom}
                width={350}
                height={350}
                style={{
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
                }}
              />
            </div>
          </Backdrop>
        )}

        <div style={{ marginTop: 24 }}>
          <div>
            {nextRank
              ? `${localProfile.total_depot} / ${nextRank.seuil} points`
              : t('dashboard.maxRank')}
          </div>
          <ProgressBar>
            <ProgressInner percent={rankProgress} />
          </ProgressBar>
          <RightText>{rankProgress}%</RightText>
        </div>

        <Button onClick={openModal} style={{ marginTop: 24 }}>{t('dashboard.editProfile')}</Button>
        <Button onClick={handleCopyProfileLink}>
          🔗 {t('dashboard.copyLink')}
        </Button>
        <ProfileModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          userProfile={localProfile}
          onProfileUpdated={handleProfileUpdated}
        />
      </Card>

      <Card>
        <h2 style={{ marginBottom: 16 }}>💰 {t('dashboard.totalPoints')}</h2>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{localProfile.total_depot} pts</p>
        <ButtonGroup>
          <Button onClick={() => router.push('/packs')}>➕ {t('dashboard.buyPacks')}</Button>
          <Button onClick={() => router.push('/abonnements')}>🔁 {t('dashboard.buySubscription')}</Button>
        </ButtonGroup>
      </Card>

      <Card>
        <h2>🏆  {t('dashboard.ranking')}</h2>
        <p> {t('dashboard.youRank')} <strong style={{ color: theme.colors.gold }}>#{position}</strong></p>
        <Button
          style={{ marginTop: 16 }}
          onClick={() => router.push('/ranking')}
        >
          {t('dashboard.viewRanking')}
        </Button>
      </Card>
      <ContactTrigger />
    </Container>
  )
}