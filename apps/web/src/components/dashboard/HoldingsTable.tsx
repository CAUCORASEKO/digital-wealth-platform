// apps/web/src/components/dashboard/HoldingsTable.tsx

import { CardContainer, Typography } from '@e-burgos/tucu-ui';

interface HoldingRow {
  symbol: string;
  name?: string;
  balance: number;
  priceUsd: number;
  valueUsd: number;
  change24hPct?: number;
}

interface HoldingsTableProps {
  holdings: HoldingRow[];
}

function formatUsd(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (!holdings.length) return null;

  return (
    <CardContainer className="p-0 overflow-hidden">
      {/* =====================================================
         HEADER
         ===================================================== */}
      <div className="px-8 py-5 border-b">
        <Typography
          tag="h4"
          className="text-sm uppercase tracking-wide text-muted-foreground"
        >
          Asset Holdings
        </Typography>
      </div>

      {/* =====================================================
         TABLE
         ===================================================== */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-8 py-4 text-left font-medium">Asset</th>
              <th className="px-8 py-4 text-right font-medium">Balance</th>
              <th className="px-8 py-4 text-right font-medium">Price</th>
              <th className="px-8 py-4 text-right font-medium">Market Value</th>
              <th className="px-8 py-4 text-right font-medium">24h</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((row) => {
              const positive = (row.change24hPct ?? 0) >= 0;

              return (
                <tr
                  key={row.symbol}
                  className="border-t hover:bg-muted/20 transition"
                >
                  {/* ASSET */}
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {row.symbol}
                      </span>
                      {row.name && (
                        <span className="text-xs text-muted-foreground">
                          {row.name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* BALANCE */}
                  <td className="px-8 py-4 text-right tabular-nums">
                    {row.balance.toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}
                  </td>

                  {/* PRICE */}
                  <td className="px-8 py-4 text-right tabular-nums">
                    {formatUsd(row.priceUsd)}
                  </td>

                  {/* VALUE */}
                  <td className="px-8 py-4 text-right font-medium tabular-nums">
                    {formatUsd(row.valueUsd)}
                  </td>

                  {/* CHANGE */}
                  <td
                    className={`px-8 py-4 text-right tabular-nums ${
                      row.change24hPct === undefined
                        ? 'text-muted-foreground'
                        : positive
                        ? 'text-emerald-500'
                        : 'text-red-500'
                    }`}
                  >
                    {row.change24hPct === undefined
                      ? '—'
                      : `${positive ? '+' : ''}${row.change24hPct.toFixed(
                          2
                        )}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CardContainer>
  );
}