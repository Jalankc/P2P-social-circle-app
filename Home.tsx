import HeroCanopy from './home/HeroCanopy'
import ChunkNetwork from './home/ChunkNetwork'
import BuilderTeaser from './home/BuilderTeaser'
import ThreeFaces from './home/ThreeFaces'
import EncryptionManifesto from './home/EncryptionManifesto'
import CommunityCTA from './home/CommunityCTA'

export default function Home() {
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

      <HeroCanopy />
      <ChunkNetwork />
      <BuilderTeaser />
      <ThreeFaces />
      <EncryptionManifesto />
      <CommunityCTA />
    </div>
  )
}
