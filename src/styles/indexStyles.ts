import styled from 'styled-components'

export const HomeWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`

export const Content = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
`

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  font-family: ${({ theme }) => theme.fonts.serif};
  color: ${({ theme }) => theme.colors.gold};
  text-shadow: 0 0 8px ${({ theme }) => theme.colors.gold};
`

export const Subtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ivory};
  font-family: ${({ theme }) => theme.fonts.sans};
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
`

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.black};
  font-weight: 700;
  font-size: 1.2rem;
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.sans};
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.gold};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.ivory};
    box-shadow: 0 0 15px ${({ theme }) => theme.colors.ivory};
  }
`