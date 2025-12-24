'use client'

export default function LEDGlow() {
    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Sol Kenar - İnce Dikey LED Çizgisi */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] md:w-1">
                {/* Koyu mavi glow - nefes alan */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent opacity-60 blur-xl animate-led-breath"></div>
                {/* İkincil glow - daha yumuşak */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-transparent opacity-40 blur-2xl animate-led-breath-slow"></div>
            </div>

            {/* Sağ Kenar - İnce Dikey LED Çizgisi */}
            <div className="absolute right-0 top-0 bottom-0 w-[2px] md:w-1">
                {/* Koyu mavi glow - nefes alan */}
                <div className="absolute inset-0 bg-gradient-to-l from-blue-900 to-transparent opacity-60 blur-xl animate-led-breath"></div>
                {/* İkincil glow - daha yumuşak */}
                <div className="absolute inset-0 bg-gradient-to-l from-blue-800 to-transparent opacity-40 blur-2xl animate-led-breath-slow"></div>
            </div>
        </div>
    )
}
