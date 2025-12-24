'use client'

import { useEffect, useRef, useState } from 'react'

export default function SnowEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight

        // Set canvas size to window size
        const setSize = () => {
            canvas.width = width
            canvas.height = height
        }
        setSize()

        const particles: { x: number; y: number; radius: number; speed: number; wind: number; opacity: number }[] = []
        // Reduced particle count for performance but enough for atmosphere
        const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 1.5 + 0.5,
                wind: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.3
            })
        }

        let animationFrameId: number

        function draw() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, width, height)

            particles.forEach((p) => {
                ctx.beginPath()
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fill()

                // Update position
                p.y += p.speed
                p.x += p.wind

                // Reset if out of bounds
                if (p.y > height) {
                    p.y = -5
                    p.x = Math.random() * width
                }
                if (p.x > width) p.x = 0
                if (p.x < 0) p.x = width
            })

            animationFrameId = requestAnimationFrame(draw)
        }

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            setSize()
        }

        try {
            window.addEventListener('resize', handleResize)
            draw()
        } catch (e) {
            console.error("Animation error", e)
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [mounted])

    if (!mounted) return null

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{ mixBlendMode: 'normal' }} // Changed from screen to normal for visibility on white bg
        />
    )
}
