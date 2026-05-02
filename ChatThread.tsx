import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Lock,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Check,
  CheckCheck,
  Timer,
  Radio,
  Mic,
  Flame,
} from 'lucide-react'
import type { Conversation, Message } from './types'
import { scrambleChars } from './data'
import MatrixRain from './MatrixRain'

interface ChatThreadProps {
  conversation: Conversation | null
  onOpenEncryption: () => void
  onSendMessage: (text: string, encrypted: boolean, selfDestruct: boolean, destructSeconds: number) => void
  typingUsers: string[]
}

/* ------------------------------------------------------------------ */
//  Self-destruct timer hook
function useSelfDestruct(initialSeconds: number, onExpire: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [expired, setExpired] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (expired || seconds <= 0) return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setExpired(true)
          onExpire()
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [expired, onExpire])

  return { seconds, expired }
}

/* ------------------------------------------------------------------ */
//  Scramble text effect
function useScramble(original: string, active: boolean, duration = 500) {
  const [display, setDisplay] = useState(original)

  useEffect(() => {
    if (!active) {
      setDisplay(original)
      return
    }
    const chars = scrambleChars
    let start = Date.now()
    let raf: number

    function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      let out = ''
      for (let i = 0; i < original.length; i++) {
        if (original[i] === ' ') {
          out += ' '
        } else if (progress > i / original.length) {
          out += original[i]
        } else {
          out += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      setDisplay(out)
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, original, duration])

  return display
}

/* ------------------------------------------------------------------ */
//  Typing dots
const TypingDots = memo(function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-sp-parchment"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
})

/* ------------------------------------------------------------------ */
//  Lock pulse icon
const LockPulse = memo(function LockPulse() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <Lock className="h-3 w-3 text-crypt-glow" />
      <span className="absolute inset-0 rounded-full border border-crypt-glow animate-pulse-ring" />
    </div>
  )
})

