export type VideoModelOption = {
  id: string;
  label: string;
  qualityHint: string;
};

export type VideoSizeOption = '720x1280' | '1280x720' | '1024x1792' | '1792x1024';

export type VideoGenerationInput = {
  apiKey: string;
  prompt: string;
  modelId: 'sora-2' | 'sora-2-pro';
  seconds: '4' | '8' | '12';
  size: VideoSizeOption;
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
