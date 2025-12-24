'use client'

import Link from 'next/link'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-8">
                    Gizlilik Politikası
                </h1>

                <div className="prose prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Kişisel Verilerin Korunması</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Solenza Mobilya olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir.
                            Bu politika, topladığımız bilgileri nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Web sitemizi kullandığınızda aşağıdaki bilgiler toplanabilir:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Ad, soyad ve iletişim bilgileri</li>
                            <li>E-posta adresi ve telefon numarası</li>
                            <li>Teslimat adresi bilgileri</li>
                            <li>Sipariş geçmişi ve tercihler</li>
                            <li>Çerezler aracılığıyla toplanan site kullanım verileri</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bilgilerin Kullanımı</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Topladığımız bilgileri şu amaçlarla kullanırız:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Siparişlerinizi işlemek ve teslimat yapmak</li>
                            <li>Müşteri hizmetleri desteği sağlamak</li>
                            <li>Ürün ve hizmetlerimizi geliştirmek</li>
                            <li>Pazarlama ve tanıtım faaliyetleri (izniniz dahilinde)</li>
                            <li>Yasal yükümlülükleri yerine getirmek</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bilgi Güvenliği</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kişisel bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz.
                            Verileriniz SSL şifreleme ile korunur ve yetkisiz erişime karşı güvence altındadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Çerezler (Cookies)</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır.
                            Tarayıcı ayarlarınızdan çerezleri yönetebilir veya engelleyebilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Üçüncü Taraflarla Paylaşım</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kişisel bilgilerinizi, hizmet sağlayıcılarımız (kargo, ödeme sistemleri) dışında
                            üçüncü taraflarla paylaşmayız. İzniniz olmadan bilgileriniz satılmaz veya kiralanmaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Haklarınız</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            KVKK kapsamında aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>Kişisel verilerinizin silinmesini veya düzeltilmesini talep etme</li>
                            <li>Pazarlama iletişimlerinden çıkma</li>
                            <li>Verilerinizin bir kopyasını talep etme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. İletişim</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Gizlilik politikamız hakkında sorularınız veya talepleriniz için:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
                            <li>E-posta: privacy@solenza.com</li>
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
