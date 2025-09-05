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

    if (userProfile) {
      setEmail(userProfile.email || "");
      setNom(userProfile.nom || "");
      setPrenom(userProfile.prenom || "");
      setUsername(userProfile.username || "");
    }
  }, [isOpen, userProfile])

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
    const { data: emailCheck, error: emailError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .neq("id", userProfile.id);

    if (emailError) {
      setErrorMessage(emailError.message);
      setIsSubmitting(false);
      return;
    }

    if (emailCheck && emailCheck?.length > 0) {
      setErrorMessage(t("modal.errorMessageEmail"));
      setIsSubmitting(false);
      return;
    }

    // Vérification username obligatoire
    if (!username.trim()) {
      setErrorMessage(t("modal.errorMessageUsernameRequired"));
      setIsSubmitting(false);
      return;
    }

    // Vérification username déjà utilisé
    const { data: usernameCheck, error: usernameError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", userProfile.id);

    if (usernameError) {
      setErrorMessage(usernameError.message);
      setIsSubmitting(false);
      return;
    }

    if (usernameCheck && usernameCheck?.length > 0) {
      setErrorMessage(t("modal.errorMessageUsername"));
      setIsSubmitting(false);
      return;
    }

    // Mise à jour dans la base de données
    const { error } = await supabase
      .from("profiles")
      .update({ email, nom, prenom, username: username.trim() })
      .eq("id", userProfile.id);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    // Mise à jour du mot de passe si nécessaire
    if (password.trim().length > 0) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });
      if (passwordError) {
        setErrorMessage(passwordError.message);
        setIsSubmitting(false);
        return;
      }
    }

    // Appel la fonction `onProfileUpdated` pour propager les données mises à jour
    onProfileUpdated({ ...userProfile, email, nom, prenom, username: username.trim() })
    setSuccesMessage(t('modal.success'))
    setPassword('')
    setIsSubmitting(false)

    setTimeout(() => {
      setSuccesMessage('')
      closeModal()
    }, 3000) // Fermer la modal après 1 seconde pour laisser le temps à l'utilisateur de lire le message de succès
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
          }} placeholder={t('modal.username')} required />
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