import type { SightingPoint } from '@/types/pet'

export const mockSightings: SightingPoint[] = [
  {
    id: 's1',
    petId: '1',
    latitude: 30.5728,
    longitude: 104.0668,
    address: '阳光花园3栋楼下',
    time: '2026-06-10 09:15',
    description: '有人在3栋花坛附近看到橘猫',
    type: 'sighting'
  },
  {
    id: 's2',
    petId: '1',
    latitude: 30.5735,
    longitude: 104.0675,
    address: '阳光花园5栋车库入口',
    time: '2026-06-10 11:30',
    description: '车库入口处发现疑似橘座',
    type: 'sighting'
  },
  {
    id: 's3',
    petId: '2',
    latitude: 30.5680,
    longitude: 104.0720,
    address: '碧桂园东区南门',
    time: '2026-06-11 18:10',
    description: '柯基受惊后往东方向跑',
    type: 'sighting'
  },
  {
    id: 's4',
    petId: '2',
    latitude: 30.5695,
    longitude: 104.0740,
    address: '碧桂园东区幼儿园旁',
    time: '2026-06-11 19:00',
    description: '幼儿园门口发现小型犬',
    type: 'sighting'
  },
  {
    id: 's5',
    petId: '3',
    latitude: 30.5650,
    longitude: 104.0650,
    address: '翡翠湾7号楼旁',
    time: '2026-06-09 14:30',
    description: '蓝白异瞳猫出现在7号楼',
    type: 'sighting'
  },
  {
    id: 's6',
    petId: '4',
    latitude: 30.5700,
    longitude: 104.0690,
    address: '锦绣家园篮球场',
    time: '2026-06-12 07:15',
    description: '金毛从篮球场往北跑',
    type: 'sighting'
  },
  {
    id: 'p1',
    petId: '1',
    latitude: 30.5730,
    longitude: 104.0670,
    address: '阳光花园4栋',
    time: '',
    description: '重点巡查：4栋一楼通道',
    type: 'patrol'
  },
  {
    id: 'p2',
    petId: '2',
    latitude: 30.5690,
    longitude: 104.0730,
    address: '碧桂园东区绿化带',
    time: '',
    description: '重点巡查：东区绿化带',
    type: 'patrol'
  },
  {
    id: 'r1',
    petId: '1',
    latitude: 30.5728,
    longitude: 104.0668,
    address: '搜索路线起点',
    time: '',
    description: '3栋→5栋→车库→4栋',
    type: 'route'
  },
  {
    id: 'r2',
    petId: '2',
    latitude: 30.5680,
    longitude: 104.0720,
    address: '搜索路线起点',
    time: '',
    description: '南门→幼儿园→东区绿化带',
    type: 'route'
  }
]

export const patrolPoints = mockSightings.filter(s => s.type === 'patrol')
export const sightingPoints = mockSightings.filter(s => s.type === 'sighting')
export const routePoints = mockSightings.filter(s => s.type === 'route')
