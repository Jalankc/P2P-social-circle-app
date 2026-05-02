import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Lock, Timer, ShieldCheck } from 'lucide-react'

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    canvas.width = w
    canvas.height = h

    const cols = Math.floor(w / 14)
    const drops = Array.from({ length: cols }, () => Math.random() * h)
    const speeds = Array.from({ length: cols }, () => 0.5 + Math.random() * 1.5)
    const chars = '01ABCDEF∑∆πλψΩ≡≠≤≥<>{}[]|/\\'

    let animId = 0

    const draw = () => {
      ctx.fillStyle = 'rgba(15, 41, 30, 0.15)'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(0, 255, 65, 0.15)'
      ctx.font = '13px "JetBrains Mono", monospace'

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * 14
        const y = drops[i]
        ctx.fillText(char, x, y)
        drops[i] += speeds[i]
        if (drops[i] > h && Math.random() > 0.975) {
          drops[i] = 0
        }
      }
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    const handleResize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ opacity: 0.08, pointerEvents: 'none' }}
    />
  )
}

export default function EncryptionManifesto() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-40"
      style={{ background: 'linear-gradient(180deg, #0f291e 0%, #1a0b2e 60%, #0f291e 100%)' }}
    >
      <MatrixRain />

      <div className="relative z-10 mx-auto max-w-[900px] px-4 text-center md:px-6">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2 }}
          className="mb-4 font-retro text-sm text-crypt-terminal uppercase"
          style={{ letterSpacing: '0.12em' }}
        >
          ENCRYPTION YOU CAN SEE
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-8 font-display text-4xl font-bold text-sp-cream md:text-5xl"
        >
          Trust, but{' '}
          <span
            className="inline-block"
            style={{
              color: 'var(--crypt-glow)',
              textShadow: '0 0 20px rgba(167, 139, 250, 0.4)',
              animation: 'verifyPulse 2s ease-in-out infinite',
            }}
          >
            verify
          </span>
          .
        </motion.h2>

        {/* Body */}
        <div className="mx-auto mb-12 max-w-[640px]">
          {[
            'Every message on SocialCircle is end-to-end encrypted. Not by us — by your device. The keys live on your phone, never on a server that can be subpoenaed.',
            'We made the encryption visible. Green locks, purple shields, terminal-green confirmation codes. You decide if a message persists forever or burns after reading.',
            'Self-destruct is not a gimmick. It is a cryptographic guarantee. When the timer hits zero, the chunk dissolves across the network. No recovery. No logs.',
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="mb-5 text-lg leading-relaxed text-sp-parchment"
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* Lock Row */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {[
            { icon: Lock, label: 'Encrypted', color: '#52b788', sub: 'End-to-end' },
            { icon: Timer, label: 'Self-Destruct', color: '#ff6b35', sub: '00:05' },
            { icon: ShieldCheck, label: 'Zero-Knowledge', color: '#7c3aed', sub: 'No logs' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  border: `2px solid ${item.color}`,
                  boxShadow: `0 0 20px ${item.color}30`,
                }}
              >
                <item.icon className="h-7 w-7" style={{ color: item.color }} />
              </div>
              <span className="text-sm font-medium text-sp-cream">{item.label}</span>
              <span className="text-xs text-sp-parchment/60">{item.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex flex-col items-center gap-3"
        >
          <Link
            to="/docs/crypto"
            className="inline-flex items-center rounded-full border-[1.5px] border-sp-fern px-6 py-3 text-sm font-medium text-sp-fern transition-colors hover:bg-sp-fern/10"
          >
            Read the Cryptography Whitepaper
          </Link>
          <Link to="/talk" className="text-sm text-sp-fern hover:underline">
            Or just start talking securely.
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes verifyPulse {
          0%, 100% { text-shadow: 0 0 20px rgba(167, 139, 250, 0.4); }
          50% { text-shadow: 0 0 40px rgba(167, 139, 250, 0.7); }
        }
      `}</style>
    </section>
  )
}
