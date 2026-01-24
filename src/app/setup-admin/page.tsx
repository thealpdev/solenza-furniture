'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Loader2, UserPlus, Info, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SetupAdminPage() {
    const [email, setEmail] = useState('solenza@gmail.com')
    const [password, setPassword] = useState('Adminsolenza123!')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [errorDetails, setErrorDetails] = useState('')

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setStatus('idle')
        setMessage('')
        setErrorDetails('')

        try {
            // 1. Try to SignUp
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            })

            if (signUpError) {
                // If user already exists
                if (signUpError.message.includes('already registered') || signUpError.status === 422) {
                    setMessage('⚠️ Bu kullanıcı zaten var.')
                    // Try to SignIn immediately to see if it works
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    })

                    if (signInError) {
                        if (signInError.message.includes('Email not confirmed')) {
                            setStatus('error')
                            setMessage('❌ Bu e-posta kayıtlı ancak DOĞRULANMAMIŞ.')
                            setErrorDetails('Supabase panelinden "Authentication -> Providers -> Email -> Confirm email" seçeneğini kapatmanız veya kullanıcının e-postasını manuel olarak doğrulamanız gerekiyor.')
                        } else {
                            setStatus('error')
                            setMessage(`❌ Giriş başarısız: ${signInError.message}`)
                        }
                    } else {
                        setStatus('success')
                        setMessage('✅ Bu kullanıcı zaten varmış ve giriş bilgileri doğru! Şimdi admin paneline gidebilirsiniz.')
                    }
                } else {
                    throw signUpError
                }
            } else {
                // SignUp successful (or confirmation email sent)
                if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
                    // Creating user failed silently or user exists
                    setMessage('⚠️ Kullanıcı oluşturma isteği işlendi ancak bir gariplik var (Identity boş).')
                } else if (signUpData.session) {
                    setStatus('success')
                    setMessage('✅ Kullanıcı oluşturuldu ve otomatik giriş yapıldı!')
                } else {
                    // Confirmation email sent
                    setStatus('error')
                    setMessage('✅ Kullanıcı oluşturuldu ANCAK e-posta doğrulaması gerekiyor.')
                    setErrorDetails('Supabase panelinize gidin: Authentication -> Users. Bu kullanıcının yanındaki üç noktaya tıklayıp "Confirm User" diyebilir veya ayarlardan e-posta doğrulamasını kapatabilirsiniz.')
                }
            }

        } catch (error: any) {
            setStatus('error')
            setMessage(`❌ Kritik Hata: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans text-gray-900">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Tanımlama</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Verdiğiniz bilgilerle kullanıcı oluşturur veya var olan kullanıcının durumunu kontrol eder.
                    </p>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                        <input
                            type="text" // Visible for setup ease
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 font-mono text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Admin Hesabını Doğrula / Oluştur'}
                    </button>
                </form>

                {/* Status Messages */}
                {message && (
                    <div className={`mt-6 p-5 rounded-xl border ${status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                            status === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                'bg-yellow-50 border-yellow-200 text-yellow-800'
                        }`}>
                        <div className="flex items-start gap-3">
                            {status === 'success' ? <CheckCircle className="w-6 h-6 shrink-0" /> :
                                status === 'error' ? <AlertCircle className="w-6 h-6 shrink-0" /> :
                                    <Info className="w-6 h-6 shrink-0" />}
                            <div className="space-y-2">
                                <p className="font-bold">{message}</p>
                                {errorDetails && (
                                    <p className="text-sm opacity-90 leading-relaxed bg-white/50 p-2 rounded">
                                        💡 {errorDetails}
                                    </p>
                                )}
                                {status === 'success' && (
                                    <Link href="/admin/login" className="inline-block mt-2 text-sm underline font-bold hover:text-green-900">
                                        → Admin Paneline Giriş Yap
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
