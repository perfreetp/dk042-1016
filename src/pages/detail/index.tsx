import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, Textarea } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import StatusTag from '@/components/StatusTag'
import { usePetStore } from '@/store/petStore'
import type { PetInfo } from '@/types/pet'
import styles from './index.module.scss'

const DetailPage: React.FC = () => {
  const router = useRouter()
  const { getPetById, getProgressByPetId, incrementViewCount, incrementVolunteerCount, pets, markPetFound, getCluesByPetId, markClueFalse } = usePetStore()
  const [pet, setPet] = useState<PetInfo | undefined>()
  const [progressData, setProgressData] = useState<Array<{ text: string; time: string; photo?: string; type?: string }>>([])
  const [clues, setClues] = useState<Array<any>>([])
  const [showFoundModal, setShowFoundModal] = useState(false)
  const [thanksNote, setThanksNote] = useState('')
  const [activeTab, setActiveTab] = useState<'progress' | 'clues'>('progress')

  const loadData = () => {
    const petId = router.params.id
    console.info('[Detail] Loading pet with id:', petId)
    const foundPet = getPetById(petId || '')
    setPet(foundPet)

    if (foundPet) {
      incrementViewCount(foundPet.id)
      const progress = getProgressByPetId(foundPet.id)
      if (progress.length > 0) {
        setProgressData(progress.map(p => ({ text: p.content, time: p.createdAt, photo: p.photo, type: p.type })))
      } else {
        setProgressData([
          { text: '主人发布走失信息', time: foundPet.createdAt, type: 'normal' }
        ])
      }
      const petClues = getCluesByPetId(foundPet.id)
      setClues([...petClues].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
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
    if (foundPet && pet && (foundPet.clueCount !== pet.clueCount || foundPet.status !== pet.status)) {
      setPet(foundPet)
      const progress = getProgressByPetId(foundPet.id)
      if (progress.length > 0) {
        setProgressData(progress.map(p => ({ text: p.content, time: p.createdAt, photo: p.photo, type: p.type })))
      }
      const petClues = getCluesByPetId(foundPet.id)
      setClues([...petClues].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
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

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 7) return phone
    return phone.slice(0, 3) + '****' + phone.slice(-4)
  }

  const handleCall = () => {
    console.info('[Detail] Call owner for pet:', pet.id, pet.nickname)
    Taro.showModal({
      title: '联系主人',
      content: `确认拨打 ${maskPhone(pet.ownerPhone)} 联系${pet.nickname}的主人？`,
      confirmText: '拨打',
      confirmColor: '#FF6B35',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: pet.ownerPhone }).catch(err => {
            console.error('[Detail] Call failed', err)
            Taro.showToast({ title: '拨打失败，请稍后重试', icon: 'none' })
          })
        }
      }
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

  const handleMarkFound = () => {
    setShowFoundModal(true)
  }

  const handleConfirmFound = () => {
    if (!pet) return
    markPetFound(pet.id, thanksNote)
    setShowFoundModal(false)
    setThanksNote('')
    Taro.showToast({ title: '已标记为找回', icon: 'success' })
    setTimeout(() => loadData(), 500)
  }

  const handleCancelFound = () => {
    setShowFoundModal(false)
    setThanksNote('')
  }

  const handleReportClue = (clueId: string) => {
    Taro.showModal({
      title: '举报虚假线索',
      content: '确认举报此条线索为虚假信息吗？',
      confirmText: '确认举报',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          markClueFalse(clueId)
          Taro.showToast({ title: '举报成功', icon: 'success' })
          setTimeout(() => loadData(), 500)
        }
      }
    })
  }

  const handleViewMap = () => {
    console.info('[Detail] View map for pet:', pet.id, pet.nickname)
    Taro.navigateTo({ url: `/pages/map/index?id=${pet.id}&name=${encodeURIComponent(pet.nickname)}` })
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
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Text className={styles.sectionTitle}>走失详情</Text>
          <View className={styles.viewMapBtn} onClick={handleViewMap}>
            <Text style={{ fontSize: 24, color: '#FF6B35' }}>🗺️ 查看地图</Text>
          </View>
        </View>
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
          <Text className={styles.infoValue}>{maskPhone(pet.ownerPhone)}</Text>
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

      {pet.status !== 'found' && (
        <View style={{ margin: '0 32rpx 24rpx' }}>
          <View className={styles.markFoundBtn} onClick={handleMarkFound}>
            <Text style={{ fontSize: 28, color: '#fff', fontWeight: 600 }}>✅ 标记为已找回</Text>
          </View>
        </View>
      )}

      <View className={styles.tabSection}>
        <View style={{ display: 'flex', borderBottom: '2rpx solid #F0F0F0', marginBottom: 24 }}>
          <View
            className={classnames(styles.tabItem, activeTab === 'progress' && styles.tabActive)}
            onClick={() => setActiveTab('progress')}
          >
            <Text style={{ fontSize: 28, fontWeight: 600 }}>寻宠进展</Text>
          </View>
          <View
            className={classnames(styles.tabItem, activeTab === 'clues' && styles.tabActive)}
            onClick={() => setActiveTab('clues')}
          >
            <Text style={{ fontSize: 28, fontWeight: 600 }}>线索列表</Text>
            {clues.filter(c => !c.isFalseReport).length > 0 && (
              <View className={styles.clueCount}>
                <Text style={{ fontSize: 20, color: '#fff' }}>{clues.filter(c => !c.isFalseReport).length}</Text>
              </View>
            )}
          </View>
        </View>

        {activeTab === 'progress' && (
          <View>
            {progressData.map((item, i) => (
              <View key={i} className={classnames(styles.progressItem, item.type && styles[`type-${item.type}`])}>
                <View className={styles.dot}>
                  <View className={styles.dotInner} />
                </View>
                <View className={styles.progressContent}>
                  <Text className={styles.progressText}>{item.text}</Text>
                  {item.photo && (
                    <Image className={styles.progressPhoto} src={item.photo} mode="aspectFill" />
                  )}
                  <Text className={styles.progressTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'clues' && (
          <View>
            {clues.length > 0 ? (
              clues.map((clue) => (
                <View
                  key={clue.id}
                  className={classnames(styles.clueCard, clue.isFalseReport && styles.clueFalse)}
                >
                  <View style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    {clue.photo ? (
                      <Image className={styles.cluePhoto} src={clue.photo} mode="aspectFill" />
                    ) : (
                      <View className={styles.cluePhotoPlaceholder}>
                        <Text style={{ fontSize: 32 }}>📷</Text>
                      </View>
                    )}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 28, color: '#2D2D2D', fontWeight: 500, marginBottom: 8 }}>
                        {clue.content}
                      </Text>
                      <View style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontSize: 22, color: '#999' }}>📍 {clue.location}</Text>
                        <Text style={{ fontSize: 22, color: '#999' }}>⏰ {clue.time || clue.createdAt}</Text>
                      </View>
                      <Text style={{ fontSize: 22, color: '#999' }}>提交人：{clue.reporterName}</Text>
                    </View>
                  </View>
                  {!clue.isFalseReport ? (
                    <View className={styles.reportBtn} onClick={() => handleReportClue(clue.id)}>
                      <Text style={{ fontSize: 22, color: '#E74C3C' }}>举报虚假</Text>
                    </View>
                  ) : (
                    <View className={styles.falseTag}>
                      <Text style={{ fontSize: 22, color: '#E74C3C' }}>已举报</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={{ padding: 60, textAlign: 'center' }}>
                <Text style={{ fontSize: 28, color: '#999' }}>暂无线索</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {pet.status !== 'found' && (
        <View className={styles.bottomBar}>
          <View className={styles.callBtn} onClick={handleCall}>
            <Text className={styles.callText}>电话联系</Text>
          </View>
          <View className={styles.clueBtn} onClick={handleSubmitClue}>
            <Text className={styles.clueText}>提供线索</Text>
          </View>
        </View>
      )}

      {showFoundModal && (
        <View className={styles.modalMask} onClick={handleCancelFound}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text style={{ fontSize: 32, fontWeight: 600, color: '#2D2D2D', marginBottom: 16 }}>确认宠物已找回？</Text>
            <Text style={{ fontSize: 24, color: '#999', marginBottom: 24 }}>标记后状态将更新为「已找回」</Text>
            <Textarea
              className={styles.thanksTextarea}
              placeholder="写一段感谢的话，感谢帮助过你的邻居们（选填）"
              value={thanksNote}
              onInput={(e) => setThanksNote(e.detail.value)}
              maxlength={200}
              autoHeight={false}
            />
            <View style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <View className={styles.modalCancelBtn} onClick={handleCancelFound}>
                <Text style={{ fontSize: 28, color: '#666' }}>取消</Text>
              </View>
              <View className={styles.modalConfirmBtn} onClick={handleConfirmFound}>
                <Text style={{ fontSize: 28, color: '#fff', fontWeight: 600 }}>确认找回</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default DetailPage
