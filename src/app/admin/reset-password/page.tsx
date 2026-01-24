'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Lock, Loader2, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [sessionChecked, setSessionChecked] = useState(false)

    useEffect(() => {
        // Check if we have a session (means the link worked)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error('Geçersiz veya süresi dolmuş bağlantı.')
                router.push('/admin/login')
            }
            setSessionChecked(true)
        }
        checkSession()
    }, [router])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            toast.success('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.')
            router.push('/admin/login')
        } catch (error: any) {
            toast.error(error.message || 'Şifre güncellenemedi.')
        } finally {
            setLoading(false)
        }
    }

    if (!sessionChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[100px] opacity-30"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Brand Logo */}
                <div className="text-center mb-10">
                    <div className="inline-block group">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 transform">
                            <KeyRound className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Solenza</h1>
                        <p className="text-gold-200 text-sm tracking-[0.2em] uppercase opacity-80">Yeni Şifre Belirle</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">

                    <div className="mb-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Lütfen hesabınız için yeni ve güvenli bir şifre belirleyin.
                        </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider ml-1">Yeni Şifre</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span>Şifreyi Güncelle</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1 text-sm">
                            <ArrowLeft className="h-3 w-3" />
                            <span>Giriş Ekranına Dön</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
