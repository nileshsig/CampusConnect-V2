Project: Campus Connect (Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase).
Always read docs/01-PRD.md to docs/05-SECURITY-QA-DEPLOY.md and docs/07-TEAM-AND-GIT.md before coding a feature.
Find your lane in .agent/rules/ and work only in the folders it owns.
Rules:
1. Enforce roles in middleware, server actions and Postgres RLS. Never rely on UI hiding.
2. Validate every input with Zod. Return typed results.
3. Never show an alert as delivered unless the backend recorded state = delivered.
4. Never expose the service role key to the client.
5. Use the design tokens in docs/02-DESIGN.md. Reuse components, do not duplicate. Follow the 'rules that override everything' table in Section 6.1: no card grids with icon boxes, no gradients, blobs or glows, no stock imagery, no entrance animations.
6. Every screen needs loading, empty and error states and must work at 360px width.
7. Write tests for each feature. Run lint, type-check and tests before saying done.
8. Small commits. One feature per task. Update docs if a decision changes.
9. All user-facing text follows Section 6.10: plain words, short sentences, none of the banned words, no technical terms. Technical words stay in code and docs. Text goes in src/messages, not in components.
10. Never push to main. Work on a branch in your own working folder, open a pull request with the template filled in, and do not approve or merge it yourself.
11. Never edit a migration that is already on main. Add a new one.
