// apps/web/src/components/advisory/AdvisoryPanel.tsx

import type {
  AdvisoryInsight,
  AdvisorySeverity,
} from '@web3-ai-copilot/advisory-engine';

const severityStyles: Record<AdvisorySeverity, string> = {
  low: 'text-[#8a94a6]',
  medium: 'text-[#c9a24d]',
  high: 'text-[#d97777]',
};

export function AdvisoryPanel({
  insights,
}: {
  insights: AdvisoryInsight[];
}) {
  if (insights.length === 0) {
    return (
      <div className="text-sm text-[#8a94a6]">
        No portfolio issues detected.
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[#1f2630] bg-[#141a22]">
      <div className="border-b border-[#1f2630] px-8 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a94a6]">
          Portfolio Insights
        </h2>
      </div>

      <div className="divide-y divide-[#1f2630]">
        {insights.map((insight) => (
          <div key={insight.id} className="px-8 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#e6ebf2]">
                {insight.title}
              </h3>

              <span
                className={`text-xs uppercase tracking-wide ${
                  severityStyles[insight.severity]
                }`}
              >
                {insight.severity}
              </span>
            </div>

            <p className="mt-2 text-sm text-[#8a94a6]">
              {insight.description}
            </p>

            <p className="mt-2 text-xs text-[#6f7787]">
              {insight.rationale}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}