// components/HeaderBar.tsx
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useThemeToggle } from '../../lib/ThemeContext'
import { Moon, Sun } from 'lucide-react' // facultatif : icônes
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

const HeaderContainer = styled.header`
  position: fixed;
  bottom: 0;
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
  border-top: 1px solid ${({ theme }) => theme.colors.gold};
  z-index: 1000;
  font-family: var(--font-main);
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

const LanguageButton = styled.button`
  background: none;
  border: 2px solid ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.gold};
  padding: 0.4rem 0.8rem;
  margin-left: 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gold};
    color: black;
  }
`

export default function HeaderBar() {
  const router = useRouter()
  const { locale, pathname, query, asPath } = router
  const [user, setUser] = useState(null)
  const { theme, toggleTheme } = useThemeToggle()
  const { t, i18n } = useTranslation('en', { useSuspense: false })

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

  const toggleLanguage = () => {
    console.log('Current locale:', locale)
    i18n.changeLanguage(locale === 'en' ? 'fr' : 'en')
    router.push({ pathname, query }, asPath, { locale: locale === 'en' ? 'fr' : 'en' })
  }

  return (
    <HeaderContainer>
      <Image
        src="https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges/logo.png"
        alt="Tajirr Rank Logo"
        width={100} height={100}
        cursor="pointer"
        objectFit="contain"
        onClick={() => router.push('/')}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </ThemeToggle>
        <LanguageButton onClick={toggleLanguage}>
          {locale === 'en' ? 'EN' : 'FR'}
        </LanguageButton>
        {user ? (
          <LogoutButton onClick={handleLogout}>{t('header.disconnect')}</LogoutButton>
        ) : (
          <LogoutButton onClick={handleLogin}>{t('header.login')}</LogoutButton>
        )}
      </div>
    </HeaderContainer>
  )
}