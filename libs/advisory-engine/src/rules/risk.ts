// libs/advisory-engine/src/rules/risk.ts


import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import type { AdvisoryInsight } from '../types';

/**
 * Risk analysis rules
 * Deterministic, non-AI, explainable logic
 */
export function generateRiskInsights(
  portfolio: ContextPortfolioData
): AdvisoryInsight[] {
  const insights: AdvisoryInsight[] = [];

  const tokens = portfolio.tokens ?? [];
  const defiPositions = portfolio.defiPositions ?? [];

  const tokenValue = tokens.reduce(
    (sum: number, t) => sum + t.value,
    0
  );

  const defiValue = defiPositions.reduce(
    (sum: number, d) => sum + d.value,
    0
  );

  const totalValue = tokenValue + defiValue;

  if (totalValue === 0 || tokens.length === 0) {
    return insights;
  }

  const largestToken = tokens.reduce(
    (max, token) => (token.value > max.value ? token : max),
    tokens[0]
  );

  const concentration = largestToken.value / totalValue;

  if (concentration > 0.6) {
    insights.push({
      id: 'risk_concentration_high',
      category: 'risk',
      severity: 'high',
      title: 'High Asset Concentration',
      description: `More than 60% of portfolio value is concentrated in ${largestToken.symbol}.`,
      rationale:
        'High concentration increases volatility and exposes the portfolio to single-asset risk.',
    });
  }

  return insights;
}