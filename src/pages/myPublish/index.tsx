import React, { useState } from 'react'
import { View, Text, ScrollView, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePetStore } from '@/store/petStore'
import PetCard from '@/components/PetCard'
import styles from './index.module.scss'

const MyPublishPage: React.FC = () => {
  const { pets, markPetFound } = usePetStore()
  const [showModal, setShowModal] = useState(false)
  const [currentPetId, setCurrentPetId] = useState('')
  const [thanksNote, setThanksNote] = useState('')

  const handlePublish = () => {
    Taro.switchTab({ url: '/pages/publish/index' })
  }

  const handleMarkFound = (petId: string) => {
    setCurrentPetId(petId)
    setThanksNote('')
    setShowModal(true)
  }

  const handleConfirmFound = () => {
    markPetFound(currentPetId, thanksNote)
    setShowModal(false)
    setThanksNote('')
    Taro.showToast({ title: '已标记为找回', icon: 'success' })
  }

  const handleCancel = () => {
    setShowModal(false)
    setThanksNote('')
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
          {pet.status !== 'found' && (
            <View style={{ padding: '0 32rpx', marginTop: -16 }}>
              <View className={styles.markFoundBtn} onClick={() => handleMarkFound(pet.id)}>
                <Text style={{ fontSize: 24, color: '#2BA471', fontWeight: 600 }}>✅ 标记为已找回</Text>
              </View>
            </View>
          )}
        </View>
      ))}

      {showModal && (
        <View className={styles.modalMask} onClick={handleCancel}>
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
              <View className={styles.modalCancelBtn} onClick={handleCancel}>
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

export default MyPublishPage
