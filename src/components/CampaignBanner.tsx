'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { X } from 'lucide-react'

type Campaign = {
    id: string
    image_url: string | null
    show_on_homepage: boolean
    translations: {
        tr?: { title: string; description?: string }
        en?: { title: string; description?: string }
    }
}

export default function CampaignBanner() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const [lang, setLang] = useState<'tr' | 'en'>('tr')

    useEffect(() => {
        // Get language from localStorage or default to 'tr'
        const savedLang = (localStorage.getItem('language') as 'tr' | 'en') || 'tr'
        setLang(savedLang)

        loadCampaigns()
    }, [])

    useEffect(() => {
        if (campaigns.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % campaigns.length)
            }, 5000) // Change every 5 seconds

            return () => clearInterval(interval)
        }
    }, [campaigns.length])

    const loadCampaigns = async () => {
        try {
            const today = new Date().toISOString().split('T')[0]

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
                .eq('show_on_homepage', true)
                .eq('is_active', true)
                .or(`end_date.is.null,end_date.gte.${today}`)
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data && data.length > 0) {
                const formatted = data.map((camp) => ({
                    ...camp,
                    translations: {
                        tr: camp.campaign_translations?.find((t: any) => t.lang === 'tr'),
                        en: camp.campaign_translations?.find((t: any) => t.lang === 'en'),
                    },
                }))
                setCampaigns(formatted)
            }
        } catch (error) {
            console.error('Error loading campaigns:', error)
        }
    }

    if (!isVisible || campaigns.length === 0) return null

    const currentCampaign = campaigns[currentIndex]
    const translation = currentCampaign.translations[lang] || currentCampaign.translations.tr

    return (
        <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-4 flex items-center justify-between">
                    <div className="flex-1 flex items-center">
                        {currentCampaign.image_url && (
                            <div className="hidden sm:block mr-4">
                                <img
                                    src={currentCampaign.image_url}
                                    alt={translation?.title || 'Campaign'}
                                    className="w-16 h-16 rounded-xl object-cover shadow-lg"
                                />
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider">
                                    🎉 {lang === 'tr' ? 'Kampanya' : 'Campaign'}
                                </span>
                                {campaigns.length > 1 && (
                                    <span className="text-xs text-white/70">
                                        {currentIndex + 1} / {campaigns.length}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-1">
                                {translation?.title}
                            </h3>
                            {translation?.description && (
                                <p className="text-sm text-white/90 hidden sm:block">
                                    {translation.description}
                                </p>
                            )}
                        </div>

                        <Link
                            href="/campaigns"
                            className="ml-4 px-6 py-2 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {lang === 'tr' ? 'Detaylar' : 'Details'}
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close banner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Dots indicator for multiple campaigns */}
                {campaigns.length > 1 && (
                    <div className="flex justify-center gap-2 pb-3">
                        {campaigns.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to campaign ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
