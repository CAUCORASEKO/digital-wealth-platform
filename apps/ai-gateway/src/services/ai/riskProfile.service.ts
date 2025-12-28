// apps/ai-gateway/src/services/ai/riskProfile.service.ts

import type { ContextPortfolioData } from
  '@web3-ai-copilot/data-hooks/types-only';

export type RiskProfile =
  | 'conservative'
  | 'balanced'
  | 'aggressive';

export function inferRiskProfile(
  portfolioData: ContextPortfolioData
): RiskProfile {
  const total =
    portfolioData.portfolio?.total?.positions ?? 0;

  if (!total || total === 0) return 'conservative';

  const tokens = portfolioData.tokens ?? [];
  const defi = portfolioData.defiPositions ?? [];
  const nfts = portfolioData.nfts ?? [];

  // --- Concentration ---
  const topToken = tokens[0];
  const topConcentration =
    topToken && total > 0
      ? topToken.value / total
      : 0;

  // --- Exposure ratios ---
  const defiValue = defi.reduce(
    (acc, d) => acc + d.value,
    0
  );

  const nftValue = nfts.reduce(
    (acc, n) => acc + (n.value ?? 0),
    0
  );

  const defiRatio = defiValue / total;
  const nftRatio = nftValue / total;

  /* -----------------------------
     RULES (simple + explainable)
     ----------------------------- */

  if (
    defiRatio > 0.35 ||
    nftRatio > 0.25 ||
    topConcentration > 0.6
  ) {
    return 'aggressive';
  }

  if (
    defiRatio > 0.15 ||
    nftRatio > 0.1 ||
    topConcentration > 0.35
  ) {
    return 'balanced';
  }

  return 'conservative';
}