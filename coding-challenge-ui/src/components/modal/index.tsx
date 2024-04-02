import React from "react";
import styled from "styled-components";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  retryFetch: () => void;
}

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;

  position: relative;
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 20vh;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #5e5e5e;
`;

const ModalMessageContainer = styled.div`
  margin: 1rem 0;
`;

const ModalSubmit = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;

export const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  retryFetch,
}) => (
  <ModalContainer>
    <ModalContent>
      <ModalHeader>
        <ModalTitle>API Connection Error</ModalTitle>
      </ModalHeader>
      <ModalMessageContainer></ModalMessageContainer>

      {children}
      <ModalSubmit onClick={() => retryFetch()}>Retry Connection</ModalSubmit>
    </ModalContent>
  </ModalContainer>
);
