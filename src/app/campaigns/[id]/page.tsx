'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

type Campaign = {
    id: string;
    image_url: string | null;
    start_date: string | null;
    end_date: string | null;
    discount_amount?: string;
    translations: {
        tr?: { title: string; description?: string };
        en?: { title: string; description?: string };
    };
};

export default function CampaignDetailPage() {
    const { id } = useParams();
    const { language } = useLanguage();
    const router = useRouter();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadCampaign();
        }
    }, [id]);

    const loadCampaign = async () => {
        try {
            setLoading(true);
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
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                const formatted: Campaign = {
                    ...data,
                    translations: {
                        tr: data.campaign_translations?.find((t: any) => t.lang === 'tr'),
                        en: data.campaign_translations?.find((t: any) => t.lang === 'en'),
                    },
                };
                setCampaign(formatted);
            }
        } catch (error) {
            console.error('Error loading campaign:', error);
            // router.push('/campaigns'); // Create separate error page if needed?
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {language === 'tr' ? 'Kampanya Bulunamadı' : 'Campaign Not Found'}
                </h1>
                <Link
                    href="/campaigns"
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    {language === 'tr' ? 'Tüm Kampanyalar' : 'All Campaigns'}
                </Link>
            </div>
        );
    }

    const t = campaign.translations[language] || campaign.translations['tr'];
    const title = t?.title || 'Kampanya Detayı';
    const description = t?.description || '';

    return (
        <main className="min-h-screen bg-white pt-24 pb-12">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-8 font-light tracking-wide">
                    <Link href="/" className="hover:text-black transition-colors">
                        {language === 'tr' ? 'Ana Sayfa' : 'Home'}
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/campaigns" className="hover:text-black transition-colors">
                        {language === 'tr' ? 'Kampanyalar' : 'Campaigns'}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{title}</span>
                </nav>

                {/* Campaign Header */}
                <header className="mb-10 text-center">
                    {/* Badge / Date */}
                    {campaign.end_date && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            {new Date(campaign.end_date) > new Date()
                                ? (language === 'tr' ? 'Son Gün: ' : 'Ends: ') + new Date(campaign.end_date).toLocaleDateString()
                                : (language === 'tr' ? 'Sona Erdi' : 'Expired')
                            }
                        </div>
                    )}

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-900 leading-tight mb-6">
                        {title}
                    </h1>

                    {campaign.discount_amount && (
                        <div className="inline-block bg-black text-white px-6 py-2 text-xl font-bold transform -rotate-2">
                            {campaign.discount_amount}
                        </div>
                    )}
                </header>

                {/* Campaign Image */}
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12 bg-gray-100">
                    {campaign.image_url ? (
                        <Image
                            src={campaign.image_url}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <span className="text-6xl">🖼️</span>
                        </div>
                    )}
                </div>

                {/* Campaign Content */}
                <div className="prose prose-lg prose-red mx-auto text-gray-600 font-light leading-relaxed">
                    {/* Simple paragraph display for now. Could support Markdown later if needed */}
                    {description.split('\n').map((line, i) => (
                        <p key={i} className="mb-4">{line}</p>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-serif text-gray-900 mb-4">
                        {language === 'tr' ? 'Bu Fırsatı Kaçırmayın' : 'Don\'t Miss Out'}
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-lg">
                        {language === 'tr'
                            ? 'Detaylı bilgi almak ve sipariş vermek için satış temsilcilerimizle iletişime geçin.'
                            : 'Contact our sales representatives for detailed information and to place an order.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            href="/contact"
                            className="flex-1 sm:flex-none px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            {language === 'tr' ? 'Bize Ulaşın' : 'Contact Us'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                        <a
                            href="https://wa.me/905XXXXXXXXX"
                            target="_blank"
                            className="flex-1 sm:flex-none px-8 py-4 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#128C7E] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>

            </article>
        </main>
    );
}
