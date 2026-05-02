import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Upload,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Eye,
  ChevronRight,
  Globe,
  FileText,
  Shield,
  BookOpen,
  UserPlus,
} from "lucide-react"

/* ── Types ── */
interface ContentProfile {
  name: string
  type: string
  pic: string
}

interface HighProfileConnection {
  type: string
  name: string
  handle: string
}

interface OnboardingData {
  tosAgreed: boolean
  touAgreed: boolean
  p2pUnderstood: boolean
  seedingAgreed: boolean
  urlName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  displayName: string
  birthday: { month: string; day: string; year: string }
  birthdayPrivacy: string
  relationships: string[]
  spouses: string
  fiances: string
  partners: string
  polyamoryType: string
  referredBy: string
  relatedTo: string
  invitedBy: string
  contentTypes: string[]
  musicTaste: string
  politicalAffiliation: string
  likes: string
  dislikes: string
  mainProfilePic: string
  contentProfiles: ContentProfile[]
  anonymousNickname: string
  forumVisibility: string
  backgroundStyle: string
  backgroundColor: string
  transparency: number
  customRules: string
  ruleChecks: boolean[]
  highProfileConnections: HighProfileConnection[]
}

const initialData: OnboardingData = {
  tosAgreed: false,
  touAgreed: false,
  p2pUnderstood: false,
  seedingAgreed: false,
  urlName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  displayName: "",
  birthday: { month: "", day: "", year: "" },
  birthdayPrivacy: "private",
  relationships: [],
  spouses: "",
  fiances: "",
  partners: "",
  polyamoryType: "",
  referredBy: "",
  relatedTo: "",
  invitedBy: "",
  contentTypes: [],
  musicTaste: "",
  politicalAffiliation: "",
  likes: "",
  dislikes: "",
  mainProfilePic: "",
  contentProfiles: [],
  anonymousNickname: "",
  forumVisibility: "public",
  backgroundStyle: "solid",
  backgroundColor: "#0f291e",
  transparency: 70,
  customRules: "",
  ruleChecks: [false, false, false, false, false],
  highProfileConnections: [],
}

/* ── Constants ── */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))
const YEARS = Array.from({ length: 100 }, (_, i) => String(2025 - i))
const CONTENT_TYPES = [
  { icon: "📝", label: "Blogging" },
  { icon: "📹", label: "Vblogging" },
  { icon: "🎭", label: "VTubing" },
  { icon: "🎬", label: "Short Reels" },
  { icon: "🎵", label: "Music" },
  { icon: "🎨", label: "Digital Art" },
  { icon: "💻", label: "Code/tech" },
  { icon: "📸", label: "Photography" },
  { icon: "🎮", label: "Gaming" },
  { icon: "🌿", label: "Gardening" },
  { icon: "🍳", label: "Cooking" },
  { icon: "🧵", label: "Crafts" },
  { icon: "💬", label: "Discussion" },
  { icon: "📚", label: "Reviews" },
]
const CONNECTION_TYPES = [
  "Actor", "Celebrity", "Athlete", "Author", "Musician",
  "Influencer", "Scientist", "Developer",
]
const PROFILE_TYPES = ["Blogging", "Vblogging", "VTubing", "Art", "Code", "Music", "Other"]
const RESERVED_WORDS = ["admin", "root", "system", "api", "test", "null", "www", "ftp", "mail"]

/* ── Animation variants ── */
const stepVariants = {
  enter: { x: 20, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
}

const easeSnap = [0.4, 0, 0.2, 1] as [number, number, number, number]

/* ── Helpers ── */
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function getPasswordStrength(pw: string): number {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 5)
}

function validateUrl(url: string): string | null {
  if (!url) return "URL is required"
  if (url.length < 3) return "Must be at least 3 characters"
  if (url.length > 30) return "Must be at most 30 characters"
  if (!/^[a-zA-Z0-9_-]+$/.test(url)) return "Only letters, numbers, underscores, hyphens"
  if (RESERVED_WORDS.includes(url.toLowerCase())) return "Reserved word"
  if (/^[0-9]/.test(url)) return "Must start with a letter"
  return null
}

