import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { mockSightings } from '@/data/sightings'
import styles from './index.module.scss'

type MapTabType = 'all' | 'sighting' | 'patrol' | 'route'

const mapTabs: { key: MapTabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'sighting', label: '目击' },
  { key: 'patrol', label: '巡查点' },
  { key: 'route', label: '路线' }
]

const typeLabels: Record<string, string> = {
  sighting: '目击',
  patrol: '巡查点',
  route: '路线'
}

const markerPositions = [
  { top: '25%', left: '30%' },
  { top: '35%', left: '55%' },
  { top: '45%', left: '20%' },
  { top: '55%', left: '70%' },
  { top: '30%', left: '75%' },
  { top: '65%', left: '40%' },
  { top: '50%', left: '50%' },
  { top: '20%', left: '45%' },
  { top: '70%', left: '60%' },
  { top: '40%', left: '35%' }
]

const MapPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MapTabType>('all')

  const filteredSightings = activeTab === 'all'
    ? mockSightings
    : mockSightings.filter(s => s.type === activeTab)

  return (
    <View className={styles.mapPage}>
      <View className={styles.mapTabs}>
        {mapTabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.mapTab, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.mapContainer}>
        <View className={styles.mapPlaceholder}>
          {[20, 40, 60, 80].map(top => (
            <View key={`h${top}`} className={classnames(styles.gridLine, styles.gridLineH)} style={{ top: `${top}%` }} />
          ))}
          {[25, 50, 75].map(left => (
            <View key={`v${left}`} className={classnames(styles.gridLine, styles.gridLineV)} style={{ left: `${left}%` }} />
          ))}
          {mockSightings.map((s, i) => (
            <View
              key={s.id}
              className={styles.mapMarker}
              style={{ top: markerPositions[i]?.top || '50%', left: markerPositions[i]?.left || '50%' }}
            >
              <View className={classnames(styles.markerDot, styles[s.type])} />
              <Text className={styles.markerLabel}>{s.address.slice(0, 4)}</Text>
            </View>
          ))}
          <View className={styles.mapCenter}>
            <Text className={styles.mapIcon}>🗺️</Text>
            <Text className={styles.mapTip}>小区寻宠协作地图</Text>
          </View>
        </View>
      </View>

      <View className={styles.legend}>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.sighting)} />
          <Text className={styles.legendText}>目击位置</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.patrol)} />
          <Text className={styles.legendText}>巡查点</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.route)} />
          <Text className={styles.legendText}>搜索路线</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.sightingList}>
        {filteredSightings.map(s => (
          <View key={s.id} className={styles.sightingCard}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>{s.address}</Text>
              <Text className={classnames(styles.cardType, styles[s.type])}>{typeLabels[s.type]}</Text>
            </View>
            <Text className={styles.cardAddress}>{s.address}</Text>
            <Text className={styles.cardDesc}>{s.description}</Text>
            {s.time && <Text className={styles.cardTime}>{s.time}</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default MapPage
