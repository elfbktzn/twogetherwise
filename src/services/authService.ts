import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { COLLECTIONS } from '@/config/constants';
import { User } from '@/types';

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(cred.user);
  return cred;
}

export async function loginAnonymously() {
  const cred = await signInAnonymously(auth);
  await createUserDocument(cred.user);
  return cred;
}

export async function loginWithGoogle(idToken: string) {
  const credential = GoogleAuthProvider.credential(idToken);
  const cred = await signInWithCredential(auth, credential);
  await createUserDocument(cred.user);
  return cred;
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function changePassword(newPassword: string) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  return updatePassword(auth.currentUser, newPassword);
}

export async function logout() {
  return signOut(auth);
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

async function createUserDocument(firebaseUser: FirebaseUser) {
  const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      isAnonymous: firebaseUser.isAnonymous,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, userData);
  }
}

export async function getUserDocument(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function updateOnboardingStatus(uid: string) {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await setDoc(userRef, { onboardingCompleted: true }, { merge: true });
}
