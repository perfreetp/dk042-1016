import React, { useState } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'

const reasons = [
  '线索照片与宠物不符',
  '虚假信息骗取悬赏',
  '恶意骚扰主人',
  '其他原因'
]

const ReportPage: React.FC = () => {
  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')

  const handleSubmit = () => {
    if (!selectedReason) {
      Taro.showToast({ title: '请选择举报原因', icon: 'none' })
      return
    }
    if (!description.trim()) {
      Taro.showToast({ title: '请填写详细说明', icon: 'none' })
      return
    }
    console.info('[Report] Submit', { selectedReason, description, contact })
    Taro.showToast({ title: '举报已提交，我们会尽快核实', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  return (
    <View className={styles.reportPage}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>举报信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>举报原因<Text className={styles.required}>*</Text></Text>
          <View className={styles.reasonSelector}>
            {reasons.map(r => (
              <View
                key={r}
                className={classnames(styles.reasonOption, selectedReason === r && styles.active)}
                onClick={() => setSelectedReason(r)}
              >
                <Text className={styles.reasonText}>{r}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>详细说明<Text className={styles.required}>*</Text></Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述虚假线索的情况，便于我们核实处理"
            value={description}
            onInput={e => setDescription(e.detail.value)}
            maxlength={500}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>您的联系方式（选填）</Text>
          <Input
            className={styles.input}
            placeholder="方便我们联系您补充信息"
            value={contact}
            onInput={e => setContact(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.submitBtn} onClick={handleSubmit}>
        <Text className={styles.btnText}>提交举报</Text>
      </View>
    </View>
  )
}

export default ReportPage
