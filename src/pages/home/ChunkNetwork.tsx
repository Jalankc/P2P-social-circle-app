import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Radio, Shield, Code, Users } from 'lucide-react'

const featureCards = [
  {
    icon: Radio,
    title: 'Lighthouse Linking',
    body: 'Your first connection happens locally. GPS finds nearby seedlings. No internet required to begin.',
  },
  {
    icon: Shield,
    title: 'Transparent Encryption',
    body: 'Every message shows its encryption status. You choose: persistent logs or self-destructing whispers.',
  },
  {
    icon: Code,
    title: 'Raw + Guided Building',
    body: "Drag and drop widgets like it's 2003. Or open the code editor and write your profile from scratch.",
  },
  {
    icon: Users,
    title: 'Three Faces, One Seed',
    body: 'A public profile. A content creator page. An anonymous nickname for the posts that need no name.',
  },
]

function ChunkDiagram() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const cx = 400
  const cy = 250
  const friendRadius = 160
  const outerRadius = 260

  const friendNodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 6 - Math.PI / 2
    return { x: cx + friendRadius * Math.cos(angle), y: cy + friendRadius * Math.sin(angle) }
  })

  const outerNodes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 12 - Math.PI / 2
    return { x: cx + outerRadius * Math.cos(angle), y: cy + outerRadius * Math.sin(angle) }
  })

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[800px]">
      <svg viewBox="0 0 800 500" className="w-full h-auto">
        {/* Connection lines from center to friends */}
        {friendNodes.map((node, i) => (
          <motion.line
            key={`cf${i}`}
            x1={cx} y1={cy} x2={node.x} y2={node.y}
            stroke="#2d6a4f"
            strokeWidth="2"
            strokeOpacity="0.4"
            strokeDasharray="8 6"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + i * 0.04, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          />
        ))}

        {/* Connection lines from friends to outer */}
        {outerNodes.map((node, i) => {
          const friend = friendNodes[Math.floor(i / 2) % 6]
          return (
            <motion.line
              key={`fo${i}`}
              x1={friend.x} y1={friend.y} x2={node.x} y2={node.y}
              stroke="#2d6a4f"
              strokeWidth="1.5"
              strokeOpacity="0.25"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.6, delay: 1.0 + i * 0.03, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
          )
        })}

        {/* Seed particles on center-to-friend lines */}
        {friendNodes.map((node, i) => (
          <circle key={`seed${i}`} r="3" fill="#f4d03f">
            <animateMotion
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              path={`M${cx},${cy} L${node.x},${node.y}`}
              begin={`${isInView ? '1.5s' : 'indefinite'}`}
            />
          </circle>
        ))}

        {/* Center node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        >
          <circle cx={cx} cy={cy} r="40" fill="#d4a017" fillOpacity="0.2" />
          <circle cx={cx} cy={cy} r="40" fill="none" stroke="#d4a017" strokeWidth="2" strokeOpacity="0.6" />
          <text x={cx} y={cy + 5} textAnchor="middle" fill="#f5f0e1" fontSize="28">
            &#127793;
          </text>
        </motion.g>

        {/* Friend nodes */}
        {friendNodes.map((node, i) => (
          <motion.g
            key={`f${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          >
            <circle cx={node.x} cy={node.y} r="20" fill="#52b788" />
            <circle cx={node.x} cy={node.y} r="20" fill="none" stroke="#52b788" strokeWidth="1.5" strokeOpacity="0.8" />
          </motion.g>
        ))}

        {/* Outer nodes */}
        {outerNodes.map((node, i) => (
          <motion.g
            key={`o${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.6 } : {}}
            transition={{ duration: 0.3, delay: 1.1 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          >
            <circle cx={node.x} cy={node.y} r="10" fill="#95d5b2" fillOpacity="0.6" />
          </motion.g>
        ))}
      </svg>
    </div>
  )
}

export default function ChunkNetwork() {
  const headerRef = useRef(null)
  const cardsRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.25 })
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 })

  return (
    <section
      id="chunk-network"
      className="relative py-24 md:py-32"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(45, 106, 79, 0.3) 0%, transparent 70%), var(--sp-canopy)',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mb-3 font-retro text-sm text-sp-fern uppercase"
            style={{ letterSpacing: '0.1em' }}
          >
            THE ARCHITECTURE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mx-auto mb-4 max-w-[640px] font-display text-3xl font-bold text-sp-cream md:text-4xl"
          >
            You are not a user. You are a node.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="mx-auto max-w-[640px] text-lg text-sp-parchment"
          >
            When you create a profile, your data splits into encrypted chunks. Your friends store them. Their friends store backups. The network remembers.
          </motion.p>
        </div>

        {/* Diagram */}
        <div className="mb-16">
          <ChunkDiagram />
        </div>

        {/* Feature Cards */}
        <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rounded-lg border border-sp-fern/25 p-6"
              style={{ background: 'rgba(45, 106, 79, 0.2)' }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={cardsInView ? { scale: [0.8, 1.1, 1] } : {}}
                transition={{ duration: 0.4, delay: i * 0.12 + 0.1, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: 'rgba(212, 160, 23, 0.15)' }}
              >
                <card.icon className="h-6 w-6 text-sp-honey" />
              </motion.div>
              <h3 className="mb-2 font-display text-xl font-medium text-sp-cream">{card.title}</h3>
              <p className="text-[15px] leading-relaxed text-sp-parchment">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
