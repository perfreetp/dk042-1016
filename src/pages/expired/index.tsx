import React from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { usePetStore } from '@/store/petStore'
import StatusTag from '@/components/StatusTag'
import styles from './index.module.scss'

const ExpiredPage: React.FC = () => {
  const { pets, markPetFound, setPetExpired } = usePetStore()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const expiredPets = pets.filter(p =>
    !p.isExpired &&
    p.status !== 'found' &&
    p.lostTime.slice(0, 10) < sevenDaysAgo
  )

  const handleMarkFound = (id: string, nickname: string) => {
    console.info('[Expired] Mark as found:', id, nickname)
    Taro.showModal({
      title: '确认找回',
      content: `确认${nickname}已平安回家？`,
      success: (res) => {
        if (res.confirm) {
          markPetFound(id)
          Taro.showToast({ title: '已标记为找回', icon: 'success' })
        }
      }
    }).catch(err => {
      console.error('[Expired] Modal error:', err)
    })
  }

  const handleKeepActive = (id: string) => {
    console.info('[Expired] Keep active:', id)
    setPetExpired(id)
    Taro.showToast({ title: '已确认仍在寻找中', icon: 'success' })
  }

  if (expiredPets.length === 0) {
    return (
      <View className={styles.expiredPage}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>✅</Text>
          <Text className={styles.emptyText}>暂无过期信息</Text>
          <Text className={styles.emptyDesc}>所有寻宠信息都在有效期内</Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView scrollY className={styles.expiredPage}>
      {expiredPets.map(pet => (
        <View key={pet.id} className={styles.expiredCard}>
          <View className={styles.cardHeader}>
            <Image className={styles.petPhoto} src={pet.photo} mode="aspectFill" />
            <View className={styles.petInfo}>
              <View style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text className={styles.petName}>{pet.nickname}</Text>
                <StatusTag status={pet.status} size="small" />
              </View>
              <Text className={styles.lostTime}>走失时间：{pet.lostTime}</Text>
              <Text className={styles.lostLocation}>{pet.lostLocation}</Text>
            </View>
          </View>
          <View className={styles.actionRow}>
            <View
              className={classnames(styles.actionBtn, styles.found)}
              onClick={() => handleMarkFound(pet.id, pet.nickname)}
            >
              <Text className={styles.btnText}>已找回</Text>
            </View>
            <View
              className={classnames(styles.actionBtn, styles.keep)}
              onClick={() => handleKeepActive(pet.id)}
            >
              <Text className={styles.btnText}>仍在寻找</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

export default ExpiredPage
