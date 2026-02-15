
export interface GeneratedResult {
  id: string;
  originalInput: string;
  expandedPrompt: string;
  timestamp: number;
}

export const ModelType = {
  FLASH: 'gemini-2.5-flash-image',
  PRO: 'gemini-3-pro-image-preview'
} as const;

export type ModelType = typeof ModelType[keyof typeof ModelType];
