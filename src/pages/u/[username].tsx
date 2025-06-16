// pages/u/[username].tsx

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1rem;
    min-height: 100vh;
    background-color: #0e0e0e;
    color: #fff;
    font-family: 'Poppins', sans-serif;
`

const Card = styled.div`
    background: #181818;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    text-align: center;
    max-width: 400px;
    width: 100%;
`

const Rank = styled.h2`
    font-size: 2rem;
    color: gold;
`

const Pseudo = styled.h1`
    font-size: 1.5rem;
    margin: 1rem 0;
`

const Position = styled.p`
    font-size: 1rem;
    opacity: 0.8;
`

const Button = styled(Link)`
    margin-top: 2rem;
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: gold;
    color: #000;
    border-radius: 10px;
    text-decoration: none;
    font-weight: bold;
`

export default function PublicProfilePage() {
    const { t } = useTranslation('en', { useSuspense: false })
    const router = useRouter()
    const { username } = router.query
    const [profile, setProfile] = useState(null)
    const [position, setPosition] = useState<number | null>(null)

    useEffect(() => {
        if (!username) return

        const fetchData = async () => {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('username, rank_id, ranks(nom, badge_path), total_depot')
                .eq('username', username)
                .single()

            if (!profileData) return

            setProfile(profileData)

            // Récupérer la position dans le classement
            const { data: classement } = await supabase
                .from('profiles')
                .select('username, total_depot')
                .order('total_depot', { ascending: false })

            const index = classement?.findIndex(p => p.username === profileData.username)
            setPosition(index !== -1 ? index + 1 : null)
        }

        fetchData()
    }, [username])

    if (!profile) return null

    const displayName = profile?.username
    const rank = profile.ranks?.nom || 'No rank'

    return (
        <Container>
            <Card>
                <Image
                    src={`https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges/${profile.ranks?.badge_path}`}
                    alt="Rank Logo"
                    style={{
                        objectFit: 'cover',
                        borderRadius: '50%',
                    }}
                    width={300} height={300}
                />
                <Rank>{rank}</Rank>
                <Pseudo>@{displayName}</Pseudo>
                <Position>
                    {position ? `#${position} ${t('ranking.inRank')}` : '???'}
                </Position>
                <Button href="/ranking">{t('ranking.title')}</Button>
            </Card>
        </Container>
    )
}