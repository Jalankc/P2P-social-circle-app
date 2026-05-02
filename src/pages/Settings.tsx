import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SettingsNav, { type TabKey } from './settings/SettingsNav'
import ProfileFacesPanel from './settings/ProfileFacesPanel'
import SignaturePanel from './settings/SignaturePanel'
import EncryptionPanel from './settings/EncryptionPanel'
import ChunksBackupPanel from './settings/ChunksBackupPanel'
import FriendsCirclesPanel from './settings/FriendsCirclesPanel'
import PrivacyPanel from './settings/PrivacyPanel'
import ContentAdvisoryPanel from './settings/ContentAdvisoryPanel'
import NotificationsPanel from './settings/NotificationsPanel'
import ClawbotPanel from './settings/ClawbotPanel'
import AppearancePanel from './settings/AppearancePanel'
import NetworkP2PPanel from './settings/NetworkP2PPanel'
import DeveloperPanel from './settings/DeveloperPanel'

const panels: Record<TabKey, React.ComponentType> = {
  'profile-faces': ProfileFacesPanel,
  'signature': SignaturePanel,
  'encryption': EncryptionPanel,
  'chunks': ChunksBackupPanel,
  'friends': FriendsCirclesPanel,
  'privacy': PrivacyPanel,
  'content-advisory': ContentAdvisoryPanel,
  'notifications': NotificationsPanel,
  'clawbot': ClawbotPanel,
  'appearance': AppearancePanel,
  'network': NetworkP2PPanel,
  'developer': DeveloperPanel,
}

const tabVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile-faces')

  const handleTabChange = useCallback((key: TabKey) => {
    setActiveTab(key)
  }, [])

  const ActivePanel = panels[activeTab]

  return (
    <div
      className="min-h-[calc(100dvh-64px)] px-4 py-8 md:px-6 md:py-16"
      style={{ background: 'var(--sp-canopy)' }}
    >
      <div className="mx-auto flex max-w-[1000px] flex-col md:flex-row gap-6 md:gap-8">
        <SettingsNav active={activeTab} onChange={handleTabChange} />

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="rounded-xl p-6"
              style={{
                background: 'rgba(26, 11, 46, 0.15)',
                border: '1px solid rgba(82, 183, 136, 0.15)',
              }}
            >
              <ActivePanel />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
