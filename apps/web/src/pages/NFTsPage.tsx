// apps/web/src/pages/NFTsPage.tsx

import { PageLayout } from '../components/layout/PageLayout';

/* =========================================================
   PRIVATE BANKING — COLLECTIBLES
   ========================================================= */

const surface = 'bg-[#141a22]';
const border = 'border border-[#1f2630]';
const textMain = 'text-[#e6ebf2]';
const textMuted = 'text-[#8a94a6]';
const accent = 'text-[#c9a24d]';

export default function NFTsPage() {
  /* MOCK DATA */
  const collectibles = [
    {
      name: 'CryptoPunk #5822',
      collection: 'CryptoPunks',
      valuation: '$420,000.00',
    },
    {
      name: 'Bored Ape #8817',
      collection: 'Bored Ape Yacht Club',
      valuation: '$180,000.00',
    },
    {
      name: 'Fidenza #313',
      collection: 'Art Blocks',
      valuation: '$95,000.00',
    },
  ];

  return (
    <PageLayout title="Collectibles">
      {/* =====================================================
         INTRO
         ===================================================== */}
      <section>
        <p className={`text-sm ${textMuted}`}>
          Curated digital collectibles held in custody
        </p>
      </section>

      {/* =====================================================
         COLLECTIBLES TABLE
         ===================================================== */}
      <section
        className={`${surface} ${border} rounded-xl overflow-hidden`}
      >
        <div className="border-b border-[#1f2630] px-10 py-5">
          <h2 className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
            Digital Collectibles
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-[#1b2029]">
            <tr>
              <th className="px-10 py-4 text-left font-medium text-[#9aa0aa]">
                Asset
              </th>
              <th className="px-10 py-4 text-left font-medium text-[#9aa0aa]">
                Collection
              </th>
              <th className="px-10 py-4 text-right font-medium text-[#9aa0aa]">
                Estimated Value
              </th>
            </tr>
          </thead>

          <tbody>
            {collectibles.map((item) => (
              <tr
                key={item.name}
                className="border-t border-[#1f2630]"
              >
                <td className={`px-10 py-5 ${textMain}`}>
                  {item.name}
                </td>
                <td className={`px-10 py-5 ${textMuted}`}>
                  {item.collection}
                </td>
                <td className={`px-10 py-5 text-right font-medium ${accent}`}>
                  {item.valuation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* =====================================================
         DISCLAIMER
         ===================================================== */}
      <section className="pt-4">
        <p className={`text-xs ${textMuted}`}>
          Valuations are indicative and subject to market conditions.
        </p>
      </section>
    </PageLayout>
  );
}