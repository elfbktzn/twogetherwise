import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { subscribeToAuth } from '@/services/authService';
import { db } from '@/config/firebase';
import { COLLECTIONS } from '@/config/constants';
import { User } from '@/types';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  firebaseUser: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setFirebaseUser(user);
      if (!user) {
        setUserProfile(null);
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Real-time listener on user's Firestore document
  useEffect(() => {
    if (!firebaseUser) {
      return;
    }
    const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          setUserProfile(snap.data() as User);
        } else {
          setUserProfile(null);
        }
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, [firebaseUser]);

  const refreshProfile = useCallback(async () => {
    // Profile updates are now handled by the onSnapshot listener,
    // but this can be called to force a check.
    if (!firebaseUser) return;
  }, [firebaseUser]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        isLoading,
        isAuthenticated: !!firebaseUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
