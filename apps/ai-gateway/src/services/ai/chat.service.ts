// services/ai/chat.service.ts

// services/ai/chat.service.ts

import { llmService } from '../llmService';
import { AIProvider } from '@web3-ai-copilot/ai-config';
import type {
  ContextPortfolioData,
} from '@web3-ai-copilot/data-hooks/types-only';

import { generateInsightEvents } from './insights.service';
import { inferRiskProfile } from './riskProfile.service';

/* ============================================================================
   TYPES
   ============================================================================ */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type AdvisoryView =
  | 'portfolio'
  | 'holdings'
  | 'defi'
  | 'nfts'
  | 'activity'
  | 'unknown';

/* ============================================================================
   ENTRY
   ============================================================================ */

export async function chatWithCopilot(
  messages: ChatMessage[],
  portfolioData?: ContextPortfolioData,
  provider?: AIProvider
) {
  const selectedProvider: AIProvider =
    provider ||
    (process.env.DEFAULT_AI_PROVIDER as AIProvider) ||
    'openai';

  const advisoryView = inferViewFromMessages(messages);
  const riskProfile = portfolioData
    ? inferRiskProfile(portfolioData)
    : 'conservative';

  const systemPrompt = buildSystemPrompt(
    portfolioData,
    advisoryView,
    riskProfile
  );

  const enhancedMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  return llmService.chat(enhancedMessages, selectedProvider);
}

/* ============================================================================
   VIEW INFERENCE
   ============================================================================ */

function inferViewFromMessages(
  messages: ChatMessage[]
): AdvisoryView {
  const first = messages[0]?.content?.toLowerCase() ?? '';

  if (first.includes('holding')) return 'holdings';
  if (first.includes('defi')) return 'defi';
  if (first.includes('nft') || first.includes('collectible'))
    return 'nfts';
  if (
    first.includes('activity') ||
    first.includes('transaction')
  )
    return 'activity';
  if (first.includes('portfolio')) return 'portfolio';

  return 'unknown';
}

/* ============================================================================
   SYSTEM PROMPT
   ============================================================================ */

function buildSystemPrompt(
  portfolioData: ContextPortfolioData | undefined,
  view: AdvisoryView,
  riskProfile: 'conservative' | 'balanced' | 'aggressive'
): string {
  if (!portfolioData) {
    return 'You are a helpful Web3 AI assistant.';
  }

  /* --- Timeline (safe) --- */
  let timelineContext = '';
  try {
    const events = generateInsightEvents(portfolioData).slice(
      0,
      6
    );

    if (events.length) {
      timelineContext = `
Recent activity:
${events
  .map(
    (e) =>
      `- [${e.category}] ${e.title} (${new Date(
        e.timestamp
      ).toLocaleDateString()})`
  )
  .join('\n')}
`;
    }
  } catch {
    timelineContext = '';
  }

  /* --- View guidance --- */
  const viewGuidance: Record<AdvisoryView, string> = {
    portfolio:
      'Focus on overall allocation, diversification and portfolio-level risks.',
    holdings:
      'Focus on token concentration, winners vs laggards and rebalancing.',
    defi:
      'Focus on DeFi protocols, yield sustainability and risk exposure.',
    nfts:
      'Focus on NFT liquidity, valuation uncertainty and collection risk.',
    activity:
      'Focus on recent transactions, behavioral patterns and notable actions.',
    unknown:
      'Adapt dynamically based on the user question.',
  };

  const totalValue =
    portfolioData.portfolio?.total?.positions ?? 0;

  const topTokens =
    portfolioData.tokens?.slice(0, 5) ?? [];

  return `
You are a Web3 AI advisory assistant.

User context:
- Current view: ${view.toUpperCase()}
- Risk profile: ${riskProfile.toUpperCase()}
- Wallet: ${portfolioData.address}
- Total portfolio value: $${totalValue}

Top assets:
${topTokens.length
  ? topTokens
      .map(
        (t) =>
          `- ${t.name} (${t.symbol}): $${t.value}`
      )
      .join('\n')
  : '- No major token positions'}

${timelineContext}

Advisory focus:
${viewGuidance[view]}

Risk guidance:
${
  riskProfile === 'conservative'
    ? 'Prioritize capital preservation and downside protection.'
    : riskProfile === 'balanced'
    ? 'Balance risk and opportunity with measured exposure.'
    : 'Accept volatility in pursuit of higher growth.'
}

Rules:
- Be precise and actionable
- Reference portfolio data when relevant
- Do NOT invent missing data
- Speak like a professional financial advisor
`.trim();
}