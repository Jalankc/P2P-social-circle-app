// IVS axiom: karma is a 4-vector — never aggregate, never scalar. See CLAUDE.md §Axioms 1-3.
export const COMPENSATION_DECAY_DAYS = 90

const DB_NAME = 'socialcircle'
const DB_VERSION = 2

export interface KarmaVector {
  M: number // Materiality
  S: number // Sociality
  I: number // Informativity
  E: number // Expressivity
}

export interface ThreeFaces {
  primary: { handle: string; bio: string; avatar: string }
  community: { handle: string; bio: string; avatar: string }
  anonymous: { handle: string; bio: string; avatar: string }
}

export interface Identity {
  did: string
  publicKey: string
  encryptedPrivateKey: string
  faces: ThreeFaces
  createdAt: number
  updatedAt: number
}

export interface Peer {
  peerId: string
  did: string
  credibility: number
  lastSeen: number
  createdAt: number
  updatedAt: number
  bytesSeeded?: number   // cumulative bytes uploaded to this peer
  bytesLeeched?: number  // cumulative bytes downloaded from this peer
  chunksHostedForPeer?: number
}

export type NetworkEventType = 'chunk_sent' | 'chunk_received' | 'chunk_stored' | 'chunk_dropped'

export interface NetworkEvent {
  eventId: string
  type: NetworkEventType
  chunkId: string
  peerId: string
  bytes: number
  createdAt: number
}

export interface Post {
  postId: string
  authorId: string
  body: string // BBCode
  karma: KarmaVector
  createdAt: number
  updatedAt: number
}

export interface CompensationTx {
  txId: string
  userId: string
  amount: number
  createdAt: number // Unix ms — used for demurrage filter
}

export interface Chunk {
  chunkId: string
  data: Uint8Array
  replicationCount: number
  createdAt: number
  updatedAt: number
}

export interface Message {
  msgId: string
  conversationId: string
  ciphertext: string
  senderId: string
  createdAt: number
}

let _db: IDBDatabase | null = null

export function openDB(idbFactory?: IDBFactory): Promise<IDBDatabase> {
  const idb = idbFactory ?? indexedDB
  return new Promise((resolve, reject) => {
    if (_db && !idbFactory) {
      resolve(_db)
      return
    }
    const req = idb.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('identity')) {
        db.createObjectStore('identity', { keyPath: 'did' })
      }
      if (!db.objectStoreNames.contains('peers')) {
        db.createObjectStore('peers', { keyPath: 'peerId' })
      }
      if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', { keyPath: 'postId' })
      }
      if (!db.objectStoreNames.contains('karma')) {
        db.createObjectStore('karma', { keyPath: 'userId' })
      }
      if (!db.objectStoreNames.contains('compensation')) {
        const store = db.createObjectStore('compensation', { keyPath: 'txId' })
        store.createIndex('by_user', 'userId', { unique: false })
      }
      if (!db.objectStoreNames.contains('chunks')) {
        db.createObjectStore('chunks', { keyPath: 'chunkId' })
      }
      if (!db.objectStoreNames.contains('messages')) {
        const store = db.createObjectStore('messages', { keyPath: 'msgId' })
        store.createIndex('by_conversation', 'conversationId', { unique: false })
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
      // v2: network event log for seeding/leeching measurement
      if (!db.objectStoreNames.contains('network_events')) {
        const evStore = db.createObjectStore('network_events', { keyPath: 'eventId' })
        evStore.createIndex('by_peer', 'peerId', { unique: false })
        evStore.createIndex('by_type', 'type', { unique: false })
      }
    }
    req.onsuccess = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!idbFactory) _db = db
      resolve(db)
    }
    req.onerror = () => reject(req.error)
  })
}

function tx(
  db: IDBDatabase,
  stores: string | string[],
  mode: IDBTransactionMode
): IDBTransaction {
  return db.transaction(stores, mode)
}

function put<T>(store: IDBObjectStore, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = store.put(value)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

function get<T>(store: IDBObjectStore, key: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const req = store.get(key)
    req.onsuccess = () => resolve((req.result as T) ?? null)
    req.onerror = () => reject(req.error)
  })
}

function getAll<T>(store: IDBObjectStore): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result as T[])
    req.onerror = () => reject(req.error)
  })
}

function getAllByIndex<T>(
  store: IDBObjectStore,
  indexName: string,
  key: IDBValidKey
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const index = store.index(indexName)
    const req = index.getAll(key)
    req.onsuccess = () => resolve(req.result as T[])
    req.onerror = () => reject(req.error)
  })
}

// ── Identity ──────────────────────────────────────────────────────────────────

export async function getIdentity(db: IDBDatabase): Promise<Identity | null> {
  return new Promise((resolve, reject) => {
    const t = tx(db, 'identity', 'readonly')
    const req = t.objectStore('identity').openCursor()
    req.onsuccess = () => resolve(req.result ? (req.result.value as Identity) : null)
    req.onerror = () => reject(req.error)
  })
}

export async function saveIdentity(db: IDBDatabase, identity: Identity): Promise<void> {
  const t = tx(db, 'identity', 'readwrite')
  return put(t.objectStore('identity'), identity)
}

// ── Peers ─────────────────────────────────────────────────────────────────────

export async function getPeer(db: IDBDatabase, peerId: string): Promise<Peer | null> {
  const t = tx(db, 'peers', 'readonly')
  return get<Peer>(t.objectStore('peers'), peerId)
}

