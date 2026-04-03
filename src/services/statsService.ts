import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { COLLECTIONS, getTodayDateString, getYesterdayDateString } from '@/config/constants';
import { EmotionDailyStat, Emotion, InsightData } from '@/types';

export async function fetchTodayInsight(userEmotion: Emotion): Promise<InsightData> {
  const today = getTodayDateString();
  const q = query(
    collection(db, COLLECTIONS.EMOTION_DAILY_STATS),
    where('date', '==', today)
  );
  const snap = await getDocs(q);
  const stats = snap.docs.map((d) => d.data() as EmotionDailyStat);

  const totalEntries = stats.reduce((sum, s) => sum + s.count, 0);
  const sameEmotionCount = stats
    .filter((s) => s.emotion === userEmotion)
    .reduce((sum, s) => sum + s.count, 0);

  const sameEmotionPercent =
    totalEntries > 0 ? Math.round((sameEmotionCount / totalEntries) * 100) : 0;

  return { userEmotion, sameEmotionPercent, totalEntries };
}

export async function fetchMapData(date?: string): Promise<EmotionDailyStat[]> {
  const targetDate = date || getYesterdayDateString();
  const q = query(
    collection(db, COLLECTIONS.EMOTION_DAILY_STATS),
    where('date', '==', targetDate)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EmotionDailyStat));
}
