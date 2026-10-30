# Campus Connect: Architecture and Backend (Part 3)

## 7. Architecture and backend document

### 7.1 Stack decision

Next.js (App Router) with TypeScript and Tailwind CSS, shadcn/ui and Lucide icons, Supabase for authentication, PostgreSQL, Realtime and Storage, React Hook Form with Zod, Recharts, Leaflet with OpenStreetMap tiles, Framer Motion for small transitions, React Three Fiber with drei for the 3D landing page, Resend or SMTP for email, and a PWA service worker.

### 7.2 Project structure

```
campus-connect/
  .github/                   CODEOWNERS, templates, workflows (Section 13.6)
  .agent/rules/              global and per-lane rules for agents (Section 13.3)
  .agent/skills/             the skills from Section 6.9
  AGENTS.md  CONTRIBUTING.md  README.md
  docs/                      the seven documents from this pack
  scripts/                   check-copy.mjs, copy-rules.json
  src/app/
    (public)/                landing, sign-in, sign-up
    (app)/                   authenticated shell
      student/ faculty/ admin/ security/
      notices/ events/ clubs/ academics/ messages/ safety/ notifications/
    api/                     route handlers (webhooks, cron, health)
  src/components/            ui/, shell/, landing/, scene/, and one folder per module
  src/config/nav/            one navigation file per module
  src/content/               landing page and other long-form copy
  src/emails/                email text
  src/lib/                   supabase clients, auth helpers, rbac, validators (one file per module), notify
  src/messages/en/ hi/       user-facing text, one file per module and language
  src/actions/               server actions per module
  supabase/migrations/       SQL migrations (add-only)
  supabase/tests/            database policy tests
  supabase/seed.sql          demo data
  tests/                     unit, integration, e2e
```

### 7.3 Authentication and authorization

- Supabase Auth with email and password. Restrict sign-up to the university email domain, or use admin-created invitations or CSV import.
- On sign-up, a trigger creates a row in `profiles` with role `student` by default. Only an admin can change a role.
- `middleware.ts` refreshes the session, redirects unauthenticated users, and blocks routes by role (for example /admin requires admin).
- Every server action and route handler calls `requireRole([...])` first and re-checks ownership on the record.
- Row-level security on every table is the final safety net.

### 7.4 Server actions and API surface

| Module | Operations |
| --- | --- |
| Auth | signUp, signIn, signOut, updateProfile, changePassword |
| Safety | createIncident, listMyIncidents, listIncidents (admin, security), getIncident, assignResponder, acknowledgeIncident, updateIncidentStatus, addIncidentNote, createSafetyReport, markFalseAlarm |
| Notices | createNotice, updateNotice, deleteNotice, listNotices, markNoticeRead, createLostFound, claimLostFound |
| Academics | listTimetable, upsertTimetableEntry, postAcademicUpdate, listDeadlines, createDeadline, publishExamSeating |
| Events | createEvent, updateEvent, listEvents, rsvp, cancelRsvp, exportIcs |
| Clubs | createClub, updateClub, listClubs, joinClub, leaveClub, approveMember, assignLead |
| Messages | getOrCreateThread, sendMessage, listThreads, markRead, reportMessage, blockUser |
| Admin | listUsers, createUser, importUsersCsv, setRole, setFlags, getAnalytics, listAuditLog |
| System | GET /api/health, POST /api/cron/escalate-incidents, POST /api/notify/send |

### 7.5 Safety alert pipeline (critical)

1. `createIncident` validates input, applies the rate limit, and inserts the incident with state `saved` in one transaction. It also writes the first timeline entry and an audit entry.
2. The server resolves recipients: security staff on duty for the zone, the resident advisor flagged for the student's hostel or department, and an administrator.
3. For each recipient it inserts a `notifications` row and a `delivery_attempts` row, then sends through enabled channels (in-app realtime, email, optional web push).
4. Delivery state moves to `delivered` only when the in-app notification is written and a recipient client confirms receipt, or the email provider returns accepted. If nothing is confirmed, state stays `queued` and a retry runs.
5. A responder tapping Acknowledge sets the incident to Acknowledged and stamps who and when.
6. A scheduled job finds incidents still unacknowledged after the configured time, re-notifies, and escalates to the administrator.
7. Students subscribe to realtime updates on their own incident row only.

### 7.6 Realtime channels

`incidents` (security and admin lists, scoped by policy), `incident:{id}` (the student's own tracking), `notifications:{user_id}`, `messages:{thread_id}`.

### 7.7 Storage buckets

`safety-images` (private, owner and staff read), `notice-attachments` (authenticated read), `lost-found` (authenticated read), `avatars` (authenticated read). Enforce file type (jpg, png, webp, pdf) and size (5 MB images, 10 MB PDFs) on the client and in storage policies.

### 7.8 Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
CRON_SECRET=
SECURITY_HELPLINE=
ESCALATION_MINUTES=3
```
