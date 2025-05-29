// components/Spinner.tsx
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 6px solid rgba(255, 255, 255, 0.2);
  border-top: 6px solid gold;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${rotate} 1s linear infinite;
  margin: auto;
`;

export default Spinner;