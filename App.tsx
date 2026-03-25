import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OnboardingScreen from '@/screens/OnboardingScreen';
import DailyPromptScreen from '@/screens/DailyPromptScreen';
import WriteEmotionScreen from '@/screens/WriteEmotionScreen';
import InsightScreen from '@/screens/InsightScreen';
import WorldMapScreen from '@/screens/WorldMapScreen';
import { useAuth } from '@/hooks/useAuth';
import { getUserEntryForDate } from '@/services/firestore';
import { Entry } from '@/types';

const queryClient = new QueryClient();

type Screen = 'onboarding' | 'dailyPrompt' | 'writeEmotion' | 'insight' | 'worldMap';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkTodayEntry = async () => {
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = await getUserEntryForDate(user.uid, today);
      
      if (existingEntry) {
        setHasCompletedToday(true);
        setCurrentEntry(existingEntry);
        setCurrentScreen('worldMap');
      } else {
        setHasCompletedToday(false);
        setCurrentScreen('dailyPrompt');
      }
    };

    checkTodayEntry();
  }, [user]);

  const handleOnboardingComplete = () => {
    setCurrentScreen('dailyPrompt');
  };

  const handlePromptResponse = (promptId: string) => {
    setCurrentScreen('writeEmotion');
  };

  const handleSkipPrompt = () => {
    setCurrentScreen('worldMap');
  };

  const handleEntryComplete = (entry: Entry) => {
    setCurrentEntry(entry);
    setCurrentScreen('insight');
  };

  const handleInsightComplete = () => {
    setCurrentScreen('worldMap');
  };

  const handleBackFromMap = () => {
    if (hasCompletedToday) {
      setCurrentScreen('insight');
    } else {
      setCurrentScreen('dailyPrompt');
    }
  };

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      
      case 'dailyPrompt':
        return (
          <DailyPromptScreen
            onResponse={handlePromptResponse}
            onSkip={handleSkipPrompt}
          />
        );
      
      case 'writeEmotion':
        return (
          <WriteEmotionScreen
            promptId="current-prompt"
            onComplete={handleEntryComplete}
            onBack={() => setCurrentScreen('dailyPrompt')}
          />
        );
      
      case 'insight':
        return currentEntry ? (
          <InsightScreen
            entry={currentEntry}
            onNext={handleInsightComplete}
          />
        ) : null;
      
      case 'worldMap':
        return <WorldMapScreen onBack={handleBackFromMap} />;
      
      default:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {renderScreen()}
    </View>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default App;
