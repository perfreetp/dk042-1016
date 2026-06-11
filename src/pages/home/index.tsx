import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import SectionHeader from '@/components/SectionHeader'
import PetCard from '@/components/PetCard'
import { usePetStore } from '@/store/petStore'
import styles from './index.module.scss'

type FilterType = 'all' | 'lost' | 'suspected' | 'found'

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'lost', label: '走失中' },
  { key: 'suspected', label: '疑似发现' },
  { key: 'found', label: '已找回' }
]

const HomePage: React.FC = () => {
  const { pets } = usePetStore()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const lostPets = useMemo(() => pets.filter(p => p.status === 'lost'), [pets])
  const suspectedPets = useMemo(() => pets.filter(p => p.status === 'suspected'), [pets])
  const foundPets = useMemo(() => pets.filter(p => p.status === 'found'), [pets])
  const rewardPets = useMemo(() => pets.filter(p => p.reward > 0 && p.status !== 'found'), [pets])

  const filteredPets = useMemo(() => {
    if (activeFilter === 'all') return pets
    return pets.filter(p => p.status === activeFilter)
  }, [activeFilter, pets])

  const handleSearch = () => {
    console.info('[Home] Search tapped')
    Taro.showToast({ title: '搜索功能开发中', icon: 'none' })
  }

  const handleRewardPetClick = (petId: string) => {
    console.info('[Home] Click reward pet:', petId)
    Taro.navigateTo({ url: `/pages/detail/index?id=${petId}` })
  }

  const handleViewAll = (type: string) => {
    console.info(`[Home] View all: ${type}`)
  }

  return (
    <View className={styles.homePage}>
      <View className={styles.searchBar}>
        <View className={styles.searchInput} onClick={handleSearch}>
          <Text className={styles.searchText}>搜索宠物昵称、品种、特征...</Text>
        </View>
      </View>

      <View className={styles.bannerSection}>
        <View className={styles.bannerCard}>
          <Text className={styles.bannerTitle}>邻里携手，帮毛孩子回家</Text>
          <Text className={styles.bannerDesc}>每一条线索都是回家的希望</Text>
          <View className={styles.bannerStats}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{lostPets.length}</Text>
              <Text className={styles.statLabel}>走失中</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{suspectedPets.length}</Text>
              <Text className={styles.statLabel}>疑似发现</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{foundPets.length}</Text>
              <Text className={styles.statLabel}>已找回</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{rewardPets.length}</Text>
              <Text className={styles.statLabel}>悬赏中</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.broadcastCard}>
        <Text className={styles.broadcastIcon}>📢</Text>
        <Text className={styles.broadcastText}>阳光花园物业：3栋区域已加强巡查，请邻居们留意橘猫</Text>
      </View>

      <View className={styles.filterTabs}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterTab, activeFilter === f.key && styles.active)}
            onClick={() => setActiveFilter(f.key)}
          >
            <Text className={styles.filterText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {rewardPets.length > 0 && (
        <View className={styles.section}>
          <SectionHeader
            title="悬赏寻宠"
            subtitle={`${rewardPets.length}条`}
            actionText="查看全部"
            onAction={() => handleViewAll('reward')}
          />
          <ScrollView scrollX className={styles.scrollRow}>
            {rewardPets.map(pet => (
              <View
                key={pet.id}
                className={styles.rewardScrollItem}
                onClick={() => handleRewardPetClick(pet.id)}
              >
                <View className={styles.rewardCard}>
                  <Image className={styles.rewardImage} src={pet.photo} mode="aspectFill" />
                  <View className={styles.rewardInfo}>
                    <Text className={styles.rewardName}>{pet.nickname}</Text>
                    <View className={styles.rewardMeta}>
                      <Text className={styles.rewardPrice}>¥{pet.reward}</Text>
                      <Text className={styles.rewardLocation}>{pet.lostLocation}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View className={styles.section}>
        <SectionHeader
          title="最新走失"
          subtitle={`${filteredPets.length}条`}
          actionText="查看全部"
          onAction={() => handleViewAll('latest')}
        />
        <View className={styles.petList}>
          {filteredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </View>
      </View>
    </View>
  )
}

export default HomePage
