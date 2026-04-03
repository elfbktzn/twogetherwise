import { useQuery } from '@tanstack/react-query';
import { fetchTodayInsight } from '@/services/statsService';
import { Emotion } from '@/types';

export function useInsight(emotion: Emotion | null) {
  return useQuery({
    queryKey: ['todayInsight', emotion],
    queryFn: () => fetchTodayInsight(emotion!),
    enabled: !!emotion,
  });
}
