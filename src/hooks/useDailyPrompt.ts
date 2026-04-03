import { useQuery } from '@tanstack/react-query';
import { fetchTodayPrompt } from '@/services/promptService';
import { getTodayDateString } from '@/config/constants';

export function useDailyPrompt() {
  return useQuery({
    queryKey: ['dailyPrompt', getTodayDateString()],
    queryFn: fetchTodayPrompt,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
