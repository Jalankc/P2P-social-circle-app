import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import {
  openDB,
  getIdentity,
  saveIdentity,
  getKarma,
  updateKarma,
  saveCompensation,
  getActiveCompensation,
  getSetting,
  setSetting,
  savePost,
  getPost,
  upsertPeer,
  getPeer,
  saveChunk,
  getChunk,
  saveMessage,
  getMessages,
  COMPENSATION_DECAY_DAYS,
  type Identity,
  type KarmaVector,
  type CompensationTx,
} from './db'

function makeIDB() {
  return new IDBFactory()
}

describe('openDB', () => {
  it('creates all required object stores', async () => {
    const db = await openDB(makeIDB())
    const stores = Array.from(db.objectStoreNames)
    expect(stores).toContain('identity')
    expect(stores).toContain('peers')
    expect(stores).toContain('posts')
    expect(stores).toContain('karma')
    expect(stores).toContain('compensation')
    expect(stores).toContain('chunks')
    expect(stores).toContain('messages')
    expect(stores).toContain('settings')
  })
})

describe('identity', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('returns null when no identity exists', async () => {
    expect(await getIdentity(db)).toBeNull()
  })

  it('round-trips identity save/get', async () => {
    const identity: Identity = {
      did: 'did:key:test123',
      publicKey: 'pubkey-abc',
      encryptedPrivateKey: 'encrypted-privkey',
      faces: {
        primary:   { handle: 'willow',  bio: 'gardener', avatar: '/avatar.jpg' },
        community: { handle: 'willow-c', bio: 'builder', avatar: '/avatar.jpg' },
        anonymous: { handle: 'anon',    bio: '',         avatar: '/avatar.jpg' },
      },
      createdAt: 1000,
      updatedAt: 1000,
    }
    await saveIdentity(db, identity)
    const result = await getIdentity(db)
    expect(result).toEqual(identity)
  })
})

describe('karma', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('returns null for unknown user', async () => {
    expect(await getKarma(db, 'user-unknown')).toBeNull()
  })

  it('initializes from zero on first update', async () => {
    await updateKarma(db, 'user1', { M: 1 })
    const k = await getKarma(db, 'user1')
    expect(k).toEqual({ M: 1, S: 0, I: 0, E: 0 })
  })

  it('accumulates deltas correctly', async () => {
    await updateKarma(db, 'user1', { M: 2, S: 1 })
    await updateKarma(db, 'user1', { I: 3, E: 1 })
    await updateKarma(db, 'user1', { M: 1 })
    const k = await getKarma(db, 'user1') as KarmaVector
    expect(k).toEqual({ M: 3, S: 1, I: 3, E: 1 })
  })

  it('does not store an aggregate scalar field', async () => {
    await updateKarma(db, 'user1', { M: 5, S: 3, I: 2, E: 4 })
    const t = db.transaction('karma', 'readonly')
    const raw = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const req = t.objectStore('karma').get('user1')
      req.onsuccess = () => resolve(req.result as Record<string, unknown>)
      req.onerror = () => reject(req.error)
    })
    // No aggregate/total/score field allowed — IVS axiom 1
    expect(raw).not.toHaveProperty('total')
    expect(raw).not.toHaveProperty('score')
    expect(raw).not.toHaveProperty('aggregate')
    expect(raw).toHaveProperty('M')
    expect(raw).toHaveProperty('S')
    expect(raw).toHaveProperty('I')
    expect(raw).toHaveProperty('E')
  })
})

