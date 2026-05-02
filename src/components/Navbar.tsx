import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Leaf } from 'lucide-react'

const navLinks = [
  { label: 'Forum', to: '/feed' },
  { label: 'Explore', to: '/explore' },
  { label: 'Talk', to: '/talk' },
  { label: 'Store', to: '/store' },
  { label: 'Build', to: '/build' },
  { label: 'Settings', to: '/settings' },
]

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ═══════════════════════════════════════════
   COMPENSATION WALLET DISPLAY
   ═══════════════════════════════════════════ */

function CompensationWallet() {
  return (
    <div
      className="hidden lg:flex items-center gap-2 font-mono text-[10px]"
      style={{ color: 'var(--sp-parchment)' }}
    >
      <span className="text-sp-parchment/50 uppercase tracking-wider">Comp:</span>
      <span className="text-sp-cream">1.2K</span>
      <span style={{ color: 'rgba(45, 106, 79, 0.4)' }}>|</span>
      <span title="Material">
        <span>{'\u2699\uFE0F'}</span>
        <span className="text-sp-cream ml-0.5">890M</span>
      </span>
      <span title="Social">
        <span>{'\uD83D\uDCAC'}</span>
        <span className="text-sp-cream ml-0.5">1,247S</span>
      </span>
      <span title="Innovation">
        <span>{'\uD83D\uDCA1'}</span>
        <span className="text-sp-cream ml-0.5">340I</span>
      </span>
      <span title="Ecology">
        <span>{'\uD83C\uDF31'}</span>
        <span className="text-sp-cream ml-0.5">45,200E</span>
      </span>
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '32px',
        background: 'var(--sp-canopy)',
        borderBottom: '1px solid rgba(82, 183, 136, 0.3)',
      }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-3">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <Leaf className="h-4 w-4 text-sp-fern" />
          <span className="font-retro text-base text-sp-fern">SocialCircle.p2p</span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-3 py-1 font-retro text-sm transition-colors',
                  isActive ? 'text-sp-amber' : 'text-sp-parchment hover:text-sp-sapling'
                )}
                style={{
                  borderBottom: isActive ? '2px solid var(--sp-amber)' : '2px solid transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right: Wallet + Status + Avatar + My Forum */}
        <div className="flex items-center gap-2">
          <CompensationWallet />

          <div className="hidden sm:flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ background: '#22c55e' }}
            />
            <span className="font-mono text-[10px] text-sp-sapling">12 peers</span>
          </div>

          <div
            className="overflow-hidden flex-shrink-0"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '2px',
              border: '1px solid rgba(82, 183, 136, 0.3)',
            }}
          >
            <img src="/avatar-default.jpg" alt="avatar" className="h-full w-full object-cover" />
          </div>

          <Link
            to="/@demo"
            className="hidden sm:block font-mono text-[10px] text-sp-parchment hover:text-sp-sapling transition-colors"
          >
            My Forum
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-sp-parchment transition-colors hover:text-sp-sapling"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="fixed top-8 right-0 z-50 h-[calc(100dvh-32px)] w-[85vw] max-w-[320px] border-l border-sp-moss md:hidden"
            style={{ background: 'var(--sp-canopy)' }}
          >
            <div className="flex flex-col gap-0 p-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 font-retro text-sm text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-sp-moss/40" />
              <Link
                to="/@demo"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 font-retro text-sm text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream"
              >
                My Forum
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
