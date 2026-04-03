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
import { COLORS, FONTS } from '../../theme';

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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
    backgroundColor: COLORS.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  promptCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  promptLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 22,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
    lineHeight: 30,
    marginBottom: 12,
  },
  promptDate: {
    fontSize: 13,
    fontFamily: FONTS.text,
    color: COLORS.textTertiary,
  },
  writeCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  writeLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 16,
    color: COLORS.inputText,
    fontFamily: FONTS.text,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {
    color: COLORS.textTertiary,
    fontSize: 13,
    fontFamily: FONTS.text,
  },
  submitBtn: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.heading,
  },
  insightCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  insightEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
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
    fontFamily: FONTS.heading,
    letterSpacing: 1,
  },
  insightStats: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  insightStatText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontFamily: FONTS.medium,
    lineHeight: 24,
  },
  insightSubText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: FONTS.text,
  },
  insightNote: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: FONTS.text,
  },
});
