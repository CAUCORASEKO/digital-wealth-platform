// apps/web/src/pages/TokensPage.tsx
import { PageLayout } from '../components/layout/PageLayout';

/* =========================================================
   PRIVATE BANKING — HOLDINGS (MOCK)
   ========================================================= */

const surface = 'bg-[#141a22]';
const border = 'border border-[#1f2630]';
const textMain = 'text-[#e6ebf2]';
const textMuted = 'text-[#8a94a6]';
const accent = 'text-[#c9a24d]';

const MOCK_HOLDINGS = [
  { asset: 'Ethereum', symbol: 'ETH', balance: '12.45', value: '$32,800.00' },
  { asset: 'USD Coin', symbol: 'USDC', balance: '50,000', value: '$50,000.00' },
  { asset: 'Staked ETH', symbol: 'stETH', balance: '5.00', value: '$13,200.00' },
];

export default function TokensPage() {
  return (
    <PageLayout title="Holdings">
      <section className={`${surface} ${border} rounded-xl overflow-hidden`}>
        <div className="px-8 py-4 border-b border-[#1f2630]">
          <h2 className={`text-sm uppercase tracking-wide ${textMuted}`}>
            Asset Holdings
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-[#1b2029]">
            <tr>
              <th className="px-8 py-4 text-left text-xs uppercase tracking-wide text-[#8a94a6]">
                Asset
              </th>
              <th className="px-8 py-4 text-right text-xs uppercase tracking-wide text-[#8a94a6]">
                Balance
              </th>
              <th className="px-8 py-4 text-right text-xs uppercase tracking-wide text-[#8a94a6]">
                Value
              </th>
            </tr>
          </thead>

          <tbody>
            {MOCK_HOLDINGS.map((row) => (
              <tr key={row.asset} className="border-t border-[#1f2630]">
                <td className={`px-8 py-4 ${textMain}`}>
                  {row.asset}
                  <span className="ml-2 text-xs text-[#8a94a6]">
                    {row.symbol}
                  </span>
                </td>
                <td className={`px-8 py-4 text-right ${textMain}`}>
                  {row.balance}
                </td>
                <td className={`px-8 py-4 text-right font-medium ${accent}`}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PageLayout>
  );
}