/* ── Main Component ── */
export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [urlStatus, setUrlStatus] = useState<"idle" | "available" | "taken">("idle")
  const [seedProgress, setSeedProgress] = useState(0)
  const [isSeeding, setIsSeeding] = useState(false)

  const update = useCallback(<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const goNext = () => setStep((s) => Math.min(s + 1, 10))
  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  /* Seeding animation */
  useEffect(() => {
    if (step === 10 && isSeeding) {
      const interval = setInterval(() => {
        setSeedProgress((p) => {
          if (p >= 100) {
            clearInterval(interval)
            return 100
          }
          return p + 2
        })
      }, 60)
      return () => clearInterval(interval)
    }
  }, [step, isSeeding])

  /* ── Validation ── */
  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.tosAgreed && data.touAgreed && data.p2pUnderstood && data.seedingAgreed
      case 2:
        return (
          !validateUrl(data.urlName) &&
          urlStatus === "available" &&
          data.password.length >= 8 &&
          data.password === data.confirmPassword &&
          !!(data.email || data.phone)
        )
      case 3:
        return data.displayName.trim().length > 0
      case 4:
        return data.contentTypes.length >= 1 && data.contentTypes.length <= 5
      case 5:
        return true
      case 6:
        return data.mainProfilePic.length > 0 && data.anonymousNickname.trim().length > 0
      case 7:
      case 8:
      case 9:
        return true
      default:
        return true
    }
  }

  /* ── Step 0: Landing Gate ── */
  const LandingGate = () => (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="font-display text-[48px] font-bold text-sp-cream tracking-tight leading-tight mb-2">
        SocialCircle.p2p
      </h1>
      <p className="font-retro text-[16px] text-sp-fern tracking-wider mb-10">
        The network is the people.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          onClick={goNext}
          className="bg-sp-amber text-sp-bark font-body font-semibold text-sm uppercase tracking-widest px-8 py-3 rounded-[2px] border-none hover:bg-sp-honey transition-colors"
          style={{ boxShadow: "none" }}
        >
          Create Account
        </Button>
        <Button
          className="bg-transparent text-sp-fern font-body font-medium text-sm px-8 py-3 rounded-[2px] border border-sp-moss/40 hover:bg-sp-moss/20 transition-colors"
          style={{ boxShadow: "none" }}
        >
          Sign In
        </Button>
      </div>
      <p className="text-sp-parchment/60 text-xs font-body mb-3">
        By joining, you agree to our Terms of Service and Terms of Use.
      </p>
      <div className="flex gap-4">
        <button className="text-sp-parchment/50 font-mono text-[11px] hover:text-sp-amber transition-colors underline">
          Read ToS
        </button>
        <button className="text-sp-parchment/50 font-mono text-[11px] hover:text-sp-amber transition-colors underline">
          Read ToU
        </button>
      </div>
    </div>
  )

  /* ── Step 1: Terms Agreement ── */
  const TermsStep = () => {
    const allChecked = data.tosAgreed && data.touAgreed && data.p2pUnderstood && data.seedingAgreed
    const tosText = `TERMS OF SERVICE — SocialCircle.p2p
\nEffective Date: EarthCycle 2025
\n1. P2P DISTRIBUTION
SocialCircle operates on a peer-to-peer mesh network. Your profile data, posts, and media are chunked and distributed across nodes operated by other members. There are no central servers. By using this service, you consent to your data being stored on peers' devices under end-to-end encryption.
\n2. SEEDING OBLIGATIONS
Every user agrees to maintain an active node that seeds at least 10% of the content they consume. Failure to seed may result in reduced bandwidth priority and restricted access to high-resolution media.
\n3. NO CENTRAL AUTHORITY
There is no single company, server, or jurisdiction governing SocialCircle. Moderation is community-driven through reputation-weighted voting. You acknowledge that content removal is performed by distributed consensus, not by a central administrator.
\n4. ENCRYPTION & PRIVACY
All direct messages are encrypted with AES-256. Profile data is encrypted at rest on peer nodes. However, public posts are plaintext and indexable by the network. You are responsible for classifying your content correctly.
\n5. CONTENT OWNERSHIP
You retain full ownership of content you create. By posting, you grant the network a license to distribute, cache, and translate your content across the mesh. This license is irrevocable for content that has been seeded to 3+ peers.
\n6. TERMINATION
You may delete your profile at any time. Deletion requests propagate through the mesh and are honored by peers within 72 hours. Chunks that have been backed up by friends may persist until those friends also purge.
\n7. LIABILITY
SocialCircle.p2p is provided as-is. No warranty, express or implied. You agree to hold harmless all peer operators, developers, and contributors.`

    const touText = `TERMS OF USE — SocialCircle.p2p
\n1. ACCEPTABLE CONTENT
You may not post content that promotes violence, doxxing, or harassment of individuals. NSFW content must be appropriately labeled with [NSFW] tags. Illegal content under your local jurisdiction is prohibited.
\n2. ANONYMITY BOUNDARIES
Anonymous profiles are permitted for privacy-sensitive discussions. However, using anonymity to evade bans, spam, or harass is prohibited. Anonymous nicknames may only be changed once per EarthCycle.
\n3. AUTOMATED POSTING
Bots and Clawbots (AI agents) may interact with the network only if attached to a biological account and funded with Y-credits. Unattributed automated posting is prohibited without Y-credit payment.
\n4. KARMA & REPUTATION
Karma is spendable but non-transferable between users. Karma accrues through contribution (Material, Social, Innovation, Ecology). Extractive behavior (high Social, low other dimensions) may incur friction penalties.
\n5. ECHO CHAMBER PREVENTION
A portion of your feed (15-20%) will be curated from heterodox sources and opposing viewpoints. You may reduce this to 10% but disabling it entirely will remove your eligibility to appear in others' heterodox feeds.
\n6. FORUM GOVERNANCE
As a forum owner, you may set custom rules, assign ranks (SA, A, SM, M, U), and designate a legacy inheritor. You are responsible for enforcing your forum's rules within the bounds of the global ToS.
\n7. DISPUTE RESOLUTION
Disputes between users are resolved through circle-mediated arbitration. If arbitration fails, the community pulse algorithm may temporarily limit visibility of disputed content until consensus is reached.`

    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
          Terms of Service & Terms of Use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-sp-moss/30 bg-sp-canopy/80 p-3">
            <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Terms of Service
            </h3>
            <div className="h-40 overflow-y-auto border border-sp-moss/20 p-3 text-xs text-sp-parchment/80 font-body leading-relaxed whitespace-pre-line">
              {tosText}
            </div>
          </div>
          <div className="border border-sp-moss/30 bg-sp-canopy/80 p-3">
            <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Terms of Use
            </h3>
            <div className="h-40 overflow-y-auto border border-sp-moss/20 p-3 text-xs text-sp-parchment/80 font-body leading-relaxed whitespace-pre-line">
              {touText}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          {[
            { key: "tosAgreed", label: "I have read and agree to the Terms of Service" },
            { key: "touAgreed", label: "I have read and agree to the Terms of Use" },
            { key: "p2pUnderstood", label: "I understand that my data is distributed P2P (not on central servers)" },
            { key: "seedingAgreed", label: "I agree to seed at least 10% of content I consume" },
          ].map((item) => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={data[item.key as keyof OnboardingData] as boolean}
                onCheckedChange={(checked) => update(item.key as keyof OnboardingData, checked as boolean)}
                className="mt-0.5 border-sp-moss/40 data-[state=checked]:bg-sp-amber data-[state=checked]:border-sp-amber data-[state=checked]:text-sp-bark"
              />
              <span className="text-sm text-sp-cream/80 font-body group-hover:text-sp-cream transition-colors">
                {item.label}
              </span>
            </label>
          ))}
        </div>
        <Button
          onClick={goNext}
          disabled={!allChecked}
          className="mt-4 bg-sp-amber text-sp-bark font-body font-semibold text-sm uppercase tracking-widest px-8 py-3 rounded-[2px] border-none hover:bg-sp-honey transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-start"
          style={{ boxShadow: "none" }}
        >
          I Agree & Continue
        </Button>
      </div>
    )
  }

  /* ── Step 2: Account Credentials ── */
  const CredentialsStep = () => {
    const urlError = validateUrl(data.urlName)
    const strength = getPasswordStrength(data.password)
    const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Excellent"]
    const strengthColors = ["bg-sp-danger/60", "bg-warning/60", "bg-sp-fern/60", "bg-sp-sapling", "bg-sp-amber"]

    const checkUrl = () => {
      if (!urlError) {
        // Simulate availability check
        setUrlStatus(data.urlName.length > 5 ? "available" : "taken")
      }
    }

    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
          Create Your Account
        </h2>
        {/* URL */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm text-sp-cream/80">Profile URL</label>
          <div className="flex gap-2 items-center">
            <span className="font-mono text-xs text-sp-parchment/60 whitespace-nowrap">
              forums.socialcircle.p2p/
            </span>
            <Input
              value={data.urlName}
              onChange={(e) => {
                setData((p) => ({ ...p, urlName: e.target.value }))
                setUrlStatus("idle")
              }}
              className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20"
              placeholder="your_handle"
            />
            <Button
              onClick={checkUrl}
              disabled={!!urlError || !data.urlName}
              className="bg-sp-moss text-sp-cream font-body text-xs px-4 py-2 rounded-[2px] border-none hover:bg-sp-fern transition-colors disabled:opacity-40"
              style={{ boxShadow: "none" }}
            >
              Check Availability
            </Button>
          </div>
          {urlError && data.urlName && (
            <span className="text-sp-danger text-xs font-body flex items-center gap-1">
              <X className="w-3 h-3" /> {urlError}
            </span>
          )}
          {urlStatus === "available" && (
            <span className="text-sp-success text-xs font-body flex items-center gap-1">
              <Check className="w-3 h-3" /> Available
            </span>
          )}
          {urlStatus === "taken" && (
            <span className="text-sp-danger text-xs font-body flex items-center gap-1">
              <X className="w-3 h-3" /> Taken
            </span>
          )}
          <p className="text-sp-parchment/50 text-[11px] font-body">
            This will be your permanent address. Choose wisely.
          </p>
        </div>

        {/* Contact */}
        <div className="border border-sp-moss/20 p-4 flex flex-col gap-3">
          <label className="font-body text-sm text-sp-cream/80">Contact Method (choose one or more)</label>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="contact"
              checked={!!data.email}
              onChange={() => {}}
              className="accent-sp-amber"
            />
            <span className="text-xs text-sp-parchment/60 font-mono w-12">Email:</span>
            <Input
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="contact"
              checked={!!data.phone}
              onChange={() => {}}
              className="accent-sp-amber"
            />
            <span className="text-xs text-sp-parchment/60 font-mono w-12">Phone:</span>
            <Input
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20"
              placeholder="+1 000-000-0000"
            />
          </div>
          <div className="flex items-center gap-3">
            <input type="radio" name="contact" onChange={() => {}} className="accent-sp-amber" />
            <span className="text-xs text-sp-parchment/60 font-mono w-12">Gmail:</span>
            <Button
              className="bg-transparent text-sp-fern font-body text-xs px-4 py-2 rounded-[2px] border border-sp-moss/40 hover:bg-sp-moss/20 transition-colors"
              style={{ boxShadow: "none" }}
            >
              Connect Google Account
            </Button>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm text-sp-cream/80">Password</label>
          <Input
            type="password"
            value={data.password}
            onChange={(e) => update("password", e.target.value)}
            className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20"
            placeholder="••••••••"
          />
          {data.password && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-[1px]",
                      i < strength ? strengthColors[strength - 1] : "bg-sp-moss/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono text-sp-parchment/60">
                {strength > 0 ? strengthLabels[strength - 1] : "Weak"}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm text-sp-cream/80">Confirm Password</label>
          <Input
            type="password"
            value={data.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20"
            placeholder="••••••••"
          />
          {data.confirmPassword && data.password !== data.confirmPassword && (
            <span className="text-sp-danger text-xs font-body flex items-center gap-1">
              <X className="w-3 h-3" /> Passwords do not match
            </span>
          )}
        </div>
      </div>
    )
  }

  /* ── Step 3: Personal Information ── */
  const PersonalStep = () => (
    <div className="flex flex-col gap-5">
      <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">About You</h2>
      {/* Display Name */}
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm text-sp-cream/80">Display Name</label>
        <Input
          value={data.displayName}
          onChange={(e) => update("displayName", e.target.value)}
          className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20"
          placeholder="Your display name"
        />
        <p className="text-sp-parchment/50 text-[11px] font-mono">BBCode allowed: [color], [b]</p>
      </div>
      {/* Birthday */}
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm text-sp-cream/80">Birthday</label>
        <div className="flex gap-2">
          <Select
            value={data.birthday.month}
            onValueChange={(v) => setData((p) => ({ ...p, birthday: { ...p.birthday, month: v } }))}
          >
            <SelectTrigger className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream rounded-[2px] focus:ring-sp-fern/20 w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-sp-canopy border-sp-moss/40 rounded-[2px]">
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m} className="text-sp-cream focus:bg-sp-moss/30 focus:text-sp-cream">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={data.birthday.day}
            onValueChange={(v) => setData((p) => ({ ...p, birthday: { ...p.birthday, day: v } }))}
          >
            <SelectTrigger className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream rounded-[2px] focus:ring-sp-fern/20 w-[80px]">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="bg-sp-canopy border-sp-moss/40 rounded-[2px]">
              {DAYS.map((d) => (
                <SelectItem key={d} value={d} className="text-sp-cream focus:bg-sp-moss/30 focus:text-sp-cream">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={data.birthday.year}
            onValueChange={(v) => setData((p) => ({ ...p, birthday: { ...p.birthday, year: v } }))}
          >
            <SelectTrigger className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream rounded-[2px] focus:ring-sp-fern/20 w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-sp-canopy border-sp-moss/40 rounded-[2px] max-h-[200px]">
              {YEARS.map((y) => (
                <SelectItem key={y} value={y} className="text-sp-cream focus:bg-sp-moss/30 focus:text-sp-cream">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={data.birthdayPrivacy}
            onValueChange={(v) => update("birthdayPrivacy", v)}
          >
            <SelectTrigger className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream rounded-[2px] focus:ring-sp-fern/20 w-[130px]">
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent className="bg-sp-canopy border-sp-moss/40 rounded-[2px]">
              {["Private", "Friends", "Circle", "Public"].map((p) => (
                <SelectItem key={p} value={p.toLowerCase()} className="text-sp-cream focus:bg-sp-moss/30 focus:text-sp-cream">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Relationships */}
      <div className="border border-sp-moss/20 p-4 flex flex-col gap-3">
        <label className="font-body text-sm text-sp-cream/80">Relationship Status (select all that apply)</label>
        <div className="flex flex-wrap gap-3">
          {["Single", "Partnered", "Married", "Engaged", "It's Complicated"].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={data.relationships.includes(r)}
                onCheckedChange={(checked) => {
                  setData((p) => ({
                    ...p,
                    relationships: checked
                      ? [...p.relationships, r]
                      : p.relationships.filter((x) => x !== r),
                  }))
                }}
                className="border-sp-moss/40 data-[state=checked]:bg-sp-amber data-[state=checked]:border-sp-amber data-[state=checked]:text-sp-bark"
              />
              <span className="text-xs text-sp-parchment/70 font-body group-hover:text-sp-cream transition-colors">
                {r}
              </span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
          {[
            { key: "spouses", label: "Spouse(s)" },
            { key: "fiances", label: "Fianc\u00e9(s)" },
            { key: "partners", label: "Partner(s)" },
          ].map((f) => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-[11px] text-sp-parchment/50 font-mono uppercase">{f.label}</label>
              <Input
                value={data[f.key as keyof OnboardingData] as string}
                onChange={(e) => update(f.key as keyof OnboardingData, e.target.value)}
                className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-sm"
                placeholder="Name(s)"
              />
            </div>
          ))}
        </div>
        {/* Polyamory */}
        <div className="mt-2 pt-3 border-t border-sp-moss/20">
          <label className="font-body text-sm text-sp-cream/80 mb-2 block">Polyamory Options</label>
          <div className="flex flex-wrap gap-3">
            {["Polyamorous", "Polygynous", "Polyandrous"].map((p) => (
              <label key={p} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={data.polyamoryType === p}
                  onCheckedChange={() => update("polyamoryType", data.polyamoryType === p ? "" : p)}
                  className="border-sp-moss/40 data-[state=checked]:bg-sp-amber data-[state=checked]:border-sp-amber data-[state=checked]:text-sp-bark"
                />
                <span className="text-xs text-sp-parchment/70 font-body group-hover:text-sp-cream transition-colors">
                  {p}
                </span>
              </label>
            ))}
          </div>
          <p className="text-sp-parchment/40 text-[11px] font-body mt-1 italic">
            These options allow listing multiple partners without hierarchy
          </p>
        </div>
      </div>
      {/* Referrals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { key: "referredBy", label: "Referred By", hint: "optional, gives them seed bonus" },
          { key: "relatedTo", label: "Related To", hint: "family, partners, close friends" },
          { key: "invitedBy", label: "Invited By", hint: "who introduced you" },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="font-body text-xs text-sp-cream/80">{f.label}</label>
            <div className="flex items-center">
              <span className="text-sp-parchment/40 font-mono text-sm mr-1">@</span>
              <Input
                value={data[f.key as keyof OnboardingData] as string}
                onChange={(e) => update(f.key as keyof OnboardingData, e.target.value)}
                className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-sm"
                placeholder="handle"
              />
            </div>
            <p className="text-sp-parchment/40 text-[10px] font-body">{f.hint}</p>
          </div>
        ))}
      </div>
    </div>
  )

  /* ── Step 4: Content Preferences ── */
  const ContentStep = () => {
    const [otherText, setOtherText] = useState("")
    const toggleType = (label: string) => {
      setData((p) => ({
        ...p,
        contentTypes: p.contentTypes.includes(label)
          ? p.contentTypes.filter((t) => t !== label)
          : p.contentTypes.length < 5
            ? [...p.contentTypes, label]
            : p.contentTypes,
      }))
    }
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
          What Do You Create?
        </h2>
        <p className="text-sp-parchment/60 text-xs font-body">
          Select up to 5 content types that best describe what you create.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.label}
              onClick={() => toggleType(ct.label)}
              className={cn(
                "flex items-center gap-2 p-3 border text-left transition-colors",
                data.contentTypes.includes(ct.label)
                  ? "border-sp-amber/60 bg-sp-amber/10"
                  : "border-sp-moss/30 bg-sp-canopy/40 hover:bg-sp-moss/10"
              )}
              style={{ borderRadius: "0px" }}
            >
              <Checkbox
                checked={data.contentTypes.includes(ct.label)}
                onCheckedChange={() => toggleType(ct.label)}
                className="border-sp-moss/40 data-[state=checked]:bg-sp-amber data-[state=checked]:border-sp-amber data-[state=checked]:text-sp-bark shrink-0"
              />
              <span className="text-sm text-sp-cream/80 font-body">
                {ct.icon} {ct.label}
              </span>
            </button>
          ))}
          <div className="flex items-center gap-2 p-3 border border-sp-moss/30 bg-sp-canopy/40">
            <Checkbox
              checked={data.contentTypes.includes("Other")}
              onCheckedChange={() => {
                if (otherText) toggleType("Other")
              }}
              className="border-sp-moss/40 data-[state=checked]:bg-sp-amber data-[state=checked]:border-sp-amber data-[state=checked]:text-sp-bark shrink-0"
            />
            <span className="text-sm text-sp-cream/80 font-body">Other:</span>
            <Input
              value={otherText}
              onChange={(e) => {
                setOtherText(e.target.value)
                if (e.target.value && !data.contentTypes.includes("Other")) {
                  setData((p) => ({ ...p, contentTypes: [...p.contentTypes, "Other"] }))
                } else if (!e.target.value && data.contentTypes.includes("Other")) {
                  setData((p) => ({ ...p, contentTypes: p.contentTypes.filter((t) => t !== "Other") }))
                }
              }}
              className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-sm h-7"
              placeholder="specify"
            />
          </div>
        </div>
        <p className={cn(
          "text-xs font-mono",
          data.contentTypes.length > 5 ? "text-sp-danger" : "text-sp-parchment/50"
        )}>
          Selected: {data.contentTypes.length}/5
        </p>
      </div>
    )
  }

  /* ── Step 5: Interest Questionnaire ── */
  const InterestStep = () => (
    <div className="flex flex-col gap-5">
      <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
        Help Us Understand You
      </h2>
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm text-sp-cream/80">Music Taste</label>
        <Textarea
          value={data.musicTaste}
          onChange={(e) => update("musicTaste", e.target.value)}
          className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 min-h-[80px]"
          placeholder="Genres, artists, vibes..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm text-sp-cream/80">
          Political Affiliation <span className="text-sp-parchment/40">(optional)</span>
        </label>
        <Input
          value={data.politicalAffiliation}
          onChange={(e) => update("politicalAffiliation", e.target.value)}
          className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20"
          placeholder="e.g. Independent, Progressive, Conservative, Libertarian..."
        />
      </div>
      {/* Warning box */}
      <div className="border-l-2 border-sp-amber bg-sp-amber/5 p-4 flex gap-3">
        <AlertTriangle className="w-4 h-4 text-sp-amber shrink-0 mt-0.5" />
        <p className="text-xs text-sp-parchment/70 font-body leading-relaxed">
          SocialCircle is committed to preventing echo chambers. A portion of your feed will be curated from heterodox sources, opposing viewpoints, and fact-checked perspectives from across the political spectrum.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm text-sp-cream/80">What do you LIKE to see?</label>
        <Textarea
          value={data.likes}
          onChange={(e) => update("likes", e.target.value)}
          className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 min-h-[60px]"
          placeholder="Topics, hobbies, communities..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm text-sp-cream/80">
          What do you DISLIKE? <span className="text-sp-parchment/40 text-xs">(helps us filter spam)</span>
        </label>
        <Textarea
          value={data.dislikes}
          onChange={(e) => update("dislikes", e.target.value)}
          className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 min-h-[60px]"
          placeholder="Things you want to avoid..."
        />
      </div>
    </div>
  )

  /* ── Step 6: Profile Pictures ── */
  const ProfilePicStep = () => {
    const addContentProfile = () => {
      if (data.contentProfiles.length >= 3) return
      setData((p) => ({
        ...p,
        contentProfiles: [...p.contentProfiles, { name: "", type: "Blogging", pic: "" }],
      }))
    }
    const updateProfile = (idx: number, field: keyof ContentProfile, value: string) => {
      setData((p) => {
        const profiles = [...p.contentProfiles]
        profiles[idx] = { ...profiles[idx], [field]: value }
        return { ...p, contentProfiles: profiles }
      })
    }
    const removeProfile = (idx: number) => {
      setData((p) => ({
        ...p,
        contentProfiles: p.contentProfiles.filter((_, i) => i !== idx),
      }))
    }
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">Your Faces</h2>
        {/* Main Profile Pic */}
        <div className="border border-dashed border-sp-moss/40 p-6 flex flex-col items-center gap-3 hover:bg-sp-moss/5 transition-colors cursor-pointer"
          onClick={() => update("mainProfilePic", "placeholder")}
        >
          <Upload className="w-8 h-8 text-sp-fern/60" />
          <span className="text-sm text-sp-parchment/60 font-body">Main Profile Picture</span>
          <span className="text-[11px] text-sp-parchment/40 font-mono">Click to upload or drag & drop</span>
          {data.mainProfilePic && (
            <div className="flex items-center gap-2 text-sp-success text-xs font-body">
              <Check className="w-3 h-3" /> Image selected
            </div>
          )}
        </div>
        {/* Content Profiles */}
        {data.contentProfiles.map((profile, idx) => (
          <div key={idx} className="border border-sp-moss/30 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider">
                Content Profile {idx + 1}
              </h3>
              <button
                onClick={() => removeProfile(idx)}
                className="text-sp-parchment/40 hover:text-sp-danger transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-sp-parchment/50 font-mono">Name</label>
                <Input
                  value={profile.name}
                  onChange={(e) => updateProfile(idx, "name", e.target.value)}
                  className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-sm"
                  placeholder="Creator name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-sp-parchment/50 font-mono">Type</label>
                <Select
                  value={profile.type}
                  onValueChange={(v) => updateProfile(idx, "type", v)}
                >
                  <SelectTrigger className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream rounded-[2px] focus:ring-sp-fern/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-sp-canopy border-sp-moss/40 rounded-[2px]">
                    {PROFILE_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-sp-cream focus:bg-sp-moss/30 focus:text-sp-cream">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-sp-parchment/50 font-mono">Picture</label>
                <Button
                  onClick={() => updateProfile(idx, "pic", "placeholder")}
                  className="bg-transparent text-sp-fern font-body text-xs px-3 py-2 rounded-[2px] border border-sp-moss/40 hover:bg-sp-moss/20 transition-colors h-9"
                  style={{ boxShadow: "none" }}
                >
                  <Upload className="w-3 h-3 mr-1" /> Upload
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={addContentProfile}
          disabled={data.contentProfiles.length >= 3}
          className="bg-transparent text-sp-fern font-body text-sm px-4 py-2 rounded-[2px] border border-sp-moss/40 hover:bg-sp-moss/20 transition-colors disabled:opacity-30 self-start"
          style={{ boxShadow: "none" }}
        >
          <UserPlus className="w-3 h-3 mr-2" /> Add Content Profile
        </Button>
        {/* Anonymous Profile */}
        <div className="border border-sp-moss/30 p-4 flex flex-col gap-3">
          <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider">Anonymous Profile</h3>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-sp-parchment/50 font-mono">Nickname</label>
            <Input
              value={data.anonymousNickname}
              onChange={(e) => update("anonymousNickname", e.target.value)}
              className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-sm"
              placeholder="Anonymous handle"
            />
          </div>
          <div className="flex gap-2 items-start">
            <AlertTriangle className="w-3 h-3 text-sp-amber shrink-0 mt-0.5" />
            <p className="text-[11px] text-sp-parchment/50 font-body leading-relaxed">
              Anonymous nicknames cannot be changed more than once per EarthCycle to prevent spamming and gaming the system.
            </p>
          </div>
        </div>
      </div>
    )
  }

  /* ── Step 7: Forum Visibility & Background ── */
  const ForumSettingsStep = () => (
    <div className="flex flex-col gap-5">
      <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">Your Forum Settings</h2>
      {/* Visibility */}
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm text-sp-cream/80">Forum Visibility</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: "public", label: "Public", desc: "Anyone can find and view" },
            { value: "friends", label: "Friends-Only", desc: "Only approved friends can view" },
            { value: "circle", label: "Circle-Only", desc: "Only specific circles can view" },
            { value: "discoverable", label: "Discoverable", desc: "Public but approval required for full access" },
          ].map((v) => (
            <label
              key={v.value}
              className={cn(
                "flex items-start gap-3 p-3 border cursor-pointer transition-colors",
                data.forumVisibility === v.value
                  ? "border-sp-amber/60 bg-sp-amber/10"
                  : "border-sp-moss/30 bg-sp-canopy/40 hover:bg-sp-moss/10"
              )}
            >
              <input
                type="radio"
                name="visibility"
                checked={data.forumVisibility === v.value}
                onChange={() => update("forumVisibility", v.value)}
                className="mt-0.5 accent-sp-amber"
              />
              <div>
                <span className="text-sm text-sp-cream/80 font-body block">{v.label}</span>
                <span className="text-[11px] text-sp-parchment/50 font-body">{v.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Background */}
      <div className="flex flex-col gap-3">
        <label className="font-body text-sm text-sp-cream/80">Background Style</label>
        <div className="flex gap-2 flex-wrap">
          {["Solid", "Gradient", "Image", "Pattern"].map((s) => (
            <button
              key={s}
              onClick={() => update("backgroundStyle", s.toLowerCase())}
              className={cn(
                "px-4 py-2 border text-xs font-body transition-colors",
                data.backgroundStyle === s.toLowerCase()
                  ? "border-sp-amber/60 bg-sp-amber/10 text-sp-cream"
                  : "border-sp-moss/30 text-sp-parchment/70 hover:bg-sp-moss/10"
              )}
              style={{ borderRadius: "0px" }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-sp-parchment/60 font-mono">Color:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.backgroundColor}
              onChange={(e) => update("backgroundColor", e.target.value)}
              className="w-8 h-8 border border-sp-moss/40 bg-transparent cursor-pointer"
              style={{ borderRadius: "0px" }}
            />
            <span className="font-mono text-xs text-sp-parchment/60">{data.backgroundColor}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-sp-parchment/60 font-mono">Content Box Transparency</label>
          <div className="flex items-center gap-3">
            <Slider
              value={[data.transparency]}
              onValueChange={(v) => update("transparency", v[0])}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="font-mono text-xs text-sp-parchment/60 w-10">{data.transparency}%</span>
          </div>
        </div>
      </div>
      {/* Live Preview */}
      <div className="border border-sp-moss/30 p-4">
        <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider mb-3 flex items-center gap-2">
          <Eye className="w-3 h-3" /> Live Preview
        </h3>
        <div
          className="border border-sp-moss/20 p-4 flex flex-col gap-2"
          style={{ backgroundColor: data.backgroundColor }}
        >
          <div
            className="border border-sp-moss/20 p-3"
            style={{
              backgroundColor: `rgba(15, 41, 30, ${data.transparency / 100})`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sp-moss/40 border border-sp-moss/30" />
              <div>
                <p className="text-sm text-sp-cream font-body">
                  {data.displayName || "Your Display Name"}
                </p>
                <p className="text-[11px] text-sp-parchment/50 font-mono">
                  forums.socialcircle.p2p/{data.urlName || "you"}
                </p>
              </div>
            </div>
          </div>
          <div
            className="border border-sp-moss/20 p-3"
            style={{
              backgroundColor: `rgba(15, 41, 30, ${data.transparency / 100})`,
            }}
          >
            <p className="text-xs text-sp-parchment/60 font-body">
              This is how your forum will look to visitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  /* ── Step 8: Forum Rules & Governance ── */
  const RulesStep = () => {
    const defaultRules = [
      "No doxxing or harassment",
      "Seed at least 10% of content you consume",
      "Label NSFW content appropriately",
      "Respect anonymity boundaries",
      "No automated posting without Y-credit payment",
    ]
    const toggleRule = (idx: number) => {
      setData((p) => {
        const checks = [...p.ruleChecks]
        checks[idx] = !checks[idx]
        return { ...p, ruleChecks: checks }
      })
    }
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
          Forum Rules & Governance
        </h2>
        {/* Quick Reference Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-sp-moss/30 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-sp-amber" />
              <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider">Setting Ranks</h3>
            </div>
            <p className="text-[11px] text-sp-parchment/60 font-body leading-relaxed">
              Assign ranks to moderators: SA (Super Admin), A (Admin), SM (Super Mod), M (Mod), U (User)
            </p>
            <button className="text-sp-amber text-[11px] font-body hover:underline self-start">
              Learn more about rank privileges →
            </button>
          </div>
          <div className="border border-sp-moss/30 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-sp-amber" />
              <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider">Legacy Account</h3>
            </div>
            <p className="text-[11px] text-sp-parchment/60 font-body leading-relaxed">
              Designate someone to inherit your forum if you go offline for more than 180 days.
            </p>
            <button className="text-sp-amber text-[11px] font-body hover:underline self-start">
              Set Legacy Contact →
            </button>
          </div>
          <div className="border border-sp-moss/30 p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3 text-sp-amber" />
              <h3 className="font-mono text-[11px] text-sp-fern uppercase tracking-wider">Rules Editor</h3>
            </div>
            <Textarea
              value={data.customRules}
              onChange={(e) => update("customRules", e.target.value)}
              className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-xs min-h-[60px]"
              placeholder="Write your forum's specific rules..."
            />
          </div>
        </div>
        {/* Default Rules */}
        <div className="border border-sp-moss/20 p-4 flex flex-col gap-3">
          <h3 className="font-body text-sm text-sp-cream/80">Default Rules (check to acknowledge)</h3>
          {defaultRules.map((rule, idx) => (
            <label key={idx} className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={data.ruleChecks[idx] || false}
                onCheckedChange={() => toggleRule(idx)}
                className="mt-0.5 border-sp-moss/40 data-[state=checked]:bg-sp-amber data-[state=checked]:border-sp-amber data-[state=checked]:text-sp-bark"
              />
              <span className="text-sm text-sp-cream/80 font-body group-hover:text-sp-cream transition-colors">
                {rule}
              </span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  /* ── Step 9: High Profile Connections ── */
  const ConnectionsStep = () => {
    const toggleConnection = (type: string) => {
      setData((p) => {
        const exists = p.highProfileConnections.find((c) => c.type === type)
        if (exists) {
          return { ...p, highProfileConnections: p.highProfileConnections.filter((c) => c.type !== type) }
        }
        return { ...p, highProfileConnections: [...p.highProfileConnections, { type, name: "", handle: "" }] }
      })
    }
    const updateConnection = (type: string, field: "name" | "handle", value: string) => {
      setData((p) => ({
        ...p,
        highProfileConnections: p.highProfileConnections.map((c) =>
          c.type === type ? { ...c, [field]: value } : c
        ),
      }))
    }
    return (
      <div className="flex flex-col gap-5">
        <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
          Connections & Reach
        </h2>
        <p className="text-sp-parchment/60 text-xs font-body">
          Link high-profile figures you are connected to (optional). Verified connections receive a ✓ badge and boost pulse reach.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONNECTION_TYPES.map((type) => {
            const conn = data.highProfileConnections.find((c) => c.type === type)
            const isActive = !!conn
            return (
              <div
                key={type}
                className={cn(
                  "border p-3 flex flex-col gap-2 transition-colors",
                  isActive ? "border-sp-amber/40 bg-sp-amber/5" : "border-sp-moss/30 bg-sp-canopy/40"
                )}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={() => toggleConnection(type)}
                    className="border-sp-moss/40 data-[state=checked]:bg-sp-amber data-[state=checked]:border-sp-amber data-[state=checked]:text-sp-bark"
                  />
                  <span className="text-sm text-sp-cream/80 font-body">{type}</span>
                </label>
                {isActive && (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={conn?.name || ""}
                      onChange={(e) => updateConnection(type, "name", e.target.value)}
                      className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-sm flex-1"
                      placeholder="Name"
                    />
                    <div className="flex items-center">
                      <span className="text-sp-parchment/40 font-mono text-sm mr-1">@</span>
                      <Input
                        value={conn?.handle || ""}
                        onChange={(e) => updateConnection(type, "handle", e.target.value)}
                        className="bg-sp-canopy/60 border-sp-moss/30 text-sp-cream placeholder:text-sp-parchment/40 rounded-[2px] focus-visible:border-sp-fern focus-visible:ring-sp-fern/20 text-sm w-[120px]"
                        placeholder="handle"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── Step 10: Seeding & Launch ── */
  const LaunchStep = () => {
    if (!isSeeding) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
          <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
            Seed Your Profile
          </h2>
          <div className="relative w-48 h-48">
            {/* Center node */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-sp-amber -translate-x-1/2 -translate-y-1/2" />
            {/* Orbiting nodes */}
            <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: "8s" }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-sp-fern -translate-x-1/2" />
            </div>
            <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-sp-sapling -translate-x-1/2" />
            </div>
            <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: "6s" }}>
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-sp-moss -translate-x-1/2" />
            </div>
          </div>
          <p className="text-sm text-sp-parchment/70 font-body max-w-sm">
            Your profile data will be chunked and distributed to 3 random peers for redundancy.
          </p>
          <Button
            onClick={() => setIsSeeding(true)}
            className="bg-sp-amber text-sp-bark font-body font-semibold text-sm uppercase tracking-widest px-10 py-4 rounded-[2px] border-none hover:bg-sp-honey transition-colors"
            style={{ boxShadow: "none" }}
          >
            Begin Seeding <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
        <h2 className="font-retro text-[14px] uppercase tracking-widest text-sp-amber">
          Seeding in Progress...
        </h2>
        <div className="w-full max-w-md">
          <Progress
            value={seedProgress}
            className="h-2 bg-sp-moss/20 rounded-[1px]"
          />
          <p className="text-sp-parchment/50 text-xs font-mono mt-2">{seedProgress}%</p>
        </div>
        <div className="flex flex-col gap-1 text-xs text-sp-parchment/60 font-body">
          <p>Chunking profile data...</p>
          <p>Encrypting with peer keys...</p>
          <p>Distributing to mesh nodes...</p>
        </div>
        {seedProgress >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-retro text-lg text-sp-fern tracking-wider">
              "No servers. Only seeds."
            </p>
            <Button
              className="bg-sp-amber text-sp-bark font-body font-semibold text-sm uppercase tracking-widest px-10 py-4 rounded-[2px] border-none hover:bg-sp-honey transition-colors"
              style={{ boxShadow: "none" }}
            >
              Launch My Forum <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    )
  }

  /* ── Render step content ── */
  const renderStep = () => {
    switch (step) {
      case 0: return <LandingGate />
      case 1: return <TermsStep />
      case 2: return <CredentialsStep />
      case 3: return <PersonalStep />
      case 4: return <ContentStep />
      case 5: return <InterestStep />
      case 6: return <ProfilePicStep />
      case 7: return <ForumSettingsStep />
      case 8: return <RulesStep />
      case 9: return <ConnectionsStep />
      case 10: return <LaunchStep />
      default: return null
    }
  }

  const showNav = step > 0 && step < 10
  const showCompleteNav = step === 9

  return (
    <div className="min-h-[100dvh] bg-sp-canopy text-sp-cream flex flex-col">
      {/* Header */}
      <header className="border-b border-sp-moss/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sp-fern" />
          <span className="font-display text-sm font-medium text-sp-cream tracking-tight">
            SocialCircle.p2p
          </span>
        </div>
        {step > 0 && (
          <span className="font-mono text-xs text-sp-parchment/60">
            Step {step} of 10
          </span>
        )}
      </header>

      {/* Progress Bar */}
      {step > 0 && step < 10 && (
        <div className="px-6 py-3 border-b border-sp-moss/20">
          <div className="w-full h-2 bg-sp-moss/20 rounded-[1px] overflow-hidden">
            <motion.div
              className="h-full bg-sp-amber"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 10) * 100}%` }}
              transition={{ duration: 0.3, ease: easeSnap }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: easeSnap }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation */}
      {showNav && (
        <footer className="border-t border-sp-moss/20 px-6 py-4 flex items-center justify-between">
          <Button
            onClick={goBack}
            className="bg-transparent text-sp-parchment font-body text-sm px-4 py-2 rounded-[2px] border border-sp-moss/40 hover:bg-sp-moss/20 transition-colors"
            style={{ boxShadow: "none" }}
          >
            <ArrowLeft className="w-3 h-3 mr-2" /> Back
          </Button>
          <Button
            onClick={goNext}
            disabled={!canProceed()}
            className="bg-sp-amber text-sp-bark font-body font-semibold text-sm uppercase tracking-widest px-6 py-2 rounded-[2px] border-none hover:bg-sp-honey transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ boxShadow: "none" }}
          >
            {showCompleteNav ? "Complete Setup" : "Continue"} <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </footer>
      )}
      {step === 10 && !isSeeding && (
        <footer className="border-t border-sp-moss/20 px-6 py-4 flex items-center justify-between">
          <Button
            onClick={goBack}
            className="bg-transparent text-sp-parchment font-body text-sm px-4 py-2 rounded-[2px] border border-sp-moss/40 hover:bg-sp-moss/20 transition-colors"
            style={{ boxShadow: "none" }}
          >
            <ArrowLeft className="w-3 h-3 mr-2" /> Back
          </Button>
        </footer>
      )}
    </div>
  )
}
