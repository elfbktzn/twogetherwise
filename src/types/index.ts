export type Emotion = 'joy' | 'sadness' | 'anxiety' | 'hope' | 'loneliness' | 'calm';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface DailyPrompt {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  createdAt: string;
}

export interface Entry {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  promptId: string;
  text: string;
  emotion: Emotion | null;
  country: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface EmotionDailyStat {
  id?: string;
  date: string; // YYYY-MM-DD
  emotion: Emotion;
  country: string;
  count: number;
  lat: number;
  lng: number;
}

export interface InsightData {
  userEmotion: Emotion;
  sameEmotionPercent: number;
  totalEntries: number;
}

export const EMOTIONS: Emotion[] = ['joy', 'sadness', 'anxiety', 'hope', 'loneliness', 'calm'];

export const EMOTION_COLORS: Record<Emotion, string> = {
  joy: '#FFD700',
  sadness: '#4A90D9',
  anxiety: '#FF6B6B',
  hope: '#7ED321',
  loneliness: '#9B59B6',
  calm: '#50E3C2',
};

export const EMOTION_EMOJI: Record<Emotion, string> = {
  joy: '😊',
  sadness: '😢',
  anxiety: '😰',
  hope: '🌱',
  loneliness: '🫂',
  calm: '😌',
};
