import type { ContextPortfolioData } from
  '@web3-ai-copilot/data-hooks/types-only';

export interface PortfolioHealthResult {
  score: number;
  label: 'poor' | 'fair' | 'good' | 'excellent';
  breakdown: {
    diversification: number;
    concentration: number;
    defiRisk: number;
    volatility: number;
    liquidity: number;
  };
}

export function calculatePortfolioHealth(
  data: ContextPortfolioData
): PortfolioHealthResult {
  const total = data.portfolio?.total?.positions ?? 0;
  const tokens = data.tokens ?? [];
  const defi = data.defiPositions ?? [];
  const nfts = data.nfts ?? [];

  /* ---------------- Diversification ---------------- */
  const diversification =
    tokens.length >= 10 ? 100 :
    tokens.length >= 5 ? 75 :
    tokens.length >= 3 ? 50 : 25;

  /* ---------------- Concentration ---------------- */
  const topValue =
    tokens.reduce((max, t) => Math.max(max, t.value), 0);
  const concentration =
    total > 0 && topValue / total > 0.5 ? 25 :
    total > 0 && topValue / total > 0.3 ? 50 : 100;

  /* ---------------- DeFi Risk ---------------- */
  const defiValue = defi.reduce((s, d) => s + d.value, 0);
  const defiRatio = total > 0 ? defiValue / total : 0;
  const defiRisk =
    defiRatio > 0.6 ? 30 :
    defiRatio > 0.3 ? 60 : 100;

  /* ---------------- Volatility ---------------- */
  const pct1d = data.portfolio?.changes?.percent_1d ?? 0;
  const volatility =
    Math.abs(pct1d) > 10 ? 30 :
    Math.abs(pct1d) > 5 ? 60 : 100;

  /* ---------------- Liquidity ---------------- */
  const nftRatio =
    total > 0
      ? nfts.reduce((s, n) => s + (n.value ?? 0), 0) / total
      : 0;

  const liquidity =
    nftRatio > 0.4 ? 40 :
    nftRatio > 0.2 ? 70 : 100;

  /* ---------------- Final Score ---------------- */
  const score = Math.round(
    diversification * 0.2 +
    concentration * 0.25 +
    defiRisk * 0.2 +
    volatility * 0.2 +
    liquidity * 0.15
  );

  const label =
    score >= 80 ? 'excellent' :
    score >= 65 ? 'good' :
    score >= 45 ? 'fair' : 'poor';

  return {
    score,
    label,
    breakdown: {
      diversification,
      concentration,
      defiRisk,
      volatility,
      liquidity,
    },
  };
}