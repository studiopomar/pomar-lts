import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from './SmoothScroll';
import OrchardBackground from './OrchardBackground';
import { SoundProvider } from './SoundEffects';
import { LanguageProvider } from './LanguageContext';
import BackToTop from './BackToTop';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = 'https://studiopomar.github.io/pomar-lts';
const ogImageUrl = `${siteUrl}/studio-pomar-icon-4096.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Studio POMAR | Vozes que criam raízes',
  description: 'Coletivo de voicebanks e ferramentas livres para UTAU e OpenUTAU. Vozes brasileiras e tecnologia aberta em síntese vocal.',
  keywords: [
    'Studio POMAR',
    'POMAR',
    'UTAU Brasil',
    'OpenUTAU',
    'DiffSinger',
    'Sintetizador de voz',
    'Voicebanks brasileiros',
    'Kamafeu',
    'VIICTOR',
    'YOHJI',
    'EDDIE',
    'LLANE CROW',
    'MIZUKI',
    'Kodama Kito',
    'Kito',
    'Vocaloid Brasil',
    'Software livre de áudio',
    'Síntese vocal',
    'VSynth BR'
  ],
  authors: [{ name: 'Studio POMAR', url: 'https://github.com/studiopomar' }],
  creator: 'Studio POMAR',
  publisher: 'Studio POMAR',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: `${basePath}/studio-pomar-icon-4096.png`, type: 'image/png' },
      { url: `${basePath}/favicon.png`, type: 'image/png' },
    ],
    apple: `${basePath}/studio-pomar-icon-4096.png`,
    shortcut: `${basePath}/studio-pomar-icon-4096.png`,
  },
  openGraph: {
    title: 'Studio POMAR | Vozes que criam raízes',
    description: 'Coletivo de voicebanks e ferramentas livres para UTAU e OpenUTAU. Feito pela comunidade, para a comunidade.',
    url: siteUrl,
    siteName: 'Studio POMAR',
    images: [
      {
        url: ogImageUrl,
        width: 800,
        height: 800,
        alt: 'Studio POMAR — Vozes que criam raízes',
        type: 'image/png',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio POMAR | Vozes que criam raízes',
    description: 'Coletivo de voicebanks e ferramentas livres para UTAU e OpenUTAU.',
    images: [ogImageUrl],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Studio POMAR',
      url: siteUrl,
      logo: ogImageUrl,
      image: ogImageUrl,
      sameAs: [
        'https://github.com/studiopomar',
        'https://vsynthbr.fandom.com/pt-br/wiki/VIICTOR',
        'https://vsynthbr.fandom.com/pt-br/wiki/Kodama_Kito',
        'https://vocadb.net/Ar/86115',
      ],
      description: 'Coletivo de voicebanks e ferramentas livres para UTAU, OpenUTAU e síntese vocal brasileira.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Studio POMAR | Vozes que criam raízes',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: 'pt-BR',
      description: 'Voicebanks brasileiros e ferramentas livres para UTAU e OpenUTAU.',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'KAMAFEU',
      operatingSystem: 'Cross-platform',
      applicationCategory: 'MultimediaApplication',
      url: 'https://github.com/studiopomar/kamafeu',
      description: 'Sintetizador concatenativo multifaixa e editor de voz UTAU/OpenUTAU em Rust com processamento DSP nativo.',
      author: {
        '@id': `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/png" href={`${basePath}/studio-pomar-icon-4096.png`} />
        <link rel="apple-touch-icon" href={`${basePath}/studio-pomar-icon-4096.png`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="Studio POMAR — Vozes que criam raízes" />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="Studio POMAR — Vozes que criam raízes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <OrchardBackground />
        <LanguageProvider>
          <SoundProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
            <BackToTop />
          </SoundProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
