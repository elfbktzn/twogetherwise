import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/types/navigation';
import { DailyPromptScreen } from '@/screens/DailyPromptScreen';
import { WorldMapScreen } from '@/screens/WorldMapScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="DailyPrompt"
        component={DailyPromptScreen}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>✍️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="WorldMap"
        component={WorldMapScreen}
        options={{
          tabBarLabel: 'World Map',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🌍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.cardBorder,
    borderTopWidth: 1,
    paddingTop: 6,
    height: 88,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  tabIcon: {
    fontSize: 22,
  },
});
