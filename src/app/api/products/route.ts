import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category_id = searchParams.get('category_id')
    const status = searchParams.get('status') || 'active'

    try {
        let query = supabase
            .from('products')
            .select(`
        *,
        product_images (
          id,
          image_url,
          display_order
        ),
        product_translations (
          id,
          lang,
          title,
          description,
          specs
        )
      `)
            .eq('status', status)
            .order('created_at', { ascending: false })

        if (category_id) {
            query = query.eq('category_id', category_id)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            category_id,
            price,
            show_price,
            stock_status,
            is_featured,
            is_new,
            is_bestseller,
            translations,
            images,
        } = body

        // Insert product
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
                category_id,
                price,
                show_price,
                stock_status: stock_status || 'in_stock',
                is_featured: is_featured || false,
                is_new: is_new || false,
                is_bestseller: is_bestseller || false,
                status: 'active',
            })
            .select()
            .single()

        if (productError) throw productError

        // Insert translations
        if (translations && product) {
            const translationData = Object.entries(translations).map(([lang, content]: [string, any]) => ({
                product_id: product.id,
                lang,
                title: content.title,
                description: content.description || null,
                specs: content.specs || null,
            }))

            const { error: translationsError } = await supabase
                .from('product_translations')
                .insert(translationData)

            if (translationsError) throw translationsError
        }

        // Insert images
        if (images && images.length > 0 && product) {
            const imageData = images.map((url: string, index: number) => ({
                product_id: product.id,
                image_url: url,
                display_order: index,
            }))

            const { error: imagesError } = await supabase
                .from('product_images')
                .insert(imageData)

            if (imagesError) throw imagesError
        }

        return NextResponse.json({ data: product }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    try {
        const { error } = await supabase.from('products').delete().eq('id', id)

        if (error) throw error

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
