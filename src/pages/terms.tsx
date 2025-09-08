// pages/terms.tsx
import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import Head from 'next/head'

const Page = styled.main`
  min-height: 100vh;
  background: #070708;
  color: #eaeaea;
  padding: 3rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Container = styled.div`
  width: 100%;
  max-width: 980px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius: 12px;
  padding: 2.25rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
`;

const Title = styled.h1`
  font-size: 1.9rem;
  color: #d4af37;
  margin-bottom: 1rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: #d4af37;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
`;

const Paragraph = styled.p`
  color: #dcdcdc;
  margin: 0.45rem 0 0.9rem;
  line-height: 1.6;
  font-size: 0.98rem;
`;

const Small = styled.p`
  color: #bfbfbf;
  font-size: 0.88rem;
  margin-top: 0.6rem;
`;

export default function Terms() {
    const { t } = useTranslation('en', { useSuspense: false })

    return (
        <Page>
            <Head> <title>Tajirr | {t("terms.title")}</title> </Head>
            <Container>
                <Title>{t("terms.title")}</Title>

                <SectionTitle>{t("terms.1.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.1.content") }} />

                <SectionTitle>{t("terms.2.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.2.content") }} />

                <SectionTitle>{t("terms.3.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.3.content") }} />

                <SectionTitle>{t("terms.4.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.4.content") }} />

                <SectionTitle>{t("terms.5.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.5.content") }} />

                <SectionTitle>{t("terms.6.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.6.content") }} />

                <SectionTitle>{t("terms.7.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.7.content") }} />

                <SectionTitle>{t("terms.8.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.8.content") }} />

                <SectionTitle>{t("terms.9.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.9.content") }} />

                <SectionTitle>{t("terms.10.title")}</SectionTitle>
                <Paragraph dangerouslySetInnerHTML={{ __html: t("terms.10.content") }} />

                <Small>{t("terms.legalNotice")}</Small>
            </Container>
        </Page>
    );
}