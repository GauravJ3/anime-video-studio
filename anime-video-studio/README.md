# Anime Video Studio

A polished React + TypeScript web app that generates anime-style videos from prompts using open-source models through Hugging Face Inference Providers.

## Features
- Prompt-to-video generation with anime-focused prompt enhancement.
- Model selection presets for text-to-video workflows.
- Progress timeline and error-safe generation states.
- Session history of recent generations.
- Download generated videos locally.
- Animated, glassmorphism UI with responsive layout.

## Tech Stack
- React 19 + TypeScript + Vite
- Framer Motion
- TanStack Query
- Hugging Face Inference JS client (`@huggingface/inference`)
- Tailwind CSS v4

## API Model Strategy
The app uses open-source text-to-video models on Hugging Face. Default options included:
- `Wan-AI/Wan2.1-T2V-1.3B-Diffusers`
- `Lightricks/LTX-Video`
- `genmo/mochi-1-preview`

You provide your own Hugging Face token in the UI (`hf_...`).

## Local Setup
```bash
npm install
npm run dev
```

Open the local URL from Vite and use a Hugging Face token with inference access.

## Build
```bash
npm run build
npm run preview
```

## Free Hosting (GitHub Pages)
1. Create a GitHub repository and push this project.
2. Enable Pages in repo settings with source set to **GitHub Actions**.
3. Push to `main`; workflow `.github/workflows/deploy-pages.yml` will build and deploy automatically.
4. Optional manual deploy from local machine:
   ```bash
   npm run deploy
   ```

This project uses `base: './'` in Vite config so it works on GitHub Pages subpaths.

## Suggested Free Alternatives
- Netlify Free tier
- Vercel Hobby tier

## Security Note
This is a static frontend app. Your token is entered in-browser and used directly for inference calls. For production-grade security, move token usage to a backend proxy.

## Open-Source UI Assets/Components Used
- [Lucide Icons](https://github.com/lucide-icons/lucide)
- [Framer Motion](https://github.com/framer/motion)
- [TanStack Query](https://github.com/TanStack/query)
- [Hugging Face JS](https://github.com/huggingface/huggingface.js)
