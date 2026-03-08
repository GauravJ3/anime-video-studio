import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { generateVideo } from './api';
import { MODEL_OPTIONS } from './modelOptions';
import type { GenerationPhase, GenerationResult, VideoGenerationInput } from './types';

const HISTORY_KEY = 'anime-video-studio-history';

type GenerationState = {
  phase: GenerationPhase;
  progress: number;
  errorMessage: string | null;
  latestResult: GenerationResult | null;
};

function readHistory(): GenerationResult[] {
  try {
    const rawValue = localStorage.getItem(HISTORY_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as GenerationResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useVideoGenerator() {
  const [history, setHistory] = useState<GenerationResult[]>(() => readHistory());
  const [state, setState] = useState<GenerationState>({
    phase: 'idle',
    progress: 0,
    errorMessage: null,
    latestResult: null,
  });

  const mutation = useMutation({
    mutationFn: async (input: VideoGenerationInput) => {
      const blob = await generateVideo(input);
      return { blob, input };
    },
    onMutate: () => {
      setState((current) => ({
        ...current,
        phase: 'submitting',
        progress: 8,
        errorMessage: null,
      }));
    },
    onSuccess: ({ blob, input }) => {
      const result: GenerationResult = {
        id: crypto.randomUUID(),
        prompt: input.prompt,
        modelId: input.modelId,
        createdAt: new Date().toISOString(),
        videoUrl: URL.createObjectURL(blob),
      };

      setState({
        phase: 'success',
        progress: 100,
        errorMessage: null,
        latestResult: result,
      });

      setHistory((previous) => {
        const updated = [result, ...previous].slice(0, 6);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Video generation failed.';
      setState({
        phase: 'error',
        progress: 0,
        errorMessage,
        latestResult: null,
      });
    },
  });

  useEffect(() => {
    if (!mutation.isPending) {
      return;
    }

    const timer = window.setInterval(() => {
      setState((current) => {
        const nextProgress = Math.min(Math.max(current.progress, 16) + 4, 92);
        return {
          ...current,
          phase: 'rendering',
          progress: nextProgress,
        };
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [mutation.isPending]);

  const selectedModelHint = useMemo(() => {
    const model = MODEL_OPTIONS.find((entry) => entry.id === state.latestResult?.modelId);
    return model?.qualityHint;
  }, [state.latestResult?.modelId]);

  return {
    state,
    history,
    isPending: mutation.isPending,
    selectedModelHint,
    generate: mutation.mutate,
    resetError: () =>
      setState((current) => ({
        ...current,
        phase: current.phase === 'error' ? 'idle' : current.phase,
        errorMessage: null,
      })),
  };
}
