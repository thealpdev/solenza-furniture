import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    req.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    req.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Check if the path starts with /admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === '/admin/login') {
            return response
        }

        // Check authentication for all other admin paths
        const {
            data: { session },
        } = await supabase.auth.getSession()

        // If no session, redirect to login
        if (!session) {
            const redirectUrl = req.nextUrl.clone()
            redirectUrl.pathname = '/admin/login'
            redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
