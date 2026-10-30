# Campus Connect: Security, QA, and Deployment (Part 5)

## 9. Security document

| Area | Requirement |
| --- | --- |
| Access control | Three layers: middleware, server check, row-level security. Deny by default |
| Input | Zod validation on every server action; length limits; escape output; no raw HTML from users |
| Secrets | Service role key only on the server; keys never logged or sent to the client |
| Sessions | Secure, httpOnly cookies handled by Supabase SSR helpers; sign-out clears the session |
| Rate limits | SOS (for example 3 per 10 minutes per user), sign-in attempts, messages, uploads |
| Uploads | Allow-list file types, size caps, random file names, private buckets for sensitive images |
| Headers | Content-Security-Policy, X-Frame-Options, Referrer-Policy, Permissions-Policy (geolocation only for self) |
| Privacy | Location only after explicit permission and only attached to incidents; retention setting; students can see what was shared |
| Audit | Log role changes, incident status changes, notice publication, user import, moderation actions |
| Abuse | Report and block in messaging; admin moderation queue; false-alarm review |
| Dependencies | Lock versions, run npm audit before release |

## 10. QA and testing document

### 10.1 Test layers

Unit tests (Vitest) for validators, role checks and delivery-state logic. Integration tests for server actions against a test database. End-to-end tests (Playwright) for the main journeys. Manual checks for accessibility and responsive layout.

### 10.2 Critical test cases

| ID | Scenario | Expected |
| --- | --- | --- |
| T1 | Student opens /admin by typing the URL | Redirected, no data returned |
| T2 | Student calls an admin server action directly | Rejected with an authorization error |
| T3 | Student queries another user's incident through the API | Zero rows returned |
| T4 | Security officer opens an incident not assigned to them | Not visible |
| T5 | Student sends SOS with GPS denied | Manual location accepted, incident created |
| T6 | Notification provider is down during an SOS | Incident stays queued, never shows delivered, call buttons visible, retry runs |
| T7 | No acknowledgement after the escalation time | Re-notify and admin escalation appear in the timeline |
| T8 | Student sends 4 SOS alerts in 10 minutes | Fourth is rate limited with a clear message |
| T9 | Admin changes a user's role | Audit entry written; user sees new menu after refresh |
| T10 | Event at capacity | New RSVP goes to the waitlist; cancel promotes the next person |
| T11 | Faculty without publish permission posts a notice | Rejected |
| T12 | Upload of a .exe renamed to .png | Rejected |
| T13 | Mobile viewport 360px wide | No horizontal scroll, SOS reachable in one tap |
| T14 | Keyboard-only run of the SOS flow | Fully completable, focus order correct |
| T15 | Scan all user-facing text (screens, seed data, emails, alerts, errors) for banned words and technical terms from Section 6.10 | Zero matches |
| T16 | Landing page design review at 360, 768 and 1280 px | No repeated three-card rows, no gradients, blobs or glows, no stock images, no entrance animations, only the palette in Section 6.2, still-image fallback works with 3D turned off |
| T17 | A new contributor clones the repository and follows the README | App runs locally with demo data in 15 minutes or less |
| T18 | Pull request that edits or deletes a migration already on `main` | CI check fails with a clear message |
| T19 | Pull request with a banned word or technical term in a message file | Copy check fails and names the file and word |

### 10.3 Definition of done for any feature

Validated inputs, role checks in all three layers, loading, empty and error states, responsive layout, keyboard and screen-reader pass, tests written, audit entry where required, no console errors.

## 11. Deployment document

1. Create a Supabase project. Run migrations from `supabase/migrations` and then `seed.sql` on a staging project first. After the first run, the database workflow in Section 13.9 pushes new migrations to staging when they merge to `main`.
2. Enable email auth, set the site URL and redirect URLs, and create the storage buckets with policies.
3. Enable Realtime on the `incidents`, `notifications` and `messages` tables.
4. Push the repository to GitHub and import it in Vercel. Add all environment variables from Section 7.8.
5. Add a cron job for `/api/cron/escalate-incidents` every minute with the `CRON_SECRET` header.
6. Configure the email provider and verify the sender domain.
7. Run the full test suite, then a manual SOS drill with two real devices (student and security) before the demo.
8. Add basic monitoring (Vercel logs and Supabase logs) and the `/api/health` check.

**Pilot notice:** until the university formally adopts the system and staff are trained, show a visible banner telling students to also call the campus security helpline in an emergency.
