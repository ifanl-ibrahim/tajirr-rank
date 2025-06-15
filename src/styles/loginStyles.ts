import styled from 'styled-components'

export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.night};
  margin: 7rem auto auto auto;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.gold}; /* or gold instead of primary */
  text-shadow: 0 0 10px ${({ theme }) => theme.colors.gold};
  font-family: ${({ theme }) => theme.fonts.serif};
`

export const Form = styled.form`
  background: ${({ theme }) => theme.colors.degrader}; /* dégradé sombre */
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.7); /* glow doré */
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem; /* borderRadius fixe, non défini dans le thème */
  border: 1px solid #333;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ivory};
  background: ${({ theme }) => theme.colors.lightTheme}; /* couleur de fond fixe */
  transition: box-shadow 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.sans};

  &:focus {
    outline: none;
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.gold};
  }
`

export const ErrorMessage = styled.div`
  color: #ff4d4f; /* rouge d'erreur fixe */
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.sans};
`

export const Button = styled.button`
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.gold};
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;
  transition: background 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.sans};

  &:hover:not(:disabled) {
    background: #bfa341; /* teinte or plus sombre */
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const FooterText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.ivory};
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.sans};

  span {
    color: ${({ theme }) => theme.colors.gold};
    cursor: pointer;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`