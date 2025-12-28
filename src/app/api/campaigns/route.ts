import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {

    try {
        const { data, error } = await supabase
            .from('campaigns')
            .select(`
        *,
        campaign_translations (
          id,
          lang,
          title,
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
        const { image_url, start_date, end_date, show_on_homepage, translations } = body

        // Insert campaign
        const { data: campaign, error: campaignError } = await supabase
            .from('campaigns')
            .insert({
                image_url: image_url || null,
                start_date: start_date || null,
                end_date: end_date || null,
                show_on_homepage: show_on_homepage || false,
                is_active: true,
            })
            .select()
            .single()

        if (campaignError) throw campaignError

        // Insert translations
        if (translations && campaign) {
            const translationData = Object.entries(translations).map(([lang, content]: [string, any]) => ({
                campaign_id: campaign.id,
                lang,
                title: content.title,
                description: content.description || null,
            }))

            const { error: translationsError } = await supabase
                .from('campaign_translations')
                .insert(translationData)

            if (translationsError) throw translationsError
        }

        return NextResponse.json({ data: campaign }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, image_url, start_date, end_date, show_on_homepage, is_active, translations } = body

        // Update campaign
        const { data: campaign, error: campaignError } = await supabase
            .from('campaigns')
            .update({
                image_url,
                start_date,
                end_date,
                show_on_homepage,
                is_active,
            })
            .eq('id', id)
            .select()
            .single()

        if (campaignError) throw campaignError

        // Update translations
        if (translations && campaign) {
            // Delete existing translations
            await supabase.from('campaign_translations').delete().eq('campaign_id', id)

            // Insert new translations
            const translationData = Object.entries(translations).map(([lang, content]: [string, any]) => ({
                campaign_id: id,
                lang,
                title: content.title,
                description: content.description || null,
            }))

            const { error: translationsError } = await supabase
                .from('campaign_translations')
                .insert(translationData)

            if (translationsError) throw translationsError
        }

        return NextResponse.json({ data: campaign }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    try {
        const { error } = await supabase.from('campaigns').delete().eq('id', id)

        if (error) throw error

        return NextResponse.json({ message: 'Campaign deleted successfully' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
