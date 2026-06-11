import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import StatusTag from '@/components/StatusTag'
import { usePetStore } from '@/store/petStore'
import type { PetInfo } from '@/types/pet'
import styles from './index.module.scss'

const DetailPage: React.FC = () => {
  const router = useRouter()
  const { getPetById, getProgressByPetId, incrementViewCount, incrementVolunteerCount, pets } = usePetStore()
  const [pet, setPet] = useState<PetInfo | undefined>()
  const [progressData, setProgressData] = useState<Array<{ text: string; time: string }>>([])

  const loadData = () => {
    const petId = router.params.id
    console.info('[Detail] Loading pet with id:', petId)
    const foundPet = getPetById(petId || '')
    setPet(foundPet)

    if (foundPet) {
      incrementViewCount(foundPet.id)
      const progress = getProgressByPetId(foundPet.id)
      if (progress.length > 0) {
        setProgressData(progress.map(p => ({ text: p.content, time: p.createdAt })))
      } else {
        setProgressData([
          { text: '主人发布走失信息', time: foundPet.createdAt }
        ])
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [router.params.id])

  useDidShow(() => {
    loadData()
  })

  useEffect(() => {
    const foundPet = pets.find(p => p.id === router.params.id)
    if (foundPet && pet && foundPet.clueCount !== pet.clueCount) {
      setPet(foundPet)
      const progress = getProgressByPetId(foundPet.id)
      if (progress.length > 0) {
        setProgressData(progress.map(p => ({ text: p.content, time: p.createdAt })))
      }
    }
  }, [pets])

  if (!pet) {
    return (
      <View className={styles.detailPage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
        <Text style={{ fontSize: 28, color: '#999' }}>宠物不存在</Text>
      </View>
    )
  }

  const petTypeLabel = pet.petType === 'cat' ? '猫' : pet.petType === 'dog' ? '狗' : '其他'
  const bodySizeLabel = pet.bodySize === 'small' ? '小型' : pet.bodySize === 'medium' ? '中型' : '大型'

  const handleCall = () => {
    console.info('[Detail] Call owner for pet:', pet.id, pet.nickname)
    const phone = pet.ownerPhone.replace(/\*/g, '0')
    Taro.makePhoneCall({ phoneNumber: phone }).catch(err => {
      console.error('[Detail] Call failed', err)
      Taro.showToast({ title: '拨打失败，请稍后重试', icon: 'none' })
    })
  }

  const handleSubmitClue = () => {
    console.info('[Detail] Navigate to submit clue for pet:', pet.id)
    Taro.navigateTo({ url: `/pages/clueSubmit/index?id=${pet.id}` })
  }

  const handlePhotoCompare = () => {
    console.info('[Detail] Photo compare for pet:', pet.id)
    Taro.showToast({ title: '照片比对功能开发中', icon: 'none' })
  }

  const handleVolunteer = () => {
    console.info('[Detail] Volunteer sign up for pet:', pet.id)
    incrementVolunteerCount(pet.id)
    Taro.showToast({ title: '协寻报名成功！', icon: 'success' })
    setTimeout(() => {
      loadData()
    }, 500)
  }

  const handleReport = () => {
    console.info('[Detail] Report false clue for pet:', pet.id)
    Taro.navigateTo({ url: '/pages/report/index' })
  }

  return (
    <ScrollView scrollY className={styles.detailPage}>
      <View className={styles.photoSection}>
        <Image className={styles.petPhoto} src={pet.photo} mode="aspectFill" />
        <View className={styles.statusBadge}>
          <StatusTag status={pet.status} />
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.petName}>{pet.nickname}</Text>
        <View className={styles.petMeta}>
          <Text className={styles.metaTag}>{petTypeLabel}</Text>
          <Text className={styles.metaTag}>{pet.breed}</Text>
          <Text className={styles.metaTag}>{bodySizeLabel}</Text>
        </View>
        <View className={styles.featureRow}>
          <Text className={styles.featureLabel}>明显特征</Text>
          <Text className={styles.featureText}>{pet.features}</Text>
        </View>
      </View>

      {pet.reward > 0 && (
        <View className={styles.rewardHighlight}>
          <View className={styles.rewardInfo}>
            <Text className={styles.rewardLabel}>悬赏金额</Text>
            <Text className={styles.rewardAmount}>¥{pet.reward}</Text>
          </View>
          <Text className={styles.rewardTip}>提供有效线索可获得</Text>
        </View>
      )}

      <View className={styles.detailSection}>
        <Text className={styles.sectionTitle}>走失详情</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>走失时间</Text>
          <Text className={styles.infoValue}>{pet.lostTime}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>走失地点</Text>
          <Text className={styles.infoValue}>{pet.lostLocation}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>主人</Text>
          <Text className={styles.infoValue}>{pet.ownerName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系方式</Text>
          <Text className={styles.infoValue}>{pet.ownerPhone}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>补充描述</Text>
          <Text className={styles.infoValue}>{pet.description}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>浏览/线索</Text>
          <Text className={styles.infoValue}>{pet.viewCount}次浏览 · {pet.clueCount}条线索 · {pet.volunteerCount}人参与</Text>
        </View>
      </View>

      <View className={styles.actionGrid}>
        <View className={styles.actionCard} onClick={handleSubmitClue}>
          <Text className={styles.actionEmoji}>🔍</Text>
          <Text className={styles.actionLabel}>提交线索</Text>
          <Text className={styles.actionDesc}>提供你看到的信息</Text>
        </View>
        <View className={styles.actionCard} onClick={handlePhotoCompare}>
          <Text className={styles.actionEmoji}>📷</Text>
          <Text className={styles.actionLabel}>照片比对</Text>
          <Text className={styles.actionDesc}>上传照片进行比对</Text>
        </View>
        <View className={styles.actionCard} onClick={handleVolunteer}>
          <Text className={styles.actionEmoji}>🙋</Text>
          <Text className={styles.actionLabel}>协寻报名</Text>
          <Text className={styles.actionDesc}>参与搜索行动</Text>
        </View>
        <View className={styles.actionCard} onClick={handleReport}>
          <Text className={styles.actionEmoji}>🚫</Text>
          <Text className={styles.actionLabel}>虚假举报</Text>
          <Text className={styles.actionDesc}>举报不实线索</Text>
        </View>
      </View>

      <View className={styles.progressSection}>
        <Text className={styles.sectionTitle}>寻宠进展</Text>
        {progressData.map((item, i) => (
          <View key={i} className={styles.progressItem}>
            <View className={styles.dot}>
              <View className={styles.dotInner} />
            </View>
            <View className={styles.progressContent}>
              <Text className={styles.progressText}>{item.text}</Text>
              <Text className={styles.progressTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.callBtn} onClick={handleCall}>
          <Text className={styles.callText}>电话联系</Text>
        </View>
        <View className={styles.clueBtn} onClick={handleSubmitClue}>
          <Text className={styles.clueText}>提供线索</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default DetailPage
