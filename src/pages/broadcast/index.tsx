import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import styles from './index.module.scss'

const mockBroadcasts = [
  {
    id: '1',
    title: '阳光花园寻宠广播',
    content: '各位邻居请注意：3栋区域已加强巡查，请邻居们留意一只叫"橘座"的橘猫，右耳有缺口。如有发现请联系138****6789。',
    time: '2026-06-11 16:00'
  },
  {
    id: '2',
    title: '碧桂园东区寻宠广播',
    content: '各位业主：今日18点左右在东区南门走失一只柯基，名叫豆豆，戴红色项圈。请大家留意，感谢配合！',
    time: '2026-06-11 19:00'
  },
  {
    id: '3',
    title: '锦绣家园寻宠提示',
    content: '温馨提示：近期小区内有宠物走失，请各位业主遛狗时牵好狗绳，家猫注意关好门窗。',
    time: '2026-06-10 10:00'
  }
]

const BroadcastPage: React.FC = () => {
  return (
    <ScrollView scrollY className={styles.broadcastPage}>
      {mockBroadcasts.map(b => (
        <View key={b.id} className={styles.broadcastCard}>
          <Text className={styles.cardTitle}>📢 {b.title}</Text>
          <Text className={styles.cardContent}>{b.content}</Text>
          <Text className={styles.cardTime}>{b.time}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default BroadcastPage
