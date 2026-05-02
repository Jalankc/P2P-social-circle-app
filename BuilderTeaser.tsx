import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Check, GripVertical, Image, Music, Users, FileText } from 'lucide-react'

const features = [
  'Drag-and-drop widget blocks',
  'Raw HTML/CSS/JS editor with live preview',
  'Photo albums, music players, video feeds, guestbooks',
  'Ad blocks you control — profit from your own space',
]

const widgets = [
  { title: 'About Me', icon: FileText, bg: 'rgba(62, 39, 35, 0.5)' },
  { title: 'My Photos', icon: Image, bg: 'rgba(62, 39, 35, 0.4)' },
  { title: 'Now Playing', icon: Music, bg: 'rgba(62, 39, 35, 0.5)' },
  { title: 'Friends', icon: Users, bg: 'rgba(62, 39, 35, 0.4)' },
]

export default function BuilderTeaser() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const leftInView = useInView(leftRef, { once: true, amount: 0.2 })
  const rightInView = useInView(rightRef, { once: true, amount: 0.2 })

  return (
    <section
      className="py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #0f291e 0%, #1a3c2a 50%, #0f291e 100%)' }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 md:flex-row md:items-center md:px-6">
        {/* Left Column */}
        <div ref={leftRef} className="flex-1 md:max-w-[55%]">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-3 font-retro text-sm text-sp-honey uppercase"
            style={{ letterSpacing: '0.1em' }}
          >
            BUILD YOUR WORLD
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-4 font-display text-3xl font-bold text-sp-cream md:text-4xl"
          >
            FrontPage nostalgia. 2025 freedom.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-6 max-w-[520px] text-base leading-relaxed text-sp-parchment"
          >
            Remember dragging widgets onto a blank canvas and suddenly having a website? We brought that back — but now your canvas is a social profile, encrypted and distributed across the friends who visit it.
          </motion.p>

          <ul className="mb-8 flex flex-col gap-3">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, y: 20 }}
                animate={leftInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="flex items-center gap-3 text-sp-parchment"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={leftInView ? { scale: [0, 1.2, 1] } : {}}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-sp-moss"
                >
                  <Check className="h-3 w-3 text-sp-sapling" />
                </motion.span>
                <span className="text-sm">{f}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={leftInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <Link
              to="/build"
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold uppercase text-sp-bark transition-all hover:scale-[1.03]"
              style={{
                background: 'var(--sp-amber)',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 20px rgba(212, 160, 23, 0.3)',
              }}
            >
              Start Building
            </Link>
          </motion.div>
        </div>

        {/* Right Column — Mockup */}
        <motion.div
          ref={rightRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={rightInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex-1"
        >
          <div
            className="rounded-lg border border-sp-fern/30 p-4"
            style={{ background: 'rgba(15, 41, 30, 0.6)' }}
          >
            {/* Browser chrome */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-sp-moss/50" />
              <div className="h-3 w-3 rounded-full bg-sp-moss/50" />
              <div className="h-3 w-3 rounded-full bg-sp-moss/50" />
              <div className="ml-2 h-5 flex-1 rounded bg-sp-moss/20" />
            </div>

            {/* Widgets */}
            <div className="flex flex-col gap-3">
              {widgets.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, x: 40 }}
                  animate={rightInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="relative rounded-md border border-dashed border-sp-amber/30 p-3"
                  style={{ background: w.bg }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <GripVertical className="h-3 w-3 text-sp-parchment/40" />
                    <span className="text-xs font-medium text-sp-cream">{w.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <w.icon className="h-4 w-4 text-sp-parchment/40" />
                    <div className="h-2 flex-1 rounded bg-sp-parchment/10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-sp-parchment/50">This is your canvas.</p>
        </motion.div>
      </div>
    </section>
  )
}
