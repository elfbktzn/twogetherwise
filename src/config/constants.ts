export const COLLECTIONS = {
  USERS: 'users',
  ENTRIES: 'entries',
  DAILY_PROMPTS: 'daily_prompts',
  EMOTION_DAILY_STATS: 'emotion_daily_stats',
} as const;

export const MAX_ENTRY_LENGTH = 280;

export const MAP_INITIAL_REGION = {
  latitude: 20,
  longitude: 0,
  latitudeDelta: 100,
  longitudeDelta: 100,
};

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
