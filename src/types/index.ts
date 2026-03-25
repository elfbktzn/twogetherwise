export type Emotion = 'joy' | 'sadness' | 'anxiety' | 'hope' | 'loneliness' | 'calm';

export interface User {
  id: string;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface Entry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  promptId: string;
  text: string;
  emotion: Emotion;
  country: string;
  lat: number;
  lng: number;
  createdAt: Date;
}

export interface DailyPrompt {
  id: string;
  date: string; // YYYY-MM-DD format
  text: string;
  createdAt: Date;
}

export interface EmotionDailyStats {
  id: string;
  date: string;
  emotion: Emotion;
  country: string;
  count: number;
}

export interface Location {
  lat: number;
  lng: number;
  country: string;
}

export interface EmotionInsight {
  emotion: Emotion;
  percentage: number;
  totalUsers: number;
}

export interface MapCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  emotion: Emotion;
  country: string;
}
