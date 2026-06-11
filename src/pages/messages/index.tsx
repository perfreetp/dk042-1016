import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { usePetStore } from '@/store/petStore'
import styles from './index.module.scss'

const typeLabels: Record<string, string> = {
  clue: '🔍',
  found: '✅',
  system: '📢',
  thanks: '🙏'
}

const MessagesPage: React.FC = () => {
  const { messages } = usePetStore()

  const handleMessageClick = (petId: string) => {
    console.info('[Messages] Click message, petId:', petId)
    if (petId) {
      Taro.navigateTo({ url: `/pages/detail/index?id=${petId}` })
    }
  }

  if (messages.length === 0) {
    return (
      <View className={styles.messagesPage}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>暂无消息</Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView scrollY className={styles.messagesPage}>
      {messages.map(msg => (
        <View
          key={msg.id}
          className={classnames(styles.messageCard, !msg.isRead && styles.unread)}
          onClick={() => handleMessageClick(msg.petId)}
        >
          <View className={styles.cardHeader}>
            <Text className={styles.title}>
              {typeLabels[msg.type] || '📋'} {msg.title}
            </Text>
            {!msg.isRead && <View className={styles.unreadDot} />}
          </View>
          <Text className={styles.content}>{msg.content}</Text>
          <Text className={styles.time}>{msg.createdAt}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default MessagesPage
