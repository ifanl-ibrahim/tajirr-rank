import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ModalOverlay, ModalContent, ModalTitle, ErrorText, SuccesText, Form, Input, ButtonRow, ButtonPrimary, ButtonSecondary } from '../../styles/modalStyles'
import { useTranslation } from 'react-i18next'
import Head from 'next/head'

type ProfileModalProps = {
  isOpen: boolean
  closeModal: () => void
  userProfile: any
  onProfileUpdated: (updatedProfile: any) => void
}

const ProfileModal = ({ isOpen, closeModal, userProfile, onProfileUpdated }: ProfileModalProps) => {
  const [email, setEmail] = useState(userProfile?.email || '')
  const [nom, setNom] = useState(userProfile?.nom || '')
  const [prenom, setPrenom] = useState(userProfile?.prenom || '')
  const [username, setUsername] = useState(userProfile?.username || '')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [succesMessage, setSuccesMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)
  const { t } = useTranslation('en', { useSuspense: false })

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
      setTimeout(() => setShouldRender(false), 250) // correspond à l'animation CSS
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }

    if (shouldRender) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shouldRender, closeModal])

  if (!userProfile) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal()
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    // Vérification si l'email existe déjà
    const { data: emailCheck } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .neq('id', userProfile.id) // Ne pas comparer avec l'ID de l'utilisateur actuel

    if (emailCheck?.length > 0) {
      setErrorMessage(t('modal.errorMessageEmail'))
      setIsSubmitting(false)
      return
    }

    // Vérification si le nom d'utilisateur existe déjà
    if (username.trim() !== '') {
      const { data: usernameCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', userProfile.id)

      if (usernameCheck?.length > 0) {
        setErrorMessage(t('modal.errorMessageUsername'))
        setIsSubmitting(false)
        return
      }
    }

    // Mise à jour dans la base de données
    const cleanedUsername = username.trim() === '' ? null : username
    const { error } = await supabase
      .from('profiles')
      .update({ email, nom, prenom, username: cleanedUsername })
      .eq('id', userProfile.id)

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
    } else {
      // Si un mot de passe a été changé, on le met à jour dans Supabase Auth
      if (password.trim().length > 0) {
        const { error: passwordError } = await supabase.auth.updateUser({ password })
        if (passwordError) {
          setErrorMessage(passwordError.message)
          setIsSubmitting(false)
          return
        }
      }

      // Appel la fonction `onProfileUpdated` pour propager les données mises à jour
      onProfileUpdated({ ...userProfile, email, nom, prenom, username })
      setSuccesMessage(t('modal.success'))

      setTimeout(() => {
        setSuccesMessage('')
      }, 3000) // Fermer la modal après 1 seconde pour laisser le temps à l'utilisateur de lire le message de succès

      closeModal()
      setPassword('')
      setIsSubmitting(false)
    }
  }

  if (!shouldRender) return null

  return (
    <ModalOverlay onClick={handleOverlayClick} className={visible ? 'visible' : 'hidden'}>
      <Head> <title>Tajirr | {t('modal.title')}</title> </Head>
      <ModalContent className={visible ? 'visible' : 'hidden'}>
        <ModalTitle>{t('modal.title')}</ModalTitle>

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        {succesMessage && <SuccesText>{succesMessage}</SuccesText>}

        <Form onSubmit={handleProfileUpdate}>
          <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder={t('modal.firstname')} required />
          <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder={t('modal.lastname')} required />
          <Input value={username} onChange={(e) => {
            const inputSansEspace = e.target.value.replace(/\s/g, '')
            if (inputSansEspace.length <= 15) {
              setUsername(inputSansEspace)
            }
          }} placeholder={t('modal.username')} />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('modal.email')} required type="email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('modal.password')} type="password" />

          <ButtonRow>
            <ButtonPrimary type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('modal.load') : t('modal.save')}
            </ButtonPrimary>
            <ButtonSecondary type="button" onClick={closeModal}>
              {t('modal.cancel')}
            </ButtonSecondary>
          </ButtonRow>
        </Form>
      </ModalContent>
    </ModalOverlay>
  )
}

export default ProfileModal