/* ------------------------------------------------------------------ */
//  Single message bubble
function MessageBubble({
  message,
  isMe,
}: {
  message: Message
  isMe: boolean
}) {
  const [dissolved, setDissolved] = useState(false)
  const [scrambling, setScrambling] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const destructSeconds = message.selfDestructSeconds ?? 30
  const { seconds, expired } = useSelfDestruct(
    destructSeconds,
    useCallback(() => {
      setScrambling(true)
      setTimeout(() => {
        setCollapsed(true)
        setTimeout(() => setDissolved(true), 400)
      }, 500)
    }, [])
  )

  const scrambleText = useScramble(message.text, scrambling, 500)

  if (dissolved) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
      >
        <div className="flex items-center gap-1.5 rounded-lg px-4 py-2" style={{ background: 'rgba(255, 107, 53, 0.08)', border: '1px dashed rgba(255, 107, 53, 0.3)' }}>
          <Flame className="h-3.5 w-3.5 text-crypt-ember" />
          <span className="text-[13px] italic text-crypt-ember">This message has dissolved</span>
        </div>
      </motion.div>
    )
  }

  const isSelfDestruct = message.selfDestruct && !expired

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={
        collapsed
          ? { opacity: 0, height: 0, marginBottom: 0, scale: 0.9 }
          : { opacity: 1, y: 0, scale: 1, height: 'auto' }
      }
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className="relative max-w-[70%] rounded-2xl px-4 py-3"
        style={{
          background: isMe
            ? 'rgba(82, 183, 136, 0.2)'
            : 'rgba(45, 106, 79, 0.3)',
          border: isSelfDestruct
            ? '1px solid rgba(255, 107, 53, 0.5)'
            : isMe
              ? '1px solid rgba(149, 213, 178, 0.3)'
              : '1px solid rgba(82, 183, 136, 0.2)',
          borderBottomRightRadius: isMe ? '4px' : undefined,
          borderBottomLeftRadius: !isMe ? '4px' : undefined,
        }}
      >
        {/* Self-destruct timer badge */}
        {isSelfDestruct && (
          <div
            className="absolute -top-2.5 -right-2 flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-medium"
            style={{ background: 'var(--crypt-ember)', color: 'white' }}
          >
            <Timer className="h-3 w-3" />
            {Math.floor(seconds / 60).toString().padStart(2, '0')}:
            {(seconds % 60).toString().padStart(2, '0')}
          </div>
        )}

        {/* Self-destruct diagonal stripe overlay */}
        {isSelfDestruct && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
            style={{
              borderBottomRightRadius: isMe ? '4px' : undefined,
              borderBottomLeftRadius: !isMe ? '4px' : undefined,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(255, 107, 53, 0.05) 10px, rgba(255, 107, 53, 0.05) 20px)',
              }}
            />
          </div>
        )}

        {/* Text content */}
        <p className="text-[15px] leading-relaxed text-sp-cream relative z-10" style={{ wordBreak: 'break-word' }}>
          {scrambling ? scrambleText : message.text}
        </p>

        {/* Timestamp & status row */}
        <div className="mt-1 flex items-center justify-end gap-1.5">
          {message.encrypted && !isMe && (
            <span title="E2E encrypted" className="relative inline-flex">
              <LockPulse />
            </span>
          )}
          <span className="text-[11px] text-sp-parchment">{message.timestamp}</span>
          {isMe && (
            <span className="text-sp-parchment">
              {message.read ? (
                <CheckCheck className="h-3.5 w-3.5 text-sp-sapling" />
              ) : message.delivered ? (
                <CheckCheck className="h-3.5 w-3.5" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
//  Composer
const SELF_DESTRUCT_OPTIONS = [
  { label: '5s', value: 5 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
  { label: '1h', value: 3600 },
]

function Composer({
  onSend,
  defaultEncrypted,
}: {
  onSend: (text: string, encrypted: boolean, selfDestruct: boolean, destructSeconds: number) => void
  defaultEncrypted: boolean
}) {
  const [text, setText] = useState('')
  const [encrypted, setEncrypted] = useState(defaultEncrypted)
  const [selfDestruct, setSelfDestruct] = useState(false)
  const [destructSeconds, setDestructSeconds] = useState(30)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    if (!text.trim()) return
    onSend(text.trim(), encrypted, selfDestruct, destructSeconds)
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = '44px'
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function autoResize() {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = '44px'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }

  return (
    <div className="border-t border-sp-moss/15 p-4" style={{ background: 'rgba(15, 41, 30, 0.6)' }}>
      {/* Input row */}
      <div className="flex items-end gap-2">
        <button className="rounded-full p-2 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream flex-shrink-0">
          <Paperclip className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              autoResize()
            }}
            onKeyDown={handleKeyDown}
            placeholder={encrypted ? 'Type an encrypted message...' : 'Type a message...'}
            rows={1}
            className="w-full resize-none rounded-lg py-2.5 px-3 text-[15px] text-sp-cream placeholder:text-sp-parchment/60 outline-none"
            style={{
              background: 'rgba(15, 41, 30, 0.8)',
              border: '1px solid rgba(82, 183, 136, 0.3)',
              minHeight: '44px',
              maxHeight: '120px',
            }}
          />
        </div>
        <button className="rounded-full p-2 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream flex-shrink-0">
          <Smile className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream flex-shrink-0">
          <Mic className="h-5 w-5" />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors"
          style={{
            background: text.trim() ? 'var(--sp-moss)' : 'rgba(232, 224, 204, 0.3)',
          }}
        >
          <Send className="h-4 w-4 text-white" />
        </motion.button>
      </div>

      {/* Self-destruct toggle row */}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {/* Encryption toggle */}
        <button
          onClick={() => setEncrypted((v) => !v)}
          className="flex items-center gap-2 text-[13px] text-sp-parchment"
        >
          <div
            className="relative h-5 w-9 rounded-full transition-colors"
            style={{ background: encrypted ? 'var(--crypt-purple)' : 'rgba(232, 224, 204, 0.3)' }}
          >
            <motion.div
              animate={{ x: encrypted ? 16 : 2 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              className="absolute top-1 h-3 w-3 rounded-full bg-white"
            />
          </div>
          <Lock className="h-3.5 w-3.5" />
          Encrypt
        </button>

        {/* Self-destruct toggle */}
        <button
          onClick={() => setSelfDestruct((v) => !v)}
          className="flex items-center gap-2 text-[13px] text-sp-parchment"
        >
          <div
            className="relative h-5 w-9 rounded-full transition-colors"
            style={{ background: selfDestruct ? 'var(--crypt-ember)' : 'rgba(232, 224, 204, 0.3)' }}
          >
            <motion.div
              animate={{ x: selfDestruct ? 16 : 2 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              className="absolute top-1 h-3 w-3 rounded-full bg-white"
            />
          </div>
          <Timer className="h-3.5 w-3.5" />
          Self-destruct
        </button>

        {/* Timer selector */}
        <AnimatePresence>
          {selfDestruct && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-1 overflow-hidden"
            >
              {SELF_DESTRUCT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDestructSeconds(opt.value)}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
                  style={{
                    background: destructSeconds === opt.value ? 'var(--crypt-ember)' : 'rgba(15, 41, 30, 0.6)',
                    color: destructSeconds === opt.value ? 'white' : 'var(--sp-parchment)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
//  Empty state
function EmptyChatState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center" style={{ position: 'relative', zIndex: 2 }}>
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full" style={{ background: 'rgba(124, 58, 237, 0.1)' }}>
        <img src="/encryption-shield.png" alt="Encryption shield" className="h-14 w-14 object-contain" />
      </div>
      <h3 className="font-display text-xl font-bold text-sp-cream mb-2">No servers. Only seeds.</h3>
      <p className="text-sm text-sp-parchment max-w-xs leading-relaxed">
        Select a conversation to start an end-to-end encrypted chat. Your keys never leave your device.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
//  ChatThread main component
export default function ChatThread({
  conversation,
  onOpenEncryption,
  onSendMessage,
  typingUsers,
}: ChatThreadProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (conversation) {
      setLocalMessages(conversation.messages)
    }
  }, [conversation?.id])

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [localMessages.length, typingUsers.length])

  function handleSend(text: string, encrypted: boolean, selfDestruct: boolean, destructSeconds: number) {
    const newMessage: Message = {
      id: `local-${Date.now()}`,
      senderId: 'me',
      text,
      type: 'text',
      timestamp: 'Just now',
      encrypted,
      selfDestruct,
      selfDestructSeconds: selfDestruct ? destructSeconds : undefined,
      read: false,
      delivered: false,
    }
    setLocalMessages((prev) => [...prev, newMessage])
    onSendMessage(text, encrypted, selfDestruct, destructSeconds)

    // Simulate delivery after 1s
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, delivered: true } : m))
      )
    }, 1000)

    // Simulate read after 2s
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, read: true } : m))
      )
    }, 2500)
  }

  const isTyping = typingUsers.length > 0 && conversation !== null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="relative flex h-full flex-1 flex-col overflow-hidden"
      style={{ background: '#0f291e' }}
    >
      {/* Matrix rain background */}
      <MatrixRain />

      {conversation ? (
        <>
          {/* Chat Header */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex h-16 flex-shrink-0 items-center gap-3 border-b border-sp-moss/15 px-4"
            style={{ background: 'rgba(15, 41, 30, 0.85)', backdropFilter: 'blur(8px)' }}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={conversation.avatar}
                alt={conversation.name}
                className="h-10 w-10 rounded-full object-cover"
                style={{ border: `2px solid ${conversation.online ? 'var(--sp-fern)' : 'rgba(232, 224, 204, 0.3)'}` }}
              />
              {conversation.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sp-canopy bg-sp-sapling" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-medium text-sp-cream truncate">{conversation.name}</div>
              <div className="flex items-center gap-2">
                {conversation.online ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sp-sapling opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-sp-sapling" />
                    </span>
                    <span className="text-xs text-sp-fern">Online</span>
                  </>
                ) : (
                  <span className="text-xs text-sp-parchment">
                    Last seen {conversation.lastSeen || 'a while ago'}
                  </span>
                )}
                {conversation.encrypted && (
                  <span className="flex items-center gap-1 text-xs text-sp-fern">
                    <Radio className="h-3 w-3" />
                    Connected via {conversation.peerCount} peers
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {conversation.encrypted && (
                <button
                  onClick={onOpenEncryption}
                  className="rounded-full p-2 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream"
                  title="Encryption details"
                >
                  <Shield className="h-4 w-4" />
                </button>
              )}
              <button className="rounded-full p-2 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream">
                <Video className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 text-sp-parchment transition-colors hover:bg-sp-moss hover:text-sp-cream">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Message Thread */}
          <div
            ref={threadRef}
            className="relative z-10 flex-1 overflow-y-auto p-5"
          >
            {/* Date divider */}
            {localMessages.length > 0 && (
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-sp-moss/15" />
                <span className="text-xs text-sp-parchment">Today</span>
                <div className="h-px flex-1 bg-sp-moss/15" />
              </div>
            )}

            {/* Messages */}
            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {localMessages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(idx * 0.05, 0.6),
                      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
                    }}
                  >
                    <MessageBubble message={msg} isMe={msg.senderId === 'me'} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="flex flex-col gap-1 mb-3"
                  >
                    <div
                      className="inline-flex w-fit items-center rounded-full px-4 py-3"
                      style={{ background: 'rgba(45, 106, 79, 0.2)' }}
                    >
                      <TypingDots />
                    </div>
                    <span className="text-xs text-sp-parchment">
                      {conversation.name} is typing...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Composer */}
          <div className="relative z-10 flex-shrink-0">
            <Composer onSend={handleSend} defaultEncrypted={conversation.encrypted} />
          </div>
        </>
      ) : (
        <EmptyChatState />
      )}
    </motion.div>
  )
}
