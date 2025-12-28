// apps/web/src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiConfig } from 'wagmi';

import {
  ReactQueryProvider,
  defaultQueryClient,
} from '@web3-ai-copilot/data-hooks';

import { wagmiConfig } from './utils/wagmi';
import App from './App';

// Styles
import './assets/styles/index.css';
import '@e-burgos/tucutable/styles';
import '@e-burgos/tucu-ui/styles';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <ReactQueryProvider queryClient={defaultQueryClient}>
        <App />
      </ReactQueryProvider>
    </WagmiConfig>
  </StrictMode>
);