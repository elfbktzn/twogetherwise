import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDailyPrompt, useFallbackPrompt } from '@/hooks/useDailyPrompt';
import { useAuth } from '@/hooks/useAuth';

interface DailyPromptScreenProps {
  onResponse: (promptId: string) => void;
  onSkip: () => void;
}

const DailyPromptScreen: React.FC<DailyPromptScreenProps> = ({ onResponse, onSkip }) => {
  const today = new Date().toISOString().split('T')[0];
  const { user } = useAuth();
  const { data: prompt, isLoading, error } = useDailyPrompt(today);
  const fallbackPrompt = useFallbackPrompt(today);

  const currentPrompt = prompt || fallbackPrompt;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading today's prompt...</Text>
      </View>
    );
  }

  if (error && !fallbackPrompt) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load today's prompt</Text>
        <TouchableOpacity style={styles.button} onPress={onSkip}>
          <Text style={styles.buttonText}>Skip for Today</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(today)}</Text>
        <Text style={styles.greeting}>Hello, how are you feeling today?</Text>
      </View>
      
      <View style={styles.promptContainer}>
        <Text style={styles.promptLabel}>Today's Prompt</Text>
        <View style={styles.promptBox}>
          <Text style={styles.promptText}>{currentPrompt?.text}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={() => onResponse(currentPrompt?.id || '')}
        >
          <Text style={styles.buttonText}>Share My Feelings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onSkip}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Skip for Today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  date: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  promptLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 16,
    textAlign: 'center',
  },
  promptBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#2c3e50',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#7f8c8d',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default DailyPromptScreen;
