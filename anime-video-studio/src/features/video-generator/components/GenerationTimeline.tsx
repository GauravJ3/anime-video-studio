import { motion } from 'framer-motion';
import { LoaderCircle, Sparkles, Video } from 'lucide-react';
import type { GenerationPhase } from '../types';

function phaseLabel(phase: GenerationPhase) {
  if (phase === 'submitting') return 'Submitting Job';
  if (phase === 'rendering') return 'Rendering Anime Frames';
  if (phase === 'success') return 'Ready';
  if (phase === 'error') return 'Failed';
  return 'Waiting for prompt';
}

export function GenerationTimeline({ phase, progress }: { phase: GenerationPhase; progress: number }) {
  return (
    <div className="space-y-3 rounded-3xl border border-white/15 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-300">
        <span>{phaseLabel(phase)}</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-blue-400"
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-slate-200">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <Sparkles className="h-4 w-4 text-fuchsia-300" />
          Prompt
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <LoaderCircle className="h-4 w-4 text-cyan-300" />
          Render
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <Video className="h-4 w-4 text-blue-300" />
          Output
        </div>
      </div>
    </div>
  );
}
