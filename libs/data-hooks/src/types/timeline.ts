// libs/data-hooks/src/types/timeline.ts

export type TimelineCategory =
  | 'insight'
  | 'transaction'
  | 'defi';

export type TimelineSeverity =
  | 'low'
  | 'medium'
  | 'high';

export interface TimelineEvent {
  id: string;
  category: TimelineCategory;
  severity?: TimelineSeverity;
  title: string;
  description: string;
  timestamp: string;
}