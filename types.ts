
export interface RecognitionResult {
  id: string;
  char: string;
  confidence: number;
  calligrapher: string;
  dynasty: string;
  source: string;
  etymology: string;
  timestamp: number;
  originalImage?: string;
}

export interface Calligrapher {
  name: string;
  dynasty: string;
  bio: string;
  avatar: string;
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
}
