// components/HeaderBar.tsx
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.night};
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gold};
  font-family: var(--font-main);
`

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
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

export default function HeaderBar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <HeaderContainer>
      <Logo>TonLogo</Logo> {/* Remplace par <img src="/logo.svg" /> plus tard */}
      <LogoutButton onClick={handleLogout}>Se déconnecter</LogoutButton>
    </HeaderContainer>
  )
}