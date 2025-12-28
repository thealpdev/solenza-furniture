import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .order('key', { ascending: true })

        if (error) throw error

        // Convert array to object for easier access
        const settingsObj: Record<string, string> = {}
        data?.forEach((item: { key: string; value: string | null }) => {
            settingsObj[item.key] = item.value || ''
        })

        return NextResponse.json({ data: settingsObj }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { key, value } = body

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('settings')
            .upsert(
                {
                    key,
                    value: value || '',
                },
                {
                    onConflict: 'key',
                }
            )
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        // Batch update - body should be an object with key-value pairs
        const updates = Object.entries(body).map(([key, value]) => ({
            key,
            value: value as string || '',
        }))

        const { data, error } = await supabase
            .from('settings')
            .upsert(updates, {
                onConflict: 'key',
            })

        if (error) throw error

        return NextResponse.json({ data, message: 'Settings updated successfully' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    try {
        const { error } = await supabase.from('settings').delete().eq('key', key)

        if (error) throw error

        return NextResponse.json({ message: 'Setting deleted successfully' }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
