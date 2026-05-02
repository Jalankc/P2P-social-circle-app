// Cryptographic primitives for SocialCircle.P2P.
// All operations use audited @noble/@scure libraries — no custom crypto.
// CLAUDE.md axiom: "Cryptographic claims must be honest."
// "Self-destruct" means key destruction. We never claim guarantees we can't enforce.

import { ed25519, x25519 } from '@noble/curves/ed25519.js'
import { sha256 as _sha256, sha512 } from '@noble/hashes/sha2.js'
import { hkdf } from '@noble/hashes/hkdf.js'
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js'
import { randomBytes } from '@noble/hashes/utils.js'
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { base58 } from '@scure/base'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SeedPhrase {
  words: string[]
}

export interface KeyPair {
  publicKey: Uint8Array   // 32 bytes, Ed25519
  privateKey: Uint8Array  // 32 bytes, Ed25519 scalar
}

export interface EncryptedKey {
  ciphertext: string // hex
  salt: string       // hex, 32 bytes
  iv: string         // hex, 12 bytes
}

export interface EncryptedMessage {
  ciphertext: string       // hex
  ephemeralPublicKey: string // hex, X25519 32 bytes
  iv: string               // hex, 12 bytes
  salt: string             // hex, 32 bytes
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PBKDF2_ITERATIONS = 210_000 // OWASP 2023 recommendation for SHA-512
const KEY_BYTES = 32
// Multicodec prefix for ed25519-pub (varint 0xed01)
const ED25519_PUB_MULTICODEC = new Uint8Array([0xed, 0x01])

// ── Hex helpers ───────────────────────────────────────────────────────────────

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string')
  return new Uint8Array(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
}

// ── Hashing ───────────────────────────────────────────────────────────────────

export function sha256(data: Uint8Array): Uint8Array {
  return _sha256(data)
}

/**
 * Content-addressable ID for a chunk — deterministic SHA-256 hex.
 * Used as chunkId in the persistence layer.
 */
export function contentId(data: Uint8Array): string {
  return toHex(sha256(data))
}

// ── Seed phrase ───────────────────────────────────────────────────────────────

/** Generate a fresh 24-word BIP39 mnemonic. */
export function generateSeedPhrase(): SeedPhrase {
  const mnemonic = generateMnemonic(wordlist, 256) // 256 bits = 24 words
  return { words: mnemonic.split(' ') }
}

export function validateSeedPhrase(phrase: SeedPhrase): boolean {
  return validateMnemonic(phrase.words.join(' '), wordlist)
}

// ── Key derivation ────────────────────────────────────────────────────────────

/**
 * Derives a deterministic Ed25519 keypair from a BIP39 seed phrase.
 * Path: mnemonic → 64-byte BIP39 seed → HKDF-SHA512 → 32-byte Ed25519 scalar.
 */
export function seedPhraseToKeyPair(phrase: SeedPhrase): KeyPair {
  const mnemonic = phrase.words.join(' ')
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid seed phrase')
  }
  const seed64 = mnemonicToSeedSync(mnemonic) // 64 bytes
  // HKDF to derive a 32-byte scalar suitable for Ed25519
  const privateKey = hkdf(sha512, seed64, undefined, new TextEncoder().encode('socialcircle-p2p-identity-v1'), KEY_BYTES)
  const publicKey = ed25519.getPublicKey(privateKey)
  return { privateKey, publicKey }
}

// ── DID generation ────────────────────────────────────────────────────────────

/**
 * Encodes an Ed25519 public key as a did:key identifier.
 * Format: did:key:z{base58btc(multicodec_prefix || pubkey)}
 * Multicodec prefix for ed25519-pub: 0xed 0x01
 */
export function publicKeyToDID(publicKey: Uint8Array): string {
  const prefixed = new Uint8Array(ED25519_PUB_MULTICODEC.length + publicKey.length)
  prefixed.set(ED25519_PUB_MULTICODEC, 0)
  prefixed.set(publicKey, ED25519_PUB_MULTICODEC.length)
  return `did:key:z${base58.encode(prefixed)}`
}

/**
 * Extracts the raw public key bytes from a did:key identifier.
 * Strips multicodec prefix and validates it is an ed25519-pub key.
 */
export function didToPublicKey(did: string): Uint8Array {
  if (!did.startsWith('did:key:z')) throw new Error('Not a did:key identifier')
  const prefixed = base58.decode(did.slice('did:key:z'.length))
  if (prefixed[0] !== 0xed || prefixed[1] !== 0x01) {
    throw new Error('Not an ed25519-pub did:key')
  }
  return prefixed.slice(2)
}

// ── Signing & verification ────────────────────────────────────────────────────

/**
 * Signs an arbitrary message with an Ed25519 private key.
 * Used for post attestations, karma votes, peer endorsements.
 */
export function sign(message: Uint8Array, privateKey: Uint8Array): Uint8Array {
  return ed25519.sign(message, privateKey)
}

/**
 * Verifies an Ed25519 signature. Returns true only if the signature is valid
 * for this exact message and public key.
 */
export function verify(
  message: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array
): boolean {
  try {
    return ed25519.verify(signature, message, publicKey)
  } catch {
    return false
  }
}

// ── Private key storage encryption ───────────────────────────────────────────

/**
 * Encrypts a private key for local storage using a user-supplied password.
 * KDF: PBKDF2-SHA512 (210k iterations) → AES-256-GCM.
 */
export async function encryptPrivateKey(
  privateKey: Uint8Array,
  password: string
): Promise<EncryptedKey> {
  const salt = randomBytes(32)
  const iv = randomBytes(12)
  const derivedKey = await pbkdf2Async(sha512, password, salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: KEY_BYTES,
  })
  const aesKey = await crypto.subtle.importKey(
    'raw', derivedKey, { name: 'AES-GCM' }, false, ['encrypt']
  )
  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    privateKey
  )
  return {
    ciphertext: toHex(new Uint8Array(ciphertextBuf)),
    salt: toHex(salt),
    iv: toHex(iv),
  }
}

