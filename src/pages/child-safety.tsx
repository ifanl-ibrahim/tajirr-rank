// pages/child-safety.tsx
import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import Head from "next/head";

const Page = styled.main`
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Container = styled.div`
  width: 100%;
  max-width: 980px;
  border-radius: 12px;
  padding: 2.25rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
`;

const Title = styled.h1`
  font-size: 1.9rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
`;

const Paragraph = styled.p`
  margin: 0.45rem 0 0.9rem;
  line-height: 1.6;
  font-size: 0.98rem;
`;

const Small = styled.p`
  font-size: 0.88rem;
  margin-top: 0.6rem;
`;

export default function ChildSafety() {
  const { t } = useTranslation("en", { useSuspense: false });

  return (
    <Page>
      <Head>
        <title>Tajirr | {t("childSafety.title")}</title>
      </Head>
      <Container>
        <Title>{t("childSafety.title")}</Title>

        <SectionTitle>{t("childSafety.1.title")}</SectionTitle>
        <Paragraph
          dangerouslySetInnerHTML={{ __html: t("childSafety.1.content") }}
        />

        <SectionTitle>{t("childSafety.2.title")}</SectionTitle>
        <Paragraph
          dangerouslySetInnerHTML={{ __html: t("childSafety.2.content") }}
        />

        <SectionTitle>{t("childSafety.3.title")}</SectionTitle>
        <Paragraph
          dangerouslySetInnerHTML={{ __html: t("childSafety.3.content") }}
        />

        <SectionTitle>{t("childSafety.4.title")}</SectionTitle>
        <Paragraph
          dangerouslySetInnerHTML={{ __html: t("childSafety.4.content") }}
        />

        <SectionTitle>{t("childSafety.5.title")}</SectionTitle>
        <Paragraph
          dangerouslySetInnerHTML={{ __html: t("childSafety.5.content") }}
        />

        <Small>{t("childSafety.legalNotice")}</Small>
      </Container>
    </Page>
  );
}