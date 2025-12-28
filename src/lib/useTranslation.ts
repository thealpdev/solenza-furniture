'use client'

import { useState, useEffect } from 'react'

export function useTranslation() {
    const [lang, setLang] = useState<'tr' | 'en'>('tr')
    const [messages, setMessages] = useState<any>({})

    useEffect(() => {
        const savedLang = (localStorage.getItem('language') as 'tr' | 'en') || 'tr'
        setLang(savedLang)
        loadMessages(savedLang)
    }, [])

    const loadMessages = async (language: 'tr' | 'en') => {
        try {
            const msgs = await import(`../../messages/${language}.json`)
            setMessages(msgs.default || msgs)
        } catch (error) {
            console.error('Failed to load messages:', error)
        }
    }

    const t = (key: string, params?: Record<string, any>): string => {
        const keys = key.split('.')
        let value: any = messages

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k]
            } else {
                return key
            }
        }

        if (typeof value !== 'string') return key

        // Replace parameters
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                value = value.replace(`{${paramKey}}`, String(paramValue))
            })
        }

        return value || key
    }

    return { t, lang, setLang }
}
