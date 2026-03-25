# Global Feelings Map - MVP

A React Native + Firebase app where users share daily emotions and see global feelings on a map.

## Tech Stack

- **Frontend**: React Native (Expo), TypeScript, React Query, react-native-maps
- **Backend**: Firebase (Firestore, Cloud Functions, Anonymous Auth)
- **AI/NLP**: Emotion classification API abstraction

## Core Features

1. Daily emotional prompts
2. Text response with emotion detection
3. Instant insights ("You are not alone...")
4. Global emotion map visualization

## Project Structure

```
src/
├── screens/           # Main app screens
├── services/          # Firebase and external APIs
├── hooks/             # Custom React hooks
├── types/             # TypeScript definitions
└── utils/             # Utility functions

functions/             # Firebase Cloud Functions
```

## Quick Start

```bash
# Install dependencies
npm install

# Start Firebase emulators (for local development)
npm run firebase:emulators

# Start Expo development server
npm start
```

## Key Components

### Screens
- **OnboardingScreen**: Welcome and app introduction
- **DailyPromptScreen**: Shows today's emotional prompt
- **WriteEmotionScreen**: Text input for user response
- **InsightScreen**: Shows emotion statistics and "You are not alone" message
- **WorldMapScreen**: Global emotion visualization with clusters

### Services
- **Firebase**: Authentication and database configuration
- **Firestore**: Database operations and queries
- **Emotion Classifier**: Placeholder AI service for emotion detection

### Hooks
- **useAuth**: Anonymous user authentication
- **useDailyPrompt**: Fetches daily prompts with fallbacks
- **useLocation**: GPS location services with country detection

## Database Schema

### Collections
- `users`: Anonymous user data
- `entries`: User emotion responses with location
- `daily_prompts`: Automated daily emotional prompts
- `emotion_daily_stats`: Aggregated emotion statistics

## Cloud Functions

- `classifyEmotionOnWrite`: Auto-classifies emotions on entry creation
- `createDailyPrompt`: Scheduled daily prompt generation
- `updateDailyStats`: Aggregates emotion statistics

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup instructions.

## Architecture

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed architecture overview.
