'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import CategorySortFilter from '@/components/CategorySortFilter'
import { getCategoryImage } from '@/lib/imageHelpers'
import type { Category } from '@/types'

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { language, t } = useLanguage()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    loadData()
  }, [params.slug])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (cat) {
        setCategory(cat as any)

        const { data: prods } = await supabase
          .from('products')
          .select('*, product_images(*)')
          .eq('category_id', cat.id)
          .eq('status', 'active')

        if (prods) {
          setProducts(prods)
        }
      } else {
        setCategory(null)
      }
    } catch (error) {
      console.error('Error loading category:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSortedProducts = () => {
    const sorted = [...products]
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'price-desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      case 'name-asc':
        return sorted.sort((a, b) => (a.title_tr || '').localeCompare(b.title_tr || ''))
      case 'newest':
      default:
        // Assuming higher ID or created_at is newer, if created_at exists
        return sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    }
  }

  const displayProducts = getSortedProducts()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif text-gray-900 mb-2">Kategori Bulunamadı</h1>
        <Link href="/categories" className="text-xs uppercase tracking-widest text-gray-500 hover:text-black underline underline-offset-4">
          Koleksiyonlara Dön
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {(category as any) && (
          <div className="absolute inset-0">
            <Image
              src={getCategoryImage((category as any).slug, (category as any).image_url)}
              alt={language === 'tr' ? (category as any).name_tr : (category as any).name_en || ''}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}

        <div className="relative z-10 text-center text-white px-6 mt-16">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/70 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-white">Koleksiyonlar</Link>
            <span>/</span>
            <span className="text-white font-medium">
              {language === 'tr' ? (category as any).name_tr : (category as any).name_en || (category as any).name_tr}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-4 tracking-tight">
            {language === 'tr' ? (category as any).name_tr : (category as any).name_en || (category as any).name_tr}
          </h1>
          <p className="text-white/80 font-light max-w-2xl mx-auto text-lg">
            Solenza'nın eşsiz {(category as any).name_tr} koleksiyonu ile yaşam alanlarınıza değer katın.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <CategorySortFilter
          currentSort={sort}
          onSortChange={setSort}
          productCount={displayProducts.length}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <span className="block text-gray-400 text-sm mb-2">Bu kategoride henüz ürün bulunmuyor.</span>
            <Link href="/categories" className="text-xs uppercase font-bold text-gray-900 hover:underline">Diğer Koleksiyonlara Bak</Link>
          </div>
        )}
      </div>
    </div>
  )
}
