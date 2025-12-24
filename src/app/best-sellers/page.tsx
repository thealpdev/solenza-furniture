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

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('popular')

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

      if (sortBy === 'popular') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false })
      }

      query = query.limit(24)

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
      <section className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-2xl">🏆</span>
            <span className="text-white font-bold">En Çok Satanlar</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Müşteri <span className="text-yellow-300">Favorileri</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            En çok tercih edilen ve beğenilen ürünlerimiz
          </p>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '⭐', value: '4.8/5', label: 'Ortalama Puan' },
              { icon: '🛒', value: '1000+', label: 'Mutlu Müşteri' },
              { icon: '📦', value: '500+', label: 'Teslim Edilen' },
              { icon: '💯', value: '%98', label: 'Memnuniyet' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtre ve Sıralama */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {products.length} Popüler Ürün
              </h2>
              <p className="text-sm text-gray-600">En çok tercih edilenler</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Sırala:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
              >
                <option value="popular">En Popüler</option>
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
          <>
            {/* En Popüler 3 Ürün - Büyük Kartlar */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">🥇</span>
                Top 3 En Çok Satanlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.slice(0, 3).map((product, idx) => (
                  <div key={product.id} className="relative">
                    {/* Sıralama Badge */}
                    <div className="absolute -top-3 -left-3 z-10 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {idx + 1}
                    </div>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Diğer Popüler Ürünler */}
            {products.length > 3 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🔥</span>
                  Diğer Popüler Ürünler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.slice(3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Henüz Ürün Yok
            </h3>
            <p className="text-gray-600 mb-6">
              Yakında popüler ürünler burada görünecek
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </section>

      {/* Neden Popüler? */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Neden Bu Kadar Popüler?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'Kaliteli Malzeme',
                desc: 'Uzun ömürlü ve dayanıklı malzemelerden üretilmiştir',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '💰',
                title: 'Uygun Fiyat',
                desc: 'Kalite ve fiyat dengesinde en iyi seçenekler',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: '🎨',
                title: 'Modern Tasarım',
                desc: 'Her eve uyum sağlayan şık ve modern tasarımlar',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <span className="text-5xl mb-4 block">🎯</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siz de Favorinizi Bulun
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Binlerce müşterimizin tercih ettiği ürünler arasından size en uygun olanı seçin
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-orange-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              Bilgi Alın
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
