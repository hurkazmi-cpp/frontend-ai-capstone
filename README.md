# AI Study Buddy

A frontend AI capstone project: upload your notes, get AI-generated summaries, flashcards, and quizzes, chat with an AI tutor that understands your material, and track your weak spots over time.

**Live app:** https://frontend-ai-capstone-gilt.vercel.app/
**Repo:** https://github.com/hurkazmi-cpp/frontend-ai-capstone

---

## Project Brief

**What problem does it solve?** Studying from raw notes or PDFs is passive — most students read once and move on, with no structured way to test recall or spot weak areas. AI Study Buddy turns any uploaded document into active study material (summaries, flashcards, quizzes) and pairs it with a chat tutor that understands the actual document content, not just generic answers.

**Who is it for?** Students studying from their own notes or reading material who want a faster way to turn passive reading into active recall practice.

**Why this idea?** It combines a genuinely useful AI integration (document-grounded Q&A and content generation) with enough distinct features — summaries, flashcards, quizzes, a chat tutor, and a personalized weak-spot tracker — to demonstrate a range of frontend and AI-integration skills in one coherent product, rather than a single-purpose AI wrapper.

---

## Setup & Run Instructions

```bash
git clone https://github.com/hurkazmi-cpp/frontend-ai-capstone.git
cd frontend-ai-capstone
npm install --legacy-peer-deps
```

