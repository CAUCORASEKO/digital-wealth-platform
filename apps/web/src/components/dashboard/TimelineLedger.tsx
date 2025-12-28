// apps/web/src/components/dashboard/TimelineLedger.tsx


import { CardContainer, Typography } from '@e-burgos/tucu-ui';

export interface LedgerEntry {
  id: string;
  date: string; // ISO string
  description: string;
  amountUsd: number;
  type: 'credit' | 'debit';
}

interface TimelineLedgerProps {
  entries: LedgerEntry[];
}

function formatUsd(value: number) {
  return `$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function TimelineLedger({ entries }: TimelineLedgerProps) {
  if (!entries.length) {
    return (
      <CardContainer>
        <Typography className="text-muted-foreground">
          No recent account activity
        </Typography>
      </CardContainer>
    );
  }

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
          Account Activity
        </Typography>
      </div>

      {/* =====================================================
         LEDGER TABLE
         ===================================================== */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              <th className="px-8 py-4 text-left font-medium">Date</th>
              <th className="px-8 py-4 text-left font-medium">
                Description
              </th>
              <th className="px-8 py-4 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry) => {
              const positive = entry.type === 'credit';

              return (
                <tr
                  key={entry.id}
                  className="border-t hover:bg-muted/20 transition"
                >
                  {/* DATE */}
                  <td className="px-8 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="px-8 py-4">
                    <Typography className="font-medium">
                      {entry.description}
                    </Typography>
                  </td>

                  {/* AMOUNT */}
                  <td
                    className={`px-8 py-4 text-right tabular-nums font-medium ${
                      positive
                        ? 'text-emerald-500'
                        : 'text-red-500'
                    }`}
                  >
                    {positive ? '+' : '-'}
                    {formatUsd(entry.amountUsd)}
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