import styled from 'styled-components'

export const SignUpWrapper = styled.div`
  background: ${({ theme }) => theme.colors.night};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.gold};
  text-shadow: 0 0 8px #d4af37;
`

export const Form = styled.form`
  background: ${({ theme }) => theme.colors.degrader};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px ${({ theme }) => theme.colors.gold};
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #333;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.lightTheme};
  transition: box-shadow 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.gold};
  }
`

export const ErrorMessage = styled.div`
  color: #e06c75;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`

export const Button = styled.button`
  padding: 0.75rem;
  background: linear-gradient(90deg, #b8860b, #ffd700);
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #121212;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #ffd700, #b8860b);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const FooterText = styled.p`
  margin: 1.5rem 0 3rem 0;
  font-size: 0.9rem;
  color: #bfbfbf;
  text-align: center;

  span {
    color: #d4af37;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`