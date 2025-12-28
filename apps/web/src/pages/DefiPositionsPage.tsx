// apps/web/src/pages/DefiPositionsPage.tsx

/* =========================================================
   PRIVATE BANKING — DEFI POSITIONS (MOCK)
   ========================================================= */

const surface = 'bg-[#141a22]';
const border = 'border border-[#1f2630]';
const textMain = 'text-[#e6ebf2]';
const textMuted = 'text-[#8a94a6]';
const accent = 'text-[#c9a24d]';

export default function DefiPositionsPage() {
  const positions = [
    {
      protocol: 'Aave',
      asset: 'ETH',
      type: 'Lending',
      value: '$420,000.00',
      apy: '4.2%',
    },
    {
      protocol: 'Lido',
      asset: 'stETH',
      type: 'Staking',
      value: '$310,000.00',
      apy: '3.8%',
    },
    {
      protocol: 'Uniswap',
      asset: 'ETH / USDC',
      type: 'Liquidity Pool',
      value: '$180,000.00',
      apy: '7.1%',
    },
  ];

  return (
    <div className="w-full min-h-full">
      {/* HEADER */}
      <section className="mb-10">
        <h1 className={`text-xl font-semibold ${textMain}`}>
          DeFi Positions
        </h1>
        <p className={`mt-1 text-sm ${textMuted}`}>
          Active decentralized finance exposures
        </p>
      </section>

      {/* POSITIONS TABLE */}
      <section className={`${surface} ${border} rounded-xl overflow-hidden`}>
        <div className="px-10 py-5 border-b border-[#1f2630]">
          <h2 className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
            Active Positions
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f2630] text-[#8a94a6]">
              <th className="px-10 py-4 text-left font-medium">Protocol</th>
              <th className="px-6 py-4 text-left font-medium">Asset</th>
              <th className="px-6 py-4 text-left font-medium">Type</th>
              <th className="px-6 py-4 text-right font-medium">APY</th>
              <th className="px-10 py-4 text-right font-medium">Value</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((p) => (
              <tr
                key={`${p.protocol}-${p.asset}`}
                className="border-t border-[#1f2630]"
              >
                <td className={`px-10 py-5 ${textMain}`}>{p.protocol}</td>
                <td className={`px-6 py-5 ${textMain}`}>{p.asset}</td>
                <td className={`px-6 py-5 ${textMuted}`}>{p.type}</td>
                <td className={`px-6 py-5 text-right ${accent}`}>
                  {p.apy}
                </td>
                <td className={`px-10 py-5 text-right font-medium ${accent}`}>
                  {p.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SUMMARY */}
      <section className={`${surface} ${border} rounded-xl p-8 mt-10`}>
        <div className="flex justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${textMuted}`}>
              Total DeFi Exposure
            </div>
            <div className={`mt-2 text-xl font-semibold ${accent}`}>
              $910,000.00
            </div>
          </div>

          <div className="text-right">
            <div className={`text-xs uppercase tracking-wide ${textMuted}`}>
              Avg. Yield
            </div>
            <div className={`mt-2 text-xl font-semibold ${accent}`}>
              4.9%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}