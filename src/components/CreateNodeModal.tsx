import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Eye, EyeOff, AlertTriangle, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  generateSeedPhrase,
  validateSeedPhrase,
  seedPhraseToKeyPair,
  publicKeyToDID,
  encryptPrivateKey,
  toHex,
} from '../lib/crypto'
import { openDB, saveIdentity, seedDefaultForum } from '../lib/db'
import type { SeedPhrase } from '../lib/crypto'
import type { Identity } from '../lib/db'

// Handle = first 8 chars of DID method-specific id after 'did:key:z'
function didToHandle(did: string): string {
  return did.replace('did:key:z', '').slice(0, 12)
}

function ProgressBar({ step }: { step: number }) {
  const steps = ['Generate', 'Verify', 'Password', 'Create']
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className="h-5 w-5 flex items-center justify-center font-mono text-[9px]"
              style={{
                border: `1px solid ${i <= step ? 'var(--sp-fern)' : 'rgba(82,183,136,0.3)'}`,
                background: i < step ? 'var(--sp-fern)' : i === step ? 'rgba(82,183,136,0.15)' : 'transparent',
                color: i <= step ? 'var(--sp-cream)' : 'var(--sp-parchment)',
              }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: i <= step ? 'var(--sp-fern)' : 'rgba(82,183,136,0.4)' }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-px mx-1"
              style={{ background: i < step ? 'var(--sp-fern)' : 'rgba(82,183,136,0.2)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Generate ──────────────────────────────────────────────────────────

function StepGenerate({ onNext }: { onNext: (phrase: SeedPhrase) => void }) {
  const [phrase, setPhrase] = useState<SeedPhrase>(() => generateSeedPhrase())
  const [copied, setCopied] = useState(false)

  function regenerate() { setPhrase(generateSeedPhrase()); setCopied(false) }

  function copyToClipboard() {
    navigator.clipboard.writeText(phrase.words.join(' ')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-grotesk text-xl text-sp-cream mb-1">Your recovery phrase</h2>
        <p className="font-mono text-[10px] text-sp-parchment opacity-60">
          Write these 24 words down and keep them safe. They are your only key — there is no password reset.
        </p>
      </div>

      <div
        className="p-4 grid grid-cols-4 gap-2"
        style={{ border: '1px solid rgba(82,183,136,0.2)', background: 'rgba(15,41,30,0.5)' }}
      >
        {phrase.words.map((word, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-sp-parchment opacity-40 w-4 text-right flex-shrink-0">
              {i + 1}.
            </span>
            <span className="font-mono text-[11px] text-sp-cream">{word}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={regenerate}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-sp-parchment hover:text-sp-sapling transition-colors"
          style={{ border: '1px solid rgba(82,183,136,0.3)' }}
        >
          <RefreshCw className="h-3 w-3" /> Regenerate
        </button>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
          style={{ border: '1px solid rgba(82,183,136,0.3)', color: copied ? 'var(--sp-fern)' : 'var(--sp-parchment)' }}
        >
          {copied ? <CheckCircle className="h-3 w-3" /> : null}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-sp-amber" />
          <span className="font-mono text-[9px] text-sp-amber">Never share these words</span>
        </div>
      </div>

      <button
        onClick={() => onNext(phrase)}
        className="w-full flex items-center justify-center gap-2 py-2.5 font-mono text-sm uppercase tracking-wider text-sp-cream hover:bg-sp-fern/20 transition-colors"
        style={{ border: '1px solid var(--sp-fern)', background: 'rgba(82,183,136,0.1)' }}
      >
        I've written it down <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── Step 2: Verify ────────────────────────────────────────────────────────────

function StepVerify({ phrase, onNext, onBack }: { phrase: SeedPhrase; onNext: () => void; onBack: () => void }) {
  // Pick 3 random positions to verify
  const [positions] = useState(() => {
    const pool = Array.from({ length: 24 }, (_, i) => i)
    const chosen: number[] = []
    while (chosen.length < 3) {
      const idx = Math.floor(Math.random() * pool.length)
      chosen.push(pool.splice(idx, 1)[0])
    }
    return chosen.sort((a, b) => a - b)
  })
  const [inputs, setInputs] = useState<Record<number, string>>({})
  const [error, setError] = useState('')

  function verify() {
    const wrong = positions.find(pos => inputs[pos]?.trim().toLowerCase() !== phrase.words[pos])
    if (wrong !== undefined) {
      setError(`Word #${wrong + 1} is incorrect. Check your written copy.`)
      return
    }
    setError('')
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-grotesk text-xl text-sp-cream mb-1">Confirm your phrase</h2>
        <p className="font-mono text-[10px] text-sp-parchment opacity-60">
          Enter the missing words from your written copy to confirm you saved it.
        </p>
      </div>

      <div className="space-y-3">
        {positions.map(pos => (
          <div key={pos} className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-sp-parchment opacity-50 w-16 flex-shrink-0">
              Word #{pos + 1}
            </span>
            <input
              type="text"
              placeholder={`word #${pos + 1}`}
              value={inputs[pos] ?? ''}
              onChange={e => setInputs(prev => ({ ...prev, [pos]: e.target.value }))}
              className="flex-1 px-3 py-1.5 font-mono text-sm text-sp-cream bg-transparent outline-none focus:border-sp-fern transition-colors"
              style={{ border: '1px solid rgba(82,183,136,0.3)' }}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>
          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          <span className="font-mono text-[10px]">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-sp-parchment hover:text-sp-sapling transition-colors"
          style={{ border: '1px solid rgba(82,183,136,0.3)' }}
        >
          Back
        </button>
        <button
          onClick={verify}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-sm uppercase tracking-wider text-sp-cream hover:bg-sp-fern/20 transition-colors"
          style={{ border: '1px solid var(--sp-fern)', background: 'rgba(82,183,136,0.1)' }}
        >
          Verify <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Password ──────────────────────────────────────────────────────────

function StepPassword({ onNext, onBack }: { onNext: (pw: string) => void; onBack: () => void }) {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  function proceed() {
    if (pw.length < 12) { setError('Password must be at least 12 characters.'); return }
    if (pw !== confirm) { setError('Passwords do not match.'); return }
    setError('')
    onNext(pw)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-grotesk text-xl text-sp-cream mb-1">Encryption password</h2>
        <p className="font-mono text-[10px] text-sp-parchment opacity-60">
          This password encrypts your key locally. It never leaves your device.
          Minimum 12 characters.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Choose a strong password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className="w-full px-3 py-2 pr-9 font-mono text-sm text-sp-cream bg-transparent outline-none focus:border-sp-fern transition-colors"
            style={{ border: '1px solid rgba(82,183,136,0.3)' }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sp-parchment opacity-50 hover:opacity-80"
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        <input
          type={show ? 'text' : 'password'}
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && proceed()}
          className="w-full px-3 py-2 font-mono text-sm text-sp-cream bg-transparent outline-none focus:border-sp-fern transition-colors"
          style={{ border: '1px solid rgba(82,183,136,0.3)' }}
        />
        {pw && (
          <div className="h-1 w-full" style={{ background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.2)' }}>
            <div
              className="h-full transition-all"
              style={{
                width: `${Math.min(100, pw.length * 5)}%`,
                background: pw.length < 12 ? 'var(--sp-amber)' : pw.length < 20 ? 'var(--sp-fern)' : 'var(--sp-sapling)',
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>
          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          <span className="font-mono text-[10px]">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-sp-parchment hover:text-sp-sapling transition-colors"
          style={{ border: '1px solid rgba(82,183,136,0.3)' }}
        >
          Back
        </button>
        <button
          onClick={proceed}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-sm uppercase tracking-wider text-sp-cream hover:bg-sp-fern/20 transition-colors"
          style={{ border: '1px solid var(--sp-fern)', background: 'rgba(82,183,136,0.1)' }}
        >
          Set password <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Create ────────────────────────────────────────────────────────────

function StepCreate({
  phrase,
  password,
  onBack,
}: {
  phrase: SeedPhrase
  password: string
  onBack: () => void
}) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [handle, setHandle] = useState('')

  const create = useCallback(async () => {
    setStatus('working')
    try {
      const { publicKey, privateKey } = seedPhraseToKeyPair(phrase)
      const did = publicKeyToDID(publicKey)
      const encKey = await encryptPrivateKey(privateKey, password)
      const now = Date.now()
      const identity: Identity = {
        did,
        publicKey: toHex(publicKey),
        encryptedPrivateKey: JSON.stringify(encKey),
        faces: {
          primary:   { handle: didToHandle(did), bio: '', avatar: '' },
          community: { handle: didToHandle(did), bio: '', avatar: '' },
          anonymous: { handle: 'anon', bio: '', avatar: '' },
        },
        createdAt: now,
        updatedAt: now,
      }
      const db = await openDB()
      await saveIdentity(db, identity)
      await seedDefaultForum(db, did)
      setHandle(didToHandle(did))
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }, [phrase, password])

  if (status === 'done') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 flex items-center justify-center" style={{ border: '1px solid var(--sp-fern)', background: 'rgba(82,183,136,0.1)' }}>
            <CheckCircle className="h-6 w-6 text-sp-fern" />
          </div>
          <h2 className="font-grotesk text-xl text-sp-cream">Node created</h2>
          <p className="font-mono text-[10px] text-sp-parchment opacity-60">
            Your forum is live at <span className="text-sp-fern">@{handle}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(`/@${handle}`)}
          className="w-full flex items-center justify-center gap-2 py-2.5 font-mono text-sm uppercase tracking-wider text-sp-cream hover:bg-sp-fern/20 transition-colors"
          style={{ border: '1px solid var(--sp-fern)', background: 'rgba(82,183,136,0.1)' }}
        >
          Open my forum <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-grotesk text-xl text-sp-cream mb-1">Create your node</h2>
        <p className="font-mono text-[10px] text-sp-parchment opacity-60">
          Your keypair will be derived from the seed phrase and encrypted with your password.
          This takes a moment due to PBKDF2 key stretching.
        </p>
      </div>

      <div className="space-y-2 p-4" style={{ border: '1px solid rgba(82,183,136,0.15)', background: 'rgba(27,67,50,0.3)' }}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-sp-parchment opacity-50">KDF</span>
          <span className="font-mono text-[10px] text-sp-cream">PBKDF2-SHA512 (210k rounds)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-sp-parchment opacity-50">Storage</span>
          <span className="font-mono text-[10px] text-sp-cream">AES-256-GCM, local only</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-sp-parchment opacity-50">Identity</span>
          <span className="font-mono text-[10px] text-sp-cream">Ed25519 / did:key</span>
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>
          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          <span className="font-mono text-[10px]">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={status === 'working'}
          className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-sp-parchment hover:text-sp-sapling transition-colors disabled:opacity-30"
          style={{ border: '1px solid rgba(82,183,136,0.3)' }}
        >
          Back
        </button>
        <button
          onClick={create}
          disabled={status === 'working'}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-sm uppercase tracking-wider text-sp-cream hover:bg-sp-fern/20 transition-colors disabled:opacity-50"
          style={{ border: '1px solid var(--sp-fern)', background: 'rgba(82,183,136,0.1)' }}
        >
          {status === 'working' ? (
            <><RefreshCw className="h-4 w-4 animate-spin" /> Generating keys…</>
          ) : (
            <><Leaf className="h-4 w-4" /> Plant my node</>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function CreateNodeModal({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0)
  const [phrase, setPhrase] = useState<SeedPhrase | null>(null)
  const [password, setPassword] = useState('')

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,20,12,0.92)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="w-full max-w-[540px] p-6"
        style={{ background: 'var(--sp-canopy)', border: '1px solid rgba(82,183,136,0.3)' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="h-4 w-4 text-sp-fern" />
          <span className="font-retro text-sm text-sp-fern uppercase tracking-widest">Create Your Node</span>
        </div>

        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15 }}
          >
            {step === 0 && (
              <StepGenerate onNext={(p) => { setPhrase(p); setStep(1) }} />
            )}
            {step === 1 && phrase && (
              <StepVerify phrase={phrase} onNext={() => setStep(2)} onBack={() => setStep(0)} />
            )}
            {step === 2 && (
              <StepPassword onNext={(pw) => { setPassword(pw); setStep(3) }} onBack={() => setStep(1)} />
            )}
            {step === 3 && phrase && (
              <StepCreate phrase={phrase} password={password} onBack={() => setStep(2)} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
