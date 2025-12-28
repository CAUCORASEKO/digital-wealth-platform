// apps/web/src/router/RouterConfig.tsx

import {
  HomePageComponent,
  TokensPageComponent,
  TransactionsPageComponent,
  NFTsPageComponent,
  DefiPositionsPageComponent,
} from './EntryPoints';

import { AppRoutesMenuItem, LucideIcons } from '@e-burgos/tucu-ui';

export const useRouterConfig = (): AppRoutesMenuItem[] => [
  {
    name: 'Overview',
    href: '/',
    icon: <LucideIcons.LayoutDashboard />,
    component: <HomePageComponent />,
  },

  {
    name: 'Holdings',
    href: '/holdings',
    icon: <LucideIcons.Wallet />,
    component: <TokensPageComponent />,
  },

  {
    name: 'Activity',
    href: '/activity',
    icon: <LucideIcons.Clock />,
    component: <TransactionsPageComponent />,
  },

  {
    name: 'DeFi',
    href: '/defi',
    icon: <LucideIcons.Layers />,
    component: <DefiPositionsPageComponent />,
  },

  {
    name: 'Collectibles',
    href: '/collectibles',
    icon: <LucideIcons.Image />,
    component: <NFTsPageComponent />,
  },
];