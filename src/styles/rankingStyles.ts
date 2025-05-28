import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #121212; /* sombre */
  color: #f5d061; /* doré clair */
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-shadow: 0 0 6px #f5d061cc;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ variant }) => (variant === 'primary' ? '#d4af37' : '#333')};
  color: ${({ variant }) => (variant === 'primary' ? '#121212' : '#f5d061')};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ variant }) => (variant === 'primary' ? '#b68e22' : '#555')};
  }
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media(min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const SearchInput = styled.input`
  padding: 10px 14px;
  border-radius: 6px;
  border: none;
  width: 100%;
  max-width: 400px;
  font-size: 1rem;
  color: #121212;
  font-weight: 600;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const UserItem = styled.div<{ highlight?: boolean }>`
  background-color: #1e1e1e;
  padding: 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: ${({ highlight }) => (highlight ? '2px solid #f5d061' : 'none')};
  box-shadow: ${({ highlight }) => (highlight ? '0 0 10px #f5d061cc' : 'none')};
  transition: box-shadow 0.3s ease, border 0.3s ease;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Username = styled.p`
  font-weight: 700;
  font-size: 1.1rem;
`;

export const Rank = styled.p`
  font-size: 0.9rem;
  color: #bfae5d;
`;

export const Points = styled.div`
  margin-left: auto;
  text-align: right;
  font-weight: 600;
  font-size: 1.1rem;
`;

export const Pagination = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? '#d4af37' : '#333')};
  color: ${({ active }) => (active ? '#121212' : '#f5d061')};
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b68e22;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
`;
export const NoResults = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #b3b3b3;
  margin-top: 24px;
`;
