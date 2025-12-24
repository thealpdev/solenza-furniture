import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function HeroSection() {
  const [heroContent, setHeroContent] = useState({
    title: 'SOLENZA',
    subtitle: 'Beyond Furniture. A Statement.',
    image_url: ''
  })

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function loadHeroSettings() {
      const { data } = await supabase.from('settings').select('*').in('key', ['hero_title_tr', 'hero_subtitle_tr', 'hero_image_url'])
      if (data) {
        const settings: any = {}
        data.forEach(item => settings[item.key] = item.value)

        setHeroContent(prev => ({
          title: settings.hero_title_tr || prev.title,
          subtitle: settings.hero_subtitle_tr || prev.subtitle,
          image_url: settings.hero_image_url || ''
        }))
      }
    }
    loadHeroSettings()
  }, [])

  return (
    <>
      <section className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-black text-white">
        {/* Hero Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Content - Avant-Garde Typography */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 md:px-0 mix-blend-difference text-white">

          <div
            className="overflow-hidden mb-4 md:mb-8"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          >
            <h1 className="font-serif text-[15vw] md:text-[12vw] leading-[0.8] tracking-tighter opacity-0 animate-[slideUp_1.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              {heroContent.title.split(' ')[0] || 'SOLENZA'}
            </h1>
          </div>

          <p
            className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase opacity-0 animate-[fadeIn_1.5s_ease-out_0.5s_forwards] max-w-md mx-auto leading-loose"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            {heroContent.subtitle}
          </p>

          <div className="mt-12 opacity-0 animate-[fadeIn_1.5s_ease-out_1s_forwards] flex flex-col items-center gap-6">
            <Link
              href="/categories"
              className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 border border-white/40 rounded-full group-hover:border-white transition-colors duration-300"></div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-sm transition-all duration-300"></div>
              <span className="relative z-10 font-sans text-xs uppercase tracking-[0.3em] font-semibold group-hover:text-white transition-colors">
                Koleksiyonu Keşfet
              </span>
            </Link>

            <p className="text-[10px] uppercase tracking-widest text-white/40">
              New Season '26
            </p>

            {/* Trust Indicators - Added as 'extra' conversion element */}
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider text-white/60 pt-4 border-t border-white/10 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                2 Yıl Garanti
              </span>
              <span className="w-px h-3 bg-white/20"></span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-white rounded-full"></span>
                El İşçiliği
              </span>
              <span className="w-px h-3 bg-white/20"></span>
              <span>Yerli Üretim</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-[fadeIn_1.5s_ease-out_2s_forwards] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">Aşağı Kaydır</span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center animate-bounce bg-white/5 backdrop-blur-sm">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </button>
      </section>

      {/* Editorial "Statement" Bar */}
      <div className="bg-black text-white py-8 border-b border-gray-900 border-t border-gray-900">
        <div className="overflow-hidden whitespace-nowrap flex">
          <div className="animate-marquee flex gap-12 text-sm uppercase tracking-[0.3em] font-light text-gray-400">
            <span>Unique Design</span>
            <span>•</span>
            <span>Italian Aesthetic</span>
            <span>•</span>
            <span>Handcrafted</span>
            <span>•</span>
            <span>Timeless</span>
            <span>•</span>
            <span>Solenza</span>
            <span>•</span>
            <span>Unique Design</span>
            <span>•</span>
            <span>Italian Aesthetic</span>
            <span>•</span>
            <span>Handcrafted</span>
            <span>•</span>
            <span>Timeless</span>
          </div>
        </div>
      </div >
    </>
  )
}

