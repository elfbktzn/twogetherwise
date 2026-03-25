import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Entry, Emotion } from '@/types';
import { getEmotionPercentage } from '@/services/firestore';

interface InsightScreenProps {
  entry: Entry;
  onNext: () => void;
}

const InsightScreen: React.FC<InsightScreenProps> = ({ entry, onNext }) => {
  const [emotionPercentage, setEmotionPercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const percentage = await getEmotionPercentage(entry.date, entry.emotion);
        setEmotionPercentage(percentage);
      } catch (error) {
        console.error('Error fetching emotion percentage:', error);
        setEmotionPercentage(0);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [entry.date, entry.emotion]);

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

  const getEmotionColor = (emotion: Emotion): string => {
    const colorMap = {
      joy: '#f39c12',
      sadness: '#3498db',
      anxiety: '#e74c3c',
      hope: '#2ecc71',
      loneliness: '#9b59b6',
      calm: '#1abc9c'
    };
    return colorMap[emotion] || '#95a5a6';
  };

  const getInsightMessage = (percentage: number): string => {
    if (percentage > 30) {
      return `You're not alone — ${percentage.toFixed(1)}% of users today feel the same way.`;
    } else if (percentage > 10) {
      return `${percentage.toFixed(1)}% of users share this feeling today.`;
    } else {
      return `Only ${percentage.toFixed(1)}% of users feel this way today — your experience is unique.`;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Analyzing global feelings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.emotionDisplay}>
          <Text style={styles.emotionEmoji}>{getEmotionEmoji(entry.emotion)}</Text>
          <Text style={[styles.emotionText, { color: getEmotionColor(entry.emotion) }]}>
            {entry.emotion.charAt(0).toUpperCase() + entry.emotion.slice(1)}
          </Text>
        </View>

        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>You are not alone</Text>
          <Text style={styles.insightMessage}>
            {emotionPercentage !== null && getInsightMessage(emotionPercentage)}
          </Text>
        </View>

        <View style={styles.yourResponse}>
          <Text style={styles.responseTitle}>Your response</Text>
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>"{entry.text}"</Text>
          </View>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>Come back tomorrow</Text>
          <Text style={styles.nextStepsText}>
            See how people around the world are feeling and explore the global emotions map.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Done for Today</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  emotionDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emotionEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emotionText: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  insightBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  insightMessage: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 24,
  },
  yourResponse: {
    marginBottom: 32,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  responseBox: {
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 12,
  },
  responseText: {
    fontSize: 16,
    color: '#34495e',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  nextSteps: {
    alignItems: 'center',
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default InsightScreen;
