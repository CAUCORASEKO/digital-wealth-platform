// apps/web/src/store/privacy.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PrivacyState {
  aiEnabled: boolean;
  toggleAI: () => void;
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      aiEnabled: true,
      toggleAI: () =>
        set((s) => ({ aiEnabled: !s.aiEnabled })),
    }),
    {
      name: 'web3-ai-privacy',
    }
  )
);