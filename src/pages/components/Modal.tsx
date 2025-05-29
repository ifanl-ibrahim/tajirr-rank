// components/Modal.tsx
import styled from 'styled-components';

export default function Modal({ open, title, children, onClose, disableClose = false }: any) {
  if (!open) return null;

  return (
    <Overlay>
      <Box>
        <h2>{title}</h2>
        <Content>{children}</Content>
        {!disableClose && <Close onClick={onClose}>×</Close>}
      </Box>
    </Overlay>
  );
}

Modal.Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;

    &:nth-child(2) {
      background-color: #e74c3c;
      color: white;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Box = styled.div`
  background: #111;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  color: #fff;
  box-shadow: 0 0 30px #000;
  position: relative;
`;

const Content = styled.div`
  margin-top: 1rem;
`;

const Close = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
`;