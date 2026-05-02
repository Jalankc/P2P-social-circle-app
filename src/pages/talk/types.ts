export type MessageType = 'text' | 'image' | 'voice'

export interface Message {
  id: string
  senderId: string
  text: string
  type: MessageType
  timestamp: string
  encrypted: boolean
  selfDestruct: boolean
  selfDestructSeconds?: number
  read: boolean
  delivered: boolean
  imageUrl?: string
  voiceDuration?: number
}

export interface Conversation {
  id: string
  name: string
  handle: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  encrypted: boolean
  online: boolean
  lastSeen?: string
  peerCount: number
  verified: boolean
  fingerprint: string
  selfDestruct?: boolean
  category: 'active' | 'offline' | 'anonymous'
  messages: Message[]
}

export type FilterTab = 'all' | 'encrypted' | 'groups' | 'requests'
