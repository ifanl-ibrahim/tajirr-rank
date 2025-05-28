// styles/dashboardStyles.ts
import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.night};
  padding: 48px;
  font-family: var(--font-main);
  color: ${({ theme }) => theme.colors.gold};
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
`

export const Brand = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.gold};
`

export const Button = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gold};
  border: 2px solid ${({ theme }) => theme.colors.gold};
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gold};
    color: black;
  }
`

export const Card = styled.div`
  background: linear-gradient(135deg, #1a1a1a, #2b2b2b);
  border: 1px solid ${({ theme }) => theme.colors.gold};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
  margin-bottom: 32px;

  p {
    color: ${({ theme }) => theme.colors.ivory};
  }
`

export const Avatar = styled.div`
  background-color: #222;
  border-radius: 50%;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gold};
  border: 2px solid ${({ theme }) => theme.colors.gold};
`

export const FlexRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`

export const ProgressBar = styled.div`
  height: 16px;
  background-color: #333;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gold};
`

export const ProgressInner = styled.div<{ percent: number }>`
  background-color: ${({ theme }) => theme.colors.ivory};
  height: 100%;
  width: ${({ percent }) => percent}%;
  transition: width 0.5s ease-out;
`

export const RightText = styled.div`
  text-align: right;
  font-size: 12px;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`
