import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-settle-ish: cubic-bezier(0.22, 1, 0.36, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(eased * target)
      setVal(start)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

const stats = [
  { value: 12847, label: 'Active Seeds', suffix: '' },
  { value: 4200000, label: 'Chunks Shared', suffix: '', format: '4.2M' },
  { value: 0, label: 'Uptime', suffix: '∞', display: '∞' },
  { value: 0, label: 'Servers', suffix: '0', display: '0' },
]

const testimonials = [
  {
    quote: 'It feels like finding an old forum again, but this time I own every pixel.',
    name: 'retroplanter',
  },
  {
    quote: 'My friends hold my data. If I go offline, I\'m still here. That\'s wild.',
    name: 'distributed_self',
  },
  {
    quote: 'Built my profile in 20 minutes. Dragged some widgets, pasted some HTML, done.',
    name: 'webmaster_98',
  },
]

export default function CommunityCTA() {
  const statsRef = useRef(null)
  const cardsRef = useRef(null)
  const ctaRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.25 })
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })

  return (
    <section
      className="py-24 md:py-32"
      style={{
        background: 'radial-gradient(ellipse at 50% 100%, rgba(212, 160, 23, 0.08) 0%, transparent 60%), var(--sp-canopy)',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Stats Row */}
        <div ref={statsRef} className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className={`flex flex-col items-center text-center ${i < 3 ? 'md:border-r md:border-sp-fern/20' : ''}`}
            >
              <span className="font-display text-4xl font-bold text-sp-honey md:text-5xl">
                {stat.display ? stat.display : <CountUp target={stat.value} />}
              </span>
              <span className="mt-2 text-sm text-sp-parchment">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div ref={cardsRef} className="mb-16 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="relative rounded-lg p-6"
              style={{ background: 'rgba(45, 106, 79, 0.15)' }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={cardsInView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.12 + 0.1, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                className="absolute left-4 top-3 font-display text-5xl text-sp-moss"
              >
                &ldquo;
              </motion.span>
              <motion.p
                initial={{ opacity: 0 }}
                animate={cardsInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                className="relative z-10 mb-4 pt-6 text-base italic text-sp-cream"
              >
                {t.quote}
              </motion.p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full border border-sp-fern/30">
                  <img src="/avatar-default.jpg" alt={t.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-sm text-sp-parchment">@{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <div ref={ctaRef} className="mx-auto max-w-[600px] text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-3 font-display text-3xl font-bold text-sp-cream md:text-4xl"
          >
            Plant your seed today.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-6 text-base text-sp-parchment"
          >
            Join the network. No email required. No phone number. Just a seed phrase and a friend.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
            className="mb-3"
          >
            <Link
              to="/build"
              className="inline-flex items-center rounded-full px-8 py-4 text-base font-semibold uppercase text-sp-bark transition-all hover:scale-[1.03]"
              style={{
                background: 'var(--sp-amber)',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 20px rgba(212, 160, 23, 0.3)',
                animation: 'ctaPulse 2s ease-out infinite',
              }}
            >
              Get SocialCircle
            </Link>
          </motion.div>

          <p className="mb-6 text-xs text-sp-parchment/60">
            Open source. P2P. Forever free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="h-10 w-28 rounded-md bg-sp-moss/30" />
            <div className="h-10 w-28 rounded-md bg-sp-moss/30" />
            <span className="text-xs text-sp-fern hover:underline cursor-pointer">APK Direct Download</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ctaPulse {
          0% { box-shadow: 0 0 0 0 rgba(212, 160, 23, 0.4); }
          70% { box-shadow: 0 0 0 16px rgba(212, 160, 23, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 160, 23, 0); }
        }
      `}</style>
    </section>
  )
}
