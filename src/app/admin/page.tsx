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
    const [categories, products, campaigns] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }),
    ])

    setStats({
      categories: categories.count || 0,
      products: products.count || 0,
      campaigns: campaigns.count || 0,
    })
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section - Premium Gradient */}
      <div className="relative bg-gradient-to-br from-[#020610] via-gray-900 to-[#1a1f2e] text-white rounded-3xl p-10 shadow-2xl overflow-hidden border border-gray-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner border border-white/10">
              <span className="text-4xl animate-wave">👋</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Hoş Geldiniz
              </h1>
              <p className="text-gray-400 text-lg font-light">
                {user?.email || 'Solenza Admin Panel'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/" target="_blank" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <span>Siteyi Görüntüle</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Categories Card */}
        <Link href="/admin/categories" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                📂
              </div>
              <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full border border-gray-100">KATEGORİ</span>
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">{stats.categories}</h3>
            <p className="text-gray-500 font-medium">Toplam Kategori</p>
          </div>
          {/* Arrow Icon */}
          <div className="absolute bottom-8 right-8 text-gray-300 group-hover:text-blue-600 transform group-hover:translate-x-2 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </Link>

        {/* Products Card */}
        <Link href="/admin/products" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                🛋️
              </div>
              <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full border border-gray-100">ÜRÜN</span>
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">{stats.products}</h3>
            <p className="text-gray-500 font-medium">Toplam Ürün</p>
          </div>
          {/* Arrow Icon */}
          <div className="absolute bottom-8 right-8 text-gray-300 group-hover:text-green-600 transform group-hover:translate-x-2 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </Link>

        {/* Campaigns Card */}
        <Link href="/admin/campaigns" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                🎯
              </div>
              <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full border border-gray-100">KAMPANYA</span>
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">{stats.campaigns}</h3>
            <p className="text-gray-500 font-medium">Aktif Kampanya</p>
          </div>
          {/* Arrow Icon */}
          <div className="absolute bottom-8 right-8 text-gray-300 group-hover:text-purple-600 transform group-hover:translate-x-2 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </Link>

      </div>

      {/* Quick Tips Section */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Hızlı İpuçları</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">📸</div>
            <p className="text-sm text-gray-600">Ürünlerinize yüksek kaliteli görseller eklemek satışları %40 artırır.</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">🏷️</div>
            <p className="text-sm text-gray-600">Kampanyalarınızı ana sayfada göstererek ziyaretçilerin ilgisini çekin.</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">🌍</div>
            <p className="text-sm text-gray-600">Ürün açıklamalarını hem Türkçe hem İngilizce girerek daha geniş kitleye ulaşın.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
