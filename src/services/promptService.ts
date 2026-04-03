import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { COLLECTIONS, getTodayDateString } from '@/config/constants';
import { DailyPrompt } from '@/types';

export async function fetchTodayPrompt(): Promise<DailyPrompt | null> {
  const today = getTodayDateString();
  const promptRef = doc(db, COLLECTIONS.DAILY_PROMPTS, today);
  const snap = await getDoc(promptRef);

  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as DailyPrompt;
  }

  // Fallback prompt if none exists for today
  return {
    id: today,
    date: today,
    text: 'How are you feeling today?',
    createdAt: new Date().toISOString(),
  };
}
