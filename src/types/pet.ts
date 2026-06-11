export type PetStatus = 'lost' | 'found' | 'suspected'
export type PetType = 'cat' | 'dog' | 'other'
export type BodySize = 'small' | 'medium' | 'large'

export interface PetInfo {
  id: string
  nickname: string
  petType: PetType
  breed: string
  bodySize: BodySize
  features: string
  photo: string
  status: PetStatus
  lostTime: string
  lostLocation: string
  ownerName: string
  ownerPhone: string
  reward: number
  description: string
  createdAt: string
  isExpired: boolean
  viewCount: number
  clueCount: number
  volunteerCount: number
}

export interface ClueInfo {
  id: string
  petId: string
  content: string
  photo: string
  location: string
  time: string
  reporterName: string
  createdAt: string
  isVerified: boolean
  isFalseReport: boolean
}

export interface SightingPoint {
  id: string
  petId: string
  latitude: number
  longitude: number
  address: string
  time: string
  description: string
  type: 'sighting' | 'patrol' | 'route'
}

export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  myPublishCount: number
  myParticipateCount: number
  myFoundCount: number
}

export interface MessageInfo {
  id: string
  type: 'clue' | 'found' | 'system' | 'thanks'
  title: string
  content: string
  petId: string
  createdAt: string
  isRead: boolean
}

export interface ProgressUpdate {
  id: string
  petId: string
  content: string
  createdAt: string
}
