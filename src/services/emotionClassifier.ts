import { Emotion } from '@/types';

// Placeholder emotion classifier - replace with actual AI service
export const classifyEmotion = async (text: string): Promise<Emotion> => {
  // Simple keyword-based classification for MVP
  const lowerText = text.toLowerCase();
  
  if (lowerText.indexOf('happy') !== -1 || lowerText.indexOf('joy') !== -1 || lowerText.indexOf('excited') !== -1) {
    return 'joy';
  }
  if (lowerText.indexOf('sad') !== -1 || lowerText.indexOf('depressed') !== -1 || lowerText.indexOf('down') !== -1) {
    return 'sadness';
  }
  if (lowerText.indexOf('anxious') !== -1 || lowerText.indexOf('worried') !== -1 || lowerText.indexOf('nervous') !== -1) {
    return 'anxiety';
  }
  if (lowerText.indexOf('hope') !== -1 || lowerText.indexOf('optimistic') !== -1 || lowerText.indexOf('looking forward') !== -1) {
    return 'hope';
  }
  if (lowerText.indexOf('lonely') !== -1 || lowerText.indexOf('alone') !== -1 || lowerText.indexOf('isolated') !== -1) {
    return 'loneliness';
  }
  if (lowerText.indexOf('calm') !== -1 || lowerText.indexOf('peaceful') !== -1 || lowerText.indexOf('relaxed') !== -1) {
    return 'calm';
  }
  
  // Default emotion if no keywords match
  const emotions: Emotion[] = ['joy', 'sadness', 'anxiety', 'hope', 'loneliness', 'calm'];
  return emotions[Math.floor(Math.random() * emotions.length)];
};

// API abstraction layer for future emotion classification services
export interface EmotionClassifierService {
  classify(text: string): Promise<Emotion>;
}

class PlaceholderEmotionClassifier implements EmotionClassifierService {
  async classify(text: string): Promise<Emotion> {
    return classifyEmotion(text);
  }
}

// Factory function to create emotion classifier instances
export const createEmotionClassifier = (): EmotionClassifierService => {
  return new PlaceholderEmotionClassifier();
};
