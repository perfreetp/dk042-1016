import React, { useState } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

const ClueSubmitPage: React.FC = () => {
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')
  const [reporterName, setReporterName] = useState('')

  const handleSubmit = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请描述线索内容', icon: 'none' })
      return
    }
    if (!location.trim()) {
      Taro.showToast({ title: '请输入发现地点', icon: 'none' })
      return
    }
    console.info('[ClueSubmit] Submit', { content, location, time, reporterName })
    Taro.showToast({ title: '线索提交成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  const handleLocationPick = () => {
    console.info('[ClueSubmit] Pick location')
    Taro.showToast({ title: '位置选择功能开发中', icon: 'none' })
  }

  return (
    <View className={styles.cluePage}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>线索照片</Text>
        <View className={styles.photoUpload}>
          <View className={styles.addPhoto}>
            <Text className={styles.addIcon}>+</Text>
            <Text className={styles.addText}>添加照片</Text>
          </View>
        </View>
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
          <View className={styles.locationPicker} onClick={handleLocationPick}>
            <Text className={location ? styles.locationText : styles.locationPlaceholder}>
              {location || '点击选择或输入发现地点'}
            </Text>
            <Text className={styles.arrowText}>▶</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>发现时间</Text>
          <Input
            className={styles.input}
            placeholder="如：2026-06-12 09:30"
            value={time}
            onInput={e => setTime(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>您的称呼</Text>
          <Input
            className={styles.input}
            placeholder="方便主人感谢您"
            value={reporterName}
            onInput={e => setReporterName(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.submitBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitText}>提交线索</Text>
        </View>
      </View>
    </View>
  )
}

export default ClueSubmitPage
