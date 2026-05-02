import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingCart, Search, ChevronDown, Store as StoreIcon, ArrowLeftRight,
} from 'lucide-react'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type StoreTab = 'browse' | 'your-store' | 'transactions'

interface Product {
  id: string
  title: string
  price: string
  seller: string
  sellerHandle: string
  category: string
}

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */

const ALL_PRODUCTS: Product[] = [
  { id: '1', title: 'Organic Seeds', price: '$15E', seller: 'Willow', sellerHandle: 'willow_03', category: 'Goods' },
  { id: '2', title: 'Custom Digital Art', price: '$45E', seller: 'Jade', sellerHandle: 'jade_07', category: 'Digital' },
  { id: '3', title: 'P2P Starter Kit', price: '$120M', seller: 'River', sellerHandle: 'river_07', category: 'Hardware' },
  { id: '4', title: 'Consulting', price: '200S/hr', seller: 'Aspen', sellerHandle: 'aspen_12', category: 'Services' },
  { id: '5', title: 'Solar Beats Album', price: '$10E', seller: 'River', sellerHandle: 'river_07', category: 'Digital' },
  { id: '6', title: 'Garden Design Guide', price: '$25E', seller: 'Willow', sellerHandle: 'willow_03', category: 'Digital' },
  { id: '7', title: 'Code Review', price: '150S/hr', seller: 'Jade', sellerHandle: 'jade_07', category: 'Services' },
  { id: '8', title: 'Handmade Planter', price: '$35M', seller: 'Aspen', sellerHandle: 'aspen_12', category: 'Goods' },
]

const CATEGORIES = ['All', 'Goods', 'Digital', 'Services', 'Hardware']

const SERVICE_TIERS = [
  { icon: '\u{1F331}', name: 'Seedling', range: '$0 – $500', rate: '2%' },
  { icon: '\u{1F33F}', name: 'Sprout', range: '$501 – $2K', rate: '3.5%' },
  { icon: '\u{1F343}', name: 'Sapling', range: '$2K – $10K', rate: '5%' },
  { icon: '\u{1F333}', name: 'Canopy', range: '$10K – $50K', rate: '7%' },
  { icon: '\u{1F332}', name: 'Redwood', range: '$50K+', rate: '10%' },
]

