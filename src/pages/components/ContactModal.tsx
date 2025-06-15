// components/ContactModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Spinner from './Spinner';
import { useTranslation } from 'react-i18next'

const Backdrop = styled.div`
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background: ${({ theme }) => theme.colors.night};
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    color: ${({ theme }) => theme.colors.text};

    h2 {
        margin-bottom: 1rem;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.7rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    border: none;
    background: ${({ theme }) => theme.colors.degrader};
    color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
    width: 100%;
    padding: 0.7rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.degrader};
    color: ${({ theme }) => theme.colors.text};
    border: none;
`;

const Textarea = styled.textarea`
    width: 100%;
    height: 120px;
    padding: 0.7rem;
    border-radius: 0.5rem;
    border: none;
    background: ${({ theme }) => theme.colors.degrader};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1rem;
`;

const Button = styled.button`
    display: flex;
    margin: auto;
    margin-bottom: 1rem;
    background: gold;
    color: black;
    font-weight: bold;
    padding: 0.7rem 1.5rem ;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
`;

export default function ContactModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [objet, setObjet] = useState('Bug');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation('en', { useSuspense: false })

    const handleSubmit = async () => {
        // Validation simple
        if (!email.trim() || !message.trim()) {
            setStatus('error');
            return;
        }
        
        setIsLoading(true);
        setStatus('idle');

        try {
            const res = await fetch('/api/send-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, objet, message }),
            });

            if (res.ok) {
                setStatus('sent');
                setEmail('');
                setObjet('Bug');
                setMessage('');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Erreur d’envoi :', err);
            setStatus('error');
        }
        setIsLoading(false);
    };

    return (
        <Backdrop onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <h2>{t('contact.title')}</h2>
                <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Select value={objet} onChange={(e) => setObjet(e.target.value)}>
                    <option value="Bug">🐞 Bug</option>
                    <option value="Suggestion">💡 Suggestion</option>
                    <option value="Question">❓ Question</option>
                    <option value="Autres">📬 {t('contact.others')}</option>
                </Select>
                <Textarea
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                {isLoading ? (
                    <Spinner />
                ) : (
                    <Button onClick={handleSubmit}>{t('contact.send')}</Button>
                )}

                {status === 'sent' && <p style={{ color: 'lightgreen' }}>{t('contact.valid')} 🙏</p>}
                {status === 'error' && <p style={{ color: 'red' }}>{t('contact.error')}.</p>}
            </Modal>
        </Backdrop>
    );
}