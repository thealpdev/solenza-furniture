'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

type ProductImage = {
  id: string
  image_url: string
}

type Product = {
  id: string
  title_tr: string
  title_en: string
  description_tr: string
  price: number
  show_price: boolean
  status: string
  created_at: string
  product_images: ProductImage[]
}

export default function NewProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    loadProducts()
  }, [sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'active')

      // Son 30 gün içinde eklenen ürünler
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      query = query.gte('created_at', thirtyDaysAgo.toISOString())

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      if (data) setProducts(data)
    } catch (err) {
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      {/* Hero Banner - Golden Luxury Theme */}
      <section className="relative bg-gradient-to-r from-primary-dark via-primary to-primary-dark overflow-hidden border-b border-gold-400/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
          {/* Subtle Accent */}
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6 shadow-lg">
            <span className="text-2xl animate-pulse">✨</span>
            <span className="text-white font-bold tracking-wide">Yeni Sezon Koleksiyonu</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-md">
            En Yeni <span className="text-gold-100 relative inline-block">
              Ürünlerimiz
              <svg className="absolute -top-6 -right-6 w-8 h-8 text-gold-300 opacity-80 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2L15,8L21,9L16.5,13.5L18,19L12,16L6,19L7.5,13.5L3,9L9,8L12,2Z" />
              </svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
            Evinize ışıltı katacak yepyeni tasarımlar ve özel parçalar
          </p>
        </div>
      </section>

      {/* Filtre ve Sıralama */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {products.length} Yeni Ürün
              </h2>
              <p className="text-sm text-gray-600">Son 30 günde eklendi</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Sırala:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              >
                <option value="newest">En Yeni</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Ürünler */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="bg-gray-200 h-52 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm mx-4">
            <div className="text-7xl mb-6 animate-pulse">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Henüz Yeni Ürün Yok
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Yeni sezon koleksiyonumuz çok yakında burada olacak. Takipte kalın!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20"
            >
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
        )}
      </section>

      {/* CTA Bölümü - Luxury Style */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            {/* Accent */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-300 rounded-full blur-3xl opacity-40"></div>
          </div>

          <div className="relative z-10">
            <span className="text-5xl mb-6 block animate-pulse">🔔</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Yeni Ürünlerden İlk Siz Haberdar Olun
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Yeni sezona özel sınırlı sayıdaki koleksiyon parçalarını kaçırmamak için bildirimleri açın.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary-dark px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg transform hover:-translate-y-1"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
