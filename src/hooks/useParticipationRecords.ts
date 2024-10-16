import { useQuery } from '@tanstack/react-query';
import { fetchParticipationRecords } from '@/api/participationRecord';

export const useParticipationRecords = () => {
  return useQuery({
    queryKey: ['participationRecords'],
    queryFn: fetchParticipationRecords,
    staleTime: 5 * 60 * 1000, 
  });
};