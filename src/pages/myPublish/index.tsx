import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePetStore } from '@/store/petStore'
import PetCard from '@/components/PetCard'
import styles from './index.module.scss'

const MyPublishPage: React.FC = () => {
  const { pets } = usePetStore()

  const handlePublish = () => {
    Taro.switchTab({ url: '/pages/publish/index' })
  }

  if (pets.length === 0) {
    return (
      <View className={styles.myPublishPage}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>暂无发布记录</Text>
          <View className={styles.actionBtn} onClick={handlePublish}>
            <Text className={styles.btnText}>去发布寻宠信息</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView scrollY className={styles.myPublishPage}>
      {pets.map(pet => (
        <View style={{ marginBottom: 24 }} key={pet.id}>
          <PetCard pet={pet} />
        </View>
      ))}
    </ScrollView>
  )
}

export default MyPublishPage
