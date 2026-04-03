import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useMapData } from '@/hooks/useMapData';
import { MAP_INITIAL_REGION, getYesterdayDateString } from '@/config/constants';
import { EMOTION_COLORS, EMOTION_EMOJI, EmotionDailyStat, Emotion } from '@/types';
import { COLORS, FONTS } from '../../theme';

const { width } = Dimensions.get('window');

export function WorldMapScreen() {
  const yesterday = getYesterdayDateString();
  const { data: mapData, isLoading } = useMapData(yesterday);

  const emotionSummary = useMemo(() => {
    if (!mapData || mapData.length === 0) return [];
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    for (const stat of mapData) {
      totals[stat.emotion] = (totals[stat.emotion] || 0) + stat.count;
      grandTotal += stat.count;
    }
    return Object.entries(totals)
      .map(([emotion, count]) => ({
        emotion: emotion as Emotion,
        count,
        percent: Math.round((count / grandTotal) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [mapData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Insight Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>World Feelings</Text>
        <Text style={styles.headerDate}>{yesterday}</Text>
      </View>

      {/* Emotion Summary Bar */}
      {emotionSummary.length > 0 && (
        <View style={styles.summaryBar}>
          {emotionSummary.slice(0, 4).map((item) => (
            <View key={item.emotion} style={styles.summaryItem}>
              <Text style={styles.summaryEmoji}>
                {EMOTION_EMOJI[item.emotion]}
              </Text>
              <Text style={styles.summaryPercent}>{item.percent}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={MAP_INITIAL_REGION}
          customMapStyle={darkMapStyle}
        >
          {mapData?.map((stat, index) => (
            <EmotionMarker key={`${stat.emotion}-${stat.country}-${index}`} stat={stat} />
          ))}
        </MapView>

        {(!mapData || mapData.length === 0) && (
          <View style={styles.emptyOverlay}>
            <Text style={styles.emptyText}>
              No data for yesterday yet.{'\n'}Check back tomorrow!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function EmotionMarker({ stat }: { stat: EmotionDailyStat }) {
  const color = EMOTION_COLORS[stat.emotion];
  return (
    <Marker
      coordinate={{ latitude: stat.lat, longitude: stat.lng }}
      title={`${EMOTION_EMOJI[stat.emotion]} ${stat.emotion}`}
      description={`${stat.count} people in ${stat.country}`}
      pinColor={color}
    />
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#0e1626' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#2a2a4a' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
  },
  headerDate: {
    fontSize: 14,
    fontFamily: FONTS.text,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 24,
  },
  summaryPercent: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  mapContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(247,245,242,0.9)',
  },
  emptyText: {
    color: COLORS.textTertiary,
    fontSize: 16,
    fontFamily: FONTS.text,
    textAlign: 'center',
    lineHeight: 24,
  },
});
