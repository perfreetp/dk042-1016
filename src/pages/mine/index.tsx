import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePetStore } from '@/store/petStore'
import styles from './index.module.scss'

const menuItems = [
  { emoji: '📋', label: '我的发布', path: '/pages/myPublish/index' },
  { emoji: '🤝', label: '参与协寻', path: '/pages/participate/index' },
  { emoji: '🔔', label: '消息提醒', path: '/pages/messages/index' },
  { emoji: '✅', label: '找回确认', path: '/pages/foundConfirm/index' },
  { emoji: '📢', label: '物业广播', path: '/pages/broadcast/index' },
  { emoji: '🚫', label: '虚假举报', path: '/pages/report/index' },
  { emoji: '⏰', label: '过期处理', path: '/pages/expired/index' }
]

const thanksList = [
  { name: '李阿姨', pet: '花花' },
  { name: '王叔叔', pet: '花花' },
  { name: '张同学', pet: '阿黄' },
  { name: '刘师傅', pet: '阿黄' },
  { name: '赵姐姐', pet: '花花' }
]

const MinePage: React.FC = () => {
  const { pets, getUnreadMessageCount, getExpiredPets } = usePetStore()
  const unreadCount = getUnreadMessageCount()
  const expiredCount = getExpiredPets().length
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const needExpiredCount = pets.filter(p =>
    !p.isExpired && p.status !== 'found' && p.lostTime.slice(0, 10) < sevenDaysAgo
  ).length

  const myPublishCount = pets.length
  const myParticipateCount = pets.filter(p => p.volunteerCount > 0).length
  const myFoundCount = pets.filter(p => p.status === 'found').length

  const handleMenuClick = (path: string, label: string) => {
    console.info('[Mine] Menu clicked:', label, 'path:', path)
    Taro.navigateTo({ url: path }).catch(err => {
      console.error('[Mine] Navigate failed:', err)
      Taro.showToast({ title: `${label}功能开发中`, icon: 'none' })
    })
  }

  return (
    <View className={styles.minePage}>
      <View className={styles.profileCard}>
        <View className={styles.avatar}>
          <Text className={styles.avatarText}>🐱</Text>
        </View>
        <View className={styles.profileInfo}>
          <Text className={styles.nickname}>爱宠达人</Text>
          <Text className={styles.phone}>138****6789</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{myPublishCount}</Text>
          <Text className={styles.statLabel}>我的发布</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{myParticipateCount}</Text>
          <Text className={styles.statLabel}>参与协寻</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{myFoundCount}</Text>
          <Text className={styles.statLabel}>成功找回</Text>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>功能菜单</Text>
        </View>
        {menuItems.map(item => (
          <View
            key={item.label}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.path, item.label)}
          >
            <View className={styles.menuLeft}>
              <Text className={styles.menuEmoji}>{item.emoji}</Text>
              <Text className={styles.menuLabel}>{item.label}</Text>
            </View>
            <View className={styles.menuRight}>
              {item.label === '消息提醒' && unreadCount > 0 && (
                <View className={styles.menuBadge}>
                  <Text className={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
              {item.label === '过期处理' && needExpiredCount > 0 && (
                <View className={styles.menuBadge}>
                  <Text className={styles.badgeText}>{needExpiredCount}</Text>
                </View>
              )}
              <Text className={styles.menuArrow}>▶</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.thanksSection}>
        <Text className={styles.thanksTitle}>🏅 感谢名单</Text>
        <View className={styles.thanksList}>
          {thanksList.map((t, i) => (
            <View key={i} className={styles.thanksItem}>
              <View className={styles.thanksAvatar}>
                <Text className={styles.thanksAvatarText}>{t.name[0]}</Text>
              </View>
              <Text className={styles.thanksName}>{t.name}</Text>
              <Text className={styles.thanksPet}>帮找{t.pet}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default MinePage
