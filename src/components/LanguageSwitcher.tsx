'use client'

import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

type Language = 'tr' | 'en'

export default function LanguageSwitcher() {
    const [currentLang, setCurrentLang] = useState<Language>('tr')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Get language from localStorage or default to 'tr'
        const savedLang = (localStorage.getItem('language') as Language) || 'tr'
        setCurrentLang(savedLang)
    }, [])

    const languages = [
        { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' },
        { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    ]

    const handleLanguageChange = (lang: Language) => {
        setCurrentLang(lang)
        localStorage.setItem('language', lang)
        setIsOpen(false)
        // Reload page to apply language change
        window.location.reload()
    }

    const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                    {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors ${currentLang === lang.code ? 'bg-gray-50' : ''
                                    }`}
                            >
                                <span className="text-2xl">{lang.flag}</span>
                                <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                                {currentLang === lang.code && (
                                    <svg
                                        className="w-4 h-4 text-green-500 ml-auto"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
