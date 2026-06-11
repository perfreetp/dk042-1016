import React, { useState } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { usePetStore } from '@/store/petStore'
import styles from './index.module.scss'

const ClueSubmitPage: React.FC = () => {
  const router = useRouter()
  const { addClue, getPetById } = usePetStore()
  const petId = router.params.id || ''
  const pet = getPetById(petId)

  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (isSubmitting) return

    if (!petId) {
      Taro.showToast({ title: '参数错误', icon: 'none' })
      return
    }
    if (!content.trim()) {
      Taro.showToast({ title: '请描述线索内容', icon: 'none' })
      return
    }
    if (!location.trim()) {
      Taro.showToast({ title: '请输入发现地点', icon: 'none' })
      return
    }

    setIsSubmitting(true)
    const now = new Date()
    const formattedTime = time || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    try {
      addClue({
        petId,
        content: content.trim(),
        photo: '',
        location: location.trim(),
        time: formattedTime,
        reporterName: reporterName.trim() || '匿名好心人'
      })

      console.info('[ClueSubmit] Success', { petId, content: content.trim() })
      Taro.showToast({ title: '线索提交成功！', icon: 'success' })

      setTimeout(() => {
        setContent('')
        setLocation('')
        setTime('')
        setReporterName('')
        setIsSubmitting(false)
        Taro.navigateBack()
      }, 1500)
    } catch (err) {
      console.error('[ClueSubmit] Failed', err)
      setIsSubmitting(false)
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' })
    }
  }

  return (
    <View className={styles.cluePage}>
      {pet && (
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.08)'
        }}>
          <Text style={{ fontSize: 24 }}>🐾</Text>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontSize: 28, fontWeight: 600, color: '#2D2D2D' }}>
              为「{pet.nickname}」提供线索
            </Text>
            <Text style={{ fontSize: 24, color: '#999', marginTop: 4 }}>
              {pet.breed} · {pet.lostLocation}
            </Text>
          </View>
        </View>
      )}

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>线索照片（选填）</Text>
        <View className={styles.photoUpload}>
          <View className={styles.addPhoto}>
            <Text className={styles.addIcon}>+</Text>
            <Text className={styles.addText}>添加照片</Text>
          </View>
        </View>
        <Text style={{ fontSize: 22, color: '#999', marginTop: 8 }}>
          照片上传功能开发中，不影响提交线索
        </Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>线索详情</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>线索描述<Text className={styles.required}>*</Text></Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述您看到的情况，如宠物状态、方向、环境等"
            value={content}
            onInput={e => setContent(e.detail.value)}
            maxlength={500}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>发现地点<Text className={styles.required}>*</Text></Text>
          <Input
            className={styles.input}
            placeholder="请输入发现地点，如：阳光花园3栋花坛旁"
            value={location}
            onInput={e => setLocation(e.detail.value)}
            maxlength={50}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>发现时间</Text>
          <Input
            className={styles.input}
            placeholder="如：2026-06-12 09:30（不填则使用当前时间）"
            value={time}
            onInput={e => setTime(e.detail.value)}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>您的称呼</Text>
          <Input
            className={styles.input}
            placeholder="方便主人感谢您（不填则显示匿名）"
            value={reporterName}
            onInput={e => setReporterName(e.detail.value)}
            maxlength={20}
          />
        </View>
      </View>

      <View className={styles.submitBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitText}>
            {isSubmitting ? '提交中...' : '提交线索'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default ClueSubmitPage
