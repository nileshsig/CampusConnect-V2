# Campus Connect: Build Playbook (Part 6)

## 12. Antigravity build playbook

Antigravity is an agent-first development environment, so the best results come from giving agents clear written rules and small, verifiable tasks.

### 12.1 One-time workspace setup

1. Global rules in `.agent/rules/00-global.md`, plus one file per lane from Section 13.3.
2. Commit the seven documents from this pack into `docs/`.
3. Create a Supabase project and keep the URL and keys ready for `.env.local`.

### 12.2 Build phases and prompts

Phase 1: Foundation (Design tokens, fonts, base components)
Phase 1b: Landing page with 3D campus model
Phase 2: Database and auth (Migrations, seed data, auth flows, role checks)
Phase 3: Safety module (SOS flow, delivery pipeline, timeline, responder view, helpline)
Phase 4: Notices, notifications, academics (Feed, urgent notices, lost & found, timetable, exam seating)
Phase 5: Events, clubs, communication (RSVP, clubs, direct & group messages)
Phase 6: Admin, analytics, polish (User management, stats, audit record, Hindi & English, offline shell)
Phase 7: Hardening and release (A11y, copy check, verification)

### 12.3 Reviewing agent work

- Verify against requirement IDs.
- Test responsive view at 360, 768, 1280 px.
- Enforce plain-language copy (Section 6.10).

### 12.4 Hackathon demo script (about 5 minutes)

1. Open the landing page and state the problem.
2. Sign in as a student: dashboard with today's classes, urgent notice, events.
3. Trigger SOS on a phone, choose Medical emergency, share location, confirm.
4. On a second screen as security: alert appears, acknowledge, add a note.
5. Back on the student phone: status changes live. Point out the honest delivery states and the helpline fallback.
6. As admin: safety dashboard, assign and resolve, publish a targeted urgent notice, show the analytics.
7. Show an event RSVP and a club join, then close with the vision line.

### 12.5 Final acceptance checklist

- All P0 requirements implemented and tested.
- Roles tested for all four user types.
- Works at 360px, 768px, 1280px with light theme.
- Tests T15 and T16 pass.
- Demo mode with seeded accounts and role switcher.
