// pages/packs.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
import { PageContainer, Header, Title, BackButton, PacksGrid, PackCard, PackTitle, PackInfo, BuyButton, FooterText, LinkText } from '../styles/packsStyles'

export default function Packs() {
    const { userProfile, loading: authLoading } = useRequireAuth()
    const [packs, setPacks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchPacks = async () => {
            const { data, error } = await supabase
                .from('packs')
                .select('*')
                .order('prix', { ascending: true })

            if (error) {
                console.error(error)
            } else {
                setPacks(data)
            }
            setLoading(false)
        }

        fetchPacks()
    }, [])

    const handlePurchase = async (pack: any) => {
        const user = await supabase.auth.getUser()
        const userId = user.data.user?.id

        if (!userId) {
            alert("Veuillez vous connecter.")
            return
        }

        const res = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: pack.stripe_price_id,
                packId: pack.id,
                isSubscription: false,
                userId,
                abonnementId: ""
            }),
        })

        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        } else {
            alert("Une erreur est survenue.")
        }
    }

    return (
        <PageContainer>
            <Header>
                <Title>Packs de points</Title>
                <BackButton onClick={() => router.push('/dashboard')}>Retour</BackButton>
            </Header>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <PacksGrid>
                    {packs.map((pack) => (
                        <PackCard key={pack.id}>
                            <PackTitle>{pack.nom}</PackTitle>
                            <PackInfo>Prix : {pack.prix} €</PackInfo>
                            <PackInfo>Points offerts : {pack.points}</PackInfo>
                            <BuyButton onClick={() => handlePurchase(pack)}>Acheter</BuyButton>
                        </PackCard>
                    ))}
                </PacksGrid>
            )}

            <FooterText>
                Tu préfères avancer à ton rythme ?
                <LinkText onClick={() => router.push('/abonnements')}>
                    Jette un œil aux abonnements mensuels →
                </LinkText>
            </FooterText>
        </PageContainer>
    )
}