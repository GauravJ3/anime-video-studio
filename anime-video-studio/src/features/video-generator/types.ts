import type { InferenceProviderOrPolicy } from '@huggingface/inference';

export type VideoModelOption = {
  id: string;
  label: string;
  provider?: InferenceProviderOrPolicy;
  qualityHint: string;
};

export type VideoGenerationInput = {
  token: string;
  prompt: string;
  negativePrompt: string;
  modelId: string;
  provider?: InferenceProviderOrPolicy;
  numFrames: number;
  guidanceScale: number;
  seed?: number;
};

export type GenerationPhase =
  | 'idle'
  | 'submitting'
  | 'rendering'
  | 'success'
  | 'error';

export type GenerationResult = {
  id: string;
  prompt: string;
  modelId: string;
  createdAt: string;
  videoUrl: string;
};
