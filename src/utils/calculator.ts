import { CalculationMode, CalculationResult, PositionInput } from '../types';

export function calculateResurrection(input: PositionInput): CalculationResult {
  const { shares1, originalPrice, lossPercent, mode } = input;

  if (shares1 <= 0) {
    throw new Error('Original shares must be greater than 0.');
  }
  if (originalPrice <= 0) {
    throw new Error('Original price must be greater than $0.00.');
  }
  if (lossPercent <= 0 || lossPercent >= 100) {
    throw new Error('Current loss must be between 0% and 100%.');
  }

  let reduction = input.reductionPercent;
  let targetLoss = input.targetLossPercent;

  if (mode === 'reduction') {
    if (reduction <= 0) {
      throw new Error('Reduction percentage must be greater than 0%.');
    }
    if (reduction >= lossPercent) {
      throw new Error('Reduction percentage cannot equal or exceed current loss percentage.');
    }
    targetLoss = Number((lossPercent - reduction).toFixed(4));
  } else {
    // target mode
    if (targetLoss < 0) {
      throw new Error('Target loss cannot be negative.');
    }
    if (targetLoss >= lossPercent) {
      throw new Error('Target loss percentage must be less than current loss percentage.');
    }
    reduction = Number((lossPercent - targetLoss).toFixed(4));
  }

  // Calculate current price based on loss
  const lossFactor = 1 - lossPercent / 100;
  const currentPrice = input.currentPriceOverride && input.currentPriceOverride > 0
    ? input.currentPriceOverride
    : Number((originalPrice * lossFactor).toFixed(4));

  // Resurrection formula:
  // Shares 2 = (Shares 1 * Reduction) / ((1 - Loss/100) * (Loss - Reduction))
  // where (Loss - Reduction) is targetLoss
  const denominator = lossFactor * (targetLoss);
  
  if (denominator <= 0.000001) {
    throw new Error('Target loss is too close to zero, which would require an infinite number of shares.');
  }

  const exactShares2 = (shares1 * reduction) / denominator;
  const roundedShares = Math.round(exactShares2);

  const cost1 = Number((shares1 * originalPrice).toFixed(2));
  const cost2 = Number((roundedShares * currentPrice).toFixed(2));
  const totalCost = Number((cost1 + cost2).toFixed(2));
  const totalShares = shares1 + roundedShares;
  const newAvgPrice = totalShares > 0 ? Number((totalCost / totalShares).toFixed(4)) : originalPrice;
  const capitalRatio = cost1 > 0 ? Number((cost2 / cost1).toFixed(2)) : 0;

  let warning: string | undefined;
  if (capitalRatio >= 5) {
    warning = `High capital commitment: Requires ${capitalRatio}× your initial capital ($${cost2.toLocaleString()}).`;
  } else if (capitalRatio >= 3) {
    warning = `Moderate dilution: Requires ${capitalRatio}× your initial capital to rescue this position.`;
  }

  return {
    shares1,
    originalPrice,
    lossPercent,
    targetLossPercent: targetLoss,
    reductionPercent: reduction,
    currentPrice,
    shares2: Number(exactShares2.toFixed(2)),
    roundedShares,
    cost1,
    cost2,
    totalCost,
    newAvgPrice,
    totalShares,
    capitalRatio,
    warning,
    mode,
    timestamp: Date.now(),
  };
}

export const PRESET_SPREADSHEET_EXACT: PositionInput = {
  symbol: 'DEMO',
  shares1: 75,
  originalPrice: 3.88,
  lossPercent: 2.86,
  reductionPercent: 2.00,
  targetLossPercent: 0.66,
  mode: 'target',
  currentPriceOverride: 3.78,
};

export const PRESET_STANDARD_FORMULA: PositionInput = {
  symbol: 'DEMO',
  shares1: 75,
  originalPrice: 3.88,
  lossPercent: 2.86,
  reductionPercent: 2.00,
  targetLossPercent: 0.86,
  mode: 'reduction',
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}
