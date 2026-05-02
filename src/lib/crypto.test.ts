import { describe, it, expect } from 'vitest'
import {
  generateSeedPhrase,
  validateSeedPhrase,
  seedPhraseToKeyPair,
  publicKeyToDID,
  didToPublicKey,
  sign,
  verify,
  encryptPrivateKey,
  decryptPrivateKey,
  encryptMessage,
  decryptMessage,
  toHex,
  fromHex,
} from './crypto'
import { wordlist } from '@scure/bip39/wordlists/english.js'

describe('hex helpers', () => {
  it('roundtrips bytes through hex', () => {
    const bytes = new Uint8Array([0x00, 0x0f, 0xff, 0xab])
    expect(fromHex(toHex(bytes))).toEqual(bytes)
  })

  it('throws on odd-length hex', () => {
    expect(() => fromHex('abc')).toThrow()
  })
})

describe('generateSeedPhrase', () => {
  it('returns 24 words', () => {
    const { words } = generateSeedPhrase()
    expect(words).toHaveLength(24)
  })

  it('all words are in the BIP39 English wordlist', () => {
    const { words } = generateSeedPhrase()
    for (const w of words) {
      expect(wordlist).toContain(w)
    }
  })

  it('two calls produce different phrases', () => {
    const a = generateSeedPhrase()
    const b = generateSeedPhrase()
    expect(a.words.join(' ')).not.toBe(b.words.join(' '))
  })
})

describe('validateSeedPhrase', () => {
  it('validates a freshly generated phrase', () => {
    expect(validateSeedPhrase(generateSeedPhrase())).toBe(true)
  })

  it('rejects a tampered phrase', () => {
    const phrase = generateSeedPhrase()
    phrase.words[0] = 'notaword'
    expect(validateSeedPhrase(phrase)).toBe(false)
  })

  it('rejects wrong word count', () => {
    expect(validateSeedPhrase({ words: ['abandon', 'ability'] })).toBe(false)
  })
})

describe('seedPhraseToKeyPair', () => {
  const phrase = generateSeedPhrase()

  it('is deterministic — same phrase yields same keys', () => {
    const a = seedPhraseToKeyPair(phrase)
    const b = seedPhraseToKeyPair(phrase)
    expect(toHex(a.publicKey)).toBe(toHex(b.publicKey))
    expect(toHex(a.privateKey)).toBe(toHex(b.privateKey))
  })

  it('returns 32-byte keys', () => {
    const { publicKey, privateKey } = seedPhraseToKeyPair(phrase)
    expect(publicKey).toHaveLength(32)
    expect(privateKey).toHaveLength(32)
  })

  it('different phrases → different keys', () => {
    const other = generateSeedPhrase()
    const a = seedPhraseToKeyPair(phrase)
    const b = seedPhraseToKeyPair(other)
    expect(toHex(a.publicKey)).not.toBe(toHex(b.publicKey))
  })

  it('throws on invalid phrase', () => {
    expect(() => seedPhraseToKeyPair({ words: ['abandon', 'ability'] })).toThrow()
  })
})

describe('DID encode / decode', () => {
  it('roundtrips public key through DID', () => {
    const { publicKey } = seedPhraseToKeyPair(generateSeedPhrase())
    const did = publicKeyToDID(publicKey)
    expect(did).toMatch(/^did:key:z/)
    const recovered = didToPublicKey(did)
    expect(toHex(recovered)).toBe(toHex(publicKey))
  })

  it('throws on non-did:key input', () => {
    expect(() => didToPublicKey('did:web:example.com')).toThrow()
  })
})

describe('sign / verify', () => {
  const phrase = generateSeedPhrase()
  const { publicKey, privateKey } = seedPhraseToKeyPair(phrase)
  const msg = new TextEncoder().encode('hello commons')

  it('verifies a valid signature', () => {
    const sig = sign(msg, privateKey)
    expect(verify(msg, sig, publicKey)).toBe(true)
  })

  it('rejects a signature from a different key', () => {
    const { privateKey: other } = seedPhraseToKeyPair(generateSeedPhrase())
    const sig = sign(msg, other)
    expect(verify(msg, sig, publicKey)).toBe(false)
  })

  it('rejects a tampered message', () => {
    const sig = sign(msg, privateKey)
    const tampered = new TextEncoder().encode('hello COMMONS')
    expect(verify(tampered, sig, publicKey)).toBe(false)
  })

  it('rejects a truncated signature', () => {
    const sig = sign(msg, privateKey)
    expect(verify(msg, sig.slice(0, 32), publicKey)).toBe(false)
  })
})

describe('encryptPrivateKey / decryptPrivateKey', () => {
  const { privateKey } = seedPhraseToKeyPair(generateSeedPhrase())
  const password = 'correct-horse-battery-staple-123'

  it('roundtrips the private key', async () => {
    const enc = await encryptPrivateKey(privateKey, password)
    const dec = await decryptPrivateKey(enc, password)
    expect(toHex(dec)).toBe(toHex(privateKey))
  })

  it('throws on wrong password', async () => {
    const enc = await encryptPrivateKey(privateKey, password)
    await expect(decryptPrivateKey(enc, 'wrong-password')).rejects.toThrow()
  })

  it('two encryptions of same key produce different ciphertexts (random IV/salt)', async () => {
    const a = await encryptPrivateKey(privateKey, password)
    const b = await encryptPrivateKey(privateKey, password)
    expect(a.ciphertext).not.toBe(b.ciphertext)
    expect(a.salt).not.toBe(b.salt)
    expect(a.iv).not.toBe(b.iv)
  })
}, 30_000)

describe('encryptMessage / decryptMessage', () => {
  const { publicKey, privateKey } = seedPhraseToKeyPair(generateSeedPhrase())

  it('roundtrips plaintext', async () => {
    const msg = 'hello peer-to-peer world'
    const enc = await encryptMessage(msg, publicKey)
    const dec = await decryptMessage(enc, privateKey)
    expect(dec).toBe(msg)
  })

  it('produces different ciphertext on each call (random ephemeral key)', async () => {
    const msg = 'same plaintext'
    const a = await encryptMessage(msg, publicKey)
    const b = await encryptMessage(msg, publicKey)
    expect(a.ciphertext).not.toBe(b.ciphertext)
    expect(a.ephemeralPublicKey).not.toBe(b.ephemeralPublicKey)
  })

  it('cannot be decrypted with a different private key', async () => {
    const { privateKey: other } = seedPhraseToKeyPair(generateSeedPhrase())
    const enc = await encryptMessage('secret', publicKey)
    await expect(decryptMessage(enc, other)).rejects.toThrow()
  })
})
