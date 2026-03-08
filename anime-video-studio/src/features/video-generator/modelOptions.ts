import type { VideoModelOption } from './types';

export const MODEL_OPTIONS: VideoModelOption[] = [
  {
    id: 'sora-2',
    label: 'Sora 2 (faster)',
    qualityHint: 'Faster iteration for concept clips and prompt tuning.',
  },
  {
    id: 'sora-2-pro',
    label: 'Sora 2 Pro (higher quality)',
    qualityHint: 'Higher fidelity output with longer render times.',
  },
];
