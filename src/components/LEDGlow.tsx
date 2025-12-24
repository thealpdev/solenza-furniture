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
        </div>
    )
}
