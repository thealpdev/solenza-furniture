'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/types'
import { CATEGORY_IMAGES } from '@/lib/constants'

export default function CategoriesPage() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setCategories(data as any)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden mb-0">
        <div className="absolute inset-0">
          <Image
            src={CATEGORY_IMAGES['kampanyalar'] || 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg'}
            alt={language === 'tr' ? 'Koleksiyonlar' : 'Collections'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 mt-16">
          <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-tight">
            {language === 'tr' ? 'Koleksiyonlar' : 'Collections'}
          </h1>
          <p className="text-white/80 font-light max-w-xl mx-auto text-lg leading-relaxed">
            {language === 'tr'
              ? 'Evinizin her köşesi için özenle seçilmiş, şıklığı ve konforu bir araya getiren tasarımlar.'
              : 'Carefully selected designs that combine elegance and comfort for every corner of your home.'}
          </p>
        </div>
      </div>

      {/* Magazine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-gray-100 border-y border-gray-100">
        {categories.map((category, idx) => (
          <Link
            key={category.id}
            href={`/?category=${category.id}`}
            className="group relative h-[50vh] md:h-[60vh] overflow-hidden bg-gray-200"
          >
            {/* Image */}
            <Image
              src={(category as any).image_url || CATEGORY_IMAGES[category.slug.toLowerCase()] || CATEGORY_IMAGES['oturma-grubu']}
              alt={language === 'tr' ? (category as any).name_tr : (category as any).name_en || ''}
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14 text-white">
              <span className="font-mono text-xs text-white/60 mb-2 block transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                0{idx + 1}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                {language === 'tr' ? (category as any).name_tr : (category as any).name_en || (category as any).name_tr}
              </h2>
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] border-b border-transparent group-hover:border-white/50 pb-1 w-fit transition-all duration-500 opacity-80 group-hover:opacity-100">
                {language === 'tr' ? 'Koleksiyonu İncele' : 'View Collection'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
