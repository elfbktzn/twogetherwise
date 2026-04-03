/**
 * Placeholder emotion classifier for Cloud Functions (server-side).
 * This mirrors the client-side classifier but runs on the backend
 * for authoritative classification.
 *
 * TODO: Replace with a real NLP API call:
 *   - HuggingFace Inference API
 *   - OpenAI API
 *   - Google Cloud Natural Language API
 */

export type Emotion = 'joy' | 'sadness' | 'anxiety' | 'hope' | 'loneliness' | 'calm';

interface ClassificationResult {
  emotion: Emotion;
  confidence: number;
}

const KEYWORD_MAP: Record<string, Emotion> = {
  happy: 'joy',
  great: 'joy',
  wonderful: 'joy',
  excited: 'joy',
  love: 'joy',
  amazing: 'joy',
  fantastic: 'joy',
  blessed: 'joy',
  grateful: 'joy',

  sad: 'sadness',
  down: 'sadness',
  depressed: 'sadness',
  cry: 'sadness',
  heartbroken: 'sadness',
  miserable: 'sadness',
  grief: 'sadness',
  hurt: 'sadness',

  anxious: 'anxiety',
  worried: 'anxiety',
  nervous: 'anxiety',
  stressed: 'anxiety',
  panic: 'anxiety',
  overwhelmed: 'anxiety',
  fear: 'anxiety',
  scared: 'anxiety',

  hopeful: 'hope',
  optimistic: 'hope',
  better: 'hope',
  future: 'hope',
  forward: 'hope',
  believe: 'hope',
  dream: 'hope',
  wish: 'hope',

  lonely: 'loneliness',
  alone: 'loneliness',
  isolated: 'loneliness',
  disconnected: 'loneliness',
  miss: 'loneliness',
  empty: 'loneliness',
  abandoned: 'loneliness',

  calm: 'calm',
  peaceful: 'calm',
  relaxed: 'calm',
  serene: 'calm',
  quiet: 'calm',
  content: 'calm',
  zen: 'calm',
  still: 'calm',
};

export function classifyEmotion(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();
  const emotionScores: Record<Emotion, number> = {
    joy: 0,
    sadness: 0,
    anxiety: 0,
    hope: 0,
    loneliness: 0,
    calm: 0,
  };

  for (const [keyword, emotion] of Object.entries(KEYWORD_MAP)) {
    if (lowerText.includes(keyword)) {
      emotionScores[emotion] += 1;
    }
  }

  let maxEmotion: Emotion = 'calm';
  let maxScore = 0;

  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxEmotion = emotion as Emotion;
    }
  }

  return {
    emotion: maxEmotion,
    confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3,
  };
}
