// apps/web/src/components/dashboard/AccountSummary.tsx

import { CardContainer, Typography } from '@e-burgos/tucu-ui';

interface AllocationItem {
  label: string;
  valueUsd: number;
}

interface AccountSummaryProps {
  totalBalanceUsd: number;
  walletAddress: string;
  allocation: AllocationItem[];
}

function formatUsd(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function AccountSummary({
  totalBalanceUsd,
  walletAddress,
  allocation,
}: AccountSummaryProps) {
  return (
    <CardContainer className="p-8">
      <div className="space-y-6">
        {/* =====================================================
           HEADER
           ===================================================== */}
        <div className="flex items-center justify-between">
          <div>
            <Typography
              tag="h4"
              className="text-sm uppercase tracking-wide text-muted-foreground"
            >
              Total Net Worth
            </Typography>

            <Typography
              tag="h2"
              className="text-4xl font-semibold mt-1"
            >
              {formatUsd(totalBalanceUsd)}
            </Typography>
          </div>

          <div className="text-right">
            <Typography className="text-xs text-muted-foreground">
              Account
            </Typography>
            <Typography className="text-sm font-mono">
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </Typography>
          </div>
        </div>

        {/* =====================================================
           DIVIDER
           ===================================================== */}
        <div className="border-t" />

        {/* =====================================================
           ALLOCATION
           ===================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {allocation.map((item) => (
            <div key={item.label} className="space-y-1">
              <Typography className="text-xs text-muted-foreground">
                {item.label}
              </Typography>

              <Typography className="text-sm font-medium">
                {formatUsd(item.valueUsd)}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}