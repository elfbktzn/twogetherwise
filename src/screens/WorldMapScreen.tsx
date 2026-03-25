import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { EmotionDailyStats, Emotion } from '@/types';
import { getEmotionStatsForDate } from '@/services/firestore';

interface WorldMapScreenProps {
  onBack: () => void;
}

const WorldMapScreen: React.FC<WorldMapScreenProps> = ({ onBack }) => {
  const [emotionStats, setEmotionStats] = useState<EmotionDailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | 'all'>('all');
  const [region, setRegion] = useState<Region>({
    latitude: 20,
    longitude: 0,
    latitudeDelta: 140,
    longitudeDelta: 360,
  });

  const emotions: Emotion[] = ['joy', 'sadness', 'anxiety', 'hope', 'loneliness', 'calm'];

  useEffect(() => {
    const loadEmotionStats = async () => {
      try {
        // Get yesterday's stats for map visualization
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];
        
        const stats = await getEmotionStatsForDate(dateStr);
        setEmotionStats(stats);
      } catch (error) {
        console.error('Error loading emotion stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmotionStats();
  }, []);

  const getEmotionColor = (emotion: Emotion): string => {
    const colorMap = {
      joy: '#FFD700',      // yellow
      sadness: '#3498db',   // blue
      anxiety: '#e74c3c',   // red
      hope: '#2ecc71',     // green
      loneliness: '#9b59b6', // purple
      calm: '#1abc9c'      // teal
    };
    return colorMap[emotion] || '#95a5a6';
  };

  const getEmotionEmoji = (emotion: Emotion): string => {
    const emojiMap = {
      joy: '😊',
      sadness: '😢',
      anxiety: '😰',
      hope: '🌟',
      loneliness: '🏠',
      calm: '😌'
    };
    return emojiMap[emotion] || '💭';
  };

  // Sample locations for different countries (in real app, use actual coordinates)
  const getCountryCoordinates = (country: string) => {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'United States': { lat: 40.7128, lng: -74.0060 },
      'Canada': { lat: 45.4215, lng: -75.6972 },
      'United Kingdom': { lat: 51.5074, lng: -0.1278 },
      'Brazil': { lat: -23.5505, lng: -46.6333 },
      'Australia': { lat: -33.8688, lng: 151.2093 },
      'Japan': { lat: 35.6762, lng: 139.6503 },
      'Germany': { lat: 52.5200, lng: 13.4050 },
      'France': { lat: 48.8566, lng: 2.3522 },
      'India': { lat: 28.6139, lng: 77.2090 },
      'China': { lat: 39.9042, lng: 116.4074 },
    };
    return coordinates[country] || { lat: 0, lng: 0 };
  };

  const filteredStats = selectedEmotion === 'all' 
    ? emotionStats 
    : emotionStats.filter(stat => stat.emotion === selectedEmotion);

  const getEmotionStats = () => {
    const stats = emotions.reduce((acc, emotion) => {
      acc[emotion] = emotionStats.filter(stat => stat.emotion === emotion)
        .reduce((sum, stat) => sum + stat.count, 0);
      return acc;
    }, {} as Record<Emotion, number>);
    
    return stats;
  };

  const emotionStatsCounts = getEmotionStats();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading global feelings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Global Feelings Map</Text>
      </View>

      <View style={styles.emotionFilter}>
        <TouchableOpacity
          style={[styles.filterButton, selectedEmotion === 'all' && styles.activeFilter]}
          onPress={() => setSelectedEmotion('all')}
        >
          <Text style={[styles.filterText, selectedEmotion === 'all' && styles.activeFilterText]}>
            All ({emotionStats.length})
          </Text>
        </TouchableOpacity>
        {emotions.map(emotion => (
          <TouchableOpacity
            key={emotion}
            style={[styles.filterButton, selectedEmotion === emotion && styles.activeFilter]}
            onPress={() => setSelectedEmotion(emotion)}
          >
            <Text style={styles.filterText}>
              {getEmotionEmoji(emotion)} {emotionStatsCounts[emotion]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {filteredStats.map((stat, index) => {
          const coords = getCountryCoordinates(stat.country);
          return (
            <Marker
              key={`${stat.id}-${index}`}
              coordinate={{
                latitude: coords.lat,
                longitude: coords.lng,
              }}
              title={`${stat.emotion} - ${stat.country}`}
              description={`${stat.count} people feeling ${stat.emotion}`}
            >
              <View style={[styles.marker, { backgroundColor: getEmotionColor(stat.emotion as Emotion) }]}>
                <Text style={styles.markerEmoji}>
                  {getEmotionEmoji(stat.emotion as Emotion)}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Emotions Today</Text>
        <View style={styles.legendItems}>
          {emotions.map(emotion => (
            <View key={emotion} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: getEmotionColor(emotion) }]} />
              <Text style={styles.legendText}>
                {getEmotionEmoji(emotion)} {emotion}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  emotionFilter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  filterText: {
    fontSize: 12,
    color: '#34495e',
  },
  activeFilterText: {
    color: 'white',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 16,
  },
  legend: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minWidth: 80,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#34495e',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default WorldMapScreen;
