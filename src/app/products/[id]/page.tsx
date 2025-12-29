'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import RelatedProducts from '@/components/RelatedProducts'

export default function ProductPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', params.id)
        .single()

      if (data) {
        setProduct(data as any)
      }
    } finally {
      setLoading(false)
    }
  }

  // LOADING 
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // NOT FOUND 
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-center px-4">
        <div>
          <h2 className="font-serif text-2xl text-gray-900 mb-2">Ürün Bulunamadı</h2>
          <Link href="/" className="text-xs uppercase tracking-widest text-gray-500 hover:text-black hover:underline">
            Koleksiyona Dön
          </Link>
        </div>
      </div>
    )
  }

  const images = (product as any).product_images || []
  const hasImages = images.length > 0

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-32 pb-20">

      {/* Breadcrumb - Clean & Simple */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">Ana Sayfa</Link>
          <span className="text-gray-300">/</span>
          <Link href="/categories" className="hover:text-black transition-colors">Koleksiyonlar</Link>
          <span className="text-gray-300">/</span>
          <span className="text-black">{(product as any).title_tr}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* LEFT: Premium Gallery (Vertical Stack) */}
          <div className="space-y-4 md:space-y-8">
            {hasImages ? (
              <>
                {/* Desktop: Vertical Stack */}
                <div className="hidden md:flex flex-col gap-6">
                  {images.map((img: any, idx: number) => (
                    <div key={img.id} className="w-full relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100 aspect-[4/5]">
                      <Image
                        src={img.image_url}
                        alt={`${(product as any).title_tr} - ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
                        sizes="(max-width: 1024px) 100vw, 800px"
                        priority={idx === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Mobile: Swipe Slider (Simple Implementation) */}
                <div className="md:hidden w-full aspect-[4/5] relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={images[selectedImage].image_url}
                    alt={(product as any).title_tr}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Dots for Mobile */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                      {images.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-2 h-2 rounded-full transition-all box-content border border-white/20 ${selectedImage === idx ? 'bg-white scale-125' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* Mobile Thumbnails Row */}
                <div className="flex md:hidden gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border transition-all ${selectedImage === idx
                        ? 'border-gray-900 opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`View ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full aspect-[4/5] relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center text-gray-300">
                <span className="text-xs uppercase tracking-widest">Görsel Yok</span>
              </div>
            )}
          </div>

          {/* RIGHT: Compact Details */}
          <div className="md:sticky md:top-32 h-fit">

            {/* Header */}
            <div className="border-b border-gray-100 pb-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                {(product as any).stock_status === 'in_stock' ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                )}
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  {(product as any).stock_status === 'in_stock' ? 'Stokta' : 'Tükendi'}
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
                {language === 'tr' ? (product as any).title_tr : (product as any).title_en || (product as any).title_tr}
              </h1>

              {(product as any).show_price && (product as any).price ? (
                <div className="flex items-baseline gap-3 text-gray-900">
                  <span className="text-2xl font-light">
                    ₺{(product as any).price.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₺{((product as any).price * 1.2).toLocaleString('tr-TR')}
                  </span>
                </div>
              ) : (
                <p className="text-lg font-serif italic text-gray-400">Fiyat bilgisi için iletişime geçiniz</p>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm prose-gray mb-8 text-gray-600 font-light leading-relaxed">
              <p>
                {language === 'tr' ? (product as any).description_tr : (product as any).description_en || (product as any).description_tr}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-8">
              <a
                href={`https://wa.me/905XXXXXXXXX?text=Merhaba, ${encodeURIComponent((product as any).title_tr)} hakkında bilgi almak istiyorum`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-900 text-white h-12 rounded-md flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] font-medium hover:bg-gray-800 transition-colors"
              >
                <span>WhatsApp İle Sipariş</span>
              </a>
              <button
                onClick={() => product && toggleFavorite(product.id)}
                className={`w-full border h-12 rounded-md flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] font-medium transition-all duration-300 ${product && isFavorite(product.id)
                  ? 'bg-holiday-red border-holiday-red text-white hover:bg-red-700'
                  : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <svg className={`w-5 h-5 ${product && isFavorite(product.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{product && isFavorite(product.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
              </button>
            </div>

            {/* Specs / Accordion Style */}
            {(language === 'tr' ? (product as any).specs_tr : (product as any).specs_en) && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h3 className="font-serif text-lg mb-3 text-gray-900">Ürün Özellikleri</h3>
                <div className="text-xs text-gray-500 font-light leading-6 whitespace-pre-line">
                  {language === 'tr' ? (product as any).specs_tr : (product as any).specs_en}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-[10px] uppercase tracking-wider">2 Yıl Garanti</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-[10px] uppercase tracking-wider">Hızlı Teslimat</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {product && (product as any).category_id && (
        <RelatedProducts
          categoryId={(product as any).category_id}
          currentProductId={(product as any).id}
        />
      )}
    </div>
  )
}