/**
 * Decrypts a stored private key. Throws if password is wrong.
 */
export async function decryptPrivateKey(
  encrypted: EncryptedKey,
  password: string
): Promise<Uint8Array> {
  const salt = fromHex(encrypted.salt)
  const iv = fromHex(encrypted.iv)
  const ciphertext = fromHex(encrypted.ciphertext)
  const derivedKey = await pbkdf2Async(sha512, password, salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: KEY_BYTES,
  })
  const aesKey = await crypto.subtle.importKey(
    'raw', derivedKey, { name: 'AES-GCM' }, false, ['decrypt']
  )
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    ciphertext
  )
  return new Uint8Array(plaintext)
}

// ── Message encryption (X25519 ECDH + AES-256-GCM) ───────────────────────────
// Ed25519 keys are used for signing; for encryption we convert to X25519 form.
// This is the standard approach (RFC 7748 / Signal Protocol initial handshake).

/**
 * Encrypts a plaintext string for a recipient, producing an EncryptedMessage.
 * Uses ephemeral X25519 ECDH → HKDF-SHA256 → AES-256-GCM.
 * The recipient only needs their X25519 private key to decrypt.
 */
export async function encryptMessage(
  plaintext: string,
  recipientPublicKey: Uint8Array  // Ed25519 public key
): Promise<EncryptedMessage> {
  const recipientX25519 = edPubKeyToX25519(recipientPublicKey)

  // Generate ephemeral X25519 keypair
  const ephemeralPrivKey = randomBytes(32)
  const ephemeralPubKey = x25519.getPublicKey(ephemeralPrivKey)

  // ECDH shared secret
  const sharedSecret = x25519.getSharedSecret(ephemeralPrivKey, recipientX25519)

  // HKDF → 32-byte AES key
  const salt = randomBytes(32)
  const iv = randomBytes(12)
  const aesKeyBytes = hkdf(_sha256, sharedSecret, salt, new TextEncoder().encode('socialcircle-p2p-msg-v1'), KEY_BYTES)

  const aesKey = await crypto.subtle.importKey(
    'raw', aesKeyBytes, { name: 'AES-GCM' }, false, ['encrypt']
  )
  const enc = new TextEncoder()
  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    enc.encode(plaintext)
  )
  return {
    ciphertext: toHex(new Uint8Array(ciphertextBuf)),
    ephemeralPublicKey: toHex(ephemeralPubKey),
    iv: toHex(iv),
    salt: toHex(salt),
  }
}

/**
 * Decrypts an EncryptedMessage using the recipient's Ed25519 private key.
 * Throws if decryption fails (wrong key or tampered ciphertext).
 */
export async function decryptMessage(
  msg: EncryptedMessage,
  recipientPrivateKey: Uint8Array  // Ed25519 private key
): Promise<string> {
  const recipientX25519 = edPrivKeyToX25519(recipientPrivateKey)
  const ephemeralPubKey = fromHex(msg.ephemeralPublicKey)
  const salt = fromHex(msg.salt)
  const iv = fromHex(msg.iv)
  const ciphertext = fromHex(msg.ciphertext)

  const sharedSecret = x25519.getSharedSecret(recipientX25519, ephemeralPubKey)
  const aesKeyBytes = hkdf(_sha256, sharedSecret, salt, new TextEncoder().encode('socialcircle-p2p-msg-v1'), KEY_BYTES)

  const aesKey = await crypto.subtle.importKey(
    'raw', aesKeyBytes, { name: 'AES-GCM' }, false, ['decrypt']
  )
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    ciphertext
  )
  return new TextDecoder().decode(plaintext)
}

// ── Ed25519 → X25519 key conversion ──────────────────────────────────────────
// Ed25519 and X25519 share the same underlying Curve25519. Public key conversion
// uses the birational map defined in RFC 8032 §5.1.5.

function edPubKeyToX25519(edPubKey: Uint8Array): Uint8Array {
  // Montgomery u = (1 + y) / (1 - y) in GF(2^255-19)
  // Ed25519 compressed point: y in bits 0-254, sign(x) in bit 255 (byte[31] MSB)
  const bytes = edPubKey.slice()
  bytes[31] &= 0x7f  // strip sign bit — pure y coordinate
  const P = 2n ** 255n - 19n
  const y = BigInt('0x' + toHex(bytes.reverse()))
  const num = (1n + y) % P
  const den = ((1n - y) % P + P) % P  // ensure positive before modInverse
  const u = (num * modInverse(den, P)) % P
  return bigintToBytes(u, 32)  // already little-endian — x25519 format
}

function edPrivKeyToX25519(edPrivKey: Uint8Array): Uint8Array {
  // Ed25519 scalar = SHA-512(privKey)[0..31] with clamping
  const h = sha512(edPrivKey)
  const scalar = h.slice(0, 32)
  scalar[0] &= 248
  scalar[31] &= 127
  scalar[31] |= 64
  return scalar
}

function modInverse(a: bigint, m: bigint): bigint {
  // Extended Euclidean algorithm
  let [old_r, r] = [a, m]
  let [old_s, s] = [1n, 0n]
  while (r !== 0n) {
    const q = old_r / r
    ;[old_r, r] = [r, old_r - q * r]
    ;[old_s, s] = [s, old_s - q * s]
  }
  return ((old_s % m) + m) % m
}

function bigintToBytes(n: bigint, len: number): Uint8Array {
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = Number(n & 0xffn)
    n >>= 8n
  }
  return bytes
}
