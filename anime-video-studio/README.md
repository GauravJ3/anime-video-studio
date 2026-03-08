# Anime Video Studio

A polished React + TypeScript web app that generates anime-style videos from prompts using OpenAI Video API.

## Features
- Prompt-to-video generation with anime-focused prompt enhancement.
- Sora model selection (`sora-2`, `sora-2-pro`).
- Duration and resolution controls.
- Progress timeline and error-safe generation states.
- Session history of recent generations.
- Download generated videos locally.
- Animated, glassmorphism UI with responsive layout.

## Tech Stack
- React 19 + TypeScript + Vite
- Framer Motion
- TanStack Query
- OpenAI Video API (`/v1/videos`)
- Tailwind CSS v4

## API Strategy
The app sends requests directly from browser to OpenAI Video API:
- `POST /v1/videos` (create)
- `GET /v1/videos/{id}` (poll status)
- `GET /v1/videos/{id}/content` (download output)

You provide your OpenAI API key in the UI (`sk-...`).

## Local Setup
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Free Hosting (GitHub Pages)
1. Enable Pages in repo settings with source set to **GitHub Actions**.
2. Push to `main`; workflow `.github/workflows/deploy-pages.yml` will build and deploy automatically.

## Security Note
This is a static frontend app. Your API key is entered in-browser and used directly for API calls. For production-grade security, use a backend proxy.

## Cost Note
OpenAI video generation is a paid API capability; a funded OpenAI account is required.

## Open-Source UI Assets/Components Used
- [Lucide Icons](https://github.com/lucide-icons/lucide)
- [Framer Motion](https://github.com/framer/motion)
- [TanStack Query](https://github.com/TanStack/query)
