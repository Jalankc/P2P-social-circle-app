import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroCanopy() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headline1Ref = useRef<HTMLHeadingElement>(null)
  const headline2Ref = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const sub2Ref = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      amp: 0.3 + Math.random() * 0.5,
    }))

    let mouseX = -999
    let mouseY = -999
    let animId = 0
    let sectionOpacity = 1

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const handleResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('resize', handleResize)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.y -= p.speed
        const sway = Math.sin(p.y * 0.01 + p.offset) * p.amp
        let px = p.x + sway

        // Repel from mouse
        const dx = px - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          px += (dx / dist) * force * 3
          p.y += (dy / dist) * force * 3
        }

        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }

        ctx.beginPath()
        ctx.arc(px, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(244, 208, 63, ${0.4 * sectionOpacity})`
        ctx.shadowBlur = 6
        ctx.shadowColor = `rgba(244, 208, 63, ${0.3 * sectionOpacity})`
        ctx.fill()
        ctx.shadowBlur = 0
      }
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // GSAP ScrollTrigger pinning & scroll animations
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Fade particles with scroll progress
          const canvas = canvasRef.current
          if (canvas) {
            canvas.style.opacity = String(Math.max(0, 1 - self.progress * 1.5))
          }
          // Darken gradient overlay
          const overlay = section.querySelector('.hero-overlay') as HTMLElement
          if (overlay) {
            overlay.style.opacity = String(0.4 + self.progress * 0.45)
          }
        },
      })

      // Headline crossfade: 40% - 60%
      gsap.fromTo(
        headline1Ref.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: { trigger: section, start: '40%', end: '60%', scrub: true },
        }
      )
      gsap.fromTo(
        headline2Ref.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: { trigger: section, start: '40%', end: '60%', scrub: true },
        }
      )

      // Subhead swap: 60% - 80%
      gsap.fromTo(
        subRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: { trigger: section, start: '55%', end: '70%', scrub: true },
        }
      )
      gsap.fromTo(
        sub2Ref.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: { trigger: section, start: '65%', end: '80%', scrub: true },
        }
      )

      // CTA fade out: 70% - 90%
      gsap.fromTo(
        ctaRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: { trigger: section, start: '70%', end: '90%', scrub: true },
        }
      )

      // Background zoom: 80% - 100%
      gsap.fromTo(
        section.querySelector('.hero-bg'),
        { scale: 1 },
        {
          scale: 1.08,
          scrollTrigger: { trigger: section, start: '80%', end: '100%', scrub: true },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  // Load animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
      .to(headline1Ref.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.2')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.15')
    return () => { tl.kill() }
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden flex items-center justify-center"
    >
      {/* Background image */}
      <div className="hero-bg absolute inset-0 z-0">
        <img
          src="/hero-canopy.jpg"
          alt="Forest canopy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="hero-overlay absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 41, 30, 0.4) 0%, rgba(15, 41, 30, 0.85) 100%)',
          opacity: 0.4,
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[2]"
        style={{ pointerEvents: 'none' }}
      />

      {/* Content */}
      <div className="relative z-[3] mx-auto flex max-w-[720px] flex-col items-center px-4 text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="mb-6 flex items-center gap-2 rounded-full px-4 py-2 opacity-0"
          style={{
            background: 'rgba(212, 160, 23, 0.15)',
            border: '1px solid rgba(212, 160, 23, 0.4)',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sp-amber opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sp-amber" />
          </span>
          <span className="text-xs font-medium text-sp-honey" style={{ letterSpacing: '0.08em' }}>
            P2P &bull; Encrypted &bull; Yours
          </span>
        </div>

        {/* Headlines */}
        <div className="relative mb-6 h-[80px] sm:h-[96px]">
          <h1
            ref={headline1Ref}
            className="absolute inset-0 flex items-center justify-center font-display text-5xl font-bold text-sp-cream opacity-0 sm:text-6xl md:text-7xl"
            style={{ transform: 'translateY(30px)' }}
          >
            No servers.
          </h1>
          <h1
            ref={headline2Ref}
            className="absolute inset-0 flex items-center justify-center font-display text-5xl font-bold text-sp-cream opacity-0 sm:text-6xl md:text-7xl"
            style={{ transform: 'translateY(30px)' }}
          >
            Only{' '}
            <span className="italic text-sp-honey">seeds</span>.
          </h1>
        </div>

        {/* Subheadlines */}
        <p
          ref={subRef}
          className="mb-2 max-w-[560px] text-lg text-sp-parchment opacity-0 sm:text-xl"
          style={{ transform: 'translateY(20px)', lineHeight: 1.5 }}
        >
          Your profile, your friends, your network. Distributed in chunks across people you trust.
        </p>
        <p
          ref={sub2Ref}
          className="mb-8 max-w-[560px] text-lg text-sp-parchment opacity-0 sm:text-xl"
          style={{ transform: 'translateY(20px)', lineHeight: 1.5 }}
        >
          Every friend holds a piece of you. Every piece holds the whole network together.
        </p>

        {/* CTA Row */}
        <div
          ref={ctaRef}
          className="flex flex-col items-center gap-4 opacity-0"
          style={{ transform: 'translateY(20px)' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/build"
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold uppercase text-sp-bark transition-all hover:scale-[1.03]"
              style={{
                background: 'var(--sp-amber)',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 20px rgba(212, 160, 23, 0.3)',
              }}
            >
              Plant Your Profile
            </Link>
            <button
              onClick={() => scrollToSection('chunk-network')}
              className="inline-flex items-center rounded-full border-[1.5px] border-sp-fern px-6 py-3 text-sm font-medium text-sp-fern transition-colors hover:bg-sp-fern/10"
            >
              See How It Works
            </button>
          </div>
          <p className="text-xs text-sp-parchment/60">
            Free forever. No ads we control. Your data lives where you put it.
          </p>
        </div>
      </div>
    </section>
  )
}
