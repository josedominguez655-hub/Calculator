export type CalculationMode = 'reduction' | 'target';

export interface PositionInput {
  symbol: string;
  shares1: number;
  originalPrice: number;
  lossPercent: number;
  reductionPercent: number;
  targetLossPercent: number;
  mode: CalculationMode;
  currentPriceOverride?: number;
}

export interface CalculationResult {
  shares1: number;
  originalPrice: number;
  lossPercent: number;
  targetLossPercent: number;
  reductionPercent: number;
  currentPrice: number;
  shares2: number;
  roundedShares: number;
  cost1: number;
  cost2: number;
  totalCost: number;
  newAvgPrice: number;
  totalShares: number;
  capitalRatio: number; // cost2 / cost1
  warning?: string;
  mode: CalculationMode;
  timestamp: number;
}

export interface SavedCalculation {
  id: string;
  timestamp: number;
  symbol: string;
  note?: string;
  input: PositionInput;
  result: CalculationResult;
}

export type ActiveTab = 'calculator' | 'history' | 'settings';
