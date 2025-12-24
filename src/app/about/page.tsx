'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import type { Settings } from '@/types'

export default function AboutPage() {
  const { language, t } = useLanguage()
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // Settings table doesn't exist yet - using placeholder data
    setSettings({
      about_tr: 'Solenza hakkında bilgi yakında eklenecek.',
      about_en: 'About Solenza information coming soon.',
    })
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('about')} Solenza</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {settings[`about_${language}`] || settings.about_tr}
          </p>
        </div>
      </div>
    </div>
  )
}
