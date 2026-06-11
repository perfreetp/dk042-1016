import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import { usePetStore } from '@/store/petStore'
import styles from './index.module.scss'

type MapTabType = 'all' | 'lost' | 'sighting' | 'patrol' | 'route'

const mapTabs: { key: MapTabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'lost', label: '走失点' },
  { key: 'sighting', label: '目击' },
  { key: 'patrol', label: '巡查点' },
  { key: 'route', label: '路线' }
]

const typeLabels: Record<string, string> = {
  lost: '走失点',
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
  const router = useRouter()
  const petId = router.params.id || ''
  const petName = router.params.name || ''
  const [activeTab, setActiveTab] = useState<MapTabType>('all')
  const { getSightingsByType, getSightingsByPetAndType, sightings } = usePetStore()

  const filteredSightings = useMemo(() => {
    console.info('[Map] Filter changed:', activeTab, 'petId:', petId)
    let result: any[]
    if (petId) {
      result = getSightingsByPetAndType(petId, activeTab)
    } else {
      result = getSightingsByType(activeTab)
    }
    return [...result].sort((a, b) => {
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.localeCompare(b.time)
    })
  }, [activeTab, petId, getSightingsByType, getSightingsByPetAndType, sightings])

  const routePoints = useMemo(() => {
    return filteredSightings
      .filter(s => s.type === 'lost' || s.type === 'sighting')
      .sort((a, b) => {
        if (!a.time) return 1
        if (!b.time) return -1
        return a.time.localeCompare(b.time)
      })
  }, [filteredSightings])

  useDidShow(() => {
    if (petId && petName) {
      Taro.setNavigationBarTitle({ title: `${petName}的寻宠地图` })
    }
  })

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
          {routePoints.length > 1 && routePoints.map((s, i) => {
            if (i === 0) return null
            const prevIdx = (i - 1) % markerPositions.length
            const currIdx = i % markerPositions.length
            const prev = markerPositions[prevIdx]
            const curr = markerPositions[currIdx]
            const x1 = parseInt(prev.left)
            const y1 = parseInt(prev.top)
            const x2 = parseInt(curr.left)
            const y2 = parseInt(curr.top)
            const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
            return (
              <View
                key={`line-${i}`}
                className={styles.routeLine}
                style={{
                  top: `${y1}%`,
                  left: `${x1}%`,
                  width: `${length}%`,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 50%'
                }}
              />
            )
          })}
          {filteredSightings.map((s, i) => (
            <View
              key={s.id}
              className={classnames(styles.mapMarker, s.type === 'lost' && styles.markerLost)}
              style={{
                top: markerPositions[i % markerPositions.length]?.top || '50%',
                left: markerPositions[i % markerPositions.length]?.left || '50%'
              }}
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
          <View className={classnames(styles.legendDot, styles.lost)} />
          <Text className={styles.legendText}>走失起点</Text>
        </View>
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
        {filteredSightings.length > 0 ? (
          filteredSightings.map(s => (
            <View key={s.id} className={styles.sightingCard}>
              <View className={styles.cardHeader}>
                <Text className={styles.cardTitle}>{s.address}</Text>
                <Text className={classnames(styles.cardType, styles[s.type])}>{typeLabels[s.type]}</Text>
              </View>
              <Text className={styles.cardAddress}>{s.address}</Text>
              <Text className={styles.cardDesc}>{s.description}</Text>
              {s.time && <Text className={styles.cardTime}>{s.time}</Text>}
            </View>
          ))
        ) : (
          <View style={{ padding: 60, textAlign: 'center' }}>
            <Text style={{ fontSize: 28, color: '#999' }}>暂无{typeLabels[activeTab] || '位置'}信息</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default MapPage
