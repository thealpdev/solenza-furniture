'use client'

import { useEffect, useState } from 'react'

// Partner logo URLs - production'da kendi logolarınızı kullanın
const PARTNER_LOGOS = [
    { name: 'Partner 1', url: 'https://via.placeholder.com/150x60/E5E7EB/6B7280?text=Partner+1' },
    { name: 'Partner 2', url: 'https://via.placeholder.com/150x60/E5E7EB/6B7280?text=Partner+2' },
    { name: 'Partner 3', url: 'https://via.placeholder.com/150x60/E5E7EB/6B7280?text=Partner+3' },
    { name: 'Partner 4', url: 'https://via.placeholder.com/150x60/E5E7EB/6B7280?text=Partner+4' },
    { name: 'Partner 5', url: 'https://via.placeholder.com/150x60/E5E7EB/6B7280?text=Partner+5' },
    { name: 'Partner 6', url: 'https://via.placeholder.com/150x60/E5E7EB/6B7280?text=Partner+6' },
]

export default function Partners() {
    const [isPaused, setIsPaused] = useState(false)

    // Duplicate logos for seamless infinite scroll
    const allLogos = [...PARTNER_LOGOS, ...PARTNER_LOGOS]

    return (
        <section className="bg-gray-50 py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Güvenilir Partnerlerimiz</h2>
                    <p className="text-gray-600">Sektörün önde gelen markaları ile çalışıyoruz</p>
                </div>

                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Gradient overlay for edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

                    {/* Scrolling container */}
                    <div className="flex overflow-hidden">
                        <div
                            className={`flex gap-16 ${isPaused ? '' : 'animate-scroll'}`}
                            style={{
                                animation: isPaused ? 'none' : 'scroll 30s linear infinite',
                            }}
                        >
                            {allLogos.map((partner, index) => (
                                <div
                                    key={`${partner.name}-${index}`}
                                    className="flex-shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                                >
                                    <img
                                        src={partner.url}
                                        alt={partner.name}
                                        className="h-12 w-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animation */}
            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
        </section>
    )
}
