// components/ContactTrigger.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import ContactModal from './ContactModal';
import { useTranslation } from 'react-i18next'

const TextButton = styled.button`
    display: flex;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.ivory};
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    margin: 1.5rem auto 3rem auto;
    
    &:hover {
        color: gold;
    }
`;

export default function ContactTrigger() {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation('en', { useSuspense: false })

    return (
        <>
            <TextButton onClick={() => setOpen(true)}>
                { t('contact.contactButton') }
            </TextButton>
            {open && <ContactModal onClose={() => setOpen(false)} />}
        </>
    );
}