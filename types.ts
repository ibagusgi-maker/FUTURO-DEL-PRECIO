export enum Timeframe {
  FIVE_MIN = '5-min',
  FIFTEEN_MIN = '15-min',
  THIRTY_MIN = '30-min',
  ONE_HOUR = '1-hour',
  ONE_DAY = '1-day',
  ONE_WEEK = '1-week',
  ONE_MONTH = '1-month',
  THREE_MONTHS = '3-months',
  SIX_MONTHS = '6-months',
  ONE_YEAR = '1-year',
}

export type Prediction = 'Up' | 'Down' | 'Stable';
export type Suggestion = 'Compra Moderada' | 'Mantener' | 'Vender'; // New type

export interface GroundingChunkWeb {
  web: {
    uri: string;
    title: string;
  };
}

export interface GroundingChunkMaps {
  maps: {
    uri: string;
    title: string;
  };
}

export type GroundingChunk = GroundingChunkWeb | GroundingChunkMaps;

export interface StockPredictionResult {
  prediction: Prediction;
  reasoning: string;
  suggestion?: Suggestion; // Added suggestion field
  projectedPrice?: string; // Nuevo campo para el precio proyectado
  groundingUrls?: GroundingChunk[];
}