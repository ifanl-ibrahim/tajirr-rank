import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function useOptionalAuth() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const currentUser = authData?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()
        setUserProfile(profile)
      }

      setLoading(false)
    }

    fetchUser()
  }, [])

  return { user, userProfile, loading }
}