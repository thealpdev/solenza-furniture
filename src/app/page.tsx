'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import HeroSection from '@/components/HeroSection'
import BentoGrid from '@/components/BentoGrid'
import CampaignBanner from '@/components/CampaignBanner'
import StatementCollection from '@/components/StatementCollection'
import DiscountStrip from '@/components/DiscountStrip'


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
  product_images: ProductImage[]
  category_id?: string
  created_at?: string
}

type Category = {
  id: string
  name_tr: string
  slug: string
  icon?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recommended')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Pagination state'leri
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // 6-Item Pattern as requested

  // Filtre state'leri
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]) // Fiyat aralığını genişlettik
  const [inStock, setInStock] = useState(false)
  const [preOrder, setPreOrder] = useState(false)

  // Accordion state'leri
  const [priceOpen, setPriceOpen] = useState(true)
  const [stockOpen, setStockOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [selectedCategories, priceRange, inStock, preOrder, allProducts, sortBy])

  useEffect(() => {
    setCurrentPage(1) // Filtre değiştiğinde ilk sayfaya dön
  }, [selectedCategories, priceRange, inStock, preOrder, sortBy])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      // Kategorileri yükle
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('name_tr')

      if (catsError) {
        console.error('Kategori yükleme hatası:', catsError)
        throw catsError
      }
      if (cats) setCategories(cats)

      // Tüm ürünleri yükle - product_images ile birlikte
      // Sadece 'inactive' olanları filtrele (diğer tüm durumları göster)
      const { data: prods, error: prodsError } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            created_at
          )
        `)
        .neq('status', 'inactive')
        .order('created_at', { ascending: false })

      if (prodsError) {
        console.error('Ürün yükleme hatası:', prodsError)
        throw prodsError
      }

      if (prods) {
        console.log(`${prods.length} ürün yüklendi (ana sayfa)`)
        // Debug: Tüm ürünleri logla
        prods.forEach((p: any) => {
          console.log(`- ${p.title_tr}: status=${p.status}, price=${p.price}, category_id=${p.category_id}`)
        })
        setAllProducts(prods)
        setProducts(prods)
      } else {
        console.log('Hiç ürün bulunamadı')
        setAllProducts([])
        setProducts([])
      }
    } catch (err: any) {
      console.error('Veri yükleme hatası:', err)
      setError(err.message || 'Ürünler yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allProducts]

    // Kategori filtresi
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p =>
        p.category_id && selectedCategories.includes(p.category_id)
      )
    }

    // Fiyat filtresi - Fiyatı null olan ürünleri de göster
    filtered = filtered.filter(p => {
      const price = p.price
      if (price === null || price === undefined) {
        return true // Fiyatı olmayan ürünleri de göster
      }
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Stok durumu filtresi
    if (inStock) {
      filtered = filtered.filter(p => {
        const stockStatus = (p as any).stock_status
        return stockStatus === 'in_stock'
      })
    }

    if (preOrder) {
      filtered = filtered.filter(p => {
        const stockStatus = (p as any).stock_status
        return stockStatus === 'pre_order'
      })
    }

    // Sıralama
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = new Date((a as any).created_at || 0).getTime()
          const dateB = new Date((b as any).created_at || 0).getTime()
          return dateB - dateA
        })
        break
      default:
        // Önerilen - öne çıkan ürünler önce
        filtered.sort((a, b) => {
          const aFeatured = (a as any).is_featured ? 1 : 0
          const bFeatured = (b as any).is_featured ? 1 : 0
          return bFeatured - aFeatured
        })
    }

    setFilteredProducts(filtered)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000000])
    setInStock(false)
    setPreOrder(false)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (selectedCategories.length > 0) count += selectedCategories.length
    if (priceRange[0] > 0 || priceRange[1] < 1000000) count += 1
    if (inStock || preOrder) count += 1
    return count
  }

  const handleSort = (value: string) => {
    setSortBy(value)
  }

  // Pagination hesaplamaları
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }


  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Campaign Banner */}
      <CampaignBanner />

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
            <span>⚠️ {error}</span>
          </div>
        </div>
      )}

      {/* Bento Grid Kategoriler */}
      <BentoGrid />

      {/* Discount Strip - Separator */}
      <div className="my-8">
        <DiscountStrip />
      </div>

      {/* Ana İçerik - Full Width Ürünler */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Horizontal Filter Bar - Sticky & Chic */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 py-4 mb-8 border-b border-gray-100 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Left: Filter Triggers */}
            <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto md:overflow-visible scrollbar-hide pb-2 md:pb-0">
              {/* Mobile Filter Toggle (Full Screen) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex items-center gap-2 text-sm font-medium text-black uppercase tracking-widest border border-gray-200 px-4 py-2"
              >
                Filtrele & Sırala
              </button>

              {/* Desktop Dropdowns - "Invisible" style like high-end fashion */}
              <div className="hidden md:flex items-center gap-8">
                {/* Category Dropdown */}
                <div className="relative group">
                  <button className={`flex items-center gap-2 text-sm uppercase tracking-widest font-medium transition-colors ${selectedCategories.length > 0 ? 'text-black' : 'text-gray-900 hover:text-holiday-red'}`}>
                    Kategori {selectedCategories.length > 0 && <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-holiday-red text-[9px] text-white">{selectedCategories.length}</span>}
                    <svg className={`w-3 h-3 ${selectedCategories.length > 0 ? 'text-black' : 'text-gray-400 group-hover:text-holiday-red'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white shadow-xl border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 transition-colors">
                          <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center ${selectedCategories.includes(cat.id) ? 'bg-black border-black' : ''}`}>
                            {selectedCategories.includes(cat.id) && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                          </div>
                          <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="hidden" />
                          <span className={`text-sm ${selectedCategories.includes(cat.id) ? 'text-black font-medium' : 'text-gray-500'}`}>{cat.name_tr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Dropdown */}
                <div className="relative group">
                  <button className={`flex items-center gap-2 text-sm uppercase tracking-widest font-medium transition-colors ${priceRange[0] > 0 || priceRange[1] < 1000000 ? 'text-black' : 'text-gray-900 hover:text-holiday-red'}`}>
                    Fiyat {(priceRange[0] > 0 || priceRange[1] < 1000000) && <span className="ml-1 w-2 h-2 bg-holiday-red rounded-full"></span>}
                    <svg className={`w-3 h-3 ${priceRange[0] > 0 || priceRange[1] < 1000000 ? 'text-black' : 'text-gray-400 group-hover:text-holiday-red'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute top-full left-0 mt-4 w-72 bg-white shadow-xl border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-sans">
                      <span>{priceRange[0].toLocaleString('tr-TR')} ₺</span>
                      <span>{priceRange[1].toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-4"
                    />
                    <div className="flex gap-2">
                      <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-1/2 p-2 text-xs border border-gray-200 focus:border-black outline-none" placeholder="Min" />
                      <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-1/2 p-2 text-xs border border-gray-200 focus:border-black outline-none" placeholder="Max" />
                    </div>
                  </div>
                </div>

                {/* Availability Dropdown */}
                <div className="relative group">
                  <button className={`flex items-center gap-2 text-sm uppercase tracking-widest font-medium transition-colors ${inStock || preOrder ? 'text-black' : 'text-gray-900 hover:text-holiday-red'}`}>
                    Durum {(inStock || preOrder) && <span className="ml-1 w-2 h-2 bg-holiday-red rounded-full"></span>}
                    <svg className={`w-3 h-3 ${inStock || preOrder ? 'text-black' : 'text-gray-400 group-hover:text-holiday-red'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-xl border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 transition-colors mb-1">
                      <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center ${inStock ? 'bg-black border-black' : ''}`}>
                        {inStock && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                      </div>
                      <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="hidden" />
                      <span className={`text-sm ${inStock ? 'text-black font-medium' : 'text-gray-500'}`}>Stoktakiler</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 transition-colors">
                      <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center ${preOrder ? 'bg-black border-black' : ''}`}>
                        {preOrder && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                      </div>
                      <input type="checkbox" checked={preOrder} onChange={(e) => setPreOrder(e.target.checked)} className="hidden" />
                      <span className={`text-sm ${preOrder ? 'text-black font-medium' : 'text-gray-500'}`}>Ön Sipariş</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Count & Sort */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs text-gray-400 font-sans tracking-wide">
                {filteredProducts.length} Ürün Listelendi
              </span>

              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="appearance-none bg-transparent text-sm uppercase tracking-widest font-medium text-gray-900 pr-6 outline-none cursor-pointer"
                >
                  <option value="recommended">Önerilen</option>
                  <option value="price-asc">Artan Fiyat</option>
                  <option value="price-desc">Azalan Fiyat</option>
                  <option value="newest">En Yeniler</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-900">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters - Tags Display */}
          {getActiveFilterCount() > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-400 mr-2">Seçimleriniz:</span>
              {selectedCategories.map(catId => {
                const cat = categories.find(c => c.id === catId);
                return cat ? (
                  <div key={cat.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 text-xs text-gray-600">
                    {cat.name_tr}
                    <button onClick={() => toggleCategory(cat.id)} className="hover:text-red-500">×</button>
                  </div>
                ) : null;
              })}
              <button onClick={clearFilters} className="text-xs text-red-500 underline ml-2">Temizle</button>
            </div>
          )}
        </div>


        {/* Mobile Filter Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <div className="absolute right-0 top-0 bottom-0 w-[80vw] bg-white p-6 shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="font-serif text-xl">Filtrele & Sırala</h3>
                <button onClick={() => setSidebarOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              {/* Re-use desktop filter logic simplified for mobile here if needed */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Kategoriler</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => toggleCategory(cat.id)} className={`px-3 py-2 text-xs border ${selectedCategories.includes(cat.id) ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600'}`}>
                        {cat.name_tr}
                      </button>
                    ))}
                  </div>
                </div>
                {/* More mobile filters can go here */}
              </div>
            </div>
          </div>
        )}

        <div className="w-full">
          {/* Ürün Grid - Asymmetric Masonry */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`bg-gray-100 rounded-sm animate-pulse ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/5]' : 'h-64'}`}></div>
              ))}
            </div>
          ) : currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <div key={product.id} className="col-span-1 aspect-[3/4]">
                    <ProductCard
                      product={product}
                      variant="default"
                      className="h-full w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Pagination - Minimalist */}
              {totalPages > 1 && (
                <div className="mt-24 flex flex-col items-center gap-6 pb-24 border-t border-gray-100 pt-12">
                  <div className="flex items-center justify-center gap-12 font-serif text-xl text-gray-900">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`transition-opacity uppercase tracking-widest text-xs ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-60'}`}
                    >
                      Previous
                    </button>

                    <span className="text-xs tracking-[0.3em] text-gray-400 font-sans">
                      {currentPage} <span className="mx-2 text-gray-200">/</span> {totalPages}
                    </span>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`transition-opacity uppercase tracking-widest text-xs ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-60'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-bounce">🎄</div>
              <p className="text-gray-600 text-lg font-medium mb-2">Filtrelere uygun ürün bulunamadı</p>
              <p className="text-gray-500 text-sm mb-6">Filtreleri değiştirerek tekrar deneyin</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-holiday-red to-red-700 text-white rounded-xl hover:from-red-600 hover:to-red-800 transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
              >
                ✨ Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>



      {/* Bank Logos Removed as per request */}

      {/* Statement Collection - Dynamic Content from Admin */}
      <StatementCollection />

      {/* Newsletter - Minimalist Light */}
      <section className="bg-gray-50 text-gray-900 py-24 px-6 md:px-12 relative overflow-hidden border-t border-gray-100">

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-red-600 mb-6 block font-medium">Solenza World</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
            Tasarım dünyasından <br /> <span className="italic text-gray-500">ilham</span> alın.
          </h2>
          <p className="text-gray-600 font-light mb-8 max-w-lg mx-auto leading-relaxed">
            Yeni koleksiyonlar, özel indirimler ve dekorasyon trendleri hakkında ilk siz haberdar olun.
          </p>

          <div className="flex justify-center flex-wrap gap-4 md:gap-8 mb-10 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              Haftalık Bülten
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              Özel İndirimler
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
              Trendler
            </span>
          </div>

          <form className="flex flex-col md:flex-row gap-0 max-w-lg mx-auto border-b border-gray-300 focus-within:border-black transition-colors duration-300 relative group">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 bg-transparent px-4 py-4 outline-none placeholder:text-gray-400 font-light text-gray-900"
            />
            <button type="button" className="px-8 py-4 uppercase tracking-widest text-xs font-bold text-gray-900 hover:text-red-600 transition-colors relative">
              <span className="relative z-10">Abone Ol</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
