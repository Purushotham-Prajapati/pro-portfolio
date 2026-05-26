import './globals.css'
import NavbarWrapper from '../components/NavbarWrapper'
import { ThemeProvider } from '../components/shared/ThemeContext'
import LenisProvider from '../components/shared/LenisProvider'

import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://madhubala.in'),
  title: 'Dr. M. Madhu Bala | Professor of Computer Science & Engineering',
  description: 'Professor Dr. M. Madhu Bala – 21+ years of academic excellence in Computer Science, Machine Learning, Image Mining, and AI research. JNTUH-ratified Professor, IEEE Member, and Principal Investigator for DST projects.',
  keywords: 'Dr Madhu Bala, Professor CSE, Machine Learning, Image Mining, Computer Vision, Artificial Intelligence, JNTUH, DST research, Data Science, Federated Learning',
  authors: [{ name: 'Dr. M. Madhu Bala' }],
  creator: 'Dr. M. Madhu Bala',
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://madhubala.in', // Replace with actual URL if known
    title: 'Dr. M. Madhu Bala | Professor of Computer Science & Engineering',
    description: 'Explore the academic journey, research publications, patents, and teaching experience of Dr. M. Madhu Bala. 21+ years of excellence in CSE.',
    siteName: 'Dr. M. Madhu Bala Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Ensure you have an og-image.jpg in the public folder if possible
        width: 1200,
        height: 630,
        alt: 'Dr. M. Madhu Bala - Professor of CSE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. M. Madhu Bala | Professor of Computer Science & Engineering',
    description: 'Professor Dr. M. Madhu Bala – 21+ years of academic excellence in Computer Science, Machine Learning, Image Mining, and AI research.',
    creator: '@madhubala', // Replace if known
  },
  alternates: {
    canonical: 'https://madhubala.in', // Replace with actual URL
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const themeScript = `
    (function() {
      try {
        var key = 'madhubala-theme';
        var stored = localStorage.getItem(key);
        var cookie = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'));
        var saved = stored || (cookie && cookie[1]);
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = saved || (prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
      } catch (error) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* title="Dr. M. Madhu Bala | Professor of Computer Science" */}
        {/* name="description" */}
        {/* og:title */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LenisProvider>
            <NavbarWrapper />
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
