// apps/web/src/hooks/useAdvisoryView.ts


export type AdvisoryView =
  | 'portfolio'
  | 'holdings'
  | 'defi'
  | 'tokens'
  | 'nfts'
  | 'collectibles'
  | 'activity'
  | 'transactions'
  | 'unknown';

export function useAdvisoryView(): AdvisoryView {
  if (typeof window === 'undefined') return 'unknown';

  const path = window.location.pathname.toLowerCase();

  // ===== Portfolio / Overview =====
  if (
    path === '/' ||
    path.includes('home') ||
    path.includes('dashboard')
  ) {
    return 'portfolio';
  }

  // ===== Holdings / Wallet =====
  if (path.includes('holdings') || path.includes('wallet')) {
    return 'holdings';
  }

  // ===== DeFi =====
  if (path.includes('defi')) {
    return 'defi';
  }

  // ===== Tokens =====
  if (path.includes('token')) {
    return 'tokens';
  }

  // ===== NFTs / Collectibles =====
  if (
    path.includes('nft') ||
    path.includes('collectible')
  ) {
    return 'collectibles';
  }

  // ===== Activity / Transactions =====
  if (
    path.includes('activity') ||
    path.includes('transaction')
  ) {
    return 'activity';
  }

  return 'unknown';
}