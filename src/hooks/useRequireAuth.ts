import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function useRequireAuth() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true)
      setIsError(false)

      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || !authData?.user) {
        console.warn('Utilisateur non connecté ou erreur auth:', authError)
        router.push('/login')
        return
      }

      const currentUser = authData.user
      setUser(currentUser)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (profileError || !profile) {
        console.error('Erreur récupération profil:', profileError)
        setIsError(true)
        setLoading(false)
        return
      }

      setUserProfile(profile)
      setLoading(false)
    }

    fetchUserAndProfile()
  }, [router])

  return {
    user,
    userProfile,
    loading,
    isError,
  }
}
