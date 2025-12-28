
// apps/web/src/utils/wagmi.ts

import { createConfig, http } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
});