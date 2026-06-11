import type { MessageInfo } from '@/types/pet'

export const mockMessages: MessageInfo[] = [
  {
    id: 'm1',
    type: 'clue',
    title: '新线索提醒',
    content: '您的宠物"橘座"有新的目击线索，点击查看详情',
    petId: '1',
    createdAt: '2026-06-12 09:30',
    isRead: false
  },
  {
    id: 'm2',
    type: 'system',
    title: '物业广播',
    content: '阳光花园物业已发布寻宠广播，3栋区域加强巡查',
    petId: '1',
    createdAt: '2026-06-11 16:00',
    isRead: false
  },
  {
    id: 'm3',
    type: 'thanks',
    title: '感谢通知',
    content: '花花主人感谢您的协助，花花已平安回家！',
    petId: '5',
    createdAt: '2026-06-10 10:00',
    isRead: true
  },
  {
    id: 'm4',
    type: 'found',
    title: '找回确认',
    content: '阿黄已被主人确认找回，感谢所有参与协寻的邻居',
    petId: '10',
    createdAt: '2026-06-09 14:00',
    isRead: true
  },
  {
    id: 'm5',
    type: 'clue',
    title: '线索更新',
    content: '豆豆疑似在幼儿园附近出现，请附近邻居留意',
    petId: '2',
    createdAt: '2026-06-12 08:00',
    isRead: false
  },
  {
    id: 'm6',
    type: 'system',
    title: '过期提醒',
    content: '您发布的"大橘"寻宠信息已超过7天，是否标记为已过期？',
    petId: '7',
    createdAt: '2026-06-12 07:00',
    isRead: false
  }
]
