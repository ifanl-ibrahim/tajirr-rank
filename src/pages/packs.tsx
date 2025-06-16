// pages/packs.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import useRequireAuth from '../hooks/useRequireAuth'
import { PageContainer, Header, Title, BackButton, PacksGrid, PackCard, PackTitle, PackInfo, BuyButton, FooterText, LinkText } from '../styles/packsStyles'
import { useTranslation } from 'react-i18next'
import Head from 'next/head'

export default function Packs() {
    const { userProfile, loading: authLoading } = useRequireAuth()
    const [packs, setPacks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const { t } = useTranslation('en', { useSuspense: false })

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

    const handlePurchase = async (pack: any, quantity: number) => {
        const user = await supabase.auth.getUser()
        const userId = user.data.user?.id

        if (!userId) {
            alert(t('packs.errorLogin'))
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
                quantity,
                abonnementId: "",
            }),
        })

        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        } else {
            alert(t('packs.errorMessage'))
        }
    }

    return (
        <PageContainer>
            <Head> <title>Tajirr | {t('packs.title')}</title> </Head>
            <Header>
                <Title>{t('packs.title')}</Title>
                <BackButton onClick={() => router.push('/dashboard')}>{t('packs.back')}</BackButton>
            </Header>

            {loading ? (
                <p>{t('packs.load')}</p>
            ) : (
                <PacksGrid>
                    {packs.map((pack) => (
                        <PackCard key={pack.id}>
                            <PackTitle>{pack.nom}</PackTitle>
                            <PackInfo>{t('packs.price')} : {pack.prix} €</PackInfo>
                            <PackInfo>{t('packs.points')} : {pack.points}</PackInfo>
                            <div>
                                <input
                                    type="number"
                                    min="1"
                                    max="49999"
                                    value={quantities[pack.id] || 1}
                                    onChange={(e) =>
                                        setQuantities((prev) => ({ ...prev, [pack.id]: parseInt(e.target.value) }))
                                    }
                                />
                            </div>
                            <BuyButton onClick={() => handlePurchase(pack, quantities[pack.id] || 1)}>
                                {t('packs.buy')}
                            </BuyButton>
                        </PackCard>
                    ))}
                </PacksGrid>
            )}

            <FooterText>
                {t('packs.message')}
                <LinkText onClick={() => router.push('/abonnements')}>
                    {t('packs.link')} →
                </LinkText>
            </FooterText>
        </PageContainer>
    )
}