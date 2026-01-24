'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Campaign = {
  id: string
  image_url: string | null
  start_date: string | null
  end_date: string | null
  discount_amount?: string
  translations: {
    tr?: { title: string; description?: string }
    en?: { title: string; description?: string }
  }
}

export default function CampaignsPage() {
  const { language } = useLanguage()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Fetch campaigns that are active
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
              *,
              campaign_translations (
                lang,
                title,
                description
              )
            `)
        .eq('is_active', true)
        .or(`end_date.is.null,end_date.gte.${today}`) // Only future or current campaigns
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const formatted = data.map((camp: any) => ({
          ...camp,
          translations: {
            tr: camp.campaign_translations?.find((t: any) => t.lang === 'tr'),
            en: camp.campaign_translations?.find((t: any) => t.lang === 'en'),
          },
        }))
        setCampaigns(formatted)
      }
    } catch (error) {
      console.error('Kampanyalar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-holiday-red"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Banner - Luxury Style */}
      <section className="relative bg-gradient-to-r from-primary-dark via-primary to-primary-dark overflow-hidden border-b border-gold-400/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-gold-200 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-gold-200 rounded-full animate-ping delay-700"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6 shadow-lg">
            <span className="text-2xl animate-pulse">🎁</span>
            <span className="text-white font-bold tracking-wide">
              {language === 'tr' ? 'Fırsatlar' : 'Opportunities'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-md">
            {language === 'tr' ? 'Kaçırılmayacak' : 'Unmissable'} <span className="text-gold-100">{language === 'tr' ? 'Kampanyalar' : 'Campaigns'}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
            {language === 'tr'
              ? 'Evinizi yenilerken bütçenizi koruyan özel indirimler ve hediye fırsatları'
              : 'Special discounts and gift opportunities that protect your budget while renewing your home'}
          </p>
        </div>
      </section>

      {/* Kampanya Kartları */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {campaigns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <span className="text-6xl mb-4 block">😔</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'tr' ? 'Şu an aktif bir kampanya yok' : 'No active campaigns at the moment'}
            </h3>
            <p className="text-gray-500">
              {language === 'tr' ? 'Lütfen daha sonra tekrar kontrol edin.' : 'Please check back later.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => {
              const t = campaign.translations[language] || campaign.translations['tr'];
              return (
                <div
                  key={campaign.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-holiday-gold/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  {/* Kampanya Görseli */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {campaign.image_url ? (
                      <Image
                        src={campaign.image_url}
                        alt={t?.title || 'Campaign'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🖼️</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                    {/* İndirim Badge (Varsa) */}
                    {campaign.discount_amount && (
                      <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-xl font-bold text-xl shadow-lg border border-white/20">
                        {campaign.discount_amount}
                      </div>
                    )}
                  </div>

                  {/* Kampanya İçeriği */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-holiday-red transition-colors">
                      {t?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {t?.description}
                    </p>

                    {/* Süre ve Buton */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      {campaign.end_date && (
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <svg className="w-4 h-4 text-holiday-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(campaign.end_date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                        </div>
                      )}
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="group/btn relative overflow-hidden bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary transition-colors flex items-center gap-2 ml-auto"
                      >
                        <span>{language === 'tr' ? 'İncele' : 'View Details'}</span>
                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Bölümü */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden border border-gray-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-holiday-red rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-dark rounded-full blur-3xl opacity-40"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'tr' ? 'Özel Kampanyalardan Haberdar Olun' : 'Get Notified About Special Campaigns'}
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {language === 'tr'
                ? 'Yeni kampanyalar ve özel fırsatlar hakkında bilgi almak için bizimle iletişime geçin'
                : 'Contact us to get information about new campaigns and special offers'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {language === 'tr' ? 'İletişime Geç' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
