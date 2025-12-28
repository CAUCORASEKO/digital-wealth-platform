// apps/web/src/components/ai-chat/AICopilotChatButton.tsx

// apps/web/src/components/ai-chat/AICopilotChatButton.tsx

import { LucideIcons } from '@e-burgos/tucu-ui';
import { userChatStore } from '../../store/userChatStore';

/**
 * Floating entry point to the Advisory Desk
 * (AI-powered private banking assistant)
 */
export function AICopilotChatButton() {
  const { setChatOpen } = userChatStore();

  return (
    <button
      onClick={() => setChatOpen(true)}
      aria-label="Open Advisory Desk"
      title="Ask your advisor"
      className="fixed bottom-6 right-6 flex items-center justify-center
                 w-12 h-12 rounded-full bg-brand shadow-lg
                 transition-all duration-300 ease-in-out
                 hover:w-14 hover:h-14"
    >
      <LucideIcons.Brain className="w-6 h-6 text-white" />
    </button>
  );
}