import type { CaseStudyBeforeAfterMetric, MetricDirection, MetricType } from '../types/caseStudy';

export interface MetricCalculationResult {
  absoluteChange: number;
  relativeChangePercent: number | null;
  percentagePointChange: number | null;
  isImprovement: boolean;
  displayFormatted: string;
  explanation: string;
}

/**
 * Calculates accurate changes according to Section 6 of the Case Studies specification.
 */
export function calculateMetricChange(
  before: number,
  after: number,
  type: MetricType,
  direction: MetricDirection,
  unit: string = ''
): MetricCalculationResult {
  const absoluteChange = after - before;

  // Check division by zero
  const canCalculateRelative = before !== 0 && !isNaN(before) && !isNaN(after);
  let relativeChangePercent: number | null = null;
  let percentagePointChange: number | null = null;
  let isImprovement = false;

  if (type === 'percentage') {
    // For percentage metrics, calculate both percentage points and relative change
    percentagePointChange = after - before;

    if (direction === 'higher_is_better') {
      isImprovement = percentagePointChange > 0;
    } else {
      isImprovement = percentagePointChange < 0;
    }

    if (canCalculateRelative) {
      if (direction === 'lower_is_better') {
        relativeChangePercent = ((before - after) / Math.abs(before)) * 100;
      } else {
        relativeChangePercent = ((after - before) / Math.abs(before)) * 100;
      }
    }

    const sign = percentagePointChange > 0 ? '+' : '';
    const ptStr = `${sign}${percentagePointChange.toFixed(1)} pt`;
    let relStr = '';

    if (relativeChangePercent !== null) {
      const relSign = relativeChangePercent > 0 ? '+' : '';
      relStr = ` (${relSign}${relativeChangePercent.toFixed(1)}% Rel.)`;
    }

    return {
      absoluteChange,
      relativeChangePercent,
      percentagePointChange,
      isImprovement,
      displayFormatted: `${ptStr}${relStr}`,
      explanation: `${ptStr} percentage points absolute change, ${relStr ? relativeChangePercent?.toFixed(1) + '% relative change' : ''}`
    };
  }

  // Non-percentage metrics (duration, count, currency, score)
  if (canCalculateRelative) {
    if (direction === 'lower_is_better') {
      // Reduction (%) = (Before - After) / Before * 100
      relativeChangePercent = ((before - after) / Math.abs(before)) * 100;
      isImprovement = after < before;
    } else {
      // Increase (%) = (After - Before) / Before * 100
      relativeChangePercent = ((after - before) / Math.abs(before)) * 100;
      isImprovement = after > before;
    }
  } else {
    isImprovement = direction === 'higher_is_better' ? after > before : after < before;
  }

  const sign = absoluteChange > 0 ? '+' : '';
  const absStr = `${sign}${formatNumber(absoluteChange)} ${unit}`.trim();

  let formatted = absStr;
  if (relativeChangePercent !== null) {
    const relSign = relativeChangePercent > 0 ? '+' : '';
    const dirWord = direction === 'lower_is_better' && relativeChangePercent > 0 ? 'Reduction' : relativeChangePercent > 0 ? 'Increase' : '';
    formatted = `${relSign}${relativeChangePercent.toFixed(1)}% ${dirWord}`.trim();
  }

  return {
    absoluteChange,
    relativeChangePercent,
    percentagePointChange: null,
    isImprovement,
    displayFormatted: formatted,
    explanation: `${formatted} (${before} to ${after} ${unit})`
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(1);
}

export function getMetricDisplay(metric: CaseStudyBeforeAfterMetric): string {
  if (metric.change_display) return metric.change_display;
  const res = calculateMetricChange(metric.before, metric.after, metric.type, metric.direction, metric.unit);
  return res.displayFormatted;
}
