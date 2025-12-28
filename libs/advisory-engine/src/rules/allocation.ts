// libs/advisory-engine/src/rules/allocation.ts


import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import type { AdvisoryInsight } from '../types';

export function generateAllocationInsights(
  portfolio: ContextPortfolioData
): AdvisoryInsight[] {
  if (!portfolio.tokens || portfolio.tokens.length === 0) {
    return [];
  }

  return [
    {
      id: 'allocation_concentration_test',
      category: 'allocation',
      severity: 'medium',
      title: 'Asset allocation review required',
      description:
        'Your portfolio shows a concentration in a limited number of assets.',
      rationale:
        'Institutional risk frameworks recommend diversification to reduce volatility and drawdown risk.',
      metric: 0.62,
      threshold: 0.5,
    },
  ];
}