const promptExamples = [
  'A neon-lit anime street at night, camera pushes forward, rain reflections and drifting lanterns.',
  'A lone samurai on a cliff at sunrise, wind-swept robe, cinematic side tracking shot.',
  'Magical girl transformation scene with sparkling particles, dynamic camera orbit, bright pastel palette.',
];

export function PromptTips({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.25em] text-sky-200/80">Prompt Starters</p>
      <div className="grid gap-2 md:grid-cols-3">
        {promptExamples.map((example) => (
          <button
            className="rounded-2xl border border-white/20 bg-white/5 p-3 text-left text-xs text-slate-100/90 transition hover:border-cyan-300/60 hover:bg-cyan-400/10"
            key={example}
            onClick={() => onSelect(example)}
            type="button"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
