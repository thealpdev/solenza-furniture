'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-32 pb-20">

      {/* Header (Minimalist) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20 text-center text-gray-900">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 block">
          {language === 'tr' ? 'Bize Ulaşın' : 'Get in Touch'}
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-8 font-light tracking-tight">
          {language === 'tr' ? 'İletişim' : 'Contact'}
        </h1>
        <div className="w-24 h-[1px] bg-gray-200 mx-auto mb-8"></div>
        <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed text-lg">
          {language === 'tr'
            ? 'Sorularınız, iş birlikleri veya sadece merhaba demek için buradayız. Formu doldurarak veya aşağıdaki kanallardan bize ulaşabilirsiniz.'
            : 'We are here for your questions, collaborations or just to say hello. You can reach us by filling out the form or via the channels below.'}
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* Layout Left: Info Grid */}
          <div className="space-y-12">

            {/* Info Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl border-b border-gray-100 pb-2">Merkez Ofis</h3>
                <p className="text-sm text-gray-500 font-light leading-6">
                  Önder, Kartalcık Sk. No : 91<br />
                  06160 Altındağ/Ankara<br />
                  Türkiye
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-xl border-b border-gray-100 pb-2">İletişim Bilgileri</h3>
                <div className="text-sm text-gray-500 font-light leading-6 space-y-2">
                  <p>
                    <span className="uppercase tracking-wider text-xs block text-gray-400">Telefon</span>
                    <a href="tel:05364349495" className="hover:text-black transition-colors">0536 434 94 95</a>
                  </p>
                  <p>
                    <span className="uppercase tracking-wider text-xs block text-gray-400">Email</span>
                    <a href="mailto:info@solenza.com" className="hover:text-black transition-colors">info@solenza.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h2 className="font-serif text-3xl mb-8">{language === 'tr' ? 'Çalışma Saatleri' : 'Working Hours'}</h2>
              <div className="bg-gray-50 p-8 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="space-y-2 md:border-r border-gray-200">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h4 className="font-serif text-lg">{language === 'tr' ? 'Pazartesi - Cumartesi' : 'Monday - Saturday'}</h4>
                  <p className="text-sm text-gray-500 font-light">08:30 - 19:00</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h4 className="font-serif text-lg">{language === 'tr' ? 'Pazar' : 'Sunday'}</h4>
                  <p className="text-sm text-gray-500 font-light">10:00 - 17:00</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder (Stylish) */}
            <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden grayscale contrast-[0.9] border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.650897686867!2d32.89862137648356!3d39.94916667253504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34d85273577d1%3A0xe5a14643c5b8b8b0!2sSolenza%20Mobilya!5e0!3m2!1str!2str!4v1703000000000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

          {/* Layout Right: Form */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-lg">
            <h3 className="font-serif text-2xl mb-8">{language === 'tr' ? 'Mesaj Gönderin' : 'Send a Message'}</h3>

            {submitted ? (
              <div className="bg-green-100 text-green-800 p-4 rounded text-sm text-center">
                {language === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Your message has been sent successfully!'}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">
                      {language === 'tr' ? 'Adınız' : 'Name'} *
                    </label>
                    <input
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">
                      {language === 'tr' ? 'E-posta' : 'Email'} *
                    </label>
                    <input
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">
                    {language === 'tr' ? 'Konu' : 'Subject'}
                  </label>
                  <select
                    name="subject" value={formData.subject} onChange={handleChange}
                    className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                  >
                    <option value="">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                    <option value="info">{language === 'tr' ? 'Bilgi Almak İstiyorum' : 'General Inquiry'}</option>
                    <option value="order">{language === 'tr' ? 'Sipariş Durumu' : 'Order Status'}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500">
                    {language === 'tr' ? 'Mesajınız' : 'Message'} *
                  </label>
                  <textarea
                    name="message" required rows={5} value={formData.message} onChange={handleChange}
                    className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-gray-900 transition-colors resize-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-gray-900 text-white text-xs uppercase tracking-[0.2em] py-4 hover:bg-black transition-colors">
                  {language === 'tr' ? 'Gönder' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
