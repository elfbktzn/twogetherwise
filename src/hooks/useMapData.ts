import { useQuery } from '@tanstack/react-query';
import { fetchMapData } from '@/services/statsService';
import { getYesterdayDateString } from '@/config/constants';

export function useMapData(date?: string) {
  const targetDate = date || getYesterdayDateString();
  return useQuery({
    queryKey: ['mapData', targetDate],
    queryFn: () => fetchMapData(targetDate),
    staleTime: 1000 * 60 * 10,
  });
}
