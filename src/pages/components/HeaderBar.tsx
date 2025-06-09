// components/HeaderBar.tsx
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useThemeToggle } from '../../lib/ThemeContext'
import { Moon, Sun } from 'lucide-react' // facultatif : icônes

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 70px;
  background-color: ${({ theme }) => theme.colors.night};
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3.5rem 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gold};
  z-index: 1000;
  font-family: var(--font-main);
`

const Logo = styled.div`
  height: 100%;
  display: flex;
  align-items: center;

  img {
    height: 100px; // adapte si tu veux plus ou moins grand
    object-fit: contain;
    cursor: pointer;
  }
`

const LogoutButton = styled.button`
  background: none;
  border: 2px solid ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.gold};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gold};
    color: black;
  }
`

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gold};
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

export default function HeaderBar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const { theme, toggleTheme } = useThemeToggle()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.reload()
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <HeaderContainer>
      <Logo>
        <img
          src="https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges//logo.png"
          alt="Tajirr Rank Logo"
          onClick={() => router.push('/')}
        />
      </Logo>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ThemeToggle onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </ThemeToggle>
        {user ? (
          <LogoutButton onClick={handleLogout}>Se déconnecter</LogoutButton>
        ) : (
          <LogoutButton onClick={handleLogin}>Se connecter</LogoutButton>
        )}
      </div>
    </HeaderContainer>
  )
}