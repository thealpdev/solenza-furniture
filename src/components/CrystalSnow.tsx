'use client'

import { useEffect, useState } from 'react'

export default function CrystalSnow() {
  const [flakes, setFlakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([])

  useEffect(() => {
    // Elegant, sparse snowfall
    const count = 30
    const newFlakes = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20, // Slow, floating fall
      size: 2 + Math.random() * 4, // Varying crystal sizes
    }))
    setFlakes(newFlakes)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-10px] bg-white rounded-full opacity-0 animate-crystal-fall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            boxShadow: `0 0 ${flake.size * 2}px rgba(255, 255, 255, 0.8)`, // Glow effect
            filter: 'blur(0.5px)',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes crystal-fall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
            transform: translateY(50vh) translateX(20px) rotate(180deg);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-crystal-fall {
          animation-name: crystal-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}
