// libs/advisory-engine/src/advisoryEngine.ts


import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import type { AdvisoryInsight } from './types';

import {
  generateAllocationInsights,
  generateRiskInsights,
} from './rules';

/**
 * Central deterministic advisory engine.
 */
export function runAdvisoryEngine(
  portfolio: ContextPortfolioData
): AdvisoryInsight[] {
  return [
    ...generateAllocationInsights(portfolio),
    ...generateRiskInsights(portfolio),
  ];
}