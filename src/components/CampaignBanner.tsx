'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type Campaign = {
    id: string
    image_url: string | null
    show_on_homepage: boolean
    start_date: string | null
    end_date: string | null
    translations: {
        tr?: { title: string; description?: string }
        en?: { title: string; description?: string }
    }
}

export default function CampaignBanner() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const { language } = useLanguage()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        loadCampaigns()
    }, [])

    // Auto-rotate campaigns
    useEffect(() => {
        if (campaigns.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % campaigns.length)
            }, 6000)
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

    if (!isVisible || campaigns.length === 0 || !mounted) return null

    const currentCampaign = campaigns[currentIndex]
    const translation = currentCampaign.translations[language] || currentCampaign.translations.tr

    return (
        <div className="relative w-full bg-black text-white overflow-hidden shadow-2xl border-b border-gray-800">
            {/* Background Image Layer */}
            {currentCampaign.image_url ? (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform hover:scale-105"
                    style={{ backgroundImage: `url(${currentCampaign.image_url})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent/50"></div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-purple-900 to-black"></div>
            )}

            {/* Content Container */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 md:py-8 lg:py-10 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Glass Card for Text Content */}
                <div className="flex-1 text-center md:text-left space-y-4 max-w-2xl bg-black/30 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm mx-auto md:mx-0 relative z-10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                            {language === 'tr' ? 'Özel Fırsat' : 'Special Offer'}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight text-white drop-shadow-lg relative z-10">
                        {translation?.title}
                    </h2>

                    {translation?.description && (
                        <p className="text-sm md:text-base text-gray-200 font-light max-w-xl mx-auto md:mx-0 line-clamp-2 leading-relaxed relative z-10">
                            {translation.description}
                        </p>
                    )}

                    {/* Button inside card for better grouping on mobile, or keep outside? Let's keep distinct actions outside or integrated. 
                        User design shows separate button. I'll keep the button separate but aligned, or maybe move it inside?
                        Moving inside makes it a complete "Card". Let offers stand out.
                    */}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 shrink-0">
                    <Link
                        href={`/campaigns/${currentCampaign.id}`}
                        className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs overflow-hidden rounded-full transition-all hover:bg-primary hover:text-white shadow-lg shadow-white/10 hover:shadow-primary/20"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {language === 'tr' ? 'İncele' : 'View Details'}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-3 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md border border-white/5"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Pagination Dots (if multiple) */}
            {campaigns.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {campaigns.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
