'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type FavoritesContextType = {
    favorites: string[] // List of Product IDs
    toggleFavorite: (id: string) => void
    isFavorite: (id: string) => boolean
    clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('solenza_favorites')
            if (stored) {
                try {
                    setFavorites(JSON.parse(stored))
                } catch (e) {
                    console.error('Failed to parse favorites', e)
                }
            }
        }
    }, [])

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const newFavs = prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id]
            localStorage.setItem('solenza_favorites', JSON.stringify(newFavs))
            return newFavs
        })
    }

    const isFavorite = (id: string) => favorites.includes(id)

    const clearFavorites = () => {
        setFavorites([])
        localStorage.removeItem('solenza_favorites')
    }

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext)
    if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
    return context
}
