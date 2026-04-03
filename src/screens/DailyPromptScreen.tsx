import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDailyPrompt } from '@/hooks/useDailyPrompt';
import { useSubmitEntry, useHasSubmittedToday } from '@/hooks/useEntry';
import { useInsight } from '@/hooks/useInsight';
import { MAX_ENTRY_LENGTH } from '@/config/constants';
import { Emotion, EMOTION_COLORS, EMOTION_EMOJI } from '@/types';

export function DailyPromptScreen() {
  const [text, setText] = useState('');
  const [submittedEmotion, setSubmittedEmotion] = useState<Emotion | null>(null);

  const { data: prompt, isLoading: promptLoading } = useDailyPrompt();
  const { data: hasSubmitted, isLoading: checkingSubmission } = useHasSubmittedToday();
  const submitEntry = useSubmitEntry();
  const { data: insight } = useInsight(submittedEmotion);

  const showInsight = hasSubmitted || submittedEmotion;

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('Empty', 'Please write something about how you feel.');
      return;
    }
    if (!prompt) return;

    try {
      const result = await submitEntry.mutateAsync({
        text: text.trim(),
        promptId: prompt.id,
      });
      setSubmittedEmotion(result.emotion);
      setText('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (promptLoading || checkingSubmission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Daily Prompt Area */}
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>TODAY'S PROMPT</Text>
          <Text style={styles.promptText}>{prompt?.text}</Text>
          <Text style={styles.promptDate}>{prompt?.date}</Text>
        </View>

        {/* Write Area or Insight Area */}
        {showInsight ? (
          <InsightCard emotion={submittedEmotion} insight={insight} />
        ) : (
          <View style={styles.writeCard}>
            <Text style={styles.writeLabel}>How are you feeling?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write one sentence..."
              placeholderTextColor="#666"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={MAX_ENTRY_LENGTH}
              textAlignVertical="top"
            />
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>
                {text.length}/{MAX_ENTRY_LENGTH}
              </Text>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!text.trim() || submitEntry.isPending) && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!text.trim() || submitEntry.isPending}
              >
                {submitEntry.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Share</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InsightCard({
  emotion,
  insight,
}: {
  emotion: Emotion | null;
  insight: any;
}) {
  if (!emotion) return null;

  return (
    <View style={styles.insightCard}>
      <Text style={styles.insightEmoji}>{EMOTION_EMOJI[emotion]}</Text>
      <Text style={styles.insightTitle}>Your emotion: {emotion}</Text>
      <View
        style={[
          styles.emotionBadge,
          { backgroundColor: EMOTION_COLORS[emotion] + '30' },
        ]}
      >
        <Text
          style={[styles.emotionBadgeText, { color: EMOTION_COLORS[emotion] }]}
        >
          {emotion.toUpperCase()}
        </Text>
      </View>

      {insight && (
        <View style={styles.insightStats}>
          <Text style={styles.insightStatText}>
            You are not alone — {insight.sameEmotionPercent}% of users today
            feel the same.
          </Text>
          <Text style={styles.insightSubText}>
            {insight.totalEntries} people shared today
          </Text>
        </View>
      )}

      <Text style={styles.insightNote}>
        Check the World Map tomorrow to see how the world felt today.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  promptCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e94560',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 12,
  },
  promptDate: {
    fontSize: 13,
    color: '#666',
  },
  writeCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  writeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {
    color: '#666',
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  insightEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  emotionBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
  },
  emotionBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  insightStats: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  insightStatText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  insightSubText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  insightNote: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
