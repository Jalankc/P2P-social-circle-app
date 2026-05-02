import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="min-h-[calc(100dvh-64px)]"
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
