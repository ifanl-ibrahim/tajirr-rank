import { useState } from "react";
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Page, Title, Form, Input, ErrorMessage, SuccessMessage, Button, FooterText } from '../styles/resetStyles'
import Head from 'next/head'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { t } = useTranslation('en', { useSuspense: false });

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password.length < 8) {
            setError(t('reset.errorPassword'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('reset.errorPasswordMatch'));
            return;
        }

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(t('reset.errorReset'));
        } else {
            setMessage("✅ " + t('reset.successReset'));
            setTimeout(() => router.push("/login"), 2000); // redirige après succès
        }
    };

    return (
        <Page>
            <Head> <title>Tajirr | {t('reset.titleReset')}</title> </Head>
            <Title>{t('reset.titleReset')}</Title>
            <Form onSubmit={handleReset}>
                <Input
                    type="password"
                    placeholder={t('reset.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder={t('reset.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button type="submit" disabled={!password || !confirmPassword}>
                    {t('reset.buttonReset')}
                </Button>
                {message && <SuccessMessage>{message}</SuccessMessage>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Form>
        </Page>
    );
}