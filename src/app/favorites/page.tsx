'use client'

import { useEffect, useState } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

type ProductImage = {
    image_url: string
}

type Product = {
    id: string
    title_tr: string
    title_en: string
    price: number | null
    product_images?: ProductImage[]
}

export default function FavoritesPage() {
    const { favorites, toggleFavorite } = useFavorites()
    const { language } = useLanguage()
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadFavorites()
    }, [favorites])

    const loadFavorites = async () => {
        if (favorites.length === 0) {
            setFavoriteProducts([])
            setLoading(false)
            return
        }

        setLoading(true)
        const { data } = await supabase
            .from('products')
            .select('*, product_images(image_url)')
            .in('id', favorites)

        if (data) {
            setFavoriteProducts(data as any)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Favorilerim</h1>
                    <p className="text-gray-500 font-light max-w-lg mx-auto">
                        Beğendiğiniz ürünleri burada bulabilirsiniz.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && favoriteProducts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="font-serif text-2xl text-gray-900 mb-2">Henüz Favori Yok</h2>
                        <p className="text-gray-500 mb-8 font-light">Koleksiyonumuza göz atıp beğendiklerinizi ekleyin.</p>
                        <Link href="/categories" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
                            Koleksiyonu Keşfet
                        </Link>
                    </div>
                )}

                {/* List */}
                {!loading && favoriteProducts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {favoriteProducts.map((product) => (
                            <div key={product.id} className="group">
                                {/* Image */}
                                <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden rounded-lg">
                                    <Link href={`/products/${product.id}`}>
                                        <Image
                                            src={product.product_images?.[0]?.image_url || 'https://via.placeholder.com/500'}
                                            alt={product.title_tr}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            toggleFavorite(product.id)
                                        }}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-all shadow-sm"
                                    >
                                        <svg className="w-5 h-5 fill-current" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-red-900 transition-colors">
                                            <Link href={`/products/${product.id}`}>{product.title_tr}</Link>
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {product.price ? `₺${product.price.toLocaleString('tr-TR')}` : 'Fiyat Bilgisi Alınız'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}
