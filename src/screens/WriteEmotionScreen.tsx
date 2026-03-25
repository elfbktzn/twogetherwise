import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { createEntry } from '@/services/firestore';
import { classifyEmotion } from '@/services/emotionClassifier';
import { Entry } from '@/types';

interface WriteEmotionScreenProps {
  promptId: string;
  onComplete: (entry: Entry) => void;
  onBack: () => void;
}

const WriteEmotionScreen: React.FC<WriteEmotionScreenProps> = ({ promptId, onComplete, onBack }) => {
  const { user } = useAuth();
  const { location } = useLocation();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('Please share your feelings', 'Write at least a few words about how you feel.');
      return;
    }

    if (!user || !location) {
      Alert.alert('Error', 'Unable to submit. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Classify emotion
      const emotion = await classifyEmotion(text.trim());
      
      // Create entry
      const entryData = {
        userId: user.uid,
        date: today,
        promptId,
        text: text.trim(),
        emotion,
        country: location.country,
        lat: location.lat,
        lng: location.lng,
      };

      const entryId = await createEntry(entryData);
      
      const newEntry: Entry = {
        id: entryId,
        ...entryData,
        createdAt: new Date(),
      };

      onComplete(newEntry);
    } catch (error) {
      console.error('Error submitting entry:', error);
      Alert.alert('Error', 'Failed to submit your feelings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharacterCount = () => {
    return `${text.length}/280`;
  };

  const getCharacterCountColor = () => {
    if (text.length > 250) return '#e74c3c';
    if (text.length > 200) return '#f39c12';
    return '#95a5a6';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Share Your Feelings</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Write one sentence about how you feel right now. Be honest and authentic.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="I feel..."
            placeholderTextColor="#bdc3c7"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={280}
            autoFocus
            textAlignVertical="top"
          />
          <Text style={[styles.characterCount, { color: getCharacterCountColor() }]}>
            {getCharacterCount()}
          </Text>
        </View>

        <View style={styles.emotionHint}>
          <Text style={styles.hintText}>
            💡 Your response will be analyzed to understand the emotion behind your words.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (!text.trim() || isSubmitting) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!text.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Share My Feelings</Text>
          )}
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  instruction: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    lineHeight: 26,
    color: '#2c3e50',
    borderWidth: 2,
    borderColor: '#ecf0f1',
    textAlignVertical: 'top',
  },
  characterCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  emotionHint: {
    marginTop: 16,
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 12,
  },
  hintText: {
    fontSize: 14,
    color: '#2980b9',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WriteEmotionScreen;
