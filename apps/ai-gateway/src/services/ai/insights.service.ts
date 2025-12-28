import type { ContextPortfolioData } from
  '@web3-ai-copilot/data-hooks/types-only';

import { mapInsightToTimelineEvent } from './insightTimeline.mapper';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Insight {
  id: string;
  type: 'risk' | 'performance' | 'opportunity' | 'info';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Core insight generation
// ---------------------------------------------------------------------------
export function generateInsights(
  portfolio: ContextPortfolioData
): Insight[] {
  const insights: Insight[] = [];

  // Rule 1: High concentration in a single asset
  const totalValue =
    portfolio.portfolio?.total?.positions || 0;

  if (totalValue > 0 && portfolio.tokens?.length) {
    const topToken = portfolio.tokens.reduce((a, b) =>
      a.value > b.value ? a : b
    );

    const concentration = topToken.value / totalValue;

    if (concentration > 0.6) {
      insights.push({
        id: 'high-asset-concentration',
        type: 'risk',
        severity: 'high',
        title: 'High asset concentration',
        description: `More than ${(
          concentration * 100
        ).toFixed(0)}% of your portfolio is allocated to ${topToken.symbol}.`,
        createdAt: new Date(),
      });
    }
  }

  // Rule 2: High concentration on a single blockchain
  if (portfolio.portfolio?.positions_distribution_by_chain) {
    const chains = portfolio.portfolio.positions_distribution_by_chain;
    const totalChainValue = Object.values(chains).reduce(
      (acc, value) => acc + value,
      0
    );

    if (totalChainValue > 0) {
      const [topChain, topChainValue] = Object.entries(chains).reduce(
        (a, b) => (a[1] > b[1] ? a : b)
      );

      const chainConcentration = topChainValue / totalChainValue;

      if (chainConcentration > 0.7) {
        insights.push({
          id: 'high-chain-concentration',
          type: 'risk',
          severity: 'medium',
          title: 'High blockchain concentration',
          description: `More than ${(
            chainConcentration * 100
          ).toFixed(0)}% of your portfolio is allocated to ${topChain}.`,
          createdAt: new Date(),
        });
      }
    }
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Timeline generation (Insights + Transactions + DeFi)
// ---------------------------------------------------------------------------
export function generateInsightEvents(
  portfolio: ContextPortfolioData
) {
  const events: any[] = [];

  // Insights
  const insights = generateInsights(portfolio);
  events.push(
    ...insights.map(mapInsightToTimelineEvent)
  );

  // Transactions
  if (portfolio.recentTransactions?.length) {
    events.push(
      ...portfolio.recentTransactions
        .slice(0, 10)
        .map(mapTransactionToTimeline)
    );
  }

  // DeFi positions
  if (portfolio.defiPositions?.length) {
    events.push(
      ...portfolio.defiPositions
        .slice(0, 5)
        .map(mapDefiToTimeline)
    );
  }

  // Sort by time (newest first)
  return events.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function mapTransactionToTimeline(tx: any) {
  return {
    id: `tx-${tx.hash}`,
    category: 'transaction',
    severity: 'low',
    title: `Transaction: ${tx.operation_type}`,
    description: `${tx.transfers?.length || 0} transfers`,
    timestamp: tx.mined_at,
  };
}

function mapDefiToTimeline(position: any) {
  return {
    id: `defi-${position.id || position.name}`,
    category: 'defi',
    severity: 'medium',
    title: `DeFi position: ${position.protocol || 'Unknown'}`,
    description: position.name || position.type,
    timestamp: new Date().toISOString(),
  };
}