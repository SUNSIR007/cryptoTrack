# Repository Guidelines

## Project Structure & Module Organization
The Next.js entrypoint lives in `src/app`, with `layout.tsx` defining shared chrome and `page.tsx` hosting the dashboard UI. Serverless handlers and shared security helpers sit under `src/app/api` and `src/app/security`. Reusable UI is packaged in `src/components`, shared hooks in `src/hooks`, data utilities in `src/lib`, and TypeScript definitions in `src/types`. Public icons and static assets reside in `public`. Standalone reproduction scripts (`debug_*.html`, `debug_*.js`) and targeted regression tests (`test_*.js`) are kept at the repo root for quick triage.

## Build, Test, and Development Commands
Use `npm run dev` for a hot-reloading development server, and `npm run build` followed by `npm run start` to verify the production bundle. Run `npm run lint` before every branch merge to catch TypeScript, React, and Tailwind issues. Execute `npm run check-env` to confirm required API keys before deployment; `npm run setup` bootstraps dependencies and validates the environment in one step.

## Coding Style & Naming Conventions
Stick to TypeScript with React function components, two-space indentation, and trailing commas where ESLint inserts them. Import modules via the `@/` path alias rather than relative `../../` chains. Components follow PascalCase (`CryptoCard.tsx`), hooks use `use*` naming, utilities stay camelCase, and constants are SCREAMING_CASE. Keep user-facing text in English unless translating existing Chinese copy, and update comments in the dominant language used in that file.

## Testing Guidelines
Targeted regression tests live in `test_*.js`; run them with `node test_price_changes.js` (swap in the relevant filename). When adding to this suite, mirror the naming (`test_<feature>.js`) and include clear console output for pass/fail status. Prefer Jest-style assertions via Node's native `assert`. For UI changes, record manual verification steps in the PR description and add or update component-level tests when practical.

## Commit & Pull Request Guidelines
Commits in history use short, task-focused imperatives (often in Chinese); follow that pattern and keep the subject under 72 characters. Reference issue IDs in the subject or body when available. Pull requests should summarize scope, list any environment or migration impacts, link related issues, and include screenshots or screen recordings for UI changes. Document new env vars or security checks in `SECURITY_CHECKLIST.md` or `DEPLOYMENT.md` as part of the PR.

## Security & Configuration Tips
Keep `.env.local` out of version control and rely on `scripts/check-env.js` for validation. When touching `src/app/security`, confirm changes against `SECURITY_DEPLOYMENT_GUIDE.md`. For third-party integrations, note rate limits and API keys in `API_SETUP_GUIDE.md` and avoid logging secrets in client code.
