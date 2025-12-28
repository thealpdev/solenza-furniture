'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    campaigns: 0,
  })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadStats()
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const loadStats = async () => {
    const [categories, products] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
    ])

    setStats({
      categories: categories.count || 0,
      products: products.count || 0,
      campaigns: 0, // Campaigns table doesn't exist yet
    })
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section - Premium Gradient */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white rounded-3xl p-10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">👋</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-1">
                Hoş Geldiniz!
              </h1>
              <p className="text-white/90 text-lg">
                {user?.email || 'Solenza Admin Panel'}
              </p>
            </div>
          </div>
          <p className="text-white/80 text-sm mt-4 max-w-2xl">
            Mobilya mağazanızı buradan kolayca yönetebilirsiniz. Ürünler, kategoriler ve kampanyalar için hızlı erişim menüsünü kullanın.
          </p>
        </div>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform">
                📂
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">TOPLAM</span>
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-2">{stats.categories}</h3>
            <p className="text-gray-600 font-medium">Kategori</p>
            <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
              <span>Detayları Gör</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group relative bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform">
                🛋️
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">TOPLAM</span>
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-2">{stats.products}</h3>
            <p className="text-gray-600 font-medium">Ürün</p>
            <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
              <span>Detayları Gör</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg border-2 border-purple-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                🎯
              </div>
              <span className="px-3 py-1 bg-purple-200 text-purple-700 text-xs font-bold rounded-full">YAKINDA</span>
            </div>
            <h3 className="text-5xl font-bold text-gray-400 mb-2">-</h3>
            <p className="text-gray-600 font-medium">Kampanya</p>
            <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
              <span>Çok Yakında</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Premium Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Hızlı Erişim</h2>
          <span className="text-sm text-gray-500">Sık kullanılan işlemler</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/categories"
            className="group relative bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  📂
                </div>
                <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <svg className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Kategorileri Yönet
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ürün kategorilerini ekleyin, düzenleyin veya silin. Kategori sıralamasını değiştirin.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span>Kategorilere Git</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/products"
            className="group relative bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  🛋️
                </div>
                <div className="p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                  <svg className="w-6 h-6 text-green-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                Ürünleri Yönet
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yeni ürünler ekleyin, görseller yükleyin ve fiyatları güncelleyin.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold group-hover:bg-green-600 group-hover:text-white transition-all">
                <span>Ürünlere Git</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/campaigns"
            className="group relative bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  🎯
                </div>
                <div className="p-2 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                  <svg className="w-6 h-6 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                Kampanyaları Yönet
              </h3>
              <p className="text-gray-600 leading-relaxed">
                İndirim ve promosyonları yönetin, kampanya ekleyin ve düzenleyin.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold group-hover:bg-purple-600 group-hover:text-white transition-all">
                <span>Kampanyalara Git</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          <div className="relative bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-3xl shadow-lg border-2 border-orange-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center text-4xl shadow-xl">
                  ⚙️
                </div>
                <span className="px-3 py-1.5 bg-orange-200 text-orange-700 text-xs font-bold rounded-xl">YAKINDA</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                Ayarlar
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Site ayarları, SEO ve genel yapılandırma seçenekleri yakında eklenecek.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-semibold cursor-not-allowed">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Kilitli</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
