import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchStampCard, StampCardResponse } from '@/api/stampCard';

export const useStampCard = (): UseQueryResult<StampCardResponse | null, Error> => {
  return useQuery<StampCardResponse | null, Error>({
    queryKey: ['stampCard'],
    queryFn: fetchStampCard,
  });
};