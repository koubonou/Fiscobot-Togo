import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0f1923" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LexIA" />
        <meta name="description" content="LexIA - Votre expert fiscal et comptable IA by Falcon Audit & Consulting" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
