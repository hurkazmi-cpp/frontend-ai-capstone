# Project Instructions

## Project

Frontend AI Engineer Capstone

## Stack

- JavaScript / TypeScript
- React
- Node.js
- Git and GitHub
- AI APIs

## Development Conventions

- Write clean and readable code.
- Prefer simple solutions over unnecessary complexity.
- Use meaningful variable and function names.
- Keep components small and reusable.
- Never expose API keys or secrets.
- Store secrets inside environment variables.
- Explain major AI-generated changes before applying them.

## Accessibility & Testing Rules

- Forms must never render more than one `role="alert"` (or `aria-live="assertive"`) element active at the same time. Field-level errors show as plain text linked via `aria-describedby` only; a single summary alert announces the total error count.
- Every form/component's test file must include at least one assertion that isn't just `getByText` for visible copy — e.g., checking `role`, `aria-live`, or `getAllByRole('alert').length` — so accessibility regressions get caught by CI, not by a human reading code.
- Before merging any AI-generated change to `package.json` or `package-lock.json`, actually run `npm install && npm test` locally. Never accept a diff to these files on faith just because it "looks reasonable."

## Git Conventions

Use Conventional Commits.

Examples:

- feat: add navigation component
- fix: correct mobile layout
- docs: improve README
- refactor: simplify API logic
