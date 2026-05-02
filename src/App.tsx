import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Feed from './pages/Feed'
import Explore from './pages/Explore'
import Talk from './pages/Talk'
import Build from './pages/Build'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import Store from './pages/Store'
import Commons from './pages/Commons'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/feed" element={<Layout><Feed /></Layout>} />
        <Route path="/explore" element={<Layout><Explore /></Layout>} />
        <Route path="/talk" element={<Layout><Talk /></Layout>} />
        <Route path="/build" element={<Layout><Build /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/store" element={<Layout><Store /></Layout>} />
        <Route path="/commons" element={<Layout><Commons /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/@:handle" element={<Layout><UserProfile /></Layout>} />
        <Route path="/:handle" element={<Layout><Profile /></Layout>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
