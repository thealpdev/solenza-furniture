'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Language } from '@/types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  tr: {
    home: 'Ana Sayfa',
    categories: 'Kategoriler',
    products: 'Ürünler',
    campaigns: 'Kampanyalar',
    about: 'Hakkımızda',
    contact: 'İletişim',
    viewAll: 'Tümünü Gör',
    viewDetails: 'Detayları Gör',
    price: 'Fiyat',
    priceOnRequest: 'Fiyat için iletişime geçin',
    featuredProducts: 'Öne Çıkan Ürünler',
    newProducts: 'Yeni Ürünler',
    activeCampaigns: 'Aktif Kampanyalar',
    specifications: 'Özellikler',
    phone: 'Telefon',
    whatsapp: 'WhatsApp',
    email: 'E-posta',
    address: 'Adres',
    followUs: 'Bizi Takip Edin',
  },
  en: {
    home: 'Home',
    categories: 'Categories',
    products: 'Products',
    campaigns: 'Campaigns',
    about: 'About',
    contact: 'Contact',
    viewAll: 'View All',
    viewDetails: 'View Details',
    price: 'Price',
    priceOnRequest: 'Contact for price',
    featuredProducts: 'Featured Products',
    newProducts: 'New Products',
    activeCampaigns: 'Active Campaigns',
    specifications: 'Specifications',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    email: 'Email',
    address: 'Address',
    followUs: 'Follow Us',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'tr' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.tr] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
