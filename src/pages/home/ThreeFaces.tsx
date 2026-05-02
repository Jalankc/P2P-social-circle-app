import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, Video, Ghost } from 'lucide-react'

const profiles = [
  {
    icon: Globe,
    title: 'Main Profile',
    subtitle: 'The Public Garden',
    desc: 'Your public face. What strangers see. Customizable, searchable, shareable by link.',
    tags: ['Open', 'Searchable', 'Shareable'],
    footer: 'Visible to: Everyone',
    gradient: 'rgba(45, 106, 79, 0.3)',
    color: '#52b788',
  },
  {
    icon: Video,
    title: 'Content Profile',
    subtitle: "The Creator's Grove",
    desc: 'Your reels, shorts, creations. A scrollable feed of what you want the world to see — on your terms.',
    tags: ['Feed', 'Albums', 'Monetizable'],
    footer: 'Ad revenue: Yours to keep',
    gradient: 'rgba(212, 160, 23, 0.15)',
    color: '#f4d03f',
  },
  {
    icon: Ghost,
    title: 'Nickname Profile',
    subtitle: 'The Whispering Fern',
    desc: 'Post without fallout. Comment without consequence. A mask for the moments you need one.',
    tags: ['Encrypted', 'Self-Destruct', 'Untraceable'],
    footer: 'Identity: Zero-knowledge',
    gradient: 'rgba(124, 58, 237, 0.15)',
    color: '#7c3aed',
  },
]

export default function ThreeFaces() {
  const headerRef = useRef(null)
  const cardsRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.25 })
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 })

  return (
    <section className="py-24 md:py-32" style={{ background: 'var(--sp-canopy)' }}>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-3 font-retro text-sm text-sp-fern uppercase"
            style={{ letterSpacing: '0.1em' }}
          >
            YOUR IDENTITIES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-3 font-display text-3xl font-bold text-sp-cream md:text-4xl"
          >
            One seed. Three faces.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="text-base text-sp-parchment"
          >
            Choose how the world sees you. Switch anytime.
          </motion.p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid gap-5 md:grid-cols-3">
          {profiles.map((p, i) => {
            const order = i === 1 ? 0 : i === 0 ? 1 : 2 // center first
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 60 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: order * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="relative flex flex-col rounded-xl border border-sp-fern/20 p-6 md:p-8"
                style={{
                  background: `linear-gradient(to bottom, ${p.gradient}, transparent)`,
                  minHeight: '360px',
                }}
              >
                {/* Glow pulse */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    animation: 'glowPulse 2s linear infinite',
                  }}
                />

                <motion.div
                  initial={{ rotate: 0 }}
                  animate={cardsInView ? { rotate: [0, 10, 0] } : {}}
                  transition={{ duration: 0.5, delay: order * 0.15 + 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                  className="mb-4"
                >
                  <p.icon className="h-10 w-10" style={{ color: p.color }} />
                </motion.div>

                <h3 className="mb-1 font-display text-xl font-medium text-sp-cream">{p.title}</h3>
                <p className="mb-3 text-sm italic text-sp-parchment/70">{p.subtitle}</p>
                <p className="mb-6 text-sm leading-relaxed text-sp-parchment">{p.desc}</p>

                <div className="mb-auto flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: 'rgba(82, 183, 136, 0.15)',
                        border: '1px solid rgba(82, 183, 136, 0.3)',
                        color: 'var(--sp-fern)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-sp-fern/10">
                  <p className="text-xs text-sp-parchment/60">{p.footer}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(82, 183, 136, 0.1); }
          50% { box-shadow: 0 0 40px rgba(82, 183, 136, 0.2); }
        }
      `}</style>
    </section>
  )
}
