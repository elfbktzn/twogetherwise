# Development Guide - Global Feelings Map

## Setup Instructions

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- Firebase CLI (`npm install -g firebase-tools`)

### Initial Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Firebase**
   ```bash
   # Login to Firebase
   firebase login
   
   # Initialize Firebase project
   firebase init
   
   # Install functions dependencies
   cd functions && npm install && cd ..
   ```

3. **Configure Firebase**
   - Update `src/services/firebase.ts` with your Firebase config
   - Set up Firestore database in Firebase console
   - Enable Anonymous Authentication in Firebase console

### Local Development

1. **Start Firebase Emulators**
   ```bash
   npm run firebase:emulators
   ```
   This starts:
   - Firestore on port 8080
   - Functions on port 5001
   - Auth on port 9099
   - Firebase UI on port 4000

2. **Start Expo Development Server**
   ```bash
   npm start
   ```
   - Scan QR code with Expo Go app
   - Or run on simulator: `npm run ios` or `npm run android`

### Firebase Configuration

1. **Update Firebase Config**
   Replace placeholder values in `src/services/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

2. **Firestore Rules**
   The `firestore.rules` file is already configured for:
   - Anonymous users can read/write their own data
   - Public read access to prompts and aggregated stats
   - Users can create entries but only read their own

3. **Cloud Functions**
   - `classifyEmotionOnWrite`: Automatically classifies emotion when entry is created
   - `createDailyPrompt`: Scheduled function to create daily prompts
   - `updateDailyStats`: Aggregates emotion statistics

### Database Schema

#### Collections

**users**
```typescript
{
  id: string,
  createdAt: Date,
  lastActiveAt: Date
}
```

**entries**
```typescript
{
  userId: string,
  date: string, // YYYY-MM-DD
  promptId: string,
  text: string,
  emotion: 'joy' | 'sadness' | 'anxiety' | 'hope' | 'loneliness' | 'calm',
  country: string,
  lat: number,
  lng: number,
  createdAt: Date
}
```

**daily_prompts**
```typescript
{
  date: string, // YYYY-MM-DD
  text: string,
  createdAt: Date
}
```

**emotion_daily_stats**
```typescript
{
  date: string,
  emotion: string,
  country: string,
  count: number
}
```

### Key Features Implementation

#### Emotion Classification
- Currently uses keyword-based placeholder
- Replace `classifyEmotion()` in `src/services/emotionClassifier.ts` with actual AI service
- Cloud Functions automatically classify entries on write

#### Location Services
- Uses Expo Location for GPS
- Fallback to manual country selection if permission denied
- Default location: New York (40.7128, -74.0060)

#### React Query Integration
- Caches daily prompts and emotion stats
- Automatic refetching and background updates
- Optimistic updates for better UX

### Testing

1. **Test Firebase Emulators**
   - Visit http://localhost:4000 for Firebase Emulator UI
   - Verify Firestore data and function execution

2. **Test App Flow**
   - Onboarding → Daily Prompt → Write Emotion → Insight → World Map
   - Test with different emotions and locations
   - Verify data persistence in Firestore

3. **Test Edge Cases**
   - No location permission
   - Network errors
   - Empty text submissions
   - Duplicate daily entries

### Deployment

1. **Deploy Cloud Functions**
   ```bash
   npm run firebase:deploy
   ```

2. **Build for Production**
   ```bash
   # Build for iOS
   eas build --platform ios
   
   # Build for Android
   eas build --platform android
   ```

### Common Issues

**TypeScript Errors**: Run `npm install` to ensure all dependencies are installed

**Firebase Connection**: Verify Firebase config and emulator status

**Location Permission**: Test on physical device for accurate GPS

**Map Rendering**: Ensure react-native-maps is properly configured for your platform

### Next Steps for Production

1. Replace placeholder emotion classifier with real AI service
2. Add proper error handling and retry logic
3. Implement user analytics and crash reporting
4. Add push notifications for daily reminders
5. Scale database with proper indexes
6. Add content moderation for user entries
