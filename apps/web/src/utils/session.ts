// apps/web/src/utils/session.ts

export function getSessionId(wallet?: string) {
  if (!wallet) return null;

  return `session:${wallet.trim().toLowerCase()}`;
}