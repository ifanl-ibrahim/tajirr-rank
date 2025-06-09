import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

import { HomeWrapper, Content, Title, Subtitle, ButtonsWrapper, Button } from '../styles/indexStyles'

export default function Home() {
  const router = useRouter()

  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      } else {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

  if (checkingSession) {
    return (
      <HomeWrapper>
        Chargement du profil...
      </HomeWrapper>
    )
  }

  return (
    <HomeWrapper>
      <Content>
        <img
            src="https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges/logo.png"
            alt="Tajirr Rank Logo"
            style={{
              width: '20rem',
            }}
        />
        <Subtitle>Prove your success. Join the elite.</Subtitle>

        <ButtonsWrapper>
          <Link href="/signup" passHref>
            <Button as="a">Créer un compte</Button>
          </Link>

          <Link href="/login" passHref>
            <Button as="a">Se connecter</Button>
          </Link>

          <Link href="/ranking" passHref>
            <Button as="a">Voir le classement</Button>
          </Link>
        </ButtonsWrapper>
      </Content>
    </HomeWrapper>
  )
}