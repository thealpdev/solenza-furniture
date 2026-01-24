import { Lato, Playfair_Display } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import LayoutWrapper from './LayoutWrapper'

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Solenza | Luxury Furniture & Home Decor',
    template: '%s | Solenza'
  },
  description: 'Eviniz için seçkin mobilya koleksiyonları. Premium koltuk, yatak odası, oturma grubu ve daha fazlası. Ücretsiz kargo ve hızlı teslimat.',
  keywords: ['mobilya', 'furniture', 'koltuk', 'yatak', 'oturma grubu', 'luxury furniture', 'home decor', 'Solenza'],
  authors: [{ name: 'Solenza' }],
  creator: 'Solenza',
  publisher: 'Solenza',
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
    locale: 'tr_TR',
    alternateLocale: ['en_US'],
    url: 'https://solenza.com',
    title: 'Solenza | Luxury Furniture & Home Decor',
    description: 'Eviniz için seçkin mobilya koleksiyonları',
    siteName: 'Solenza',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solenza | Luxury Furniture',
    description: 'Eviniz için seçkin mobilya koleksiyonları',
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Console verification
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${lato.variable} ${playfair.variable}`}>
      <body className={lato.className}>
        <FavoritesProvider>
          <LanguageProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster position="top-right" />
          </LanguageProvider>
        </FavoritesProvider>
      </body>
    </html>
  )
}
