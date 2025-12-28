'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith('/admin')

    return (
        <>
            {!isAdminRoute && <Header />}
            <main className={isAdminRoute ? '' : 'min-h-screen'}>{children}</main>
            {!isAdminRoute && <Footer />}
        </>
    )
}