const SORT_OPTIONS = ['Recent', 'Price: Low to High', 'Price: High to Low', 'Seller']

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.06, 0.4),
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="group transition-colors hover:bg-sp-fern/10 flex flex-col"
      style={{
        border: '1px solid rgba(45,106,79,0.3)',
        background: 'rgba(15,41,30,0.5)',
      }}
    >
      {/* Image Placeholder */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          height: '160px',
          background: 'rgba(15,41,30,0.8)',
          borderBottom: '1px solid rgba(45,106,79,0.3)',
        }}
      >
        <ShoppingCart className="h-10 w-10 text-sp-moss group-hover:text-sp-fern transition-colors" />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm text-sp-cream font-medium group-hover:text-sp-fern transition-colors">
          {product.title}
        </p>
        <p className="font-mono text-[13px] text-sp-amber mt-1">
          {product.price}
        </p>
        <p className="font-mono text-[10px] text-sp-parchment mt-0.5">
          <Link
            to={`/@${product.sellerHandle}`}
            className="text-sp-fern hover:text-sp-cream transition-colors hover:underline"
          >
            @{product.sellerHandle}
          </Link>
        </p>
        <p className="font-mono text-[9px] uppercase text-sp-parchment mt-0.5">
          {product.category}
        </p>
        <div className="mt-auto pt-3">
          <button
            className="w-full px-3 py-1.5 font-retro text-[11px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80"
            style={{
              background: 'var(--sp-moss)',
              border: 'none',
              borderRadius: '0px',
            }}
          >
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function BrowseView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Recent')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div
        className="flex flex-wrap items-center gap-3 px-3 py-2"
        style={{
          border: '1px solid rgba(45,106,79,0.25)',
          background: 'rgba(15,41,30,0.4)',
        }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 min-w-[200px]"
          style={{
            border: '1px solid rgba(45,106,79,0.4)',
            background: 'rgba(15,41,30,0.6)',
          }}
        >
          <Search className="h-3.5 w-3.5 text-sp-parchment ml-2 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-sp-cream placeholder-sp-parchment/60 focus:outline-none py-1.5 pr-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowSortDropdown(false) }}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] text-sp-parchment transition-colors hover:text-sp-cream"
            style={{
              border: '1px solid rgba(45,106,79,0.4)',
              background: 'rgba(15,41,30,0.6)',
              borderRadius: '0px',
            }}
          >
            <span className="text-sp-cream">{selectedCategory}</span>
            <ChevronDown className={cn('h-3 w-3 transition-transform', showCategoryDropdown && 'rotate-180')} />
          </button>
          {showCategoryDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCategoryDropdown(false)} />
              <div
                className="absolute left-0 top-full mt-1 z-50 py-1"
                style={{
                  minWidth: '140px',
                  background: 'var(--sp-canopy)',
                  border: '1px solid rgba(45,106,79,0.5)',
                  borderRadius: '0px',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false) }}
                    className="w-full text-left px-3 py-1.5 font-mono text-[11px] transition-colors hover:bg-sp-fern/10"
                    style={{
                      color: selectedCategory === cat ? '#d4a017' : '#e8e0cc',
                      background: selectedCategory === cat ? 'rgba(45,106,79,0.2)' : 'transparent',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowSortDropdown(!showSortDropdown); setShowCategoryDropdown(false) }}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] text-sp-parchment transition-colors hover:text-sp-cream"
            style={{
              border: '1px solid rgba(45,106,79,0.4)',
              background: 'rgba(15,41,30,0.6)',
              borderRadius: '0px',
            }}
          >
            <span className="text-sp-cream">{sortBy}</span>
            <ChevronDown className={cn('h-3 w-3 transition-transform', showSortDropdown && 'rotate-180')} />
          </button>
          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
              <div
                className="absolute right-0 top-full mt-1 z-50 py-1"
                style={{
                  minWidth: '160px',
                  background: 'var(--sp-canopy)',
                  border: '1px solid rgba(45,106,79,0.5)',
                  borderRadius: '0px',
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSortDropdown(false) }}
                    className="w-full text-left px-3 py-1.5 font-mono text-[11px] transition-colors hover:bg-sp-fern/10"
                    style={{
                      color: sortBy === opt ? '#d4a017' : '#e8e0cc',
                      background: sortBy === opt ? 'rgba(45,106,79,0.2)' : 'transparent',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div
          className="flex items-center justify-center py-12"
          style={{
            border: '1px solid rgba(45,106,79,0.25)',
            background: 'rgba(15,41,30,0.4)',
          }}
        >
          <p className="font-mono text-sm text-sp-parchment">No products found.</p>
        </div>
      )}

      {/* Results count */}
      <p className="font-mono text-[10px] text-sp-parchment">
        Showing {filtered.length} of {ALL_PRODUCTS.length} products
      </p>
    </div>
  )
}

function YourStoreView() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      style={{
        border: '1px solid rgba(45,106,79,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <StoreIcon className="h-10 w-10 text-sp-moss mb-3" />
      <p className="font-retro text-lg uppercase text-sp-parchment mb-1">Your Store</p>
      <p className="font-mono text-sm text-sp-parchment text-center max-w-md px-4">
        You haven&apos;t listed any products yet. Create your first listing to start selling on the P2P marketplace.
      </p>
      <button
        className="mt-4 px-4 py-1.5 font-retro text-[11px] uppercase text-sp-cream transition-colors hover:bg-sp-moss/80"
        style={{
          background: 'var(--sp-moss)',
          borderRadius: '0px',
        }}
      >
        Create Listing +
      </button>
    </div>
  )
}

