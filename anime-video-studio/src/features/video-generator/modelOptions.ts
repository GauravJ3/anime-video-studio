import type { VideoModelOption } from './types';

export const MODEL_OPTIONS: VideoModelOption[] = [
  {
    id: 'Wan-AI/Wan2.1-T2V-1.3B-Diffusers',
    label: 'Wan 2.1 (1.3B, balanced)',
    provider: 'hf-inference',
    qualityHint: 'Balanced speed and quality for stylized clips.',
  },
  {
    id: 'Lightricks/LTX-Video',
    label: 'LTX Video (faster)',
    provider: 'hf-inference',
    qualityHint: 'Fast iterations while prompting.',
  },
  {
    id: 'genmo/mochi-1-preview',
    label: 'Mochi 1 Preview (cinematic)',
    provider: 'auto',
    qualityHint: 'Often stronger motion coherence, usually slower.',
  },
];
