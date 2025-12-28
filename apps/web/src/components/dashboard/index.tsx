import { useMemo, useEffect } from 'react';
import {
  useContextPortfolioData,
  useTokenData,
  useInsightsData,
  useTimelineData,
} from '@web3-ai-copilot/data-hooks';

import {
  CardContainer,
  LucideIcons,
  Typography,
} from '@e-burgos/tucu-ui';

import { PortfolioOverview } from './PortfolioOverview';
import { AssetAllocationChart } from './AssetAllocationChart';
import { TopAssetsChart } from './TopAssetsChart';
import { DistributionByChain } from './DistributionByChain';
import { DistributionByType } from './DistributionByType';
import { Timeline } from './Timeline';
import { Skeleton } from '../common/Skeleton';

import { useTimelineStore } from '../../store/timeline.store';
import type { AdvisoryInsight } from '@web3-ai-copilot/advisory-engine';

export function Dashboard() {
  // ---------------------------------------------------------------------------
  // Data fetching (SINGLE SOURCE OF TRUTH)
  // ---------------------------------------------------------------------------
  const {
    data: rawContextPortfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
  } = useContextPortfolioData();

  // ⬇️ NORMALIZACIÓN CRÍTICA (null → undefined)
  const contextPortfolio = rawContextPortfolio ?? undefined;

  const {
    data: tokensData,
    isLoading: tokensLoading,
    error: tokensError,
  } = useTokenData({ trash: 'only_non_trash' });

  const tokens = useMemo(() => tokensData?.data ?? [], [tokensData]);

  const { data: insights } = useInsightsData(contextPortfolio);
  const { data: timelineEvents } = useTimelineData(contextPortfolio);

  // ---------------------------------------------------------------------------
  // Timeline persistence (desktop-first)
  // ---------------------------------------------------------------------------
  const { setEvents, eventsByWallet } = useTimelineStore();
  const wallet = contextPortfolio?.address;

  useEffect(() => {
    if (wallet && timelineEvents) {
      setEvents(wallet, timelineEvents);
    }
  }, [wallet, timelineEvents, setEvents]);

  const persistedTimeline =
    wallet && eventsByWallet[wallet]
      ? eventsByWallet[wallet]
      : timelineEvents;

  const isLoading = portfolioLoading || tokensLoading;
  const error = portfolioError || tokensError;

  // ---------------------------------------------------------------------------
  // Data processing
  // ---------------------------------------------------------------------------
  const sortedTokens = [...tokens].sort((a, b) => b.value - a.value);

  const topTokens = sortedTokens.slice(0, 5);
  const otherValue = sortedTokens
    .slice(5)
    .reduce((acc, t) => acc + t.value, 0);

  const pieData = [
    ...topTokens.map((t) => ({ name: t.symbol, value: t.value })),
    ...(otherValue > 0 ? [{ name: 'Others', value: otherValue }] : []),
  ];

  // ---------------------------------------------------------------------------
  // Loading / Error states
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rectangular" className="h-24 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rectangular" className="h-64 rounded-lg" />
          <Skeleton variant="rectangular" className="h-64 rounded-lg" />
        </div>
        <Skeleton variant="rectangular" className="h-64 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <CardContainer>
        <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
          <LucideIcons.DatabaseBackup className="h-16 w-16 text-muted-foreground" />
          <Typography tag="h4" className="text-destructive">
            Error loading portfolio: {error.message}
          </Typography>
        </div>
      </CardContainer>
    );
  }

  if (!contextPortfolio) {
    return (
      <CardContainer>
        <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
          <LucideIcons.Wallet className="h-16 w-16 text-muted-foreground" />
          <Typography tag="h4" className="text-muted-foreground">
            No portfolio data available
          </Typography>
        </div>
      </CardContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full space-y-6">
      {/* ADVISORY INSIGHTS */}
      {insights && insights.length > 0 && (
        <CardContainer>
          <div className="flex flex-col gap-3">
            <Typography tag="h4">Advisory Insights</Typography>

            {insights.slice(0, 3).map((insight: AdvisoryInsight) => (
              <div
                key={insight.id}
                className="rounded-md border border-border p-3"
              >
                <Typography tag="h5">{insight.title}</Typography>
                <Typography className="text-muted-foreground">
                  {insight.description}
                </Typography>
              </div>
            ))}
          </div>
        </CardContainer>
      )}

      {/* TIMELINE */}
      {persistedTimeline && persistedTimeline.length > 0 && (
        <Timeline events={persistedTimeline} />
      )}

      {/* OVERVIEW */}
      <PortfolioOverview
        totalValue={contextPortfolio.portfolio?.total?.positions ?? 0}
      />

      {/* CHARTS */}
      {tokens.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AssetAllocationChart data={pieData} />
          <TopAssetsChart data={topTokens} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DistributionByChain
          portfolio={
            contextPortfolio.portfolio?.positions_distribution_by_chain
          }
        />
        <DistributionByType
          portfolio={
            contextPortfolio.portfolio?.positions_distribution_by_type
          }
        />
      </div>
    </div>
  );
}