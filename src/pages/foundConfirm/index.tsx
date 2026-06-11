import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { usePetStore } from '@/store/petStore'
import PetCard from '@/components/PetCard'
import styles from './index.module.scss'

const FoundConfirmPage: React.FC = () => {
  const { pets } = usePetStore()
  const myPets = pets.filter(p => p.status === 'lost' || p.status === 'suspected')

  return (
    <ScrollView scrollY className={styles.placeholderPage} style={{ display: 'block', padding: '24rpx 32rpx' }}>
      {myPets.length > 0 ? (
        <View className={styles.list}>
          {myPets.map(pet => (
            <View key={pet.id} style={{ marginBottom: 24 }}>
              <PetCard pet={pet} />
            </View>
          ))}
        </View>
      ) : (
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 120 }}>
          <Text className={styles.icon}>✅</Text>
          <Text className={styles.title}>找回确认</Text>
          <Text className={styles.desc}>暂时没有需要确认找回的宠物</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default FoundConfirmPage
