import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Type, EyeOff, Droplets } from 'lucide-react'

const themes = [
  { key: 'dark-forest', label: 'Dark Forest', icon: Moon, colors: ['#0f291e', '#2d6a4f', '#52b788'] },
  { key: 'solar-meadow', label: 'Solar Meadow', icon: Sun, colors: ['#1a3c2a', '#52b788', '#d4a017'] },
  { key: 'system', label: 'System', icon: Monitor, colors: ['#0f291e', '#3e2723', '#f5f0e1'] },
]

const accentColors = [
  { name: 'Fern', hex: '#52b788' },
  { name: 'Amber', hex: '#d4a017' },
  { name: 'Honey', hex: '#f4d03f' },
  { name: 'Crypt', hex: '#7c3aed' },
  { name: 'Ember', hex: '#ff6b35' },
  { name: 'Sapling', hex: '#95d5b2' },
]

const AppearancePanel = memo(function AppearancePanel() {
  const [theme, setTheme] = useState('dark-forest')
  const [accent, setAccent] = useState('#52b788')
  const [fontSize, setFontSize] = useState(100)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [matrixIntensity, setMatrixIntensity] = useState(5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream">Appearance</h2>
      </div>

      {/* Theme selector */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Theme</p>
        <div className="flex gap-3 flex-wrap">
          {themes.map((t) => {
            const Icon = t.icon
            const isActive = theme === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={`relative rounded-lg p-3 transition-all border-2 ${isActive ? 'border-sp-fern' : 'border-transparent hover:border-sp-fern/30'}`}
                style={{ background: 'rgba(15, 41, 30, 0.6)', minWidth: '100px' }}
              >
                <div className="flex gap-1 mb-2">
                  {t.colors.map((c, i) => (
                    <span key={i} className="h-4 w-4 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-sp-parchment" />
                  <span className="text-xs font-medium text-sp-cream">{t.label}</span>
                </div>
                {isActive && (
                  <motion.span
                    layoutId="theme-check"
                    className="absolute top-1 right-1 h-4 w-4 rounded-full bg-sp-fern flex items-center justify-center"
                  >
                    <span className="text-[10px] text-sp-cream">✓</span>
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Accent color */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Accent Color</p>
        <div className="flex gap-3 flex-wrap">
          {accentColors.map((c) => {
            const isActive = accent === c.hex
            return (
              <button
                key={c.hex}
                onClick={() => setAccent(c.hex)}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${isActive ? 'border-white' : 'border-transparent'}`}
                style={{ background: `${c.hex}25`, color: c.hex }}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
                {c.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Accessibility */}
      <div className="rounded-lg p-4" style={{ background: 'rgba(45, 106, 79, 0.15)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
        <p className="font-display text-lg font-medium text-sp-cream mb-3">Accessibility</p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type className="h-4 w-4 text-sp-parchment" />
              <label className="text-sm text-sp-cream">Font Size</label>
              <span className="text-xs text-sp-fern">{fontSize}%</span>
            </div>
            <input
              type="range"
              min={90}
              max={120}
              step={10}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-sp-fern"
            />
            <div className="flex justify-between text-[10px] text-sp-parchment mt-1">
              <span>90%</span>
              <span>100%</span>
              <span>110%</span>
              <span>120%</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-sp-parchment" />
              <label className="text-sm text-sp-cream">Matrix Rain Intensity</label>
              <span className="text-xs text-sp-fern">{matrixIntensity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={5}
              value={matrixIntensity}
              onChange={(e) => setMatrixIntensity(Number(e.target.value))}
              className="w-full accent-sp-fern"
            />
            <div className="flex justify-between text-[10px] text-sp-parchment mt-1">
              <span>0%</span>
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
            </div>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-sp-parchment" />
              <span className="text-sm text-sp-cream">Reduced motion</span>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`relative h-5 w-9 rounded-full transition-colors ${reducedMotion ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${reducedMotion ? 'translate-x-4' : ''}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-sp-parchment" />
              <span className="text-sm text-sp-cream">High contrast</span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`relative h-5 w-9 rounded-full transition-colors ${highContrast ? 'bg-sp-fern' : 'bg-sp-moss/40'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-sp-cream shadow transition-transform ${highContrast ? 'translate-x-4' : ''}`} />
            </button>
          </label>
        </div>
      </div>
    </div>
  )
})

export default AppearancePanel
