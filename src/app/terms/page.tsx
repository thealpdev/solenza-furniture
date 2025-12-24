'use client'

import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-8">
                    Kullanım Koşulları
                </h1>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Bilgiler</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Solenza Mobilya web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.
                            Bu koşulları kabul etmiyorsanız, lütfen siteyi kullanmayınız.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Ürün Bilgileri</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Sitemizdeki tüm ürün bilgileri, görseller ve fiyatlar bilgilendirme amaçlıdır.
                            Ürünlerin renk tonları, ekran ayarlarınıza göre farklılık gösterebilir.
                            Fiyatlar ve stok durumu önceden haber verilmeksizin değiştirilebilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sipariş ve Teslimat</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Siparişler onaylandıktan sonra üretim ve teslimat süreci başlar.
                            Teslimat süreleri ürüne ve bölgeye göre değişiklik gösterebilir.
                            Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. İade ve Değişim</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Özel üretim ürünler hariç, satın aldığınız ürünleri teslim tarihinden itibaren 14 gün içinde
                            iade edebilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Fikri Mülkiyet Hakları</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Bu sitede yer alan tüm içerik, görseller, tasarımlar ve markalar Solenza Mobilya'nın
                            mülkiyetindedir ve telif hakkı yasaları ile korunmaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sorumluluk Sınırlaması</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Solenza Mobilya, web sitesinin kesintisiz ve hatasız çalışacağını garanti etmez.
                            Site kullanımı sonucu oluşabilecek doğrudan veya dolaylı zararlardan sorumlu değildir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. İletişim</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
                            <li>E-posta: info@solenza.com</li>
                            <li>Telefon: +90 XXX XXX XX XX</li>
                        </ul>
                    </section>

                    <p className="text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
                        Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="mt-12">
                    <Link
                        href="/"
                        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
                    >
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    )
}
