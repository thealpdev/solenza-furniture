'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from './ProductCard'

// Define local interface to match Supabase response (flat structure)
interface Product {
    id: string
    title_tr: string
    price: number
    product_images?: { id: string; image_url: string }[]
    created_at?: string
    category_id?: string
}

interface RelatedProductsProps {
    categoryId: string
    currentProductId: string
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (categoryId) {
            loadRelatedProducts()
        }
    }, [categoryId, currentProductId])

    const loadRelatedProducts = async () => {
        setLoading(true)
        // Fetch products from the same category, excluding the current one
        const { data } = await supabase
            .from('products')
            .select('*, product_images(*)')
            .eq('category_id', categoryId)
            .neq('id', currentProductId)
            .limit(4)

        if (data) {
            setProducts(data as any)
        }
        setLoading(false)
    }

    if (loading || products.length === 0) return null

    return (
        <section className="border-t border-gray-100 py-24 mt-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
                        İlginizi Çekebilir
                    </h2>
                    <a href="/categories" className="hidden md:block text-xs uppercase tracking-widest text-gray-500 hover:text-black">
                        Tümünü Gör
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            variant="default" // Use default vertical aspect
                        />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a href="/categories" className="text-xs uppercase tracking-widest text-gray-500 hover:text-black border-b border-gray-300 pb-1">
                        Koleksiyona Dön
                    </a>
                </div>
            </div>
        </section>
    )
}