function TransactionsView() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      style={{
        border: '1px solid rgba(45,106,79,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <ArrowLeftRight className="h-10 w-10 text-sp-moss mb-3" />
      <p className="font-retro text-lg uppercase text-sp-parchment mb-1">Transactions</p>
      <p className="font-mono text-sm text-sp-parchment text-center max-w-md px-4">
        No transactions yet. When you buy or sell on the marketplace, your transaction history will appear here.
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SERVICE TIERS DISPLAY
   ═══════════════════════════════════════════ */

function ServiceTiers() {
  return (
    <div
      className="mt-6"
      style={{
        border: '1px solid rgba(45,106,79,0.25)',
        background: 'rgba(15,41,30,0.4)',
      }}
    >
      <div
        className="px-3 py-1.5"
        style={{ borderBottom: '1px solid rgba(45,106,79,0.2)' }}
      >
        <span className="font-retro text-xs uppercase text-sp-amber">
          Income-Based Service Charges
        </span>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SERVICE_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex items-center gap-2 px-2 py-1.5"
              style={{
                border: '1px solid rgba(45,106,79,0.2)',
                background: 'rgba(15,41,30,0.3)',
              }}
            >
              <span className="text-base">{tier.icon}</span>
              <div>
                <p className="font-mono text-[10px] text-sp-cream font-bold">{tier.name}</p>
                <p className="font-mono text-[9px] text-sp-parchment">{tier.range}</p>
                <p className="font-mono text-[11px] text-sp-amber">{tier.rate}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-[9px] text-sp-parchment mt-2 leading-relaxed">
          Service charges fund the network infrastructure and ecological dimension. Richer profiles pay a higher percentage. No ads, no data selling — this is the platform&apos;s only revenue.
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function Store() {
  const [activeTab, setActiveTab] = useState<StoreTab>('browse')

  const tabs: { id: StoreTab; label: string }[] = [
    { id: 'browse', label: 'Browse' },
    { id: 'your-store', label: 'Your Store' },
    { id: 'transactions', label: 'Transactions' },
  ]

  return (
    <div className="min-h-[calc(100dvh-64px)]" style={{ background: 'var(--sp-canopy)' }}>
      <div className="mx-auto max-w-[1200px] px-3 py-4">
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2 mb-3"
          style={{
            border: '1px solid rgba(45,106,79,0.3)',
            background: 'rgba(15,41,30,0.5)',
          }}
        >
          <h1
            className="font-retro text-lg uppercase text-sp-amber flex items-center gap-2"
            style={{ letterSpacing: '0.05em' }}
          >
            <ShoppingCart className="h-5 w-5" />
            P2P Marketplace
          </h1>
          <span className="font-mono text-[10px] text-sp-parchment">
            {ALL_PRODUCTS.length} listings
          </span>
        </div>

        {/* Tabs */}
        <div className="flex mb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 font-retro text-[13px] uppercase transition-colors"
              style={{
                color: activeTab === tab.id ? '#d4a017' : '#e8e0cc',
                background: activeTab === tab.id ? 'rgba(45,106,79,0.2)' : 'transparent',
                borderTop: activeTab === tab.id ? '2px solid #d4a017' : '2px solid transparent',
                borderBottom: activeTab !== tab.id ? '1px solid rgba(45,106,79,0.3)' : '1px solid transparent',
                borderLeft: '1px solid rgba(45,106,79,0.15)',
                borderRight: '1px solid rgba(45,106,79,0.15)',
                letterSpacing: '0.05em',
              }}
            >
              {tab.label}
            </button>
          ))}
          {/* Fill remaining tab bar */}
          <div
            className="flex-1"
            style={{ borderBottom: '1px solid rgba(45,106,79,0.3)' }}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && <BrowseView />}
        {activeTab === 'your-store' && <YourStoreView />}
        {activeTab === 'transactions' && <TransactionsView />}

        {/* Service Tiers — always visible */}
        <ServiceTiers />
      </div>
    </div>
  )
}
