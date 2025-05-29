// components/UnsubscribeFlow.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal'; // à créer aussi
import Spinner from './Spinner'; // à créer aussi
import { unsubscribeUser } from '../lib/api'; // ta logique côté client

const Button = styled.button`
  background: transparent;
  color: #aaa;
  border: none;
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    color: #e74c3c;
  }
`;

const UnsubscribeFlow = ({ userId }: { userId: string }) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0); // étapes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUnsubscribe = async () => {
    setStep(3); // étape de chargement
    const { success, error } = await unsubscribeUser(userId); // appel au backend
    if (error) {
      setError(error);
      setStep(4);
    } else {
      setSuccess("Désabonnement réussi.");
      setStep(4);
    }
  };

  return (
    <>
      <Button onClick={() => setStep(1)}>Se désabonner</Button>

      <Modal open={step === 1} onClose={() => setStep(0)} title="Confirmer ?">
        <p>Souhaitez-vous vraiment vous désabonner ?</p>
        <Modal.Actions>
          <button onClick={() => setStep(0)}>Annuler</button>
          <button onClick={() => setStep(2)}>Continuer</button>
        </Modal.Actions>
      </Modal>

      <Modal open={step === 2} onClose={() => setStep(0)} title="Dernière étape">
        <p>Vous perdrez tous vos avantages liés à l'abonnement. Continuer ?</p>
        <Modal.Actions>
          <button onClick={() => setStep(0)}>Retour</button>
          <button onClick={handleUnsubscribe}>Oui, me désabonner</button>
        </Modal.Actions>
      </Modal>

      <Modal open={step === 3} title="Traitement en cours" disableClose>
        <Spinner />
        <p>Merci de patienter pendant que nous traitons votre demande...</p>
      </Modal>

      <Modal open={step === 4} onClose={() => setStep(0)} title={error ? 'Erreur' : 'Succès'}>
        <p>{error || success}</p>
        <Modal.Actions>
          <button onClick={() => setStep(0)}>Fermer</button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default UnsubscribeFlow;