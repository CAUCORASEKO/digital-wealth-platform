// apps/web/src/utils/constants.ts
export const AI_GATEWAY_URL =
  import.meta.env.VITE_AI_GATEWAY_URL;

if (!AI_GATEWAY_URL) {
  console.warn(
    '[AI] Gateway URL not configured. AI features disabled.'
  );
}