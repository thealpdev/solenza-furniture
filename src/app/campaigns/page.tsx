'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CampaignsPage() {
  const { language } = useLanguage()

  // Mock kampanya verileri
  const campaigns = [
    {
      id: 1,
      title: 'Kış Sonu Fırsatları',
      description: 'Tüm koltuk takımlarında %30\'a varan indirim! Kaçırmayın!',
      discount: '%30',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      badge: '🔥 Sıcak Fırsat',
      color: 'from-holiday-red to-red-700',
      endDate: '31 Mart 2024'
    },
    {
      id: 2,
      title: 'Yatak Odası Kampanyası',
      description: 'Yatak odası takımlarında özel indirimler ve ücretsiz montaj hizmeti',
      discount: '%25',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      badge: '⭐ Özel Fiyat',
      color: 'from-holiday-gold to-yellow-600',
      endDate: '15 Nisan 2024'
    },
    {
      id: 3,
      title: 'Yemek Odası Seti',
      description: 'Yemek masası ve sandalye setlerinde 3 al 2 öde kampanyası',
      discount: '3 Al 2 Öde',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
      badge: '🎁 Hediye',
      color: 'from-holiday-green to-emerald-700',
      endDate: '30 Nisan 2024'
    },
    {
      id: 4,
      title: 'Ofis Mobilyaları',
      description: 'Çalışma masası ve ofis koltuklarında özel indirimler',
      discount: '%20',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      badge: '💼 İş Fırsatı',
      color: 'from-slate-600 to-slate-800',
      endDate: '20 Nisan 2024'
    },
    {
      id: 5,
      title: 'Bahçe Mobilyaları',
      description: 'Bahçe ve balkon mobilyalarında sezon başı kampanyası',
      discount: '%35',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
      badge: '🌸 Bahar',
      color: 'from-holiday-red to-pink-600',
      endDate: '10 Mayıs 2024'
    },
    {
      id: 6,
      title: 'Çocuk Odası',
      description: 'Çocuk odası mobilyalarında %40\'a varan indirimler',
      discount: '%40',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      badge: '🎨 Çocuk',
      color: 'from-holiday-gold to-orange-500',
      endDate: '25 Nisan 2024'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner - Holiday Style */}
      <section className="relative bg-gradient-to-r from-holiday-red via-red-700 to-holiday-red overflow-hidden border-b border-holiday-gold/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-holiday-gold rounded-full blur-3xl"></div>
          {/* Subtle Green Sparkles */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-holiday-green rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-holiday-green rounded-full animate-ping delay-700"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6 shadow-lg">
            <span className="text-2xl animate-bounce">🎁</span>
            <span className="text-white font-bold tracking-wide">Yılbaşı Fırsatları</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-md">
            Kaçırılmayacak <span className="text-holiday-gold">Yılbaşı Kampanyaları</span>
          </h1>
          <p className="text-lg md:text-xl text-red-50 max-w-2xl mx-auto font-light">
            Evinizi yeni yıla hazırlarken bütçenizi koruyan özel indirimler ve hediye fırsatları
          </p>
        </div>
      </section>

      {/* Kampanya Kartları */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-holiday-gold/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Kampanya Görseli */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                {/* İndirim Badge */}
                <div className={`absolute bottom-4 right-4 bg-gradient-to-br ${campaign.color} text-white px-4 py-2 rounded-xl font-bold text-xl shadow-lg border border-white/20`}>
                  {campaign.discount}
                </div>
                {/* Kategori Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-sm flex items-center gap-1">
                  {campaign.badge}
                </div>
              </div>

              {/* Kampanya İçeriği */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-holiday-red transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {campaign.description}
                </p>

                {/* Süre ve Buton */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4 text-holiday-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{campaign.endDate}'e kadar</span>
                  </div>
                  <Link
                    href="/contact"
                    className="group/btn relative overflow-hidden bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-holiday-red transition-colors flex items-center gap-2"
                  >
                    <span>İncele</span>
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden border border-gray-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-holiday-red rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-holiday-green rounded-full blur-3xl opacity-40"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Özel Kampanyalardan Haberdar Olun
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Yeni kampanyalar ve özel fırsatlar hakkında bilgi almak için bizimle iletişime geçin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-holiday-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                İletişime Geç
              </Link>
              <a
                href="https://wa.me/905XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Kampanya Avantajları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Ücretsiz Kargo', desc: 'Tüm siparişlerde' },
            { icon: '💳', title: '12 Taksit', desc: 'Kredi kartına' },
            { icon: '🔄', title: 'Kolay İade', desc: '14 gün içinde' },
            { icon: '🎁', title: 'Hediye Çeki', desc: 'Her alışverişte' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
