import { useState } from 'react'
import { Link } from 'react-router-dom'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

type AuthTab = 'url' | 'email' | 'phone'

export default function Login() {
  const [tab, setTab] = useState<AuthTab>('url')
  const [profileUrl, setProfileUrl] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const tabs: { key: AuthTab; label: string }[] = [
    { key: 'url', label: 'Profile URL' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ]

  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center px-4 py-12"
      style={{ background: 'var(--sp-canopy)' }}
    >
      <div className="w-full max-w-[400px]">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <h1
            className="mb-1 text-xl font-bold text-sp-cream"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            SocialCircle.p2p
          </h1>
          <p className="text-sm text-sp-parchment">
            "The network is the people."
          </p>
        </div>

        {/* Login box */}
        <div
          className="p-6"
          style={{
            background: 'var(--sp-canopy)',
            border: '1px solid var(--sp-moss)',
            borderRadius: '0px',
          }}
        >
          {/* Header */}
          <div
            className="mb-5 text-sm uppercase text-sp-amber"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '14px',
              letterSpacing: '0.05em',
              borderBottom: '1px solid var(--sp-moss)',
              paddingBottom: '8px',
            }}
          >
            SIGN IN
          </div>

          {/* Tab buttons */}
          <div className="mb-5 flex">
            {tabs.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex-1 py-2 text-center text-sm transition-colors"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '14px',
                  background: tab === t.key ? 'var(--sp-amber)' : 'transparent',
                  color: tab === t.key ? 'var(--sp-canopy)' : 'var(--sp-parchment)',
                  border: '1px solid var(--sp-moss)',
                  borderRightWidth: i < tabs.length - 1 ? '0px' : '1px',
                  borderRadius: '0px',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sign in with label */}
          <label
            className="mb-3 block text-xs uppercase text-sp-parchment"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '12px' }}
          >
            Sign in with:
          </label>

          {/* Dynamic input based on tab */}
          <div className="mb-4">
            {tab === 'url' && (
              <div>
                <label
                  className="mb-1 block text-xs text-sp-parchment"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '12px' }}
                >
                  Profile URL:
                </label>
                <div className="flex items-center">
                  <span
                    className="px-2 py-2 text-sm text-sp-parchment"
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: '12px',
                      border: '1px solid var(--sp-moss)',
                      borderRight: 'none',
                      background: 'rgba(15, 41, 30, 0.8)',
                    }}
                  >
                    forums.socialcircle.p2p/
                  </span>
                  <input
                    type="text"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="username"
                    className="w-full py-2 text-sm text-sp-cream placeholder:text-sp-parchment/60 focus:outline-none"
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '14px',
                      background: 'var(--sp-canopy)',
                      border: '1px solid var(--sp-moss)',
                      borderRadius: '0px',
                      padding: '8px 12px',
                    }}
                  />
                </div>
              </div>
            )}

            {tab === 'email' && (
              <div>
                <label
                  className="mb-1 block text-xs text-sp-parchment"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '12px' }}
                >
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full py-2 text-sm text-sp-cream placeholder:text-sp-parchment/60 focus:outline-none"
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '14px',
                    background: 'var(--sp-canopy)',
                    border: '1px solid var(--sp-moss)',
                    borderRadius: '0px',
                    padding: '8px 12px',
                  }}
                />
              </div>
            )}

            {tab === 'phone' && (
              <div>
                <label
                  className="mb-1 block text-xs text-sp-parchment"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '12px' }}
                >
                  Phone:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 ___-___-____"
                  className="w-full py-2 text-sm text-sp-cream placeholder:text-sp-parchment/60 focus:outline-none"
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: '12px',
                    background: 'var(--sp-canopy)',
                    border: '1px solid var(--sp-moss)',
                    borderRadius: '0px',
                    padding: '8px 12px',
                  }}
                />
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              className="mb-1 block text-xs text-sp-parchment"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '12px' }}
            >
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full py-2 text-sm text-sp-cream placeholder:text-sp-parchment/60 focus:outline-none"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '14px',
                background: 'var(--sp-canopy)',
                border: '1px solid var(--sp-moss)',
                borderRadius: '0px',
                padding: '8px 12px',
              }}
            />
          </div>

          {/* Sign In button */}
          <button
            className="w-full py-3 text-sm font-semibold uppercase transition-all hover:opacity-90"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              background: 'var(--sp-amber)',
              color: 'var(--sp-canopy)',
              borderRadius: '0px',
              letterSpacing: '0.05em',
            }}
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--sp-moss)' }} />
            <span className="text-xs text-sp-parchment" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              or
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--sp-moss)' }} />
          </div>

          {/* Google Sign In */}
          <button
            className="flex w-full items-center justify-center gap-3 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              background: 'var(--sp-moss)',
              borderRadius: '0px',
            }}
          >
            <GoogleIcon />
            Sign in with Google
          </button>

          {/* Footer links */}
          <div className="mt-5 flex items-center justify-between">
            <Link
              to="/onboarding"
              className="text-sm text-sp-fern transition-colors hover:text-sp-sapling"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px' }}
            >
              Create Account
            </Link>
            <button
              className="text-sm text-sp-parchment transition-colors hover:text-sp-cream"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px' }}
              onClick={() => alert('Password reset flow would open here')}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
