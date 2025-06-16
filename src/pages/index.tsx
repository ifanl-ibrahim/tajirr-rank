import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { HomeWrapper, Content, Subtitle, ButtonsWrapper, Button } from '../styles/indexStyles'
import { useTranslation } from 'react-i18next'
import ContactTrigger from './components/ContactTrigger'
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [checkingSession, setCheckingSession] = useState(true)
  const [randomSubtitle, setRandomSubtitle] = useState('')
  const { t } = useTranslation('en', { useSuspense: false })

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      } else {
        setCheckingSession(false)
        const randomIndex = Math.floor(Math.random() * 2)
        setRandomSubtitle([t('index.subtitle'), t('index.subtitle2')][randomIndex])
      }
    }

    checkSession()
  }, [router, t])

  if (checkingSession) {
    return (
      <HomeWrapper>
        {t('index.loading')}
      </HomeWrapper>
    )
  }

  return (
    <HomeWrapper>
      <Head> <title>Tajirr</title> </Head>
      <Content>
        <Image
          src="https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges/logo.png"
          alt="Tajirr Rank Logo"
          width={300} height={300}
        />
        <Subtitle>{randomSubtitle}</Subtitle>

        <ButtonsWrapper>
          <Link href="/signup" passHref>
            <Button as="a">{t('index.signup')}</Button>
          </Link>

          <Link href="/login" passHref>
            <Button as="a">{t('index.login')}</Button>
          </Link>

          <Link href="/ranking" passHref>
            <Button as="a">{t('index.ranking')}</Button>
          </Link>
        </ButtonsWrapper>
        <ContactTrigger />
      </Content>
    </HomeWrapper>
  )
}