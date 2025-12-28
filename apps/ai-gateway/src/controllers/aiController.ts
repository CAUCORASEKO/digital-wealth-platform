
// apps/ai-gateway/src/controllers/aiController.ts

import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks/types-only';
import type { AIProvider } from '@web3-ai-copilot/ai-config';

import { chatWithCopilot } from '../services/ai/chat.service';
import { generateInsights, generateInsightEvents } from '../services/ai/insights.service';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function buildSystemPrompt(messages: ChatMessage[], portfolioData?: ContextPortfolioData): ChatMessage {
  const first = messages[0]?.content ?? '';
  const match = first.match(/Context:\s*User is currently viewing the "(.+?)"/i);
  const view = match?.[1] ?? 'portfolio overview';

  return {
    role: 'assistant',
    content: [
      `You are an institutional-grade advisory assistant for a digital private banking platform.`,
      ``,
      `Current user view: ${view}`,
      ``,
      `Rules:`,
      `- Use ONLY the data provided. Do not invent balances, positions, or transactions.`,
      `- If data is missing, say so clearly.`,
      `- No financial advice. Provide informational and analytical guidance only.`,
      `- Be concise, conservative, and audit-friendly.`,
      ``,
      `Portfolio data available: ${portfolioData ? 'YES' : 'NO'}`,
      ``,
      `Response focus: prioritize what matters for the current view.`,
    ].join('\n'),
  };
}

export const aiController = {
  // Chat (Copilot)
  chat(messages: ChatMessage[], provider?: AIProvider, portfolioData?: ContextPortfolioData) {
    const systemPrompt = buildSystemPrompt(messages, portfolioData);
    return chatWithCopilot([systemPrompt, ...messages], portfolioData, provider);
  },

  // Insights (cards)
  insights(portfolioData: ContextPortfolioData) {
    return generateInsights(portfolioData);
  },

  // Timeline
  timeline(portfolioData: ContextPortfolioData) {
    return generateInsightEvents(portfolioData);
  },
};