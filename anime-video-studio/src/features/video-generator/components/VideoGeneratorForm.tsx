import { Sparkles, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { MODEL_OPTIONS } from '../modelOptions';
import type { VideoGenerationInput, VideoSizeOption } from '../types';
import { PromptTips } from './PromptTips';

type VideoGeneratorFormProps = {
  disabled: boolean;
  onSubmit: (value: VideoGenerationInput) => void;
};

const SIZE_OPTIONS: { value: VideoSizeOption; label: string }[] = [
  { value: '720x1280', label: '720x1280 (portrait)' },
  { value: '1280x720', label: '1280x720 (landscape)' },
  { value: '1024x1792', label: '1024x1792 (portrait HD)' },
  { value: '1792x1024', label: '1792x1024 (landscape HD)' },
];

export function VideoGeneratorForm({ disabled, onSubmit }: VideoGeneratorFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [modelId, setModelId] = useState<VideoGenerationInput['modelId']>('sora-2');
  const [seconds, setSeconds] = useState<VideoGenerationInput['seconds']>('8');
  const [size, setSize] = useState<VideoSizeOption>('1280x720');

  const selectedModel = MODEL_OPTIONS.find((model) => model.id === modelId) ?? MODEL_OPTIONS[0];

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit({
          apiKey,
          prompt,
          modelId,
          seconds,
          size,
        });
      }}
    >
      <div className="space-y-2">
        <label className="field-label" htmlFor="openai-key">
          OpenAI API Key
        </label>
        <input
          className="field-input"
          id="openai-key"
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="sk-..."
          required
          type="password"
          value={apiKey}
        />
      </div>

      <div className="space-y-2">
        <label className="field-label" htmlFor="prompt">
          Video Prompt
        </label>
        <textarea
          className="field-input min-h-28"
          id="prompt"
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Describe your anime scene..."
          required
          value={prompt}
        />
      </div>

      <PromptTips onSelect={setPrompt} />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <label className="field-label" htmlFor="model">
            Model
          </label>
          <select
            className="field-input"
            id="model"
            onChange={(event) => setModelId(event.target.value as VideoGenerationInput['modelId'])}
            value={modelId}
          >
            {MODEL_OPTIONS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-sky-100/70">{selectedModel.qualityHint}</p>
        </div>

        <div className="space-y-2">
          <label className="field-label" htmlFor="seconds">
            Duration
          </label>
          <select
            className="field-input"
            id="seconds"
            onChange={(event) => setSeconds(event.target.value as VideoGenerationInput['seconds'])}
            value={seconds}
          >
            <option value="4">4 seconds</option>
            <option value="8">8 seconds</option>
            <option value="12">12 seconds</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="field-label" htmlFor="size">
            Resolution
          </label>
          <select
            className="field-input"
            id="size"
            onChange={(event) => setSize(event.target.value as VideoSizeOption)}
            value={size}
          >
            {SIZE_OPTIONS.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-blue-500 to-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={disabled}
        type="submit"
      >
        <WandSparkles className="h-4 w-4" />
        {disabled ? 'Rendering...' : 'Generate Anime Video'}
        <Sparkles className="h-4 w-4" />
      </button>
    </form>
  );
}
