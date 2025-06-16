import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { LoginWrapper, Title, Form, Input, ErrorMessage, Button, FooterText } from '../styles/loginStyles'
import { useTranslation } from 'react-i18next'
import Head from 'next/head'

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { t } = useTranslation('en', { useSuspense: false })

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/')
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    let emailToUse = emailOrUsername.trim()

    if (!emailToUse.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailToUse)
        .single()

      if (error || !data?.email) {
        setErrorMessage(t('login.errorMessage1'))
        setLoading(false)
        return
      }

      emailToUse = data.email
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password
    })

    if (error) {
      setErrorMessage(t('login.errorMessage2'))
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <LoginWrapper>
      <Head> <title>Tajirr | {t('login.title')}</title> </Head>
      <Title>{t('login.title')}</Title>
      <Form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder={t('login.id')}
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t('login.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? t('login.loading') : t('login.login')}
        </Button>
      </Form>

      <FooterText>
        {t('login.message')}{' '}
        <span onClick={() => router.push('/signup')}>
          {t('login.link')}
        </span>
      </FooterText>
    </LoginWrapper>
  )
}