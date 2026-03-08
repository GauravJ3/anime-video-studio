import { InferenceClient, type InferenceProviderOrPolicy } from '@huggingface/inference';
import type { VideoGenerationInput } from './types';

const FALLBACK_MODEL_IDS = [
  'Lightricks/LTX-Video',
  'Wan-AI/Wan2.1-T2V-1.3B-Diffusers',
  'genmo/mochi-1-preview',
];

function toNegativeList(negativePrompt: string) {
  return negativePrompt
    .split(',')
    .map((piece) => piece.trim())
    .filter(Boolean);
}

function buildAnimePrompt(prompt: string) {
  return `${prompt}. anime film style, expressive characters, cinematic lighting, detailed environments, smooth motion, high quality.`;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Video generation failed. Try a different model or shorter prompt.';
}

async function runTextToVideo(params: {
  client: InferenceClient;
  token: string;
  prompt: string;
  negativePrompt: string;
  model?: string;
  provider?: InferenceProviderOrPolicy;
  numFrames: number;
  guidanceScale: number;
  seed?: number;
}) {
  return params.client.textToVideo({
    accessToken: params.token,
    model: params.model,
    provider: params.provider,
    inputs: buildAnimePrompt(params.prompt),
    parameters: {
      negative_prompt: toNegativeList(params.negativePrompt),
      num_frames: params.numFrames,
      guidance_scale: params.guidanceScale,
      num_inference_steps: 30,
      seed: params.seed,
    },
  });
}

async function resolveDefaultTextToVideoModel(token: string): Promise<string | null> {
  try {
    const response = await fetch('https://huggingface.co/api/tasks/text-to-video', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { widgetModels?: string[] };
    if (Array.isArray(payload.widgetModels) && payload.widgetModels.length > 0) {
      return payload.widgetModels[0];
    }
  } catch {
    return null;
  }

  return null;
}

function uniqueModels(models: string[]): string[] {
  return [...new Set(models.filter(Boolean))];
}

export async function generateVideo(input: VideoGenerationInput): Promise<Blob> {
  const client = new InferenceClient(input.token);
  const resolvedDefaultModel = await resolveDefaultTextToVideoModel(input.token);
  const modelCandidates = uniqueModels([
    input.modelId ?? '',
    resolvedDefaultModel ?? '',
    ...FALLBACK_MODEL_IDS,
  ]);

  if (modelCandidates.length === 0) {
    throw new Error('No text-to-video models available at the moment.');
  }

  const baseRequest = {
    client,
    token: input.token,
    prompt: input.prompt,
    negativePrompt: input.negativePrompt,
    numFrames: input.numFrames,
    guidanceScale: input.guidanceScale,
    seed: input.seed,
  };

  let lastError: unknown;

  for (const model of modelCandidates) {
    try {
      const preferredBlob = await runTextToVideo({
        ...baseRequest,
        model,
        provider: input.provider,
      });

      if (preferredBlob instanceof Blob) {
        return preferredBlob;
      }
    } catch (primaryError) {
      lastError = primaryError;
    }

    try {
      const autoProviderBlob = await runTextToVideo({
        ...baseRequest,
        model,
        provider: 'auto',
      });

      if (autoProviderBlob instanceof Blob) {
        return autoProviderBlob;
      }
    } catch (fallbackError) {
      lastError = fallbackError;
    }
  }

  throw new Error(toErrorMessage(lastError));
}
