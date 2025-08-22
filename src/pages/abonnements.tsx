import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
import { Container, TopBar, Title, ReturnButton, Grid, Card, CardTitle, Text, SubscribeButton, BottomText, Highlight, NoticeText, UnsubscribeButton, Spinner, ConfirmationOverlay, ConfirmationBox, ConfirmationText, ConfirmationButton, CancelButton } from '../styles/abonnementStyles'
import { useTranslation } from 'react-i18next'
import Head from 'next/head'

export default function Abonnements() {
    const { user, loading: loadingAuth } = useRequireAuth()
    const [abonnements, setAbonnements] = useState<any[]>([])
    const [userProfile, setUserProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [loadingUnsub, setLoadingUnsub] = useState(false)
    const [confirmStep, setConfirmStep] = useState(0)
    const router = useRouter()
    const { t } = useTranslation('en', { useSuspense: false })

    useEffect(() => {
        const fetchData = async () => {
            const [abRes, profileRes] = await Promise.all([
                supabase.from('abonnements').select('*').order('prix', { ascending: true }),
                supabase.from('profiles').select('username, abonnement_id').eq('id', user?.id).single(),
            ])

            if (!abRes.error) setAbonnements(abRes.data || [])
            if (!profileRes.error) setUserProfile(profileRes.data)

            setLoading(false)
        }

        if (user?.id) fetchData()
    }, [user])

    const handleUnsubscribe = async () => {
        setConfirmStep(1)
    }

    const confirmUnsubscribe = async () => {
        if (confirmStep === 1) {
            setConfirmStep(2)
        } else if (confirmStep === 2) {
            setLoadingUnsub(true)
            try {
                const res = await fetch('../api/cancel-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user?.id }),
                })

                const result = await res.json()
                if (result.success) {
                    await supabase.from('profiles').update({ abonnement_id: null, derniere_recharge: null }).eq('id', user?.id)
                    setConfirmStep(3)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                } else {
                    alert(t('abonnements.errorMessage1'))
                    setConfirmStep(0)
                }
            } catch (err) {
                alert(t('abonnements.errorMessage2'))
                setConfirmStep(0)
            } finally {
                setLoadingUnsub(false)
            }
        }
    }

    return (
        <Container>
            <Head> <title>Tajirr | {t('abonnements.title')}</title> </Head>
            <TopBar>
                <Title>{t('abonnements.title')}</Title>
                <ReturnButton onClick={() => router.push('/dashboard')}>
                    {t('abonnements.back')}
                </ReturnButton>
            </TopBar>

            {loading ? (
                <p>{t('abonnements.loading')}</p>
            ) : (
                <>
                    <Grid>
                        {abonnements.map((abonnement) => {
                            const isCurrent = userProfile?.abonnement_id === abonnement.id
                            const hasAbonnement = !!userProfile?.abonnement_id

                            return (
                                <Card key={abonnement.id}>
                                    <CardTitle>{abonnement.nom}</CardTitle>
                                    <Text>{t('abonnements.price')} : {abonnement.prix} € / {t('abonnements.month')}</Text>
                                    <Text>{t('abonnements.points')} : {abonnement.points_mensuels}</Text>
                                    {hasAbonnement ? (
                                        isCurrent ? (
                                            <NoticeText>⏳ {t('abonnements.currentSubscription')}</NoticeText>
                                        ) : (
                                            <NoticeText>🔒 {t('abonnements.unsubscribeFirst')}</NoticeText>
                                        )
                                    ) : (
                                        <SubscribeButton
                                            onClick={async () => {
                                                const res = await fetch('../api/create-checkout-session', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        priceId: abonnement.stripe_price_id,
                                                        abonnementId: abonnement.id,
                                                        isSubscription: true,
                                                        userId: user?.id,
                                                        derniere_recharge: new Date().toISOString(),
                                                    }),
                                                })

                                                const data = await res.json()
                                                if (data.url) {
                                                    window.location.href = data.url
                                                }
                                            }}
                                            disabled={hasAbonnement}
                                        >
                                            {t('abonnements.subscribe')}
                                        </SubscribeButton>
                                    )}
                                </Card>
                            )
                        })}
                    </Grid>
                    {userProfile?.abonnement_id && (
                        <UnsubscribeButton onClick={handleUnsubscribe}>
                            {t('abonnements.unsubscribe')}
                        </UnsubscribeButton>
                    )}
                </>
            )}

            {confirmStep > 0 && (
                <ConfirmationOverlay>
                    <ConfirmationBox>
                        {loadingUnsub ? (
                            <>
                                <Spinner />
                                <ConfirmationText>{t('abonnements.unsubscribeLoading')}</ConfirmationText>
                            </>
                        ) : (
                            <>
                                <ConfirmationText>
                                    {confirmStep === 1
                                        ? t('abonnements.verifUnsubscribe1')
                                        : confirmStep === 2
                                            ? t('abonnements.verifUnsubscribe2')
                                            : t('abonnements.unsubscriptionCompleted')}
                                </ConfirmationText>
                                {confirmStep < 3 && (
                                    <>
                                        <ConfirmationButton onClick={confirmUnsubscribe}>{t('abonnements.yes')}</ConfirmationButton>
                                        <CancelButton onClick={() => setConfirmStep(0)}>{t('abonnements.cancel')}</CancelButton>
                                    </>
                                )}
                            </>
                        )}
                    </ConfirmationBox>
                </ConfirmationOverlay>
            )}

            <BottomText>
                {t('abonnements.faster')}{' '}
                <Highlight onClick={() => router.push('/packs')}>
                    {t('abonnements.discoverPacks')} →
                </Highlight>
            </BottomText>
        </Container>
    )
}