describe('compensation demurrage', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('returns active (recent) compensation entries', async () => {
    const now = Date.now()
    const active: CompensationTx = { txId: 'tx1', userId: 'user1', amount: 10, createdAt: now }
    await saveCompensation(db, active)
    const result = await getActiveCompensation(db, 'user1')
    expect(result).toHaveLength(1)
    expect(result[0].txId).toBe('tx1')
  })

  it(`excludes entries older than ${COMPENSATION_DECAY_DAYS} days`, async () => {
    const old = Date.now() - (COMPENSATION_DECAY_DAYS + 1) * 24 * 60 * 60 * 1000
    const expired: CompensationTx = { txId: 'tx-old', userId: 'user1', amount: 50, createdAt: old }
    await saveCompensation(db, expired)
    const result = await getActiveCompensation(db, 'user1')
    expect(result).toHaveLength(0)
  })

  it('mixes active and expired correctly', async () => {
    const now = Date.now()
    const old = now - (COMPENSATION_DECAY_DAYS + 1) * 24 * 60 * 60 * 1000
    await saveCompensation(db, { txId: 'tx-active', userId: 'u1', amount: 5, createdAt: now })
    await saveCompensation(db, { txId: 'tx-expired', userId: 'u1', amount: 99, createdAt: old })
    const result = await getActiveCompensation(db, 'u1')
    expect(result).toHaveLength(1)
    expect(result[0].txId).toBe('tx-active')
  })
})

describe('settings', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('returns null for missing key', async () => {
    expect(await getSetting(db, 'missing')).toBeNull()
  })

  it('round-trips string value', async () => {
    await setSetting(db, 'theme', 'dark')
    expect(await getSetting(db, 'theme')).toBe('dark')
  })

  it('round-trips object value', async () => {
    const cfg = { chunkSize: 64, maxPeers: 50 }
    await setSetting(db, 'network', cfg)
    expect(await getSetting(db, 'network')).toEqual(cfg)
  })

  it('overwrites on second set', async () => {
    await setSetting(db, 'key', 'v1')
    await setSetting(db, 'key', 'v2')
    expect(await getSetting(db, 'key')).toBe('v2')
  })
})

describe('posts', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('round-trips post save/get', async () => {
    const post = {
      postId: 'p1',
      authorId: 'user1',
      body: '[b]Hello[/b]',
      karma: { M: 0, S: 0, I: 0, E: 0 },
      createdAt: 1000,
      updatedAt: 1000,
    }
    await savePost(db, post)
    expect(await getPost(db, 'p1')).toEqual(post)
  })

  it('returns null for unknown post', async () => {
    expect(await getPost(db, 'nope')).toBeNull()
  })
})

describe('peers', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('round-trips peer upsert/get', async () => {
    const peer = { peerId: 'p1', did: 'did:key:abc', credibility: 0.8, lastSeen: 100, createdAt: 1, updatedAt: 1 }
    await upsertPeer(db, peer)
    expect(await getPeer(db, 'p1')).toEqual(peer)
  })

  it('returns null for unknown peer', async () => {
    expect(await getPeer(db, 'ghost')).toBeNull()
  })
})

describe('chunks', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('round-trips chunk save/get', async () => {
    const chunk = {
      chunkId: 'c1',
      data: new Uint8Array([1, 2, 3]),
      replicationCount: 3,
      createdAt: 1,
      updatedAt: 1,
    }
    await saveChunk(db, chunk)
    const result = await getChunk(db, 'c1')
    expect(result).toEqual(chunk)
  })
})

describe('messages', () => {
  let db: IDBDatabase

  beforeEach(async () => {
    db = await openDB(makeIDB())
  })

  it('saves and retrieves messages by conversationId', async () => {
    await saveMessage(db, { msgId: 'm1', conversationId: 'conv1', ciphertext: 'ct1', senderId: 'u1', createdAt: 1 })
    await saveMessage(db, { msgId: 'm2', conversationId: 'conv1', ciphertext: 'ct2', senderId: 'u2', createdAt: 2 })
    await saveMessage(db, { msgId: 'm3', conversationId: 'conv2', ciphertext: 'ct3', senderId: 'u1', createdAt: 3 })
    const conv1 = await getMessages(db, 'conv1')
    expect(conv1).toHaveLength(2)
    expect(conv1.map(m => m.msgId)).toContain('m1')
    expect(conv1.map(m => m.msgId)).toContain('m2')
    const conv2 = await getMessages(db, 'conv2')
    expect(conv2).toHaveLength(1)
  })
})
