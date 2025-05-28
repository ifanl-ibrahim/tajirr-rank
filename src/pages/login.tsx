import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { LoginWrapper, Title, Form, Input, ErrorMessage, Button, FooterText } from '../styles/loginStyles'

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

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
        setErrorMessage("Nom d'utilisateur introuvable.")
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
      setErrorMessage("Identifiants incorrects.")
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <LoginWrapper>
      <Title>Connexion</Title>

      <Form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="Email ou nom d'utilisateur"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </Form>

      <FooterText>
        Pas encore de compte ?{' '}
        <span onClick={() => router.push('/signup')}>
          Inscris-toi ici
        </span>
      </FooterText>
    </LoginWrapper>
  )
}