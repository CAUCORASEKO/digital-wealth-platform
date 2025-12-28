// apps/web/src/components/tokens/TokenSparkline.tsx


import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from 'recharts';

/* =========================================================
   BANKING-STYLE SPARKLINE (JP MORGAN INSPIRED)
   - Flat
   - Muted
   - No neon
   - No noise
   ========================================================= */

/**
 * Generates a smooth, deterministic sparkline
 * suitable for private banking UI (no randomness)
 */
export const generateSparklineData = (
  basePrice: number,
  isPositive: boolean
) => {
  const points = 20;
  const direction = isPositive ? 1 : -1;
  const variance = basePrice * 0.015;

  return Array.from({ length: points }, (_, i) => ({
    i,
    value:
      basePrice +
      direction * variance * Math.sin((i / points) * Math.PI),
  }));
};

interface SparklineDataPoint {
  i: number;
  value: number;
}

export function TokenSparkline({
  data,
  isPositive,
}: {
  data: SparklineDataPoint[];
  isPositive: boolean;
}) {
  if (!data?.length) return null;

  return (
    <div className="w-24 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#c9a24d' : '#8a94a6'}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <YAxis hide domain={['dataMin', 'dataMax']} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}