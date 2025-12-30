'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Settings } from '@/types'

export default function Footer() {
  const { language } = useLanguage()
  const [settings, setSettings] = useState<Settings>({})
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    loadSettings()
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(5)

    if (data) setCategories(data)
  }

  const loadSettings = async () => {
    setSettings({
      about_tr: 'Solenza - Modern mobilya ve ev dekorasyon ürünlerinde güvenilir adresiniz',
      about_en: 'Solenza - Your trusted address for modern furniture and home decoration',
      phone: '0536 434 94 95',
      whatsapp: '0536 434 94 95',
      email: 'info@solenza.com',
      address_tr: 'Önder, Kartalcık Sk. No : 91, 06160 Altındağ/Ankara',
      address_en: 'Önder, Kartalcık Sk. No : 91, 06160 Altındağ/Ankara',
      facebook: '',
      instagram: '',
    })
  }

  const quickLinks = [
    { name: language === 'tr' ? 'Hakkımızda' : 'About Us', href: '/about' },
    { name: language === 'tr' ? 'İletişim' : 'Contact', href: '/contact' },
    { name: language === 'tr' ? 'Gizlilik' : 'Privacy', href: '/privacy' },
    { name: 'Admin', href: '/admin/login' },
  ]

  return (
    <footer className="bg-[#111111] text-gray-400 py-16 border-t border-white/5 font-light">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20">

          {/* 1. Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <h2 className="font-serif text-2xl text-white tracking-wide group-hover:text-gray-300 transition-colors">SOLENZA</h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block">Luxury Furniture</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-[200px] text-gray-500">
              {settings[`about_${language}`] || settings.about_tr}
            </p>
            <div className="flex gap-4">
              <a href={settings.instagram || '#'} className="text-gray-500 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.825-.049.905-.029 1.532-.179 1.987-.349.502-.195.897-.442 1.285-.828.389-.389.636-.783.828-1.285.176-.464.32-.993.349-1.987.048-1.054.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.825-.029-.905-.179-1.532-.349-1.987-.195-.502-.442-.897-.828-1.285-.389-.389-.783-.636-1.285-.828-.454-.176-.993-.32-1.987-.349-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href={settings.facebook || '#'} className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Pinterest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 0C5.372 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.65 0-5.789 2.738-5.789 5.57 0 1.103.425 2.286.956 2.922.105.124.12.235.088.423-.098.399-.315 1.272-.358 1.453-.058.243-.19.295-.437.178-1.625-.762-2.64-3.15-2.64-5.071 0-4.133 3.003-7.925 8.657-7.925 4.545 0 8.079 3.238 8.079 7.568 0 4.517-2.848 8.151-6.801 8.151-1.328 0-2.576-.69-3.004-1.503l-.818 3.116c-.295 1.127-1.096 2.54-1.63 3.404C7.781 23.869 9.839 24 12 24c6.627 0 12-5.373 12-12S16.627 0 12 0z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">{language === 'tr' ? 'Kurumsal' : 'Corporate'}</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">{language === 'tr' ? 'Koleksiyonlar' : 'Collections'}</h4>
            <ul className="space-y-3 text-sm">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/?category=${cat.id}`} className="hover:text-white transition-colors">
                    {language === 'tr' ? cat.name_tr : (cat.name_en || cat.name_tr)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">{language === 'tr' ? 'İletişim' : 'Contact'}</h4>
            <div className="space-y-4 text-sm">
              <p>
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors block">{settings.phone}</a>
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors block">{settings.email}</a>
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                {settings[`address_${language}`] || settings.address_tr}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-wider text-gray-600">
          <p>&copy; {new Date().getFullYear()} Solenza.</p>
          <p>Designed for Luxury.</p>
        </div>
      </div>
    </footer>
  )
}
