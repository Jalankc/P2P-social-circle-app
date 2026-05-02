import { useState, useCallback, memo } from 'react'
import { PenLine, RotateCcw, Save } from 'lucide-react'

function bbcodeToHtml(input: string): string {
  return input
    .replace(/\[b\](.*?)\[\/b\]/gi, '<strong>$1</strong>')
    .replace(/\[i\](.*?)\[\/i\]/gi, '<em>$1</em>')
    .replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
    .replace(/\[center\](.*?)\[\/center\]/gi, '<div style="text-align:center">$1</div>')
    .replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<span style="color:$1">$2</span>')
    .replace(/\[url\](.*?)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noopener" style="color:#52b788;text-decoration:underline">$1</a>')
    .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noopener" style="color:#52b788;text-decoration:underline">$2</a>')
    .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-height:100px;max-width:100%" alt="" />')
    .replace(/\[quote\](.*?)\[\/quote\]/gi, '<blockquote style="border-left:2px solid #2d6a4f;padding-left:8px;margin:4px 0;color:#e8e0cc;font-style:italic">$1</blockquote>')
    .replace(/\[spoiler\](.*?)\[\/spoiler\]/gi, '<span style="background:#2d6a4f;color:#2d6a4f;padding:0 4px;cursor:pointer" onclick="this.style.color=\'#e8e0cc\'">$1</span>')
    .replace(/\n/g, '<br/>')
}

function wrapWithAnimation(html: string, animation: string): string {
  switch (animation) {
    case 'marquee': return `<marquee scrollamount="3" style="max-height:120px">${html}</marquee>`
    case 'fade': return `<div style="animation:fadeInOut 3s ease-in-out infinite;max-height:120px">${html}</div>`
    case 'pulse': return `<div style="animation:pulse 2s ease-in-out infinite;max-height:120px">${html}</div>`
    case 'slide': return `<div style="animation:slideHorizontal 4s ease-in-out infinite;max-height:120px">${html}</div>`
    default: return `<div style="max-height:120px">${html}</div>`
  }
}

type SigTab = 'text' | 'html' | 'animation'
type AnimationPreset = 'marquee' | 'fade' | 'pulse' | 'slide' | 'none'

const DEFAULT_SIGNATURE = `~ [b]🌿 Super Admin of Willow's Grove[/b] ~\n~ 1,247 Posts ~ P2P Seed Collector ~`
const DEFAULT_HTML = `<marquee>🌿 Willow's Grove ~ Super Admin ~ 1,247 Posts ~</marquee>`

const BBCodeButtons = [
  { tag: 'b', label: 'b' },
  { tag: 'i', label: 'i' },
  { tag: 'u', label: 'u' },
  { tag: 'color=#52b788', label: 'color' },
  { tag: 'url', label: 'url' },
  { tag: 'img', label: 'img' },
  { tag: 'quote', label: 'quote' },
  { tag: 'center', label: 'center' },
  { tag: 'spoiler', label: 'spoiler' },
]

const AnimationPresetsList: { key: AnimationPreset; label: string }[] = [
  { key: 'marquee', label: 'Marquee' },
  { key: 'fade', label: 'Fade' },
  { key: 'pulse', label: 'Pulse' },
  { key: 'slide', label: 'Slide' },
  { key: 'none', label: 'None' },
]

const SignaturePanel = memo(function SignaturePanel() {
  const [activeSigTab, setActiveSigTab] = useState<SigTab>('text')
  const [textValue, setTextValue] = useState(DEFAULT_SIGNATURE)
  const [htmlValue, setHtmlValue] = useState(DEFAULT_HTML)
  const [animation, setAnimation] = useState<AnimationPreset>('none')

  const previewHtml = activeSigTab === 'text'
    ? wrapWithAnimation(bbcodeToHtml(textValue), animation)
    : wrapWithAnimation(htmlValue, animation)

  const insertBBCode = useCallback((tag: string) => {
    const textarea = document.getElementById('sig-textarea') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textValue.substring(start, end)
    const before = textValue.substring(0, start)
    const after = textValue.substring(end)
    const replacement = `[${tag}]${selected}[/${tag.split('=')[0]}]`
    const newValue = before + replacement + after
    setTextValue(newValue)
    setTimeout(() => {
      textarea.focus()
      const newCursor = start + replacement.length
      textarea.setSelectionRange(newCursor, newCursor)
    }, 0)
  }, [textValue])

  const handleReset = useCallback(() => {
    setTextValue(DEFAULT_SIGNATURE)
    setHtmlValue(DEFAULT_HTML)
    setAnimation('none')
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-[28px] font-bold text-sp-cream flex items-center gap-2">
          <PenLine className="h-6 w-6 text-sp-fern" />
          ✎ Signature Editor
        </h2>
        <p className="font-mono text-[11px] text-sp-parchment mt-1">
          Max height: 120px | Max 3 lines | BBCode + HTML enabled
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {([
          { key: 'text' as SigTab, label: 'Text Mode' },
          { key: 'html' as SigTab, label: 'HTML Mode' },
          { key: 'animation' as SigTab, label: 'Animation Presets' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSigTab(tab.key)}
            className="px-4 py-1.5 font-retro text-[12px] uppercase transition-colors"
            style={{
              background: activeSigTab === tab.key ? 'rgba(45,106,79,0.35)' : 'rgba(45,106,79,0.1)',
              color: activeSigTab === tab.key ? '#f5f0e1' : '#e8e0cc',
              border: '1px solid rgba(45,106,79,0.4)',
              borderRadius: '0px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSigTab === 'text' && (
        <div className="space-y-2">
          <textarea
            id="sig-textarea"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm text-sp-cream placeholder-sp-parchment/50 bg-sp-canopy/60 focus:outline-none resize-none"
            style={{ border: '1px solid rgba(45,106,79,0.4)', borderRadius: '0px', fontFamily: 'Inter, system-ui, sans-serif' }}
          />
          <div className="flex flex-wrap gap-1">
            {BBCodeButtons.map((btn) => (
              <button
                key={btn.tag}
                onClick={() => insertBBCode(btn.tag)}
                className="px-2 py-0.5 font-mono text-[11px] text-sp-parchment transition-colors hover:bg-sp-fern/20 hover:text-sp-cream"
                style={{ border: '1px solid rgba(45,106,79,0.3)', borderRadius: '0px', background: 'rgba(15,41,30,0.4)' }}
              >
                [{btn.label}]
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSigTab === 'html' && (
        <textarea
          value={htmlValue}
          onChange={(e) => setHtmlValue(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 text-sp-cream placeholder-sp-parchment/50 bg-sp-canopy/60 focus:outline-none resize-none"
          style={{
            border: '1px solid rgba(45,106,79,0.4)',
            borderRadius: '0px',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: '12px',
            color: '#95d5b2',
          }}
        />
      )}

      {activeSigTab === 'animation' && (
        <div className="p-4 space-y-3" style={{ border: '1px solid rgba(45,106,79,0.3)', background: 'rgba(15,41,30,0.4)' }}>
          <p className="font-retro text-[12px] uppercase text-sp-amber">Select Animation</p>
          <div className="flex flex-wrap gap-2">
            {AnimationPresetsList.map((preset) => (
              <button
                key={preset.key}
                onClick={() => setAnimation(preset.key)}
                className="px-4 py-1.5 font-mono text-[12px] transition-colors"
                style={{
                  background: animation === preset.key ? 'rgba(45,106,79,0.4)' : 'rgba(15,41,30,0.4)',
                  color: animation === preset.key ? '#f5f0e1' : '#e8e0cc',
                  border: animation === preset.key ? '1px solid rgba(82,183,136,0.5)' : '1px solid rgba(45,106,79,0.3)',
                  borderRadius: '0px',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview */}
      <div>
        <p className="font-retro text-[12px] uppercase text-sp-amber mb-2">Live Preview (max 120px)</p>
        <div
          className="overflow-hidden"
          style={{ maxHeight: '120px', border: '1px solid rgba(45,106,79,0.4)', background: 'rgba(15,41,30,0.6)', padding: '8px 12px' }}
        >
          <div
            className="text-sm text-sp-cream"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="flex items-center gap-2 px-4 py-1.5 font-retro text-[11px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80"
          style={{ background: 'var(--sp-moss)', border: 'none', borderRadius: '0px' }}
        >
          <Save className="h-3.5 w-3.5" />
          Save Signature
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-1.5 font-retro text-[11px] uppercase text-sp-parchment transition-colors hover:bg-sp-fern/10"
          style={{ border: '1px solid rgba(45,106,79,0.4)', background: 'transparent', borderRadius: '0px' }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Default
        </button>
      </div>

      {/* BBCode Reference */}
      <div className="p-3" style={{ border: '1px solid rgba(45,106,79,0.2)', background: 'rgba(15,41,30,0.3)' }}>
        <p className="font-retro text-[11px] uppercase text-sp-amber mb-2">Quick BBCode Reference</p>
        <div className="flex flex-wrap gap-2 font-mono text-[10px] text-sp-parchment">
          <span>[b]bold[/b]</span>
          <span>[i]italic[/i]</span>
          <span>[u]underline[/u]</span>
          <span>[color=#hex]colored[/color]</span>
          <span>[url]link[/url]</span>
          <span>[img]image[/img]</span>
          <span>[quote]quote[/quote]</span>
          <span>[center]center[/center]</span>
          <span>[spoiler]spoiler[/spoiler]</span>
        </div>
      </div>
    </div>
  )
})

export default SignaturePanel
