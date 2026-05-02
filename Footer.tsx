import { Link } from 'react-router-dom'
import { Leaf, Github, FileText, Lock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-sp-moss/20" style={{ background: 'var(--sp-canopy)' }}>
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sp-moss">
                <Leaf className="h-3.5 w-3.5 text-sp-sapling" />
              </div>
              <span className="font-display text-sm font-medium text-sp-cream">SocialCircle.p2p</span>
            </div>
            <p className="text-sm text-sp-parchment leading-relaxed max-w-xs">
              A peer-to-peer social network where your friends hold your data, encryption is visible, and profiles are creative canvases.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-medium text-sp-cream mb-4">Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/explore" className="text-sm text-sp-parchment hover:text-sp-fern transition-colors">Explore</Link>
              <Link to="/feed" className="text-sm text-sp-parchment hover:text-sp-fern transition-colors">Feed</Link>
              <a href="#" className="flex items-center gap-1.5 text-sm text-sp-parchment hover:text-sp-fern transition-colors">
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
              <a href="#" className="flex items-center gap-1.5 text-sm text-sp-parchment hover:text-sp-fern transition-colors">
                <FileText className="h-3.5 w-3.5" /> Docs
              </a>
              <a href="#" className="flex items-center gap-1.5 text-sm text-sp-parchment hover:text-sp-fern transition-colors">
                <Lock className="h-3.5 w-3.5" /> Privacy
              </a>
            </div>
          </div>

          {/* Network Stats */}
          <div>
            <h4 className="font-display text-sm font-medium text-sp-cream mb-4">Network</h4>
            <div className="flex flex-col gap-2 text-sm text-sp-parchment">
              <div className="flex justify-between">
                <span>Peers online</span>
                <span className="text-sp-fern font-medium">12,847</span>
              </div>
              <div className="flex justify-between">
                <span>Chunks distributed</span>
                <span className="text-sp-fern font-medium">4.2M</span>
              </div>
              <div className="flex justify-between">
                <span>Average uptime</span>
                <span className="text-sp-fern font-medium">99.7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-sp-moss/20 text-center">
          <p className="font-retro text-base tracking-wider text-sp-fern" style={{ letterSpacing: '0.05em' }}>
            No servers. Only seeds.
          </p>
        </div>
      </div>
    </footer>
  )
}
