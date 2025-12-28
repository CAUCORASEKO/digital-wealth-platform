import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client/apiClient';
import type { ContextPortfolioData } from '../types-only';

async function fetchTimeline(portfolioData?: ContextPortfolioData) {
  if (!portfolioData) return [];

  const response = await apiClient.post('/api/timeline', {
    portfolioData,
  });

  return response.data;
}

export function useTimelineData(portfolioData?: ContextPortfolioData) {
  return useQuery({
    queryKey: ['timeline', portfolioData?.address],
    queryFn: () => fetchTimeline(portfolioData),
    enabled: !!portfolioData,
  });
}