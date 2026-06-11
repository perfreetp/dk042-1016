import React from 'react'
import { View, Text } from '@tarojs/components'
import { usePetStore } from '@/store/petStore'
import PetCard from '@/components/PetCard'
import { ScrollView } from '@tarojs/components'
import styles from './index.module.scss'

const ParticipatePage: React.FC = () => {
  const { pets } = usePetStore()
  const participatedPets = pets.filter(p => p.volunteerCount > 0)

  return (
    <ScrollView scrollY className={styles.placeholderPage} style={{ display: 'block', padding: '24rpx 32rpx' }}>
      {participatedPets.length > 0 ? (
        participatedPets.map(pet => (
          <View key={pet.id} style={{ marginBottom: 24 }}>
            <PetCard pet={pet} />
          </View>
        ))
      ) : (
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 120 }}>
          <Text className={styles.icon}>🤝</Text>
          <Text className={styles.title}>参与协寻</Text>
          <Text className={styles.desc}>还没有参与任何协寻，去首页看看需要帮助的毛孩子吧</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default ParticipatePage