export async function upsertPeer(db: IDBDatabase, peer: Peer): Promise<void> {
  const t = tx(db, 'peers', 'readwrite')
  return put(t.objectStore('peers'), peer)
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function savePost(db: IDBDatabase, post: Post): Promise<void> {
  const t = tx(db, 'posts', 'readwrite')
  return put(t.objectStore('posts'), post)
}

export async function getPost(db: IDBDatabase, postId: string): Promise<Post | null> {
  const t = tx(db, 'posts', 'readonly')
  return get<Post>(t.objectStore('posts'), postId)
}

// ── Karma ─────────────────────────────────────────────────────────────────────
// Stored as { userId, ...KarmaVector } — no aggregate field is ever written.
// IVS axiom 1: incommensurable dimensions, never summed.

interface KarmaRecord extends KarmaVector {
  userId: string
  updatedAt: number
}

export async function getKarma(db: IDBDatabase, userId: string): Promise<KarmaVector | null> {
  const t = tx(db, 'karma', 'readonly')
  const record = await get<KarmaRecord>(t.objectStore('karma'), userId)
  if (!record) return null
  return { M: record.M, S: record.S, I: record.I, E: record.E }
}

export async function updateKarma(
  db: IDBDatabase,
  userId: string,
  delta: Partial<KarmaVector>
): Promise<void> {
  const current = await getKarma(db, userId)
  const base: KarmaVector = current ?? { M: 0, S: 0, I: 0, E: 0 }
  const next: KarmaRecord = {
    userId,
    M: base.M + (delta.M ?? 0),
    S: base.S + (delta.S ?? 0),
    I: base.I + (delta.I ?? 0),
    E: base.E + (delta.E ?? 0),
    updatedAt: Date.now(),
  }
  const t = tx(db, 'karma', 'readwrite')
  return put(t.objectStore('karma'), next)
}

// ── Compensation ──────────────────────────────────────────────────────────────
// Demurrage: entries older than COMPENSATION_DECAY_DAYS are treated as expired.
// IVS axiom 4: hoarding is structurally penalized.

export async function saveCompensation(db: IDBDatabase, txRecord: CompensationTx): Promise<void> {
  const t = tx(db, 'compensation', 'readwrite')
  return put(t.objectStore('compensation'), txRecord)
}

export async function getActiveCompensation(
  db: IDBDatabase,
  userId: string
): Promise<CompensationTx[]> {
  const t = tx(db, 'compensation', 'readonly')
  const all = await getAllByIndex<CompensationTx>(t.objectStore('compensation'), 'by_user', userId)
  const cutoff = Date.now() - COMPENSATION_DECAY_DAYS * 24 * 60 * 60 * 1000
  return all.filter((c) => c.createdAt >= cutoff)
}

// ── Chunks ────────────────────────────────────────────────────────────────────

export async function saveChunk(db: IDBDatabase, chunk: Chunk): Promise<void> {
  const t = tx(db, 'chunks', 'readwrite')
  return put(t.objectStore('chunks'), chunk)
}

export async function getChunk(db: IDBDatabase, chunkId: string): Promise<Chunk | null> {
  const t = tx(db, 'chunks', 'readonly')
  return get<Chunk>(t.objectStore('chunks'), chunkId)
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function saveMessage(db: IDBDatabase, msg: Message): Promise<void> {
  const t = tx(db, 'messages', 'readwrite')
  return put(t.objectStore('messages'), msg)
}

export async function getMessages(db: IDBDatabase, conversationId: string): Promise<Message[]> {
  const t = tx(db, 'messages', 'readonly')
  return getAllByIndex<Message>(t.objectStore('messages'), 'by_conversation', conversationId)
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSetting<T>(db: IDBDatabase, key: string): Promise<T | null> {
  const t = tx(db, 'settings', 'readonly')
  const record = await get<{ key: string; value: T }>(t.objectStore('settings'), key)
  return record?.value ?? null
}

export async function setSetting<T>(db: IDBDatabase, key: string, value: T): Promise<void> {
  const t = tx(db, 'settings', 'readwrite')
  return put(t.objectStore('settings'), { key, value })
}

// ── Network Events ────────────────────────────────────────────────────────────

export async function saveNetworkEvent(db: IDBDatabase, event: NetworkEvent): Promise<void> {
  const t = tx(db, 'network_events', 'readwrite')
  return put(t.objectStore('network_events'), event)
}

export async function getNetworkEventsSince(
  db: IDBDatabase,
  sinceMs: number
): Promise<NetworkEvent[]> {
  const t = tx(db, 'network_events', 'readonly')
  const all = await getAll<NetworkEvent>(t.objectStore('network_events'))
  return all.filter((e) => e.createdAt >= sinceMs)
}

export async function getNetworkEventsByPeer(
  db: IDBDatabase,
  peerId: string
): Promise<NetworkEvent[]> {
  const t = tx(db, 'network_events', 'readonly')
  return getAllByIndex<NetworkEvent>(t.objectStore('network_events'), 'by_peer', peerId)
}

// ── Bulk helpers ──────────────────────────────────────────────────────────────

export async function getAllPeers(db: IDBDatabase): Promise<Peer[]> {
  const t = tx(db, 'peers', 'readonly')
  return getAll<Peer>(t.objectStore('peers'))
}

export async function getAllChunks(db: IDBDatabase): Promise<Chunk[]> {
  const t = tx(db, 'chunks', 'readonly')
  return getAll<Chunk>(t.objectStore('chunks'))
}
