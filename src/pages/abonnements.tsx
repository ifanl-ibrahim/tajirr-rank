import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
import { Container, TopBar, Title, ReturnButton, Grid, Card, CardTitle, Text, SubscribeButton, BottomText, Highlight } from '../styles/abonnementStyles'

export default function Abonnements() {
    const { user, loading: loadingAuth } = useRequireAuth()
    const [abonnements, setAbonnements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchAbonnements = async () => {
            const { data, error } = await supabase
                .from('abonnements')
                .select('*')
                .order('prix', { ascending: true })

            if (error) {
                console.error(error)
            } else {
                setAbonnements(data)
            }
            setLoading(false)
        }

        fetchAbonnements()
    }, [])

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
                <Grid>
                    {abonnements.map((abonnement) => (
                        <Card key={abonnement.id}>
                            <CardTitle>{abonnement.nom}</CardTitle>
                            <Text>Prix : {abonnement.prix} € / mois</Text>
                            <Text>Points par mois : {abonnement.points_mensuels}</Text>
                            <SubscribeButton
                                onClick={async () => {
                                    const res = await fetch('../api/create-checkout-session', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            priceId: abonnement.stripe_price_id,
                                            abonnementId: abonnement.id,
                                            isSubscription: true,
                                            userId: (await supabase.auth.getUser()).data.user?.id,
                                        }),
                                    })

                                    const data = await res.json()
                                    if (data.url) {
                                        window.location.href = data.url
                                    }
                                }}
                            >
                                S’abonner
                            </SubscribeButton>
                        </Card>
                    ))}
                </Grid>
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
