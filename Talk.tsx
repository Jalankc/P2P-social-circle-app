import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ConversationList from './talk/ConversationList'
import ChatThread from './talk/ChatThread'
import EncryptionDrawer from './talk/EncryptionDrawer'
import { demoConversations } from './talk/data'
import type { Conversation } from './talk/types'

export default function Talk() {
  const [conversations] = useState<Conversation[]>(demoConversations)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [typingMap, setTypingMap] = useState<Record<string, string[]>>({})

  const selectedConversation = conversations.find((c) => c.id === selectedId) || null

  function handleSelect(id: string) {
    setSelectedId(id)
    setMobileShowChat(true)

    // Simulate typing after a delay for demo effect
    const conv = conversations.find((c) => c.id === id)
    if (conv && conv.online && Math.random() > 0.5) {
      setTypingMap((prev) => ({ ...prev, [id]: [conv.name] }))
      setTimeout(() => {
        setTypingMap((prev) => ({ ...prev, [id]: [] }))
      }, 3000)
    }
  }

  function handleSendMessage(
    _text: string,
    _encrypted: boolean,
    _selfDestruct: boolean,
    _destructSeconds: number
  ) {
    // In a real app, this would send to the network
    // For demo, the ChatThread handles local optimistic UI
  }

  const typingUsers = selectedId ? typingMap[selectedId] || [] : []

  return (
    <div
      className="relative flex h-[calc(100dvh-64px)] w-full overflow-hidden"
      style={{
        background: 'var(--sp-canopy)',
        boxShadow: 'inset 0 0 120px rgba(26, 11, 46, 0.3)',
      }}
    >
      {/* Left sidebar */}
      <div
        className={`h-full transition-transform duration-300 ${
          mobileShowChat ? 'hidden sm:flex' : 'flex'
        }`}
        style={{ width: '100%' }}
      >
        <div className="h-full w-full sm:w-[320px]">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Right chat area */}
      <div
        className={`h-full flex-1 ${
          mobileShowChat ? 'flex' : 'hidden sm:flex'
        }`}
      >
        {/* Mobile back button */}
        {mobileShowChat && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-3 top-3 z-20 rounded-full p-2 sm:hidden"
            style={{ background: 'rgba(15, 41, 30, 0.85)' }}
            onClick={() => setMobileShowChat(false)}
          >
            <ArrowLeft className="h-5 w-5 text-sp-cream" />
          </motion.button>
        )}

        <ChatThread
          conversation={selectedConversation}
          onOpenEncryption={() => setDrawerOpen(true)}
          onSendMessage={handleSendMessage}
          typingUsers={typingUsers}
        />
      </div>

      {/* Encryption drawer */}
      <EncryptionDrawer
        conversation={selectedConversation}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
