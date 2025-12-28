// libs/advisory-engine/src/types.ts

/**
 * Severity levels aligned with institutional risk frameworks
 */
export type AdvisorySeverity = 'low' | 'medium' | 'high';

/**
 * Core advisory insight produced by the deterministic Advisory Engine.
 * Designed to be auditable, explainable, and regulator-friendly.
 */
export interface AdvisoryInsight {
  /** Stable identifier for versioning and audit trails */
  id: string;

  /** Advisory domain */
  category: 'allocation' | 'risk' | 'liquidity' | 'exposure';

  /** Risk or importance level */
  severity: AdvisorySeverity;

  /** Short human-readable headline */
  title: string;

  /** Plain-language description of the finding */
  description: string;

  /** Deterministic explanation of why this insight was generated */
  rationale: string;

  /** Optional calculated metric (e.g. 0.62 = 62% concentration) */
  metric?: number;

  /** Optional recommended or policy threshold for comparison */
  threshold?: number;
}