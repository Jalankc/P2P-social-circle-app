import { useRef, useEffect, memo } from 'react'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@%&*()[]{}<>~'

const MatrixRain = memo(function MatrixRain({ opacity = 0.03 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let cols: number[] = []
    const fontSize = 14

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      const numCols = Math.ceil(canvas.width / fontSize)
      cols = Array.from({ length: numCols }, () => Math.random() * -100)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!ctx || !canvas) return
      ctx.fillStyle = `rgba(15, 41, 30, 0.05)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'var(--crypt-terminal)'
      ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`

      for (let i = 0; i < cols.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = cols[i] * fontSize
        ctx.globalAlpha = opacity * (0.5 + Math.random() * 0.5)
        ctx.fillText(char, x, y)
        ctx.globalAlpha = 1

        if (y > canvas.height && Math.random() > 0.975) {
          cols[i] = 0
        } else {
          cols[i] += 0.5 + Math.random() * 0.5
        }
      }
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [opacity])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
})

export default MatrixRain
