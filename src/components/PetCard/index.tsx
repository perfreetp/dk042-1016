import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import type { PetInfo } from '@/types/pet'
import styles from './index.module.scss'

interface PetCardProps {
  pet: PetInfo
  compact?: boolean
}

const PetCard: React.FC<PetCardProps> = ({ pet, compact = false }) => {
  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${pet.id}` })
  }

  const petTypeLabel = pet.petType === 'cat' ? '猫' : pet.petType === 'dog' ? '狗' : '其他'

  return (
    <View className={classnames(styles.card, compact && styles.compact)} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image className={styles.photo} src={pet.photo} mode="aspectFill" />
        <View className={styles.statusWrap}>
          <StatusTag status={pet.status} size="small" />
        </View>
      </View>
      <View className={styles.info}>
        <View className={styles.nameRow}>
          <Text className={styles.nickname}>{pet.nickname}</Text>
          <Text className={styles.petType}>{petTypeLabel}</Text>
        </View>
        <Text className={styles.breed}>{pet.breed} · {pet.bodySize === 'small' ? '小型' : pet.bodySize === 'medium' ? '中型' : '大型'}</Text>
        {!compact && (
          <Text className={styles.features}>{pet.features}</Text>
        )}
        <View className={styles.metaRow}>
          <Text className={styles.location}>{pet.lostLocation}</Text>
          <Text className={styles.time}>{pet.lostTime.split(' ')[0]}</Text>
        </View>
        {pet.reward > 0 && (
          <View className={styles.rewardRow}>
            <Text className={styles.rewardLabel}>悬赏</Text>
            <Text className={styles.rewardAmount}>¥{pet.reward}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default PetCard
