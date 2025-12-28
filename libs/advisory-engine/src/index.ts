// libs/advisory-engine/src/index.ts

export type {
  AdvisoryInsight,
  AdvisorySeverity,
} from './types';

export { runAdvisoryEngine } from './advisoryEngine';

export {
  generateAllocationInsights,
  generateRiskInsights,
} from './rules';

export * from './advisoryEngine';
export * from './types';