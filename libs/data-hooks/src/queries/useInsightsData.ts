// libs/data-hooks/src/queries/useInsightsData.ts

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client/apiClient';
import type { ContextPortfolioData } from '../types-only';

async function fetchInsights(portfolioData?: ContextPortfolioData) {
  if (!portfolioData) return [];

  const response = await apiClient.post('/api/insights', {
    portfolioData,
  });

  return response.data;
}

export function useInsightsData(portfolioData?: ContextPortfolioData) {
  return useQuery({
    queryKey: ['insights', portfolioData?.address],
    queryFn: () => fetchInsights(portfolioData),
    enabled: !!portfolioData,
  });
}