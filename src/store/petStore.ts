import { create } from 'zustand'
import type { PetInfo, ClueInfo, SightingPoint, MessageInfo, ProgressUpdate } from '@/types/pet'
import { mockPets } from '@/data/pets'
import { mockSightings } from '@/data/sightings'
import { mockMessages } from '@/data/messages'

interface PetStore {
  pets: PetInfo[]
  sightings: SightingPoint[]
  messages: MessageInfo[]
  clues: ClueInfo[]
  progressUpdates: ProgressUpdate[]

  addPet: (pet: Omit<PetInfo, 'id' | 'createdAt' | 'viewCount' | 'clueCount' | 'volunteerCount' | 'isExpired'>) => void
  getPetById: (id: string) => PetInfo | undefined
  incrementViewCount: (id: string) => void
  incrementClueCount: (id: string) => void
  incrementVolunteerCount: (id: string) => void
  markPetFound: (id: string) => void
  setPetExpired: (id: string) => void

  addClue: (clue: Omit<ClueInfo, 'id' | 'createdAt' | 'isVerified' | 'isFalseReport'>) => void
  getCluesByPetId: (petId: string) => ClueInfo[]

  getSightingsByType: (type: 'all' | 'sighting' | 'patrol' | 'route') => SightingPoint[]
  getSightingsByPetId: (petId: string) => SightingPoint[]
  getSightingsByPetAndType: (petId: string, type: 'all' | 'sighting' | 'patrol' | 'route') => SightingPoint[]

  getUnreadMessageCount: () => number
  getExpiredPets: () => PetInfo[]

  addProgressUpdate: (update: Omit<ProgressUpdate, 'id'>) => void
  getProgressByPetId: (petId: string) => ProgressUpdate[]
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [...mockPets],
  sightings: [...mockSightings],
  messages: [...mockMessages],
  clues: [],
  progressUpdates: [
    { id: 'p1', petId: '1', content: '主人发布走失信息', createdAt: '2026-06-10 10:00' },
    { id: 'p2', petId: '1', content: '邻居反馈3栋花坛附近目击', createdAt: '2026-06-10 11:30' },
    { id: 'p3', petId: '1', content: '物业发布小区广播', createdAt: '2026-06-11 16:00' },
    { id: 'p4', petId: '1', content: '5栋车库入口发现疑似踪迹', createdAt: '2026-06-12 09:30' },
    { id: 'p5', petId: '2', content: '主人发布走失信息', createdAt: '2026-06-11 18:30' },
    { id: 'p6', petId: '2', content: '幼儿园附近发现疑似柯基', createdAt: '2026-06-11 19:00' }
  ],

  addPet: (petData) => {
    const newPet: PetInfo = {
      ...petData,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      viewCount: 0,
      clueCount: 0,
      volunteerCount: 0,
      isExpired: false
    }
    const initialProgress: ProgressUpdate = {
      id: `pg${Date.now()}`,
      petId: newPet.id,
      content: '主人发布走失信息',
      createdAt: newPet.createdAt
    }
    set((state) => ({
      pets: [newPet, ...state.pets],
      progressUpdates: [initialProgress, ...state.progressUpdates]
    }))
    console.info('[Store] New pet added:', newPet.id, newPet.nickname)
  },

  getPetById: (id) => {
    return get().pets.find(p => p.id === id)
  },

  incrementViewCount: (id) => {
    set((state) => ({
      pets: state.pets.map(p =>
        p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
      )
    }))
  },

  incrementClueCount: (id) => {
    set((state) => ({
      pets: state.pets.map(p =>
        p.id === id ? { ...p, clueCount: p.clueCount + 1 } : p
      )
    }))
  },

  incrementVolunteerCount: (id) => {
    set((state) => ({
      pets: state.pets.map(p =>
        p.id === id ? { ...p, volunteerCount: p.volunteerCount + 1 } : p
      )
    }))
  },

  markPetFound: (id) => {
    set((state) => ({
      pets: state.pets.map(p =>
        p.id === id ? { ...p, status: 'found' as const, description: '已平安回家！感谢所有邻居的热心帮助！' } : p
      )
    }))
  },

  setPetExpired: (id) => {
    set((state) => ({
      pets: state.pets.map(p =>
        p.id === id ? { ...p, isExpired: true } : p
      )
    }))
  },

  addClue: (clueData) => {
    const newClue: ClueInfo = {
      ...clueData,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      isVerified: false,
      isFalseReport: false
    }
    set((state) => ({ clues: [newClue, ...state.clues] }))
    get().incrementClueCount(clueData.petId)

    const baseLat = 30.57
    const baseLng = 104.068
    const randomLat = baseLat + (Math.random() - 0.5) * 0.01
    const randomLng = baseLng + (Math.random() - 0.5) * 0.01
    const newSighting: SightingPoint = {
      id: `s${Date.now()}`,
      petId: clueData.petId,
      latitude: randomLat,
      longitude: randomLng,
      address: clueData.location,
      time: clueData.time,
      description: clueData.content.slice(0, 30),
      type: 'sighting'
    }
    set((state) => ({ sightings: [newSighting, ...state.sightings] }))

    const progressContent = `新线索：${clueData.content.slice(0, 20)}${clueData.content.length > 20 ? '...' : ''}`
    get().addProgressUpdate({
      petId: clueData.petId,
      content: progressContent,
      photo: clueData.photo || undefined,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    })

    console.info('[Store] New clue added:', newClue.id, 'for pet:', clueData.petId)
  },

  getCluesByPetId: (petId) => {
    return get().clues.filter(c => c.petId === petId)
  },

  getSightingsByType: (type) => {
    if (type === 'all') return get().sightings
    return get().sightings.filter(s => s.type === type)
  },

  getSightingsByPetId: (petId) => {
    return get().sightings.filter(s => s.petId === petId)
  },

  getSightingsByPetAndType: (petId, type) => {
    const petSightings = get().sightings.filter(s => s.petId === petId)
    if (type === 'all') return petSightings
    return petSightings.filter(s => s.type === type)
  },

  getUnreadMessageCount: () => {
    return get().messages.filter(m => !m.isRead).length
  },

  getExpiredPets: () => {
    return get().pets.filter(p => p.isExpired)
  },

  addProgressUpdate: (update) => {
    const newUpdate: ProgressUpdate = {
      ...update,
      id: `pg${Date.now()}`
    }
    set((state) => ({
      progressUpdates: [newUpdate, ...state.progressUpdates]
    }))
  },

  getProgressByPetId: (petId) => {
    return get().progressUpdates
      .filter(u => u.petId === petId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }
}))
