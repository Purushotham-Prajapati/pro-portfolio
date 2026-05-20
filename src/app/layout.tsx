import './globals.css'
import NavbarWrapper from '../components/NavbarWrapper'

export const metadata = {
  title: 'Dr. M. Madhu Bala | Professor of Computer Science & Engineering',
  description: 'Professor Dr. M. Madhu Bala – 21 years of excellence in Computer Science, Machine Learning, Image Mining and AI research. JNTUH-ratified Professor, Principal Investigator for DST projects funded at ₹1Cr+.',
  keywords: 'Dr Madhu Bala, Professor CSE, Machine Learning, Image Mining, Computer Vision, JNTUH, DST research',
  openGraph: {
    title: 'Dr. M. Madhu Bala | Professor of Computer Science',
    description: '21 years of academic excellence. 100+ publications, 8 patents, 780+ citations.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* title="Dr. M. Madhu Bala | Professor of Computer Science" */}
        {/* name="description" */}
        {/* og:title */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  )
}
