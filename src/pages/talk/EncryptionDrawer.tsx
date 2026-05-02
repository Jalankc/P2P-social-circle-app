import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Check, X, Lock, Radio } from 'lucide-react'
import type { Conversation } from './types'

interface EncryptionDrawerProps {
  conversation: Conversation | null
  open: boolean
  onClose: () => void
}

export default function EncryptionDrawer({ conversation, open, onClose }: EncryptionDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(15, 41, 30, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed top-0 right-0 z-50 h-full w-[360px] max-w-[90vw] border-l border-sp-moss overflow-y-auto"
            style={{ background: 'var(--sp-canopy)' }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-lg font-medium text-sp-cream">Encryption Details</h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Shield */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
                    <Shield className="h-10 w-10 text-crypt-purple" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="absolute inset-0 rounded-full border-2 border-crypt-glow animate-pulse-ring" />
                </div>
              </div>

              {conversation ? (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="rounded-lg p-4" style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-crypt-glow" />
                      <span className="text-sm font-medium text-crypt-glow">End-to-End Encrypted</span>
                    </div>
                    <p className="text-xs text-sp-parchment leading-relaxed">
                      This conversation is end-to-end encrypted. Neither SocialCircle nor any intermediary can read your messages.
                    </p>
                  </div>

                  {/* Fingerprint */}
                  <div>
                    <label className="text-xs font-medium text-sp-parchment uppercase tracking-wider mb-2 block">
                      Public Key Fingerprint
                    </label>
                    <div className="rounded-md p-3 font-mono text-xs leading-relaxed break-all" style={{ background: 'rgba(0, 255, 65, 0.08)', color: 'var(--crypt-terminal)', border: '1px solid rgba(0, 255, 65, 0.15)' }}>
                      {conversation.fingerprint || 'No fingerprint available'}
                    </div>
                  </div>

                  {/* Protocol */}
                  <div>
                    <label className="text-xs font-medium text-sp-parchment uppercase tracking-wider mb-2 block">
                      Protocol
                    </label>
                    <div className="flex items-center gap-2 rounded-md px-3 py-2" style={{ background: 'rgba(82, 183, 136, 0.1)', border: '1px solid rgba(82, 183, 136, 0.2)' }}>
                      <Radio className="h-4 w-4 text-sp-fern" />
                      <span className="text-sm text-sp-cream">Signal Protocol (Double Ratchet)</span>
                    </div>
                  </div>

                  {/* Verification */}
                  <div>
                    <label className="text-xs font-medium text-sp-parchment uppercase tracking-wider mb-2 block">
                      Verification Status
                    </label>
                    <div className="flex items-center gap-2">
                      {conversation.verified ? (
                        <>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                          <span className="text-sm text-success font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                            <span className="h-2 w-2 rounded-full bg-warning" />
                          </span>
                          <span className="text-sm text-warning font-medium">Unverified</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Local storage note */}
                  <div className="rounded-lg p-3" style={{ background: 'rgba(15, 41, 30, 0.6)', border: '1px solid rgba(82, 183, 136, 0.1)' }}>
                    <p className="text-xs text-sp-parchment leading-relaxed">
                      Keys are stored on your device only. No cloud backup. If you lose your device, encrypted conversations cannot be recovered.
                    </p>
                  </div>

                  {/* Verify button */}
                  {!conversation.verified && (
                    <button
                      className="w-full rounded-full py-2.5 text-sm font-medium text-sp-bark transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: 'var(--sp-amber)' }}
                    >
                      Verify Trust in Person
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-sp-parchment text-center">Select a conversation to view encryption details.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
