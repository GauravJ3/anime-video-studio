import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, Stars } from 'lucide-react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { GenerationTimeline } from '../features/video-generator/components/GenerationTimeline';
import { VideoGeneratorForm } from '../features/video-generator/components/VideoGeneratorForm';
import { VideoResultCard } from '../features/video-generator/components/VideoResultCard';
import { useVideoGenerator } from '../features/video-generator/hooks';

function toReadableTime(isoTimestamp: string) {
  return new Date(isoTimestamp).toLocaleString();
}

export function App() {
  const { generate, history, isPending, resetError, selectedModelHint, state } = useVideoGenerator();

  return (
    <div className="app-bg min-h-screen text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          initial={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.6 }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-100/90">
            <Stars className="h-4 w-4" />
            Anime Video Studio
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            Turn prompts into
            <span className="bg-gradient-to-r from-fuchsia-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent"> cinematic anime clips</span>
          </h1>
          <p className="max-w-3xl text-sm text-slate-200/85 md:text-base">
            Powered by open-source models via Hugging Face Inference Providers. Use your own HF token and iterate fast with style-friendly controls.
          </p>
        </motion.header>

        <main className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <GlassPanel className="space-y-5 p-5 md:p-6">
            <VideoGeneratorForm disabled={isPending} onSubmit={generate} />
            <GenerationTimeline phase={state.phase} progress={state.progress} />
            {state.errorMessage && (
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
                <div className="flex gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <p>{state.errorMessage}</p>
                </div>
                <button className="text-xs underline" onClick={resetError} type="button">
                  Dismiss
                </button>
              </div>
            )}
          </GlassPanel>

          <div className="space-y-6">
            <VideoResultCard result={state.latestResult} />
            <GlassPanel className="p-5">
              <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-sky-100/90">
                <Sparkles className="h-4 w-4" />
                Session History
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-slate-200/70">No renders yet in this browser session.</p>
              ) : (
                <ul className="space-y-2">
                  {history.map((item) => (
                    <li className="rounded-2xl border border-white/15 bg-white/5 p-3" key={item.id}>
                      <p className="line-clamp-2 text-sm text-slate-100/90">{item.prompt}</p>
                      <p className="mt-2 text-xs text-slate-300/75">
                        {item.modelId} | {toReadableTime(item.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {selectedModelHint && <p className="mt-3 text-xs text-cyan-100/80">Latest render hint: {selectedModelHint}</p>}
            </GlassPanel>
          </div>
        </main>
      </div>
    </div>
  );
}
