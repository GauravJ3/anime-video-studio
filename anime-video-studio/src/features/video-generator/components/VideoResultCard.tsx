import { Download, Film } from 'lucide-react';
import type { GenerationResult } from '../types';
import { GlassPanel } from '../../../components/ui/GlassPanel';

function toFileSafePrompt(prompt: string) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function VideoResultCard({ result }: { result: GenerationResult | null }) {
  if (!result) {
    return (
      <GlassPanel className="min-h-[260px] p-5">
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-200/75">
          <Film className="h-8 w-8 text-sky-200" />
          <p className="text-sm">Your generated anime clip will appear here.</p>
        </div>
      </GlassPanel>
    );
  }

  const fileName = `${toFileSafePrompt(result.prompt) || 'anime-video'}-${result.id.slice(0, 6)}.mp4`;

  return (
    <GlassPanel className="space-y-4 p-5">
      <video className="w-full rounded-2xl border border-white/20" controls src={result.videoUrl} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-slate-100/90">{result.prompt}</p>
        <a
          className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/15"
          download={fileName}
          href={result.videoUrl}
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </GlassPanel>
  );
}
