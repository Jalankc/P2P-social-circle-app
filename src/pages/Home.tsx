import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HeroCanopy from './home/HeroCanopy'
import ChunkNetwork from './home/ChunkNetwork'
import BuilderTeaser from './home/BuilderTeaser'
import ThreeFaces from './home/ThreeFaces'
import EncryptionManifesto from './home/EncryptionManifesto'
import CommunityCTA from './home/CommunityCTA'
import CreateNodeModal from '../components/CreateNodeModal'
import { openDB, getIdentity } from '../lib/db'

function didToHandle(did: string): string {
  return did.replace('did:key:z', '').slice(0, 12)
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    openDB()
      .then((db) => getIdentity(db))
      .then((identity) => {
        if (identity) navigate(`/@${didToHandle(identity.did)}`, { replace: true })
      })
      .catch(() => {})
  }, [navigate])

  return (
    <div className="relative">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.05]"
        style={{
          backgroundImage: 'url(/solar-punk-ui-texture.png)',
          backgroundRepeat: 'repeat',
        }}
      />

      <HeroCanopy onCreateNode={() => setShowModal(true)} />
      <ChunkNetwork />
      <BuilderTeaser />
      <ThreeFaces />
      <EncryptionManifesto />
      <CommunityCTA />

      <AnimatePresence>
        {showModal && <CreateNodeModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
