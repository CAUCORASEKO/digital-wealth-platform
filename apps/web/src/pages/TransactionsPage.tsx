// apps/web/src/pages/TransactionsPage.tsx


import { PageLayout } from '../components/layout/PageLayout';

/* =========================================================
   PRIVATE BANKING — ACTIVITY (MOCK)
   ========================================================= */

const surface = 'bg-[#141a22]';
const border = 'border border-[#1f2630]';
const textMain = 'text-[#e6ebf2]';
const textMuted = 'text-[#8a94a6]';
const accent = 'text-[#c9a24d]';

const MOCK_ACTIVITY = [
  {
    date: '2025-01-18',
    type: 'Deposit',
    asset: 'USDC',
    amount: '+$25,000.00',
  },
  {
    date: '2025-01-15',
    type: 'Stake',
    asset: 'ETH',
    amount: '5.00 ETH',
  },
  {
    date: '2025-01-10',
    type: 'Withdrawal',
    asset: 'ETH',
    amount: '-2.00 ETH',
  },
];

export default function TransactionsPage() {
  return (
    <PageLayout title="Activity">
      <section className={`${surface} ${border} rounded-xl overflow-hidden`}>
        <div className="px-8 py-4 border-b border-[#1f2630]">
          <h2 className={`text-sm uppercase tracking-wide ${textMuted}`}>
            Transaction Ledger
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-[#1b2029]">
            <tr>
              <th className="px-8 py-4 text-left text-xs uppercase tracking-wide text-[#8a94a6]">
                Date
              </th>
              <th className="px-8 py-4 text-left text-xs uppercase tracking-wide text-[#8a94a6]">
                Type
              </th>
              <th className="px-8 py-4 text-left text-xs uppercase tracking-wide text-[#8a94a6]">
                Asset
              </th>
              <th className="px-8 py-4 text-right text-xs uppercase tracking-wide text-[#8a94a6]">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {MOCK_ACTIVITY.map((tx, i) => (
              <tr key={i} className="border-t border-[#1f2630]">
                <td className={`px-8 py-4 ${textMuted}`}>
                  {tx.date}
                </td>
                <td className={`px-8 py-4 ${textMain}`}>
                  {tx.type}
                </td>
                <td className={`px-8 py-4 ${textMain}`}>
                  {tx.asset}
                </td>
                <td className={`px-8 py-4 text-right font-medium ${accent}`}>
                  {tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PageLayout>
  );
}