'use client'

export default function LEDGlow() {
    return (
        <>
            {/* Sol taraf LED glow - Daha parlak ve geniş */}
            <div className="fixed left-0 top-0 bottom-0 w-2 md:w-4 pointer-events-none z-50">
                {/* Ana glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-80 blur-2xl animate-breath"></div>
                {/* İkincil glow - daha parlak */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-transparent opacity-70 blur-3xl animate-breath-slow"></div>
                {/* Parlak çekirdek */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-transparent opacity-90 blur-xl"></div>
            </div>

            {/* Sağ taraf LED glow - Daha parlak ve geniş */}
            <div className="fixed right-0 top-0 bottom-0 w-2 md:w-4 pointer-events-none z-50">
                {/* Ana glow */}
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-transparent opacity-80 blur-2xl animate-breath"></div>
                {/* İkincil glow - daha parlak */}
                <div className="absolute inset-0 bg-gradient-to-l from-cyan-400 to-transparent opacity-70 blur-3xl animate-breath-slow"></div>
                {/* Parlak çekirdek */}
                <div className="absolute inset-0 bg-gradient-to-l from-blue-400 to-transparent opacity-90 blur-xl"></div>
            </div>
        </>
    )
}
