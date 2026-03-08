import type { VideoGenerationInput } from './types';

type OpenAIVideoStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | string;

type OpenAIVideoJob = {
  id: string;
  status: OpenAIVideoStatus;
  progress?: number;
  error?: {
    message?: string;
  };
};

const OPENAI_API_BASE = 'https://api.openai.com/v1';
const MAX_POLLS = 90;
const POLL_INTERVAL_MS = 3000;

function buildAnimePrompt(prompt: string) {
  return `${prompt}. anime cinematic style, expressive character animation, detailed backgrounds, dynamic camera movement, smooth motion, polished lighting.`;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Video generation failed. Please try a different prompt or settings.';
}

async function createVideoJob(input: VideoGenerationInput): Promise<OpenAIVideoJob> {
  const formData = new FormData();
  formData.append('prompt', buildAnimePrompt(input.prompt));
  formData.append('model', input.modelId);
  formData.append('seconds', input.seconds);
  formData.append('size', input.size);

  const response = await fetch(`${OPENAI_API_BASE}/videos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `OpenAI video create failed (${response.status})`);
  }

  return (await response.json()) as OpenAIVideoJob;
}

async function retrieveVideoJob(videoId: string, apiKey: string): Promise<OpenAIVideoJob> {
  const response = await fetch(`${OPENAI_API_BASE}/videos/${videoId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `OpenAI video status failed (${response.status})`);
  }

  return (await response.json()) as OpenAIVideoJob;
}

async function downloadVideoContent(videoId: string, apiKey: string): Promise<Blob> {
  const response = await fetch(`${OPENAI_API_BASE}/videos/${videoId}/content`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `OpenAI video download failed (${response.status})`);
  }

  return response.blob();
}

export async function generateVideo(input: VideoGenerationInput): Promise<Blob> {
  try {
    let job = await createVideoJob(input);

    for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
      if (job.status === 'completed') {
        return downloadVideoContent(job.id, input.apiKey);
      }

      if (job.status === 'failed') {
        throw new Error(job.error?.message || 'OpenAI video generation failed.');
      }

      await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL_MS));
      job = await retrieveVideoJob(job.id, input.apiKey);
    }

    throw new Error('Video generation timed out. Please retry with shorter duration or lower resolution.');
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}
