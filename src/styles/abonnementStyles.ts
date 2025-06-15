import styled, { keyframes } from 'styled-components'

export const Container = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    padding: 3rem;
    font-family: ${({ theme }) => theme.fonts.sans};
`

export const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`

export const Title = styled.h1`
    font-size: 1.3rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.gold};
`

export const ReturnButton = styled.button`
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

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
`

export const Card = styled.div`
    background: ${({ theme }) => theme.colors.degrader};
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.04);
    }
`

export const CardTitle = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.ivory};
`

export const Text = styled.p`
    color: ${({ theme }) => theme.colors.text};
    margin: 0.25rem 0;
`

export const SubscribeButton = styled.button`
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

export const BottomText = styled.p`
    margin-top: 3rem;
    text-align: center;
    color: #999;
    font-size: 0.9rem;
`

export const Highlight = styled.span`
    color: ${({ theme }) => theme.colors.ivory};
    cursor: pointer;
    text-decoration: underline;
    margin-left: 0.4rem;

    &:hover {
        color: #e0c26e;
    }
`

export const NoticeText = styled.p`
  color: #999;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`

export const UnsubscribeButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 0.8rem;
  margin: 1rem auto;
  display: block;
  cursor: pointer;
  text-decoration: underline;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`
export const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.85);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ConfirmationBox = styled.div`
  background: #111;
  border: 1px solid gold;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  color: white;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  text-align: center;
`

export const ConfirmationText = styled.p`
  margin-bottom: 20px;
  font-size: 1.1rem;
`

export const ConfirmationButton = styled.button`
  background: gold;
  color: black;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background: #ffd700c0;
  }
`

export const CancelButton = styled(ConfirmationButton)`
  background: #333;
  color: white;
  border: 1px solid gold;

  &:hover {
    background: #444;
  }
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.div`
  border: 4px solid #333;
  border-top: 4px solid gold;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`