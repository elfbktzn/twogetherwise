# Global Feelings Map - Project Structure

## Folder Structure

```
global-feelings-map/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Main app screens
│   │   ├── OnboardingScreen.tsx
│   │   ├── DailyPromptScreen.tsx
│   │   ├── WriteEmotionScreen.tsx
│   │   ├── InsightScreen.tsx
│   │   └── WorldMapScreen.tsx
│   ├── services/           # External service integrations
│   │   ├── firebase.ts     # Firebase configuration
│   │   ├── firestore.ts    # Firestore queries
│   │   └── emotionClassifier.ts  # Emotion detection
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication state
│   │   ├── useDailyPrompt.ts  # Daily prompt data
│   │   └── useLocation.ts  # Location services
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── utils/              # Utility functions
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts        # Main functions file
│   ├── package.json
│   └── tsconfig.json
├── App.tsx                 # Main app component
├── package.json
├── tsconfig.json
├── app.json               # Expo configuration
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── README.md
├── DEVELOPMENT.md
└── PROJECT_STRUCTURE.md
```

## Architecture Overview

### Frontend (React Native + Expo)
- **Screens**: Core user interface components
- **Hooks**: State management and data fetching
- **Services**: External API integrations
- **Types**: TypeScript definitions

### Backend (Firebase)
- **Firestore**: NoSQL database
- **Cloud Functions**: Server-side logic
- **Anonymous Auth**: User authentication

### Key Design Patterns

#### 1. Service Layer Pattern
- Separates business logic from UI
- Centralized API calls and data transformations
- Easy to mock for testing

#### 2. Custom Hooks Pattern
- Encapsulates complex state logic
- Reusable across components
- Clean separation of concerns

#### 3. Type Safety
- Comprehensive TypeScript definitions
- End-to-end type checking
- Better developer experience

## Data Flow

1. **User Authentication**
   - Anonymous sign-in on app launch
   - User ID stored for data association

2. **Daily Prompt Flow**
   - Fetch today's prompt from Firestore
   - Fallback to local prompts if offline

3. **Emotion Entry**
   - User writes text response
   - Client-side emotion classification
   - Server-side classification confirmation
   - Store in Firestore with location

4. **Insight Display**
   - Calculate emotion percentages
   - Show "You are not alone" messaging

5. **Map Visualization**
   - Fetch aggregated entries
   - Display emotion clusters on world map

## Database Schema

### Collections

#### users
- Anonymous user management
- Tracks user activity

#### entries
- User emotion entries
- Core data for insights and map

#### daily_prompts
- Daily emotional prompts
- Automated creation via Cloud Functions

#### emotion_daily_stats
- Aggregated emotion statistics
- Optimized for quick insights

## Security Rules

- Anonymous users can create entries
- Users can only read their own entries
- Public access to prompts and aggregated stats
- Prevents data leakage between users

## Scalability Considerations

### Frontend
- React Query for efficient data caching
- Lazy loading for map data
- Optimistic updates for better UX

### Backend
- Cloud Functions for automatic processing
- Firestore indexes for query performance
- Emulator support for local development

### Future Enhancements
- Real-time updates with Firestore listeners
- Image-based emotion detection
- Advanced sentiment analysis
- Social features and community building
