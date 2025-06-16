import styled from 'styled-components'

export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 3rem;
  font-family: ${({ theme }) => theme.fonts.sans};
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gold};
`

export const BackButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gold};
  border: 1px solid ${({ theme }) => theme.colors.gold};
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gold};
    color: ${({ theme }) => theme.colors.background};
  }
`

export const PacksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
`

export const PackCard = styled.div`
  background: ${({ theme }) => theme.colors.degrader};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.04);
  }

  input {
    color: black
  }
`

export const PackTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.ivory};
`

export const PackInfo = styled.p`
  color: ${({ theme }) => theme.colors.ivory};
  margin: 0.25rem 0;
`

export const BuyButton = styled.button`
  margin-top: 1rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.background};
  font-weight: bold;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #b8972d;
  }
`

export const FooterText = styled.p`
  margin: 1.5rem 0 3rem 0;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
`

export const LinkText = styled.span`
  color: ${({ theme }) => theme.colors.ivory};
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.4rem;

  &:hover {
    color: #e0c26e;
  }
`
