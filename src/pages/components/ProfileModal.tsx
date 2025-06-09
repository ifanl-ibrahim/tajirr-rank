import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ModalOverlay, ModalContent, ModalTitle, ErrorText, Form, Input, ButtonRow, ButtonPrimary, ButtonSecondary } from '../../styles/modalStyles'

type ProfileModalProps = {
  isOpen: boolean
  closeModal: () => void
  userProfile: any
  onProfileUpdated: (updatedProfile: any) => void
}

const ProfileModal = ({ isOpen, closeModal, userProfile, onProfileUpdated }: ProfileModalProps) => {
  const [email, setEmail] = useState(userProfile.email || '')
  const [nom, setNom] = useState(userProfile.nom || '')
  const [prenom, setPrenom] = useState(userProfile.prenom || '')
  const [username, setUsername] = useState(userProfile.username || '')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)

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
  }, [shouldRender])

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
      setErrorMessage('Cet email est déjà utilisé.')
      setIsSubmitting(false)
      return
    }

    // Vérification si le nom d'utilisateur existe déjà
    const { data: usernameCheck } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', userProfile.id)

    if (usernameCheck?.length > 0) {
      setErrorMessage('Ce nom d\'utilisateur est déjà pris.')
      setIsSubmitting(false)
      return
    }

    // Mise à jour dans la base de données
    const { error } = await supabase
      .from('profiles')
      .update({ email, nom, prenom, username })
      .eq('id', userProfile.id)

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
    } else {
      // Si un mot de passe a été changé, on le met à jour dans Supabase Auth
      if (password) {
        const { data, error: passwordError } = await supabase.auth.updateUser({ password })
        if (passwordError) {
          setErrorMessage(passwordError.message)
          setIsSubmitting(false)
          return
        }
      }

      // Appel la fonction `onProfileUpdated` pour propager les données mises à jour
      onProfileUpdated({ ...userProfile, email, nom, prenom, username })

      // Si tout est OK, fermer la modal
      closeModal()
      setIsSubmitting(false)
    }
  }

  if (!shouldRender) return null

  return (
    <ModalOverlay onClick={handleOverlayClick} className={visible ? 'visible' : 'hidden'}>
      <ModalContent className={visible ? 'visible' : 'hidden'}>
        <ModalTitle>Modifier le Profil</ModalTitle>

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <Form onSubmit={handleProfileUpdate}>
          <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" required />
          <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" required />
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nom d'utilisateur" required />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required type="email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe (si vous souhaitez le modifier)" type="password" />

          <ButtonRow>
            <ButtonPrimary type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
            </ButtonPrimary>
            <ButtonSecondary type="button" onClick={closeModal}>
              Annuler
            </ButtonSecondary>
          </ButtonRow>
        </Form>
      </ModalContent>
    </ModalOverlay>
  )
}

export default ProfileModal
