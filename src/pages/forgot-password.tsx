import { useState } from "react";
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import { Page, Title, Form, Input, ErrorMessage, SuccessMessage, Button, FooterText } from '../styles/resetStyles'
import Head from 'next/head'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { t } = useTranslation('en', { useSuspense: false });

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(t('reset.errorForgot'));
        } else {
            setMessage(t('reset.successForgot'));
        }
    };

    return (
        <Page>
            <Head> <title>Tajirr | {t('reset.titleForgot')}</title> </Head>
            <Title>{t('reset.titleForgot')}</Title>
            <Form onSubmit={handleForgot}>
                <Input
                    type="email"
                    placeholder={t('reset.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit" disabled={!email}>
                    {t('reset.buttonForgot')}
                </Button>
                {message && <SuccessMessage>{message}</SuccessMessage>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Form>
            <FooterText>
                <span onClick={() => window.location.href = '/login'}>
                    {t('reset.back')}
                </span>
            </FooterText>
        </Page>
    );
}