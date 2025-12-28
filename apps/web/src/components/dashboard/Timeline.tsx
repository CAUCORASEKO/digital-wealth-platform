// apps/web/src/components/dashboard/Timeline.tsx

import { useState, useMemo } from 'react';
import { CardContainer, Typography } from '@e-burgos/tucu-ui';
import type { TimelineEvent } from '@web3-ai-copilot/data-hooks';


type TimelineFilter = 'all' | 'insight' | 'transaction' | 'defi';

function getSeverityColor(severity?: 'low' | 'medium' | 'high') {
  switch (severity) {
    case 'high':
      return 'border-red-500';
    case 'medium':
      return 'border-yellow-500';
    case 'low':
      return 'border-green-500';
    default:
      return 'border-border';
  }
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const [filter, setFilter] = useState<TimelineFilter>('all');

  const filteredEvents = useMemo(() => {
    const list =
      filter === 'all'
        ? events
        : events.filter((e) => e.category === filter);

    return [...list].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );
  }, [events, filter]);

  if (!filteredEvents.length) return null;

  return (
    <CardContainer>
      <div className="flex flex-col gap-4">
        <Typography tag="h4">Activity & Insights</Typography>

        {/* FILTERS */}
        <div className="flex gap-2 text-sm">
          {(['all', 'insight', 'transaction', 'defi'] as TimelineFilter[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded border px-3 py-1 transition ${
                  filter === type
                    ? 'bg-muted font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {type === 'all'
                  ? 'All'
                  : type === 'insight'
                  ? 'Insights'
                  : type === 'transaction'
                  ? 'Transactions'
                  : 'DeFi'}
              </button>
            )
          )}
        </div>

        {/* EVENTS */}
        <div className="flex flex-col gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`border-l-4 pl-4 ${getSeverityColor(
                event.severity
              )}`}
            >
              <Typography tag="h5">{event.title}</Typography>

              <Typography className="text-muted-foreground">
                {event.description}
              </Typography>

              <Typography className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString()}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}