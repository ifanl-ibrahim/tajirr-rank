// components/HeaderBar.tsx
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
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

export default function HeaderBar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <HeaderContainer>
      <Logo>
        <img
            src="https://rdsxttvdekzinhdpfkoh.supabase.co/storage/v1/object/public/badges//logo.png"
            alt="Tajirr Rank Logo"
            onClick={() => router.push('/dashboard')}
        />
      </Logo>
      <LogoutButton onClick={handleLogout}>Se déconnecter</LogoutButton>
    </HeaderContainer>
  )
}