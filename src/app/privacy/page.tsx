'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPage() {
    const { language } = useLanguage()

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <header className="text-center mb-20">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 block">
                        {language === 'tr' ? 'Yasal' : 'Legal'}
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-8">
                        {language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                    </h1>
                    <div className="w-24 h-[1px] bg-gray-200 mx-auto"></div>
                </header>

                <div className="space-y-16">

                    {/* Section 1 */}
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4">
                            <h2 className="font-serif text-xl md:text-2xl text-gray-900 sticky top-32">
                                {language === 'tr' ? '1. Kişisel Verilerin Korunması' : '1. Protection of Personal Data'}
                            </h2>
                        </div>
                        <div className="md:col-span-8">
                            <p className="text-gray-500 font-light leading-loose text-lg">
                                {language === 'tr'
                                    ? 'Solenza Mobilya olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir. Bu politika, topladığımız bilgileri nasıl kullandığımızı ve koruduğumuzu en şeffaf şekilde açıklamaktadır. Müşterilerimizin güveni, bizim için en değerli varlıktır.'
                                    : 'As Solenza Furniture, the security of your personal data is extremely important to us. This policy explains how we use and protect the information we collect in the most transparent way. The trust of our customers is our most valuable asset.'}
                            </p>
                        </div>
                    </section>

                    <div className="h-[1px] bg-gray-100 w-full"></div>

                    {/* Section 2 */}
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4">
                            <h2 className="font-serif text-xl md:text-2xl text-gray-900 sticky top-32">
                                {language === 'tr' ? '2. Toplanan Bilgiler' : '2. Collected Information'}
                            </h2>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <p className="text-gray-500 font-light leading-relaxed">
                                {language === 'tr' ? 'Web sitemizi ziyaret ettiğinizde veya alışveriş yaptığınızda, size daha iyi hizmet sunabilmek adına aşağıdaki bilgiler toplanabilir:' : 'When you visit our website or shop, the following information may be collected in order to provide you with better service:'}
                            </p>
                            <ul className="space-y-3">
                                {[
                                    language === 'tr' ? 'Ad, soyad ve iletişim bilgileri.' : 'Name, surname and contact information.',
                                    language === 'tr' ? 'E-posta adresi ve telefon numarası.' : 'Email address and phone number.',
                                    language === 'tr' ? 'Teslimat ve fatura adresi bilgileri.' : 'Delivery and billing address information.',
                                    language === 'tr' ? 'Sipariş geçmişi ve alışveriş tercihleri.' : 'Order history and shopping preferences.'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-600 font-light">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2.5 flex-shrink-0"></span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <div className="h-[1px] bg-gray-100 w-full"></div>

                    {/* Section 3 */}
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4">
                            <h2 className="font-serif text-xl md:text-2xl text-gray-900 sticky top-32">
                                {language === 'tr' ? '3. Bilgilerin Kullanımı' : '3. Use of Information'}
                            </h2>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <p className="text-gray-500 font-light leading-relaxed">
                                {language === 'tr' ? 'Topladığımız bilgiler, deneyiminizi kişiselleştirmek ve hizmet kalitemizi artırmak amacıyla şu şekillerde kullanılır:' : 'The information we collect is used in the following ways to personalize your experience and improve our service quality:'}
                            </p>
                            <ul className="space-y-3">
                                {[
                                    language === 'tr' ? 'Siparişlerinizi en hızlı ve güvenli şekilde işlemek.' : 'To process your orders in the fastest and safest way.',
                                    language === 'tr' ? 'Size özel müşteri hizmetleri ve destek sağlamak.' : 'To provide you with personalized customer service and support.',
                                    language === 'tr' ? 'Ürün portföyümüzü ve hizmet standartlarımızı sürekli geliştirmek.' : 'To continuously improve our product portfolio and service standards.'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-600 font-light">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2.5 flex-shrink-0"></span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <div className="h-[1px] bg-gray-100 w-full"></div>

                    {/* Section 4 */}
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4">
                            <h2 className="font-serif text-xl md:text-2xl text-gray-900 sticky top-32">
                                {language === 'tr' ? '4. Bilgi Güvenliği' : '4. Information Security'}
                            </h2>
                        </div>
                        <div className="md:col-span-8">
                            <p className="text-gray-500 font-light leading-loose text-lg">
                                {language === 'tr'
                                    ? 'Kişisel bilgilerinizi korumak için en son teknoloji endüstri standardı güvenlik önlemlerini kullanıyoruz. Tüm hassas verileriniz 256-bit SSL şifreleme teknolojisi ile korunmakta olup, yetkisiz erişime karşı üst düzey güvenlikle saklanmaktadır.'
                                    : 'We use state-of-the-art industry standard security measures to protect your personal information. All your sensitive data is protected by 256-bit SSL encryption technology and stored with high-level security against unauthorized access.'}
                            </p>
                        </div>
                    </section>

                </div>

                <div className="mt-24 pt-12 border-t border-gray-900 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                        {language === 'tr' ? 'Son Güncelleme' : 'Last Updated'}: {new Date().getFullYear()}
                    </p>
                </div>

            </div>
        </div>
    )
}
