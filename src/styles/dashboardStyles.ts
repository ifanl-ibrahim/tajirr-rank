// styles/dashboardStyles.ts
import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.night};
  padding: 48px;
  font-family: var(--font-main);
  color: ${({ theme }) => theme.colors.gold};

  @media (max-width: 767px) {
    padding: 20px;
  }
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

  @media (max-width: 767px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    width: 100%;
    max-width: 180px;
  }
`

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.degrader};
  border: 1px solid ${({ theme }) => theme.colors.gold};
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
  margin-bottom: 32px;
  padding: 32px;

  p {
    color: ${({ theme }) => theme.colors.text};
  }
  
  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    margin: 1rem auto;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    h2 {
      font-size: 1.5rem;
      font-weight: bold;
      white-space: nowrap;
      text-align: center;
    }
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

  @media (max-width: 767px) {
    object-fit: cover;
  }
`

export const FlexRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`

export const ProgressBar = styled.div`
  height: 16px;
  background-color: ${({ theme }) => theme.colors.night};
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gold};

  @media (max-width: 767px) {
    width: 16rem;
  }
`

export const ProgressInner = styled.div<{ percent: number }>`
  background-color: ${({ theme }) => theme.colors.ivory};
  height: 100%;
  width: ${({ percent }) => percent}%;
  transition: width 0.5s ease-out;
`

export const RightText = styled.div`
  text-align: right;
  font-size: 15px;
`

export const ButtonGroup = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
  
  @media (max-width: 767px) {
    gap: 0.75rem;
    display: flex;
    justify-content: space-between;
    justify-content: center;

    button {
      flex: 1 1 48%;
      font-size: 0.9rem;
      padding: 0.5rem;
    }
  }
`

export const Backdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${(props) => (props.isOpen ? 'fadeIn 0.3s' : 'fadeOut 0.3s')};
  z-index: 1000;

  @keyframes fadeIn {
    from { opacity: 0 }
    to { opacity: 1 }
  }

  @keyframes fadeOut {
    from { opacity: 1 }
    to { opacity: 0 }
  }
`