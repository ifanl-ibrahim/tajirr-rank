import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import useRedirectIfAuthenticated from '../hooks/useRedirectIfAuthenticated'
import { SignUpWrapper, Title, Form, Input, ErrorMessage, Button, FooterText } from '../styles/signupStyles'
import { useTranslation } from 'react-i18next'
import Head from 'next/head'

export default function SignUp() {
  useRedirectIfAuthenticated()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { t } = useTranslation('en', { useSuspense: false })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    if (password.length < 6) {
      setErrorMessage(t('signup.errorMessagePassword'))
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('signup.errorMessagePassword2'))
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      if (error.message.includes("already registered")) {
        setErrorMessage(t('signup.errorMessageEmail'))
      } else {
        setErrorMessage(error.message)
      }
      setLoading(false)
      return
    }

    const user = data.user
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email,
          nom,
          prenom,
          username,
          rank_id: 1,
          abonnement_id: 1,
          total_depot: 0
        }])

      if (profileError) {
        if (profileError.message.includes("duplicate key")) {
          setErrorMessage(t('signup.errorMessageEmail2'))
        } else {
          setErrorMessage(`t('signup.errorMessage') : ` + profileError.message)
        }
        setLoading(false)
        return
      }

      alert(t('signup.success'))
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <SignUpWrapper>
      <Head> <title>Tajirr | {t('signup.title')}</title> </Head>
      <Title>{t('signup.title')}</Title>
      <Form onSubmit={handleSignUp}>
        <Input type="text" placeholder={t('signup.firstname')} value={nom} onChange={(e) => setNom(e.target.value)} required />
        <Input type="text" placeholder={t('signup.lastname')} value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        <Input type="text" placeholder={t('signup.username')} value={username} onChange={(e) => {
          const inputSansEspace = e.target.value.replace(/\s/g, '')
          if (inputSansEspace.length <= 15) {setUsername(inputSansEspace)}}} />
        <Input type="email" placeholder={t('signup.email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder={t('signup.password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="password" placeholder={t('signup.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? t('signup.loading') : t('signup.signup')}
        </Button>
      </Form>

      <FooterText>
        {t('signup.message')}{' '}
        <span onClick={() => router.push('/login')}>
          {t('signup.link')}
        </span>
      </FooterText>
    </SignUpWrapper>
  )
}