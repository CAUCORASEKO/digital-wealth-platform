// apps/web/src/pages/HomePage.tsx

import { useContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import { runAdvisoryEngine } from '@web3-ai-copilot/advisory-engine';

import { AdvisoryPanel } from '../components/advisory/AdvisoryPanel';
import { AICopilotSidebar } from '../components/ai-chat/AICopilotSidebar';

/* =========================================================
   PRIVATE BANKING — OVERVIEW
   ========================================================= */

const bg = 'bg-[#0b0f14]';
const surface = 'bg-[#141a22]';
const border = 'border border-[#1f2630]';
const textMain = 'text-[#e6ebf2]';
const textMuted = 'text-[#8a94a6]';
const accent = 'text-[#c9a24d]'; // muted gold

export default function HomePage() {
  /* REAL PORTFOLIO DATA */
  const { data } = useContextPortfolioData();

  /* ADVISORY INSIGHTS (deterministic, no AI) */
  const insights = data ? runAdvisoryEngine(data) : [];

  /* VISUAL DATA (mock until fully wired) */
  const address = '0x19A2…9B54';
  const totalAssets = '$1,250,000.00';

  const allocation = [
    { label: 'Wallet Balance', value: '$850,000.00' },
    { label: 'Deposited Assets', value: '$300,000.00' },
    { label: 'Staked Positions', value: '$100,000.00' },
  ];

  return (
    <div className={`${bg} w-full min-h-full px-12 py-10`}>
      {/* =====================================================
         HEADER
         ===================================================== */}
      <section className="mb-12 flex items-end justify-between">
        <div>
          <h1 className={`text-2xl font-semibold ${textMain}`}>
            Portfolio Overview
          </h1>
          <p className={`mt-1 text-sm ${textMuted}`}>
            Private digital wealth account
          </p>
        </div>

        <div
          className={`${surface} ${border} rounded-md px-4 py-2 text-xs ${textMuted}`}
        >
          {address}
        </div>
      </section>

      {/* =====================================================
         TOTAL ASSETS
         ===================================================== */}
      <section
        className={`${surface} ${border} rounded-xl px-12 py-10 mb-14`}
      >
        <div className="text-xs uppercase tracking-wide text-[#8a94a6]">
          Total Assets
        </div>
        <div className={`mt-2 text-3xl font-semibold ${accent}`}>
          {totalAssets}
        </div>
      </section>

      {/* =====================================================
         ALLOCATION BREAKDOWN
         ===================================================== */}
      <section
        className={`${surface} ${border} rounded-xl overflow-hidden mb-14`}
      >
        <div className="px-12 py-5 border-b border-[#1f2630]">
          <h2
            className={`text-xs font-semibold uppercase tracking-wide ${textMuted}`}
          >
            Allocation Breakdown
          </h2>
        </div>

        <table className="w-full text-sm">
          <tbody>
            {allocation.map((row) => (
              <tr
                key={row.label}
                className="border-t border-[#1f2630]"
              >
                <td className={`px-12 py-5 ${textMain}`}>
                  {row.label}
                </td>
                <td
                  className={`px-12 py-5 text-right font-medium ${accent}`}
                >
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* =====================================================
         PORTFOLIO INSIGHTS — ADVISORY ENGINE
         ===================================================== */}
      <section className="mb-14">
        <AdvisoryPanel insights={insights} />
      </section>

      {/* =====================================================
         AI COPILOT — ALWAYS AVAILABLE
         ===================================================== */}
      <AICopilotSidebar />
    </div>
  );
}