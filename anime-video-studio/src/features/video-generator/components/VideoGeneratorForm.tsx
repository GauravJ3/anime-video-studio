import { Sparkles, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { MODEL_OPTIONS } from '../modelOptions';
import type { VideoGenerationInput } from '../types';
import { PromptTips } from './PromptTips';

type VideoGeneratorFormProps = {
  disabled: boolean;
  onSubmit: (value: VideoGenerationInput) => void;
};

export function VideoGeneratorForm({ disabled, onSubmit }: VideoGeneratorFormProps) {
  const [token, setToken] = useState('');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('low quality, blurry, distorted anatomy');
  const [modelId, setModelId] = useState(MODEL_OPTIONS[0].id);
  const [numFrames, setNumFrames] = useState(49);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState('');

  const selectedModel = MODEL_OPTIONS.find((model) => model.id === modelId) ?? MODEL_OPTIONS[0];

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit({
          token,
          prompt,
          negativePrompt,
          modelId: modelId === '__auto__' ? undefined : modelId,
          provider: modelId === '__auto__' ? undefined : selectedModel.provider,
          numFrames,
          guidanceScale,
          seed: seed ? Number(seed) : undefined,
        });
      }}
    >
      <div className="space-y-2">
        <label className="field-label" htmlFor="hf-token">
          Hugging Face API Token
        </label>
        <input
          className="field-input"
          id="hf-token"
          onChange={(event) => setToken(event.target.value)}
          placeholder="hf_xxxxxxxxxxxxxxxxx"
          required
          type="password"
          value={token}
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

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="field-label" htmlFor="model">
            Model
          </label>
          <select
            className="field-input"
            id="model"
            onChange={(event) => setModelId(event.target.value)}
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
          <label className="field-label" htmlFor="negative-prompt">
            Negative Prompt
          </label>
          <input
            className="field-input"
            id="negative-prompt"
            onChange={(event) => setNegativePrompt(event.target.value)}
            value={negativePrompt}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <label className="field-label" htmlFor="num-frames">
            Frames
          </label>
          <input
            className="field-input"
            id="num-frames"
            max={97}
            min={17}
            onChange={(event) => setNumFrames(Number(event.target.value))}
            step={8}
            type="number"
            value={numFrames}
          />
        </div>

        <div className="space-y-2">
          <label className="field-label" htmlFor="guidance-scale">
            Guidance
          </label>
          <input
            className="field-input"
            id="guidance-scale"
            max={15}
            min={1}
            onChange={(event) => setGuidanceScale(Number(event.target.value))}
            step={0.5}
            type="number"
            value={guidanceScale}
          />
        </div>

        <div className="space-y-2">
          <label className="field-label" htmlFor="seed">
            Seed (optional)
          </label>
          <input
            className="field-input"
            id="seed"
            onChange={(event) => setSeed(event.target.value)}
            placeholder="random"
            type="number"
            value={seed}
          />
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
