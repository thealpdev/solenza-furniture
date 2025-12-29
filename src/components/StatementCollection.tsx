import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function StatementCollection() {
    const [content, setContent] = useState({
        title: 'The Velvet Touch Series',
        desc: 'Ustalıkla işlenmiş kadife dokusu, el işçiliği detaylar ve modern formun kusursuz uyumu.',
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80' // Default high-quality placeholder
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
                    image_url: settings.statement_image_url || prev.image_url
                }))
            }
        }
        loadSettings()
    }, [])

    return (
        <section className="relative h-[500px] w-full overflow-hidden group">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={content.image_url}
                    alt={content.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center text-white">
                <span className="text-xs font-serif uppercase tracking-[0.3em] mb-4 text-white/80">Signature Series</span>

                <h2 className="font-serif text-4xl md:text-6xl mb-6 leading-tight max-w-3xl">
                    {content.title}
                </h2>

                <p className="font-light text-white/90 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                    {content.desc}
                </p>

                <Link
                    href="/categories"
                    className="inline-block px-8 py-3 border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-medium"
                >
                    Koleksiyonu İncele
                </Link>
            </div>
        </section>
    );
}
