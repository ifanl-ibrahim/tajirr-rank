import { useState } from 'react'
import { supabase } from '../lib/supabase'

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Modifier le Profil</h2>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom"
            className="w-full p-2 rounded"
            required
          />
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Prénom"
            className="w-full p-2 rounded"
            required
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            className="w-full p-2 rounded"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe (si vous souhaitez le modifier)"
            className="w-full p-2 rounded"
          />

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal
