import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimelineEvent } from
  '@web3-ai-copilot/data-hooks';

interface TimelineState {
  eventsByWallet: Record<string, TimelineEvent[]>;
  setEvents: (wallet: string, events: TimelineEvent[]) => void;
  clear: (wallet: string) => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      eventsByWallet: {},

      setEvents: (wallet, events) =>
        set((state) => ({
          eventsByWallet: {
            ...state.eventsByWallet,
            [wallet]: events,
          },
        })),

      clear: (wallet) =>
        set((state) => {
          const next = { ...state.eventsByWallet };
          delete next[wallet];
          return { eventsByWallet: next };
        }),
    }),
    {
      name: 'web3-ai-timeline',
    }
  )
);