import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { submitEntry, hasSubmittedToday } from '@/services/entryService';
import { classifyEmotion } from '@/services/emotionClassifier';
import { getUserLocation } from '@/utils/location';
import { useAuth } from '@/contexts/AuthContext';
import { getTodayDateString } from '@/config/constants';
import { Entry, Emotion } from '@/types';

export function useHasSubmittedToday() {
  const { firebaseUser } = useAuth();
  return useQuery({
    queryKey: ['hasSubmitted', getTodayDateString(), firebaseUser?.uid],
    queryFn: () => hasSubmittedToday(firebaseUser!.uid),
    enabled: !!firebaseUser,
  });
}

export function useSubmitEntry() {
  const { firebaseUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      text,
      promptId,
    }: {
      text: string;
      promptId: string;
    }): Promise<{ entryId: string; emotion: Emotion }> => {
      if (!firebaseUser) throw new Error('Not authenticated');

      const [classification, location] = await Promise.all([
        classifyEmotion(text),
        getUserLocation(),
      ]);

      const entry: Omit<Entry, 'id'> = {
        userId: firebaseUser.uid,
        date: getTodayDateString(),
        promptId,
        text,
        emotion: classification.emotion,
        country: location.country,
        lat: location.lat,
        lng: location.lng,
        createdAt: new Date().toISOString(),
      };

      const entryId = await submitEntry(entry);
      return { entryId, emotion: classification.emotion };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasSubmitted'] });
      queryClient.invalidateQueries({ queryKey: ['todayInsight'] });
    },
  });
}
