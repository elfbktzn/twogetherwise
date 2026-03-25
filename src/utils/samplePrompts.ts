import { DailyPrompt } from '@/types';

// Sample daily prompts for testing
export const samplePrompts: DailyPrompt[] = [
  {
    id: 'prompt-1',
    date: '2024-03-25',
    text: 'How are you feeling today?',
    createdAt: new Date('2024-03-25T00:00:00Z')
  },
  {
    id: 'prompt-2',
    date: '2024-03-24',
    text: 'What emotion is most present for you right now?',
    createdAt: new Date('2024-03-24T00:00:00Z')
  },
  {
    id: 'prompt-3',
    date: '2024-03-23',
    text: 'Describe your current emotional state in one sentence.',
    createdAt: new Date('2024-03-23T00:00:00Z')
  },
  {
    id: 'prompt-4',
    date: '2024-03-22',
    text: "What's on your mind today?",
    createdAt: new Date('2024-03-22T00:00:00Z')
  },
  {
    id: 'prompt-5',
    date: '2024-03-21',
    text: 'How would you describe your mood at this moment?',
    createdAt: new Date('2024-03-21T00:00:00Z')
  }
];