Create a `.env` file in the project root with:
GROQ_API_KEY=your_groq_api_key_here
(Get a free key at [console.groq.com](https://console.groq.com))

Then run:
```bash
npm run dev
```

Open `http://localhost:3000`.

**Run tests:**
```bash
npm run test
```

> Note: `--legacy-peer-deps` is required due to a peer dependency version mismatch between Vitest 5 and this project's `@types/node` version. This does not affect runtime behavior.

---

## Architecture Overview

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

| Route | Purpose |
|---|---|
| `/` | Dashboard — quick actions, weak-spot tracker, study stats |
| `/upload` | Upload a `.pdf` or `.txt` file; extracts text client-side and stores it |
| `/summary/[id]` | AI-generated summary of a stored document |
| `/flashcards/[id]` | AI-generated flashcards with a flip interaction |
| `/quiz/[id]` | AI-generated 10-question multiple-choice quiz with explanations |
| `/history` | Lists all uploaded documents with links back into their generated content |
| `/chat` | Streaming AI chat, automatically grounded in the relevant uploaded document |
| `/settings` | Data management (clear stored data) and app info |

**Data storage:** There is no backend database. Uploaded document text, quiz results, and weak-spot data are stored entirely in the browser's `localStorage`. This was a deliberate scope decision for a capstone project — see Limitations below.

**API routes** (`src/app/api/*/route.ts`): thin server-side handlers that receive text from the client, call the Groq API, and return either a streamed response (chat) or a generated summary/flashcards/quiz.

**Key components:**
- `CodeBlock` — renders AI-generated code snippets with a copy-to-clipboard button
- `MobileNav` — bottom tab navigation shown only on small screens
- `Logo` / `AmbientEffects` — visual branding and background animation, isolated into their own components to keep the page-level components focused on logic

---

## AI Integration

**Provider:** [Groq](https://groq.com) (via the [Vercel AI SDK](https://ai-sdk.dev)), using the `openai/gpt-oss-120b` model. Groq was chosen over the Claude API for cost reasons — it offers a genuinely free tier with fast inference, appropriate for a student-built capstone project.

**Where AI is used:**
1. **Chat (`/api/chat`)** — streamed responses via `streamText`, with `smoothStream` applied to produce a smooth token-by-token typing effect (Groq's raw output otherwise arrives in larger bursts). The system prompt is dynamically built: if the user has uploaded a document, its text is injected into the prompt so the AI answers using the actual notes rather than general knowledge.
2. **Summary (`/api/summary`)** — a single `generateText` call with a system prompt instructing the model to produce a clear, structured summary using Markdown headings and bullet points.
3. **Flashcards (`/api/flashcards`)** — the model is instructed to return strict JSON (no prose, no code fences) representing an array of question/answer pairs, which the client parses and renders as flippable cards.
4. **Quiz (`/api/quiz`)** — similarly constrained to JSON output, this time including a topic tag and explanation per question. The topic tag is what powers the Weak-Spot Tracker: missed questions are grouped by topic and surfaced back to the user on the dashboard, with a direct link to ask the chat tutor about that specific topic.

**Why structured JSON output matters here:** Flashcards and Quiz need machine-readable data (to render interactive UI), not prose. The model is explicitly instructed to return only JSON, and the API route wraps parsing in a try/catch with a clear error path back to the client — necessary because a fast, non-reasoning model like this occasionally returns malformed JSON or stray formatting, and the UI needs to fail gracefully (with a retry option) rather than crash.

---

## Known Limitations & Future Improvements

- **No backend or accounts.** All data lives in `localStorage`, scoped to one browser on one device — it does not sync across devices and is lost if browser data is cleared. This was an intentional scope decision for an internship capstone; a production version would use a real database (e.g. Postgres via Prisma or Supabase) and user accounts.
- **AI JSON output is occasionally malformed.** Groq's fast, non-reasoning model sometimes fails to strictly follow the "JSON only" instruction. This is mitigated with parsing guards and a retry option, but a production version would add stronger schema validation (e.g. via `zod`) with automatic re-prompting.
- **Weak-Spot Tracker is topic-name based**, not semantically deduplicated — if the AI labels a similar concept with slightly different topic names across quizzes, they're tracked as separate entries. A future version could normalize or cluster similar topics.
- **No offline support** — the app requires an active connection to Groq for all AI features.
- **Single latest-document context in Chat** — Chat uses either a specifically linked document (via the weak-spot flow) or your most recently uploaded document as context, not a user-selectable document picker. A future version could let users explicitly choose which document(s) to ground the conversation in.

---

## Testing

Tests are written with **Vitest** and **React Testing Library**, covering components with meaningful logic rather than purely presentational ones:

- `CodeBlock` — renders content, copies code to clipboard
- `Quiz` — correct/incorrect answer feedback
- `Flashcards` — flip state and card navigation reset
- `Upload` — file reading, localStorage persistence, and redirect
- `Home` — conditional "upload first" notice logic
- `Settings` — document count display, two-step data-clear confirmation
- `History` — empty state vs. populated document list
- `Chat` — empty-state rendering
- `Logo` — renders without crashing

Purely structural/wrapper components with no logic (`AmbientEffects`, `MobileNav` layout wiring) are intentionally excluded from this count, in line with testing components that have real behavior to verify.

Run with:
```bash
npm run test
```

---

## Performance & Accessibility

Audited with Lighthouse (mobile) against the live deployment:

| Category | Score |
|---|---|
| Performance | 85–90* |
| Accessibility | 94–100 |
| Best Practices | 100 |
| SEO | 100 |

*Occasionally dips to 84 due to normal Lighthouse run-to-run variance.

Notable improvements made based on audit findings:
- Decorative background components (`ParticleField`, `CursorGlow`) were moved to lazy-loaded, client-only dynamic imports (`next/dynamic` with `ssr: false`) to remove them from the critical initial-load JavaScript bundle, improving Total Blocking Time.
- Added an explicit `browserslist` config to avoid shipping unnecessary legacy JavaScript polyfills for browsers this app doesn't need to support.
- Keyboard focus states (`:focus-visible`) were added on all interactive elements, and `prefers-reduced-motion` is respected for background animations, to support the Accessibility score.

---

## Deployment

Deployed on **Vercel**, connected to the `main` branch of this repository. Every push to `main` triggers an automatic production redeploy.

**Environment variables required on Vercel:** `GROQ_API_KEY` (set in Project Settings → Environment Variables).

**Install command override:** Vercel's build uses `npm install --legacy-peer-deps` (configured in Project Settings → Build & Development Settings) to resolve the same peer dependency conflict noted in Setup above.

**Rollback plan:** Vercel retains all previous deployments. If a deployment introduces a regression, the previous known-good deployment can be re-promoted to production instantly from the Vercel dashboard's Deployments tab, with no rebuild required.

---

## Author

Built by Syed Muhammad Hur Abbas Kazmi as part of a Frontend AI Engineering internship.