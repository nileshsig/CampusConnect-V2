# Campus Connect: Team and Git Workflow (Part 7)

## 13. Team, agents and Git workflow

### 13.1 How the work is split

Nine lanes: Platform and release, Design system, Landing and 3D, Data and access, Safety, Campus content, Community, Admin and polish, Quality and security.

### 13.2 Lanes at a glance

- `platform`: .github/, scripts/, configs, README, docs/
- `design`: src/components/ui, src/components/shell, src/styles
- `landing`: Landing page, campus model, landing copy
- `data`: Database migrations, seed data, row-level security, auth, middleware
- `safety`: Safety module, responder screens, alert pipeline
- `content`: Notices, lost and found, academics, alerts inbox
- `community`: Events, clubs, messages
- `admin`: Admin screens, analytics, activity record, Hindi & English
- `qa`: Tests, accessibility, security checks

### 13.3 Plain language and copy check rules

User-facing words live in `src/messages/{en,hi}/<module>.json`, `src/content`, `src/emails`.
Zero banned words. Technical terms replaced according to Section 6.10.
Script: `scripts/check-copy.mjs` with `scripts/copy-rules.json`.
