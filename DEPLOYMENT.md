# Deployment Checklist

This document records the deployment process for AI Study Buddy, confirming it was done intentionally and with a known rollback path, per the capstone's production-readiness requirements.

**Live URL:** https://frontend-ai-capstone-gilt.vercel.app/
**Hosting:** Vercel
**Branch deployed:** `main`

---

## Pre-Deployment Checklist

- [x] All planned routes exist and are reachable (`/`, `/upload`, `/summary/[id]`, `/flashcards/[id]`, `/quiz/[id]`, `/history`, `/chat`, `/settings`)
- [x] No secrets committed to the repository — confirmed via `git ls-files | grep .env` returning no results
- [x] `.env` is listed in `.gitignore`
- [x] Environment variable (`GROQ_API_KEY`) is set in Vercel's Project Settings, not hardcoded anywhere in source
- [x] `npm run build` completes successfully with no errors
- [x] All tests pass locally (`npm run test`) before pushing
- [x] Responsive layout checked at 375px (mobile) and 1280px (desktop) widths
- [x] Lighthouse audit run against the live deployment (see README's Performance & Accessibility section)
- [x] Custom favicon and page metadata (title, description) configured

## Deployment Configuration

- **Framework preset:** Next.js (auto-detected by Vercel)
- **Install command override:** `npm install --legacy-peer-deps` — required due to a peer dependency version mismatch between Vitest 5 and this project's `@types/node` version (dev-dependency only; does not affect production runtime behavior)
- **Build command:** default (`next build`)
- **Environment variables:** `GROQ_API_KEY` set under Production environment in Vercel Project Settings

## Continuous Deployment

Every push to the `main` branch automatically triggers a new production build and deployment via Vercel's GitHub integration. No manual deployment step is required for ongoing changes.

## How the App Fails Safely

- **AI generation failures** (Summary, Flashcards, Quiz): API routes wrap all Groq calls in try/catch blocks. On failure, the client shows a clear error message instead of a blank page or crash, and Quiz specifically offers a one-click retry, since transient generation failures (e.g. malformed JSON from the model) are expected occasionally with a fast, non-reasoning model.
- **Missing or invalid uploaded document:** Summary, Flashcards, and Quiz pages check for a valid document in `localStorage` before attempting generation; if none is found, the user sees an error state rather than the app breaking.
- **No document uploaded yet:** Home page's Flashcards/Quiz shortcuts detect this case and redirect to Upload with an explanatory notice, rather than linking to a broken page.
- **Hydration safety:** Components that depend on browser-only APIs (`localStorage`, `Math.random()` for particle generation) defer that logic to `useEffect`, avoiding server/client mismatch errors during Next.js's server-side rendering pass.

## Rollback Plan

Vercel retains every previous successful deployment indefinitely. If a new deployment to `main` introduces a regression:

1. Go to the Vercel dashboard → Deployments tab for this project
2. Locate the last known-good deployment (identified by its commit message and green "Ready" status)
3. Click the three-dot menu on that deployment → **Promote to Production**

This immediately repoints the live URL to the previous working build, with no rebuild or downtime — typically completing in a few seconds. No manual server access or redeploy-from-scratch is required.

## Monitoring

No dedicated uptime/error-monitoring service (e.g. Sentry) is integrated for this capstone scope. Vercel's own dashboard provides basic visibility: build/deployment status, function invocation logs for the API routes (`/api/chat`, `/api/summary`, `/api/flashcards`, `/api/quiz`), and can be checked manually if the app is reported as broken. A production version of this app would integrate a dedicated error-tracking tool.

---

**Signed off by:** Syed Muhammad Hur Abbas Kazmi
**Date:** October 3rd, 2026