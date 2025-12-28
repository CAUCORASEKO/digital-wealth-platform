// apps/web/src/App.tsx



import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@web3-ai-copilot/wallet';
import { ThemeProvider } from '@e-burgos/tucu-ui';
import { useRouterConfig } from './router/RouterConfig';
import { RightHeaderContent } from './components/header/RightHeaderContent';

/* AI COPILOT — GLOBAL */
import { AICopilotChatButton } from './components/ai-chat/AICopilotChatButton';
import { AICopilotSidebar } from './components/ai-chat/AICopilotSidebar';

function App() {
  const routerConfig = useRouterConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      {/* ===============================
          APP LAYOUT / ROUTER
         =============================== */}
      <ThemeProvider
        layout="classic"
        logo={undefined}
        rightButton={<RightHeaderContent />}
        menuItems={routerConfig}
        contentClassName="!m-0 !p-0"
      />

      {/* ===============================
          AI COPILOT — GLOBAL OVERLAY
         =============================== */}
      <AICopilotChatButton />
      <AICopilotSidebar />
    </WagmiProvider>
  );
}

export default App;