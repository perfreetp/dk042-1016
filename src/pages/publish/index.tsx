import React, { useState } from 'react'
import { View, Text, Input, Textarea, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { usePetStore } from '@/store/petStore'
import type { PetType, BodySize } from '@/types/pet'
import styles from './index.module.scss'

const petTypes: { key: PetType; label: string }[] = [
  { key: 'cat', label: '🐱 猫' },
  { key: 'dog', label: '🐶 狗' },
  { key: 'other', label: '🐾 其他' }
]

const bodySizes: { key: BodySize; label: string }[] = [
  { key: 'small', label: '小型' },
  { key: 'medium', label: '中型' },
  { key: 'large', label: '大型' }
]

const photoIds: Record<PetType, number[]> = {
  cat: [237, 718, 1025],
  dog: [659, 783, 237],
  other: [1025, 237, 659]
}

const PublishPage: React.FC = () => {
  const { addPet } = usePetStore()

  const [petType, setPetType] = useState<PetType>('cat')
  const [nickname, setNickname] = useState('')
  const [breed, setBreed] = useState('')
  const [bodySize, setBodySize] = useState<BodySize>('medium')
  const [features, setFeatures] = useState('')
  const [lostTime, setLostTime] = useState('')
  const [lostLocation, setLostLocation] = useState('')
  const [description, setDescription] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [rewardStr, setRewardStr] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleNicknameInput = (e: any) => {
    setNickname(e.detail.value)
  }

  const handleBreedInput = (e: any) => {
    setBreed(e.detail.value)
  }

  const handleFeaturesInput = (e: any) => {
    setFeatures(e.detail.value)
  }

  const handleLostTimeInput = (e: any) => {
    setLostTime(e.detail.value)
  }

  const handleLocationInput = (e: any) => {
    setLostLocation(e.detail.value)
  }

  const handleDescInput = (e: any) => {
    setDescription(e.detail.value)
  }

  const handleOwnerNameInput = (e: any) => {
    setOwnerName(e.detail.value)
  }

  const handlePhoneInput = (e: any) => {
    setOwnerPhone(e.detail.value)
  }

  const handleRewardInput = (e: any) => {
    setRewardStr(e.detail.value)
  }

  const handleChooseImage = () => {
    Taro.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      success: (res) => {
        const sourceType: ('album' | 'camera')[] = res.tapIndex === 0
          ? ['album']
          : ['camera']
        Taro.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType,
          success: (imgRes) => {
            const tempPath = imgRes.tempFilePaths[0]
            if (tempPath) {
              setPhotoUrl(tempPath)
              console.info('[Publish] Photo selected:', tempPath)
            }
          },
          fail: (err) => {
            console.error('[Publish] Choose image failed:', err)
            if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
              Taro.showToast({ title: '选择照片失败', icon: 'none' })
            }
          }
        })
      },
      fail: () => {}
    })
  }

  const handleRemovePhoto = () => {
    setPhotoUrl('')
  }

  const handleSubmit = () => {
    if (submitting) return

    if (!nickname.trim()) {
      Taro.showToast({ title: '请输入宠物昵称', icon: 'none' })
      return
    }
    if (!breed.trim()) {
      Taro.showToast({ title: '请输入品种', icon: 'none' })
      return
    }
    if (!lostLocation.trim()) {
      Taro.showToast({ title: '请输入走失地点', icon: 'none' })
      return
    }
    if (!ownerPhone.trim()) {
      Taro.showToast({ title: '请输入联系电话', icon: 'none' })
      return
    }

    setSubmitting(true)
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const defaultTime = `${year}-${month}-${day} ${hour}:${minute}`

    let finalPhoto = photoUrl
    if (!finalPhoto) {
      const photos = photoIds[petType]
      const photoId = photos[Math.floor(Math.random() * photos.length)]
      finalPhoto = `https://picsum.photos/id/${photoId}/300/300`
    }
    const rewardNum = rewardStr ? parseInt(rewardStr) || 0 : 0

    try {
      addPet({
        nickname: nickname.trim(),
        petType,
        breed: breed.trim(),
        bodySize,
        features: features.trim(),
        photo: finalPhoto,
        status: 'lost',
        lostTime: lostTime.trim() || defaultTime,
        lostLocation: lostLocation.trim(),
        ownerName: ownerName.trim() || '匿名',
        ownerPhone: ownerPhone.trim(),
        reward: rewardNum,
        description: description.trim()
      })

      console.info('[Publish] Success', { nickname: nickname.trim(), location: lostLocation.trim() })
      Taro.showToast({ title: '发布成功', icon: 'success' })

      setTimeout(() => {
        setNickname('')
        setBreed('')
        setFeatures('')
        setLostTime('')
        setLostLocation('')
        setDescription('')
        setOwnerName('')
        setOwnerPhone('')
        setRewardStr('')
        setPhotoUrl('')
        setSubmitting(false)
        Taro.switchTab({ url: '/pages/home/index' })
      }, 1500)
    } catch (err) {
      console.error('[Publish] Failed', err)
      setSubmitting(false)
      Taro.showToast({ title: '发布失败，请重试', icon: 'none' })
    }
  }

  return (
    <View className={styles.publishPage}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>宠物照片</Text>
        <View className={styles.photoUpload}>
          {photoUrl ? (
            <View className={styles.photoItem}>
              <Image className={styles.photoImg} src={photoUrl} mode="aspectFill" />
              <View className={styles.removeBtn} onClick={handleRemovePhoto}>
                <Text className={styles.removeText}>×</Text>
              </View>
            </View>
          ) : (
            <View className={styles.addPhoto} onClick={handleChooseImage}>
              <Text className={styles.addIcon}>+</Text>
              <Text className={styles.addText}>添加照片</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 22, color: '#999' }}>
          建议上传清晰正面照，方便邻居识别
        </Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>宠物类型<Text className={styles.required}>*</Text></Text>
          <View className={styles.typeSelector}>
            {petTypes.map((t) => (
              <View
                key={t.key}
                className={classnames(styles.typeOption, petType === t.key && styles.active)}
                onClick={() => setPetType(t.key)}
              >
                <Text className={styles.typeText}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>宠物昵称<Text className={styles.required}>*</Text></Text>
          <Input
            className={styles.input}
            placeholder='请输入宠物昵称'
            value={nickname}
            onInput={handleNicknameInput}
            maxlength={20}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>品种<Text className={styles.required}>*</Text></Text>
          <Input
            className={styles.input}
            placeholder='如：橘猫、柯基、英短'
            value={breed}
            onInput={handleBreedInput}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>体型</Text>
          <View className={styles.sizeSelector}>
            {bodySizes.map((s) => (
              <View
                key={s.key}
                className={classnames(styles.sizeOption, bodySize === s.key && styles.active)}
                onClick={() => setBodySize(s.key)}
              >
                <Text className={styles.sizeText}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>明显特征</Text>
          <Textarea
            className={styles.textarea}
            placeholder='描述宠物明显特征，如毛色、伤痕、项圈等'
            value={features}
            onInput={handleFeaturesInput}
            maxlength={200}
            autoHeight={false}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>走失信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>走失时间</Text>
          <Input
            className={styles.input}
            placeholder='如：2026-06-12 08:30（不填则使用当前时间）'
            value={lostTime}
            onInput={handleLostTimeInput}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>走失地点<Text className={styles.required}>*</Text></Text>
          <Input
            className={styles.input}
            placeholder='请输入走失地点，如：阳光花园3栋楼下'
            value={lostLocation}
            onInput={handleLocationInput}
            maxlength={50}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>补充描述</Text>
          <Textarea
            className={styles.textarea}
            placeholder='描述走失时的情况、宠物习性等'
            value={description}
            onInput={handleDescInput}
            maxlength={500}
            autoHeight={false}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>联系与悬赏</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>主人姓名</Text>
          <Input
            className={styles.input}
            placeholder='请输入您的姓名'
            value={ownerName}
            onInput={handleOwnerNameInput}
            maxlength={20}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>联系电话<Text className={styles.required}>*</Text></Text>
          <Input
            className={styles.input}
            type='number'
            placeholder='请输入联系电话'
            value={ownerPhone}
            onInput={handlePhoneInput}
            maxlength={11}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>悬赏金额（选填）</Text>
          <View className={styles.rewardInput}>
            <Text className={styles.rewardUnit}>¥</Text>
            <Input
              className={styles.input}
              type='digit'
              placeholder='0'
              value={rewardStr}
              onInput={handleRewardInput}
              maxlength={6}
            />
          </View>
        </View>
      </View>

      <View className={styles.submitBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitText}>
            {submitting ? '发布中...' : '发布寻宠信息'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PublishPage
