import React, { useState } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
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

const PublishPage: React.FC = () => {
  const [petType, setPetType] = useState<PetType>('cat')
  const [nickname, setNickname] = useState('')
  const [breed, setBreed] = useState('')
  const [bodySize, setBodySize] = useState<BodySize>('medium')
  const [features, setFeatures] = useState('')
  const [lostTime, setLostTime] = useState('')
  const [lostLocation, setLostLocation] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [reward, setReward] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
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
      Taro.showToast({ title: '请输入联系方式', icon: 'none' })
      return
    }
    console.info('[Publish] Submit', { nickname, breed, petType, bodySize, lostLocation })
    Taro.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/home/index' })
    }, 1500)
  }

  const handleLocationPick = () => {
    console.info('[Publish] Pick location')
    Taro.showToast({ title: '位置选择功能开发中', icon: 'none' })
  }

  return (
    <View className={styles.publishPage}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>宠物照片</Text>
        <View className={styles.photoUpload}>
          <View className={styles.addPhoto}>
            <Text className={styles.addIcon}>+</Text>
            <Text className={styles.addText}>添加照片</Text>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>宠物类型<Text className={styles.required}>*</Text></Text>
          <View className={styles.typeSelector}>
            {petTypes.map(t => (
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
            placeholder="请输入宠物昵称"
            value={nickname}
            onInput={e => setNickname(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>品种<Text className={styles.required}>*</Text></Text>
          <Input
            className={styles.input}
            placeholder="如：橘猫、柯基、英短"
            value={breed}
            onInput={e => setBreed(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>体型</Text>
          <View className={styles.sizeSelector}>
            {bodySizes.map(s => (
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
            placeholder="描述宠物明显特征，如毛色、伤痕、项圈等"
            value={features}
            onInput={e => setFeatures(e.detail.value)}
            maxlength={200}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>走失信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>走失时间</Text>
          <Input
            className={styles.input}
            placeholder="如：2026-06-12 08:30"
            value={lostTime}
            onInput={e => setLostTime(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>走失地点<Text className={styles.required}>*</Text></Text>
          <View className={styles.locationPicker} onClick={handleLocationPick}>
            <Text className={lostLocation ? styles.locationText : styles.locationPlaceholder}>
              {lostLocation || '点击选择或输入走失地点'}
            </Text>
            <Text className={styles.arrowText}>▶</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>补充描述</Text>
          <Textarea
            className={styles.textarea}
            placeholder="描述走失时的情况、宠物习性等"
            value={description}
            onInput={e => setDescription(e.detail.value)}
            maxlength={500}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>联系与悬赏</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>主人姓名</Text>
          <Input
            className={styles.input}
            placeholder="请输入您的姓名"
            value={ownerName}
            onInput={e => setOwnerName(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>联系电话<Text className={styles.required}>*</Text></Text>
          <Input
            className={styles.input}
            type="number"
            placeholder="请输入联系电话"
            value={ownerPhone}
            onInput={e => setOwnerPhone(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>悬赏金额（选填）</Text>
          <View className={styles.rewardInput}>
            <Text className={styles.rewardUnit}>¥</Text>
            <Input
              className={styles.input}
              type="digit"
              placeholder="0"
              value={reward}
              onInput={e => setReward(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.submitBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitText}>发布寻宠信息</Text>
        </View>
      </View>
    </View>
  )
}

export default PublishPage
