import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface StatusTagProps {
  status: 'lost' | 'found' | 'suspected' | 'reward'
  text?: string
  size?: 'small' | 'normal'
}

const statusMap: Record<string, string> = {
  lost: '走失中',
  found: '已找回',
  suspected: '疑似发现',
  reward: '悬赏'
}

const StatusTag: React.FC<StatusTagProps> = ({ status, text, size = 'normal' }) => {
  return (
    <View className={classnames(styles.tag, styles[status], size === 'small' && styles.small)}>
      <Text className={styles.tagText}>{text || statusMap[status]}</Text>
    </View>
  )
}

export default StatusTag
