import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" /*style={{overflow: 'hidden'}}*/>
      <Head />
      <body>  {/* This is the only change */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
