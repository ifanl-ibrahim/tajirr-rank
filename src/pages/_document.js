// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="Prove your success. Join the elite." />
          <meta name="description" content="Success isn't given. It's ranked." />
          <meta name="keywords" content="Ranking, Tajirr, Classement, Abonnements, Packs, Rang, Rank, Buy, Achat, Subscribe, Achats, ranked, You are, Price, Prix, Month, Mois, Per month, Par mois, faster, climb, Want to climb faster, Discover the exclusive packs, Discover, Points, Descending, Ascending, Luxe, Riche, Rich, Fame, Creative, Skills, Projects, languages, tools, References, Blog, Professional presentation, Resume, social networks, follow, Prove your success. Join the elite, Prove, success, your success, elite" />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Tajirr" />
          <meta property="og:title" content="Tajirr-Rank" />
          <meta property="og:description" content="Prove your success. Join the elite." />
          <meta property="og:description" content="Success isn't given. It's ranked." />
          <meta property="og:url" content="https://tajirr.club" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="TAJIRR" />
          <meta name="twitter:description" content="Prove your success. Join the elite." />
          <meta name="twitter:description" content="Success isn't given. It's ranked." />
          <html lang="en" />
          <link rel="alternate" hrefLang="fr" href="https://tajirr.club" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
          <link rel="canonical" href="https://tajirr.club" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}