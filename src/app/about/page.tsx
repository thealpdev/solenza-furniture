'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

export default function AboutPage() {
  const { language } = useLanguage()

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Solenza Interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white font-serif text-5xl md:text-7xl tracking-wide italic">
            {language === 'tr' ? 'Hikayemiz' : 'Our Story'}
          </h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 space-y-32">

        {/* Intro */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 block">1995'ten Beri</span>
            <h2 className="font-serif text-4xl text-gray-900 mb-6 leading-tight">
              {language === 'tr' ? 'Konfor ve Estetiğin Buluşma Noktası' : 'Where Comfort Meets Aesthetics'}
            </h2>
            <div className="w-20 h-[1px] bg-gray-900 mb-8"></div>
            <p className="text-gray-600 font-light leading-relaxed text-lg mb-6">
              {language === 'tr'
                ? 'Solenza, evinizin her köşesine zarafet ve konfor katmak için yola çıktı. Yılların getirdiği deneyimle, en kaliteli malzemeleri modern tasarımlarla harmanlıyor, yaşam alanlarınızı sanat eserine dönüştürüyoruz.'
                : 'Solenza set out to add elegance and comfort to every corner of your home. With years of experience, we blend the highest quality materials with modern designs, transforming your living spaces into works of art.'
              }
            </p>
            <p className="text-gray-600 font-light leading-relaxed text-lg">
              {language === 'tr'
                ? 'Her bir parça, ustalarımızın elinde özenle şekilleniyor. Bizim için mobilya sadece bir eşya değil, yaşam tarzınızın bir yansımasıdır.'
                : 'Each piece is carefully shaped in the hands of our masters. For us, furniture is not just an item, but a reflection of your lifestyle.'
              }
            </p>
          </div>
          <div className="relative h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden translate-y-8 md:translate-y-12">
            <Image
              src="https://images.pexels.com/photos/3757055/pexels-photo-3757055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Craftsmanship"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Philosophy / Values */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl text-gray-900 mb-4">
              {language === 'tr' ? 'Değerlerimiz' : 'Our Values'}
            </h2>
            <div className="w-12 h-[1px] bg-gray-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Value 1 */}
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-500">
                <svg className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="font-serif text-xl">{language === 'tr' ? 'Kalite Tutkusu' : 'Passion for Quality'}</h3>
              <p className="text-gray-500 font-light text-sm leading-6">
                {language === 'tr' ? 'En dayanıklı kumaşlar ve birinci sınıf ahşap kullanımı.' : 'Using the most durable fabrics and premium wood.'}
              </p>
            </div>
            {/* Value 2 */}
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-500">
                <svg className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-serif text-xl">{language === 'tr' ? 'Zamanız Tasarım' : 'Timeless Design'}</h3>
              <p className="text-gray-500 font-light text-sm leading-6">
                {language === 'tr' ? 'Modası geçmeyen, her döneme hitap eden estetik çizgiler.' : 'Aesthetic lines that never go out of fashion.'}
              </p>
            </div>
            {/* Value 3 */}
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-500">
                <svg className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-serif text-xl">{language === 'tr' ? 'Müşteri Mutluluğu' : 'Customer Happiness'}</h3>
              <p className="text-gray-500 font-light text-sm leading-6">
                {language === 'tr' ? 'Satış öncesi ve sonrası kesintisiz destek ve güvence.' : 'Uninterrupted support and assurance before and after sales.'}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
