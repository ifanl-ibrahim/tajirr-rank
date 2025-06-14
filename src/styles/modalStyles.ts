// styles/modalStyles.ts
import styled, { keyframes, css } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: ${fadeIn} 0.3s ease-out;

  &.hidden {
    animation: ${fadeOut} 0.25s ease-in forwards;
  }
`

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.night};
  border: 1px solid #3a3a3a;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
  animation: ${fadeIn} 0.3s ease-out;

  &.hidden {
    animation: ${fadeOut} 0.25s ease-in forwards;
  }
`

export const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.gold};
  text-align: center;
`

export const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`

export const SuccesText = styled.div`
  color:rgb(77, 255, 110);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #333;
  background-color: ${({ theme }) => theme.colors.night};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gold};
  }
`

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`

export const ButtonPrimary = styled.button`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gold};
  color: #000;
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #e6c200;
  }
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`

export const ButtonSecondary = styled.button`
  flex: 1;
  background-color: #333;
  color: #fff;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid #555;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #444;
  }
`