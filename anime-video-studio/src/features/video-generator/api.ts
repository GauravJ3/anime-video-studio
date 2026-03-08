import { InferenceClient, type InferenceProviderOrPolicy } from '@huggingface/inference';
import type { VideoGenerationInput } from './types';

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
  model: string;
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

export async function generateVideo(input: VideoGenerationInput): Promise<Blob> {
  const client = new InferenceClient(input.token);

  try {
    const preferredBlob = await runTextToVideo({
      client,
      token: input.token,
      prompt: input.prompt,
      negativePrompt: input.negativePrompt,
      model: input.modelId,
      provider: input.provider,
      numFrames: input.numFrames,
      guidanceScale: input.guidanceScale,
      seed: input.seed,
    });

    if (preferredBlob instanceof Blob) {
      return preferredBlob;
    }
  } catch (primaryError) {
    if (!input.provider || input.provider === 'auto') {
      throw new Error(toErrorMessage(primaryError));
    }

    try {
      const fallbackBlob = await runTextToVideo({
        client,
        token: input.token,
        prompt: input.prompt,
        negativePrompt: input.negativePrompt,
        model: input.modelId,
        provider: 'auto',
        numFrames: input.numFrames,
        guidanceScale: input.guidanceScale,
        seed: input.seed,
      });

      if (fallbackBlob instanceof Blob) {
        return fallbackBlob;
      }
    } catch (fallbackError) {
      throw new Error(toErrorMessage(fallbackError));
    }

    throw new Error(toErrorMessage(primaryError));
  }

  throw new Error('The model returned an unexpected response.');
}
