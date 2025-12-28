// apps/web/src/components/dashboard/BalanceBreakdown.tsx

import { CardContainer, Typography } from '@e-burgos/tucu-ui';

export function BalanceBreakdown() {
  return (
    <CardContainer className="p-6">
      <Typography className="text-sm text-slate-500 mb-4">
        Asset allocation
      </Typography>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Tokens</span>
          <span className="font-medium">$82,400</span>
        </div>

        <div className="flex justify-between">
          <span>DeFi</span>
          <span className="font-medium">$31,200</span>
        </div>

        <div className="flex justify-between">
          <span>NFTs</span>
          <span className="font-medium">$10,900</span>
        </div>
      </div>
    </CardContainer>
  );
}