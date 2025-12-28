import type { Insight } from './insights.service';

export function mapInsightToTimelineEvent(insight: Insight) {
  return {
    id: insight.id,
    category: 'insight',
    severity: insight.severity,
    title: insight.title,
    description: insight.description,
    timestamp: insight.createdAt.toISOString(),
  };
}