import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Entry, DailyPrompt, EmotionDailyStats, Emotion } from '@/types';
import { sampleEmotionStats } from '@/utils/sampleData';
import { samplePrompts } from '@/utils/samplePrompts';

// Collections
const ENTRIES_COLLECTION = 'entries';
const DAILY_PROMPTS_COLLECTION = 'daily_prompts';
const EMOTION_STATS_COLLECTION = 'emotion_daily_stats';
const USERS_COLLECTION = 'users';

// Entry operations
export const createEntry = async (entryData: Omit<Entry, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      ...entryData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.log('Creating sample entry for testing');
    // Return sample ID for testing
    return `sample-${Date.now()}`;
  }
};

export const getUserEntryForDate = async (userId: string, date: string) => {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('userId', '==', userId),
      where('date', '==', date),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Entry;
  } catch (error) {
    console.log('No entry found for user');
    return null;
  }
};

// Daily prompt operations
export const getTodayPrompt = async (date: string) => {
  try {
    const q = query(
      collection(db, DAILY_PROMPTS_COLLECTION),
      where('date', '==', date),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as DailyPrompt;
  } catch (error) {
    console.log('Using sample prompt for testing');
    // Return sample prompt for testing
    return samplePrompts.find(prompt => prompt.date === date) || samplePrompts[0];
  }
};

// Emotion stats operations
export const getEmotionStatsForDate = async (date: string) => {
  try {
    const q = query(
      collection(db, EMOTION_STATS_COLLECTION),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as EmotionDailyStats[];
  } catch (error) {
    console.log('Using sample data for emotion stats');
    // Return sample data for testing
    return sampleEmotionStats;
  }
};

export const getEmotionStatsForCountry = async (date: string, country: string) => {
  try {
    const q = query(
      collection(db, EMOTION_STATS_COLLECTION),
      where('date', '==', date),
      where('country', '==', country)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as EmotionDailyStats[];
  } catch (error) {
    console.log('Using sample data for country stats');
    return sampleEmotionStats.filter(stat => stat.country === country);
  }
};

// Get entries for map visualization (previous day)
export const getEntriesForMap = async (date: string) => {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('date', '==', date),
      limit(1000) // Limit for performance
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as Entry[];
  } catch (error) {
    console.log('Using sample data for map entries');
    return [];
  }
};

// Get emotion percentage for insight
export const getEmotionPercentage = async (date: string, emotion: Emotion): Promise<number> => {
  try {
    const stats = await getEmotionStatsForDate(date);
    const emotionCount = stats.filter(stat => stat.emotion === emotion).reduce((sum, stat) => sum + stat.count, 0);
    const totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);
    return totalCount > 0 ? (emotionCount / totalCount) * 100 : 0;
  } catch (error) {
    // Return sample percentage for testing
    const samplePercentage = {
      joy: 25,
      sadness: 15,
      anxiety: 20,
      hope: 22,
      loneliness: 8,
      calm: 10
    };
    return samplePercentage[emotion] || 10;
  }
};
