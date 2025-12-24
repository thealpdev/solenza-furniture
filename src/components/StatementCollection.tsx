import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function StatementCollection() {
    const [content, setContent] = useState({
        title: 'The Velvet Touch Series',
        desc: 'Ustalıkla işlenmiş kadife dokusu, el işçiliği detaylar ve modern formun kusursuz uyumu. Evinizin en özel köşesi için tasarlandı.',
        image_url: ''
    })

    useEffect(() => {
        async function loadSettings() {
            const { data } = await supabase.from('settings').select('*').in('key', ['statement_title_tr', 'statement_desc_tr', 'statement_image_url'])
            if (data) {
                const settings: any = {}
                data.forEach(item => settings[item.key] = item.value)
                setContent(prev => ({
                    title: settings.statement_title_tr || prev.title,
                    desc: settings.statement_desc_tr || prev.desc,
                    image_url: settings.statement_image_url || ''
                }))
            }
        }
        loadSettings()
    }, [])

    return (
        <section className="relative bg-holiday-cream text-gray-900 border-t border-b border-gray-100">
            <div className="flex flex-col md:flex-row h-full">

                {/* Visual Side (Left on Desktop) */}
                <div className="w-full md:w-1/2 h-[60vh] md:h-screen relative overflow-hidden group md:sticky md:top-0">
                    {content.image_url ? (
                        <img
                            src={content.image_url}
                            alt={content.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            Görsel Bekleniyor
                        </div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 shadow-xl">
                        <span className="text-holiday-red font-serif font-medium uppercase tracking-widest text-xs">Signature Series</span>
                    </div>
                </div>

                {/* Content Side (Right on Desktop) */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 bg-white">
                    <div className="max-w-xl">
                        <div className="w-20 h-1 bg-holiday-gold mb-8"></div>

                        <h2 className="font-serif text-5xl md:text-6xl text-gray-900 mb-8 leading-none">
                            {content.title}
                        </h2>

                        <p className="font-sans text-lg text-gray-600 mb-10 leading-relaxed font-light">
                            {content.desc}
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-holiday-cream flex items-center justify-center text-holiday-red">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="font-serif text-lg">El İşçiliği Detaylar</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-holiday-cream flex items-center justify-center text-holiday-red">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="font-serif text-lg">Sürdürülebilir Materyal</span>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-6">
                            <Link href="/collections/velvet" className="bg-gray-900 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-holiday-red transition-all shadow-xl hover:shadow-red-900/20">
                                Şimdi İncele
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
