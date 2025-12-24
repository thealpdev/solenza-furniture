'use client'

import { Lato, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'
import SnowEffect from '@/components/SnowEffect'
import { FavoritesProvider } from '@/contexts/FavoritesContext'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <html lang="tr" className={`${lato.variable} ${playfair.variable}`}>
      <body className={lato.className}>
        <SnowEffect />
        <FavoritesProvider>
          <LanguageProvider>

            {!isAdminRoute && <Header />}
            <main className={isAdminRoute ? '' : 'min-h-screen'}>{children}</main>
            {!isAdminRoute && <Footer />}
            <Toaster position="top-right" />
          </LanguageProvider>
        </FavoritesProvider>
      </body>
    </html>
  )
}
