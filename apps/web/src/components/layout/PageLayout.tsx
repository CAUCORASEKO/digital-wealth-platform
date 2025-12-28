
// apps/web/src/components/layout/PageLayout.tsx

import { Typography } from '@e-burgos/tucu-ui';
import { useWallet } from '@web3-ai-copilot/wallet';

import { AICopilotChatButton } from '../ai-chat/AICopilotChatButton';
import { AICopilotSidebar } from '../ai-chat/AICopilotSidebar';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  const { isConnected } = useWallet();

  /* =========================================================
     SECURE ACCESS — PRIVATE BANKING
     ========================================================= */
  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f14]">
        <div className="w-full max-w-md rounded-xl border border-[#1f2630] bg-[#141a22] px-12 py-14 text-center">
          <Typography
            tag="h2"
            className="text-xl font-semibold text-[#e6ebf2]"
          >
            Secure Access Required
          </Typography>

          <p className="mt-3 text-sm text-[#8a94a6]">
            Connect your wallet to access your private banking dashboard
          </p>

          <p className="mt-6 text-xs text-[#6b7280]">
            Read-only access · No transactions executed
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN CONTENT — DESKTOP PRIVATE BANKING
     ========================================================= */
  return (
    <div className="relative min-h-screen bg-[#0b0f14] text-[#e6ebf2]">
      <main className="px-12 py-10">
        {/* PAGE HEADER */}
        <header className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight">
            {title}
          </h1>
        </header>

        {/* PAGE BODY */}
        <section className="space-y-10">
          {children}
        </section>
      </main>

      {/* =====================================================
         ADVISORY DESK — AI COPILOT (GLOBAL)
         ===================================================== */}
      <AICopilotChatButton />
      <AICopilotSidebar />
    </div>
  );
}