'use client'

export default function LEDGlow() {
    return (
        <>
            {/* Sol taraf LED glow */}
            <div className="fixed left-0 top-0 bottom-0 w-1 md:w-2 pointer-events-none z-50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-60 blur-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-transparent opacity-40 blur-2xl animate-pulse"></div>
            </div>

            {/* Sağ taraf LED glow */}
            <div className="fixed right-0 top-0 bottom-0 w-1 md:w-2 pointer-events-none z-50">
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-transparent opacity-60 blur-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-cyan-400 to-transparent opacity-40 blur-2xl animate-pulse"></div>
            </div>
        </>
    )
}
