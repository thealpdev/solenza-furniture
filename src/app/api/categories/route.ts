import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {

    try {
        const { data, error } = await supabase
            .from('categories')
            .select(`
        *,
        category_translations (
          id,
          lang,
          name,
          description
        )
      `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ data }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { slug, image_url, translations } = body

        // Insert category
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .insert({
                slug,
                image_url: image_url || null,
            })
            .select()
            .single()

        if (categoryError) throw categoryError

        // Insert translations
        if (translations && category) {
            const translationData = Object.entries(translations).map(([lang, content]: [string, any]) => ({
                category_id: category.id,
                lang,
                name: content.name,
                description: content.description || null,
            }))

            const { error: translationsError } = await supabase
                .from('category_translations')
                .insert(translationData)

            if (translationsError) throw translationsError
        }

        return NextResponse.json({ data: category }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, slug, image_url, translations } = body

        // Update category
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .update({ slug, image_url })
            .eq('id', id)
            .select()
            .single()

        if (categoryError) throw categoryError

        // Update translations
        if (translations && category) {
            // Delete existing translations
            await supabase.from('category_translations').delete().eq('category_id', id)

            // Insert new translations
            const translationData = Object.entries(translations).map(([lang, content]: [string, any]) => ({
                category_id: id,
                lang,
                name: content.name,
                description: content.description || null,
            }))

            const { error: translationsError } = await supabase
                .from('category_translations')
                .insert(translationData)

            if (translationsError) throw translationsError
        }

        return NextResponse.json({ data: category }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    try {
        const { error } = await supabase.from('categories').delete().eq('id', id)

        if (error) throw error

        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
