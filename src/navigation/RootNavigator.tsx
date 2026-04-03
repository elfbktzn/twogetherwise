import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { COLORS } from '../../theme';

export function RootNavigator() {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const needsOnboarding = isAuthenticated && !userProfile?.onboardingCompleted;
  const isReady = isAuthenticated && userProfile?.onboardingCompleted;

  return (
    <NavigationContainer>
      {isReady ? (
        <MainTabNavigator />
      ) : (
        <AuthNavigator
          key={needsOnboarding ? 'onboarding' : 'auth'}
          showOnboarding={!!needsOnboarding}
        />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgPrimary,
  },
});
