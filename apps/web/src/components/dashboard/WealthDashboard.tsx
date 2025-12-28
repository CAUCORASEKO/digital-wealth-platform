// apps/web/src/components/dashboard/WealthDashboard.tsx

import { useMemo } from 'react';
import {
  usePortfolioData,
  useTokenData,
} from '@web3-ai-copilot/data-hooks';
import { useWallet } from '@web3-ai-copilot/wallet';

import { AccountSummary } from './AccountSummary';
import { HoldingsTable } from './HoldingsTable';
import { TimelineLedger } from './TimelineLedger';

import { Skeleton } from '../common/Skeleton';
import { CardContainer, Typography } from '@e-burgos/tucu-ui';

export function WealthDashboard() {
  const { address } = useWallet();

  const { data: portfolioRes, isLoading: portfolioLoading } =
    usePortfolioData();

  const { data: tokenRes, isLoading: tokensLoading } =
    useTokenData({ trash: 'only_non_trash' });

  const portfolio = portfolioRes?.data;
  const tokens = tokenRes?.data ?? [];

  const isLoading = portfolioLoading || tokensLoading;

  // ============================================================
  // DERIVED VALUES
  // ============================================================
  const totalBalanceUsd = portfolio?.total?.positions ?? 0;

  const allocation = useMemo(() => {
    if (!portfolio?.positions_distribution_by_type) return [];

    const d = portfolio.positions_distribution_by_type;

    return [
      { label: 'Wallet', valueUsd: d.wallet },
      { label: 'Deposited', valueUsd: d.deposited },
      { label: 'Staked', valueUsd: d.staked },
      { label: 'Locked', valueUsd: d.locked },
      { label: 'Borrowed', valueUsd: d.borrowed },
    ].filter((a) => a.valueUsd > 0);
  }, [portfolio]);

  const holdings = useMemo(() => {
    return tokens.map((token) => ({
      symbol: token.symbol,
      name: token.name,
      balance: Number(token.balance),
      priceUsd: token.price ?? 0,
      valueUsd: token.value,
      change24hPct: undefined,
    }));
  }, [tokens]);

  // ============================================================
  // LOADING / EMPTY
  // ============================================================
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <CardContainer>
        <Typography>No portfolio data available</Typography>
      </CardContainer>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-10">
      {/* ======================================================
         ACCOUNT OVERVIEW (TOP)
         ====================================================== */}
      <section>
        <AccountSummary
          totalBalanceUsd={totalBalanceUsd}
          walletAddress={address ?? ''}
          allocation={allocation}
        />
      </section>

      {/* ======================================================
         HOLDINGS TABLE
         ====================================================== */}
      <section>
        <Typography
          tag="h3"
          className="mb-4 text-lg font-semibold"
        >
          Asset Holdings
        </Typography>

        <HoldingsTable holdings={holdings} />
      </section>

      {/* ======================================================
         ACTIVITY LEDGER
         ====================================================== */}
      <section>
        <Typography
          tag="h3"
          className="mb-4 text-lg font-semibold"
        >
          Activity & Ledger
        </Typography>

        <TimelineLedger entries={[]} />
      </section>
    </div>
  );
}