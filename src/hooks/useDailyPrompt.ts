import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTodayPrompt } from '@/services/firestore';
import { DailyPrompt } from '@/types';

export const useDailyPrompt = (date: string) => {
  return useQuery({
    queryKey: ['dailyPrompt', date],
    queryFn: () => getTodayPrompt(date),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Fallback prompts for offline/demo
const FALLBACK_PROMPTS = [
  "How are you feeling today?",
  "What emotion is most present for you right now?",
  "Describe your current emotional state in one sentence.",
  "What's on your mind today?",
  "How would you describe your mood at this moment?"
];

export const useFallbackPrompt = (date: string) => {
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);

  useEffect(() => {
    const dayIndex = new Date(date).getDate() % FALLBACK_PROMPTS.length;
    setPrompt({
      id: `fallback-${date}`,
      date,
      text: FALLBACK_PROMPTS[dayIndex],
      createdAt: new Date()
    });
  }, [date]);

  return prompt;
};
