import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
import { Container, TopBar, Title, ReturnButton, Grid, Card, CardTitle, Text, SubscribeButton, BottomText, Highlight, NoticeText, UnsubscribeButton, Spinner, ConfirmationOverlay, ConfirmationBox, ConfirmationText, ConfirmationButton, CancelButton } from '../styles/abonnementStyles'

export default function Abonnements() {
    const { user, loading: loadingAuth } = useRequireAuth()
    const [abonnements, setAbonnements] = useState<any[]>([])
    const [userProfile, setUserProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [loadingUnsub, setLoadingUnsub] = useState(false)
    const [confirmStep, setConfirmStep] = useState(0)
    const [isUnsubscribing, setIsUnsubscribing] = useState(false)
    const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<null | boolean>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const [abRes, profileRes] = await Promise.all([
                supabase.from('abonnements').select('*').order('prix', { ascending: true }),
                supabase.from('profiles').select('*').eq('id', user?.id).single(),
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
                    await supabase.from('profiles').update({ abonnement_id: null }).eq('id', user?.id)
                    setConfirmStep(3)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                } else {
                    alert('Erreur : désinscription échouée.')
                    setConfirmStep(0)
                }
            } catch (err) {
                alert('Une erreur est survenue.')
                setConfirmStep(0)
            } finally {
                setLoadingUnsub(false)
            }
        }
    }

    return (
        <Container>
            <TopBar>
                <Title>🌟 Abonnements</Title>
                <ReturnButton onClick={() => router.push('/dashboard')}>
                    Retour
                </ReturnButton>
            </TopBar>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <Grid>
                        {abonnements.map((abonnement) => {
                            const isCurrent = userProfile?.abonnement_id === abonnement.id
                            const hasAbonnement = !!userProfile?.abonnement_id

                            return (
                                <Card key={abonnement.id}>
                                    <CardTitle>{abonnement.nom}</CardTitle>
                                    <Text>Prix : {abonnement.prix} € / mois</Text>
                                    <Text>Points par mois : {abonnement.points_mensuels}</Text>
                                    {hasAbonnement ? (
                                        isCurrent ? (
                                            <NoticeText>⏳ Abonnement en cours</NoticeText>
                                        ) : (
                                            <NoticeText>🔒 Désabonnez-vous d'abord</NoticeText>
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
                                                    }),
                                                })

                                                const data = await res.json()
                                                if (data.url) {
                                                    window.location.href = data.url
                                                }
                                            }}
                                            disabled={hasAbonnement}
                                        >
                                            S’abonner
                                        </SubscribeButton>
                                    )}
                                </Card>
                            )
                        })}
                    </Grid>
                    {userProfile?.abonnement_id && (
                        <UnsubscribeButton onClick={handleUnsubscribe}>
                            Se désabonner
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
                                <ConfirmationText>Annulation en cours, veuillez patienter...</ConfirmationText>
                            </>
                        ) : (
                            <>
                                <ConfirmationText>
                                    {confirmStep === 1
                                        ? 'Souhaitez-vous vraiment vous désabonner ?'
                                        : confirmStep === 2
                                            ? 'Êtes-vous sûr ? Cette action arrêtera le renouvellement automatique.'
                                            : 'Désabonnement effectué avec succès.'}
                                </ConfirmationText>
                                {confirmStep < 3 && (
                                    <>
                                        <ConfirmationButton onClick={confirmUnsubscribe}>Oui</ConfirmationButton>
                                        <CancelButton onClick={() => setConfirmStep(0)}>Annuler</CancelButton>
                                    </>
                                )}
                            </>
                        )}
                    </ConfirmationBox>
                </ConfirmationOverlay>
            )}

            <BottomText>
                Envie de grimper plus vite ?{' '}
                <Highlight onClick={() => router.push('/packs')}>
                    Découvre les packs exclusifs →
                </Highlight>
            </BottomText>
        </Container>
    )
}
