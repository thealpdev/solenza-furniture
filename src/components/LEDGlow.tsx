'use client'

export default function LEDGlow() {
    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Sol Kenar - Dikey LED Strip */}
            <div className="absolute left-0 top-0 bottom-0 w-1">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent opacity-90 blur-[30px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-transparent opacity-100 blur-[20px] animate-pulse-slow" />
            </div>

            {/* Sağ Kenar - Dikey LED Strip */}
            <div className="absolute right-0 top-0 bottom-0 w-1">
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500 via-cyan-400 to-transparent opacity-90 blur-[30px]" />
                <div className="absolute inset-0 bg-gradient-to-l from-blue-600 to-transparent opacity-100 blur-[20px] animate-pulse-slow" />
            </div>

            {/* Üst Kenar - Yatay LED Strip */}
            <div className="absolute top-0 left-0 right-0 h-1">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-cyan-400 to-transparent opacity-80 blur-[25px]" />
            </div>

            {/* Alt Kenar - Yatay LED Strip */}
            <div className="absolute bottom-0 left-0 right-0 h-1">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500 via-cyan-400 to-transparent opacity-80 blur-[25px]" />
            </div>

            {/* Sol Üst Köşe - Spot Işık */}
            <div className="absolute top-0 left-0 w-40 h-40">
                <div className="absolute inset-0 bg-gradient-radial from-blue-400 via-cyan-300 to-transparent opacity-80 blur-3xl animate-breath" />
            </div>

            {/* Sağ Üst Köşe - Spot Işık */}
            <div className="absolute top-0 right-0 w-40 h-40">
                <div className="absolute inset-0 bg-gradient-radial from-blue-400 via-cyan-300 to-transparent opacity-80 blur-3xl animate-breath-slow" />
            </div>

            {/* Sol Alt Köşe - Spot Işık */}
            <div className="absolute bottom-0 left-0 w-40 h-40">
                <div className="absolute inset-0 bg-gradient-radial from-blue-400 via-cyan-300 to-transparent opacity-80 blur-3xl animate-breath-slow" />
            </div>

            {/* Sağ Alt Köşe - Spot Işık */}
            <div className="absolute bottom-0 right-0 w-40 h-40">
                <div className="absolute inset-0 bg-gradient-radial from-blue-400 via-cyan-300 to-transparent opacity-80 blur-3xl animate-breath" />
            </div>
        </div>
    )
}
