import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBNFBPWiTNdlmJcTDtS_5P098_pt4Je4sk',
  authDomain: 'twogetherwise.firebaseapp.com',
  projectId: 'twogetherwise',
  storageBucket: 'twogetherwise.appspot.com',
  messagingSenderId: '1080975271512',
  appId: '1:1080975271512:ios:86f11cc508eb6003bf4c2d',
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export default app;
