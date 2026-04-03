import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { COLLECTIONS, getTodayDateString } from '@/config/constants';
import { Entry } from '@/types';

export async function submitEntry(entry: Omit<Entry, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.ENTRIES), entry);
  return ref.id;
}

export async function hasSubmittedToday(userId: string): Promise<boolean> {
  const today = getTodayDateString();
  const q = query(
    collection(db, COLLECTIONS.ENTRIES),
    where('userId', '==', userId),
    where('date', '==', today)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function fetchTodayEntries(): Promise<Entry[]> {
  const today = getTodayDateString();
  const q = query(
    collection(db, COLLECTIONS.ENTRIES),
    where('date', '==', today),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Entry));
}

export async function fetchEntriesByDate(date: string): Promise<Entry[]> {
  const q = query(
    collection(db, COLLECTIONS.ENTRIES),
    where('date', '==', date),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Entry));
}
