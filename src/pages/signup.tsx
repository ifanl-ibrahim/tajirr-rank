import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import useRedirectIfAuthenticated from '../hooks/useRedirectIfAuthenticated'

import { SignUpWrapper, Title, Form, Input, ErrorMessage, Button, FooterText } from '../styles/signupStyles'

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      if (error.message.includes("already registered")) {
        setErrorMessage("Cet email est déjà utilisé.")
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
          setErrorMessage("Ce nom d'utilisateur ou cet email existe déjà.")
        } else {
          setErrorMessage("Erreur lors de la création du profil : " + profileError.message)
        }
        setLoading(false)
        return
      }

      alert('Compte créé avec succès !')
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <SignUpWrapper>
      <Title>Créer un compte</Title>
      <Form onSubmit={handleSignUp}>
        <Input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <Input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        <Input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Mot de passe (min. 6 caractères)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer le compte'}
        </Button>
      </Form>

      <FooterText>
        Déjà inscrit ?{' '}
        <span onClick={() => router.push('/login')}>
          Connecte-toi ici
        </span>
      </FooterText>
    </SignUpWrapper>
  )
}
