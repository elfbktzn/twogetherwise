# Global Feelings Map

A mobile app where users share how they feel in response to a daily prompt. Their text is analyzed for emotion, and the next day everyone can see how the world felt on a map.

## Tech Stack

- **Frontend**: React Native (Expo), TypeScript, React Query, react-native-maps
- **Backend**: Firebase (Firestore, Cloud Functions, Anonymous Auth)
- **AI/NLP**: Placeholder emotion classifier (swap-ready abstraction layer)

## Project Structure

```
twogetherwise/
├── App.tsx                          # App entry point
├── app.json                         # Expo config
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── babel.config.js                  # Babel + module aliases
├── firebase.json                    # Firebase config
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Firestore composite indexes
├── scripts/
│   └── seedPrompts.ts               # Seed daily prompts to Firestore
├── functions/                       # Firebase Cloud Functions
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                 # classifyEmotionOnWrite + updateDailyStats
│       └── emotionClassifier.ts     # Server-side placeholder classifier
└── src/
    ├── config/
    │   ├── firebase.ts              # Firebase initialization
    │   └── constants.ts             # App constants + helpers
    ├── types/
    │   ├── index.ts                 # Core types (Emotion, Entry, User, etc.)
    │   └── navigation.ts            # Navigation type definitions
    ├── contexts/
    │   └── AuthContext.tsx           # Auth state management
    ├── services/
    │   ├── authService.ts           # Auth operations (login, signup, etc.)
    │   ├── promptService.ts         # Fetch daily prompts
    │   ├── entryService.ts          # CRUD for user entries
    │   ├── statsService.ts          # Fetch insights + map data
    │   └── emotionClassifier.ts     # Client-side placeholder classifier
    ├── hooks/
    │   ├── useDailyPrompt.ts        # React Query hook for prompts
    │   ├── useEntry.ts              # Submission + check hooks
    │   ├── useInsight.ts            # Today's insight data
    │   └── useMapData.ts            # Map aggregation data
    ├── utils/
    │   └── location.ts              # Expo Location helper
    ├── navigation/
    │   ├── RootNavigator.tsx         # Auth vs Main routing
    │   ├── AuthNavigator.tsx         # Login/SignUp/ForgotPassword/Onboarding
    │   └── MainTabNavigator.tsx      # Tab navigation (Today, World Map, Settings)
    └── screens/
        ├── LoginScreen.tsx
        ├── SignUpScreen.tsx
        ├── ForgotPasswordScreen.tsx
        ├── OnboardingScreen.tsx
        ├── DailyPromptScreen.tsx     # Prompt + Write + Insight
        ├── WorldMapScreen.tsx        # Map + aggregated emotions
        └── SettingsScreen.tsx        # Account + logout
```

## Firebase Schema

### Collections

| Collection            | Doc ID                        | Fields                                                  |
|-----------------------|-------------------------------|---------------------------------------------------------|
| `users`               | `{uid}`                       | uid, email, displayName, isAnonymous, onboardingCompleted, createdAt |
| `daily_prompts`       | `{YYYY-MM-DD}`                | date, text, createdAt                                   |
| `entries`             | `{auto-id}`                   | userId, date, promptId, text, emotion, country, lat, lng, createdAt |
| `emotion_daily_stats` | `{date}_{emotion}_{country}`  | date, emotion, country, count, lat, lng                 |

### Cloud Functions

1. **`classifyEmotionOnWrite`** — Firestore trigger on `entries/{entryId}` creation. Classifies text → emotion, updates the entry, and increments stats.
2. **`updateDailyStats`** — HTTP endpoint for manual re-aggregation of a given date.

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project created at [Firebase Console](https://console.firebase.google.com)

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions && npm install && cd ..

# Install babel module resolver (for @ path alias)
npm install --save-dev babel-plugin-module-resolver
```

### 2. Configure Firebase

1. Create a Firebase project in the console
2. Enable **Authentication** → Email/Password + Anonymous sign-in
3. Enable **Firestore Database**
4. Copy your Firebase config to `src/config/firebase.ts`
5. Login to Firebase CLI:

```bash
firebase login
firebase use --add   # select your project
```

### 3. Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 4. Seed Daily Prompts

```bash
# Set up service account credentials
export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
npx ts-node scripts/seedPrompts.ts
```

### 5. Deploy Cloud Functions

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 6. Run the App

```bash
# Start Expo dev server
npx expo start

# Or run on specific platform
npx expo start --ios
npx expo start --android
```

### 7. (Optional) Firebase Emulators

For local development without hitting production:

```bash
firebase emulators:start
```

Then update `src/config/firebase.ts` to connect to emulators:

```typescript
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

// After initialization:
connectAuthEmulator(auth, 'http://localhost:9099');
connectFirestoreEmulator(db, 'localhost', 8080);
```

## Google Maps Setup

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Maps SDK for Android" and "Maps SDK for iOS"
3. Add the key to `app.json` under `ios.config.googleMapsApiKey` and `android.config.googleMaps.apiKey`

## Replacing the Emotion Classifier

The placeholder classifier uses keyword matching. To integrate a real API:

1. **Client-side**: Edit `src/services/emotionClassifier.ts`
2. **Server-side**: Edit `functions/src/emotionClassifier.ts`

Example with HuggingFace:
```typescript
export async function classifyEmotion(text: string): Promise<ClassificationResult> {
  const response = await fetch('https://api-inference.huggingface.co/models/...', {
    method: 'POST',
    headers: { Authorization: `Bearer ${HF_API_KEY}` },
    body: JSON.stringify({ inputs: text }),
  });
  const result = await response.json();
  // Map result to your Emotion type
}
```

## Architecture Decisions

- **Firestore for prompts** (not Google Sheets): faster reads, offline support, native integration, no rate limits
- **Dual classification**: client-side for instant UI feedback, server-side (Cloud Function) as source of truth
- **Stats aggregation**: incremental on each entry, with HTTP function for manual re-aggregation
- **Anonymous auth**: low-friction onboarding, easy to upgrade to email later
- **React Query**: caching, deduplication, and background refetching out of the box
