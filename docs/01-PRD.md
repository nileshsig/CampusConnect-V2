# Campus Connect: Product Requirements (Part 1 - PRD)

*Everything on campus, in one place.* Prepared for Vinoba Bhave University, Hazaribagh hackathon project. Target build environment: Google Antigravity.

## 1. Product overview

### 1.1 Problem

Campus information is scattered across WhatsApp groups, posters, email, portals and hotlines. Students miss deadlines, class changes and safety notices. Staff repeat the same answers on many channels. In an emergency there is no single, accountable route from the student to a responder.

### 1.2 Vision

Campus Connect puts campus life in one app: one sign-in, one feed and six sections (Safety, Academics, Notices, Events, Clubs, Messages) for students, faculty, administrators and security officers.

### 1.3 Goals

1. A student can raise an SOS in under 10 seconds and see who has taken ownership.
2. Every official notice reaches the right audience once, in one place.
3. Students see timetable changes, exam seating and deadlines without leaving the app.
4. Staff manage safety, notices, events and clubs from one dashboard.
5. Role-based access is enforced on the server and the database, never only in the UI.

### 1.4 Non-goals (version 1)

- Replacing the university's official ERP, fee or results system.
- Video calling or large file sharing in chat.
- Native mobile apps (a installable PWA is in scope instead).
- Automatic calling of external emergency services. The app must clearly show a call-helpline fallback.

### 1.5 Personas

| Persona | Need | Success looks like |
| --- | --- | --- |
| Asha, student | Know what changed today, get help fast, join clubs | Opens one app, sees today's classes and urgent notices |
| Dr. Prasad, faculty | Post class updates and assignments once | Students acknowledge without WhatsApp |
| Registrar office, admin | Official announcements, event and club management, oversight | Targeted notice sent in under 2 minutes, analytics visible |
| Officer Singh, security | Clear list of assigned incidents with location | Acknowledges, updates and closes incidents in the app |

### 1.6 Success metrics

- Median time from SOS tap to first acknowledgement (target under 3 minutes in pilot).
- Share of active students who open the app weekly.
- Notice read rate within 24 hours.
- Event registrations and club joins per month.
- Number of repeated-update messages staff report (should fall).

## 2. Scope: six core modules

Requirement IDs (FR-xx) are used so the agent and tests can reference them. Priority: **P0** must ship in the hackathon demo, **P1** should ship, **P2** later.

### 2.1 Module 1: Campus Safety

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-S1 | Prominent SOS button on the student dashboard and in the bottom navigation on mobile | P0 |
| FR-S2 | Confirmation step before sending, with a short cancel window | P0 |
| FR-S3 | Capture GPS only after browser permission; manual location entry if unavailable | P0 |
| FR-S4 | Categories: Medical emergency, Personal safety, Harassment, Accident, Security issue, Other | P0 |
| FR-S5 | Unique incident ID, timestamp, short description | P0 |
| FR-S6 | Notify security, the designated resident advisor or staff, and the relevant administrator | P0 |
| FR-S7 | Status flow: Submitted, Acknowledged, Responder assigned, In progress, Resolved, Closed | P0 |
| FR-S8 | Admin safety dashboard with filters by category and status, detail view, assign responder, timeline | P0 |
| FR-S9 | Non-emergency safety reports with optional image upload and progress tracking | P1 |
| FR-S10 | Responder can acknowledge, add notes, update status and close | P0 |
| FR-S11 | Honest delivery states: Saved, Queued, Delivered to responder (confirmed by backend), Acknowledged. Never show "delivered" unless the backend recorded it. Students see them in the plain wording of Section 6.5 | P0 |
| FR-S12 | Escalation: if no acknowledgement within a configured time (default 3 minutes), re-notify and escalate to the administrator | P1 |
| FR-S13 | Fallback panel: one-tap call to the campus security helpline and national emergency number if the network or alert fails | P0 |
| FR-S14 | Anti-abuse: rate limit SOS per user, log false-alarm outcomes for admin review | P1 |

**Safety rules that must not be broken:** never claim an alert reached anyone unless the server confirmed it; never collect location without permission; show students only their own incidents; show responders only incidents assigned to them or in their zone; write every status change to an immutable audit trail.

### 2.2 Module 2: Academics

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-A1 | Student timetable for today and this week (classes and lab practicals) | P0 |
| FR-A2 | Class change alerts (room change, cancelled, rescheduled) pushed to affected students | P0 |
| FR-A3 | Assignment and deadline list with due dates | P1 |
| FR-A4 | Exam notifications and exam seating plan (room and seat) | P0 |
| FR-A5 | Faculty can post academic updates and update schedules for their courses | P0 |
| FR-A6 | Study notes sharing by course (PDF upload) | P2 |

### 2.3 Module 3: Notices

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-N1 | One official notice feed with categories: Holidays, Exams, Lost and found, Workshops, General, Urgent | P0 |
| FR-N2 | Targeting by department, course, semester or everyone | P0 |
| FR-N3 | Urgent notices pin to the top and trigger notifications | P0 |
| FR-N4 | Attachments (PDF or image) | P1 |
| FR-N5 | Read receipts and read-rate view for the publisher | P1 |
| FR-N6 | Publishing by admin and authorised faculty only; approval flow for faculty notices if enabled | P1 |
| FR-N7 | Lost and found: post lost or found item with photo, claim and mark resolved | P0 |

### 2.4 Module 4: Events

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-E1 | Browse upcoming events by date, category and club | P0 |
| FR-E2 | RSVP and cancel RSVP, with capacity limits and waitlist | P0 |
| FR-E3 | Admin and club leads create and edit events | P0 |
| FR-E4 | Add to calendar (ICS download) and reminder notification | P1 |
| FR-E5 | Attendance check-in by QR code | P2 |

### 2.5 Module 5: Clubs and activities

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-C1 | Clubs: Literature, Sports, Science and Innovation, Art and Culture, plus NSS, NCC, Yoga and other extra-curricular groups | P0 |
| FR-C2 | Join and leave; join approval option per club | P0 |
| FR-C3 | Club page with description, leads, members count, upcoming events, announcements | P0 |
| FR-C4 | Club group chat | P1 |
| FR-C5 | Admin creates, edits and archives clubs, assigns club leads | P0 |

### 2.6 Module 6: Communication

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-M1 | Direct messages between students, faculty and club leads, with real-time delivery | P1 |
| FR-M2 | Course and club group conversations | P1 |
| FR-M3 | Report and block a user; admin moderation queue | P1 |
| FR-M4 | Students cannot start chats with arbitrary staff outside allowed relationships (own faculty, advisors, club leads) | P1 |
| FR-M5 | Unread counts and in-app notification centre | P0 |

## 3. Added features (recommended)

| ID | Feature | Why | Priority |
| --- | --- | --- | --- |
| FR-X1 | Notification centre with preferences (in-app, email, optional web push) | One place for everything that needs attention | P0 |
| FR-X2 | Emergency directory and campus map (gates, medical room, security posts, assembly points) | Helps students act during an incident | P1 |
| FR-X3 | Hindi and English interface | Reaches more students at the university | P1 |
| FR-X4 | Installable PWA with offline shell and queued SOS retry | Weak campus connectivity | P0 |
| FR-X5 | Audit log of admin and responder actions | Accountability and dispute handling | P0 |
| FR-X6 | Global search across notices, events, clubs, courses | Finding things is the core problem | P1 |
| FR-X7 | Bulk import of students and faculty from CSV | Onboarding hundreds of users quickly | P1 |
| FR-X8 | Privacy and consent screen for location and notifications; data retention settings | Trust and legal hygiene | P0 |
| FR-X9 | Accessibility: keyboard use, screen reader labels, high contrast, large tap targets | Inclusion; emergency use under stress | P0 |
| FR-X10 | Demo mode with seeded data and a role switcher | Hackathon presentation | P0 |
| FR-X11 | Optional AI helper that answers "what's on today?" from the student's own data only | Differentiator; build last | P2 |
| FR-X12 | Landing page with an interactive 3D campus model (turn, hover, click), light and plain design, plain-language copy, and a still-image fallback | Shows what the app covers in one look, for students, staff and hackathon judges | P0 |
| FR-X13 | Plain-language copy: no technical terms or banned words in anything users read, enforced by a scan | The app is for students and staff, not for engineers | P0 |

## 4. Roles and permissions

Four roles: `student`, `faculty`, `admin`, `security`. A user has exactly one primary role. Club leads and resident advisors are **flags** on a user, not separate roles.

| Capability | Student | Faculty | Admin | Security |
| --- | --- | --- | --- | --- |
| View own dashboard | Yes | Yes | Yes | Yes |
| View timetable and notices for own audience | Yes | Yes | Yes | No |
| Publish academic update for own courses | No | Yes | Yes | No |
| Publish official notice | No | If authorised | Yes | No |
| Create events | No | No | Yes (club leads for own club) | No |
| Register for events, join clubs | Yes | Yes | Yes | No |
| Send SOS and safety reports | Yes | Yes | Yes | Yes |
| View own incidents | Yes | Yes | Yes | Yes |
| View all incidents | No | No | Yes | Assigned or zone only |
| Assign responder | No | No | Yes | No |
| Acknowledge, add notes, change status | No | No | Yes | Assigned only |
| Manage users and permissions | No | No | Yes | No |
| View analytics | No | Limited (own courses) | Yes | Safety stats only |
| Moderate content | No | No | Yes | No |

**Enforcement rule:** every row above is enforced in three places: route middleware, server code, and database row-level security. Changing a URL or editing frontend code must never grant access.

## 5. Non-functional requirements

- **Performance:** first meaningful paint under 2.5 seconds on a mid-range phone over 4G; SOS screen interactive in under 1 second after app load.
- **Availability:** SOS creation must work even if notifications or maps fail. Degrade gracefully.
- **Security:** OWASP Top 10 baseline, server-side validation, secrets only in environment variables.
- **Privacy:** location stored only for incidents; students see what is shared and with whom; configurable retention.
- **Accessibility:** WCAG 2.2 AA target.
- **Responsive:** desktop, laptop, tablet and phone.
- **Browser support:** current Chrome, Edge, Safari, Firefox.
- **Observability:** error logging, request IDs on every incident, health check endpoint.

### Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| False sense of safety if alerts fail silently | Strict delivery-state model (FR-S11), helpline fallback (FR-S13), prominent "pilot" notice until officially adopted |
| Misuse of SOS | Rate limit, confirmation, false-alarm review (FR-S14) |
| Location privacy | Permission-only capture, limited visibility, retention policy |
| Low adoption | Seed with real notices, Hindi support, staff publish only here |
| Hackathon time overrun | Strict P0 first, P1 and P2 behind a checklist |

### Milestones

1. **Day 1:** project setup, auth, roles, database, design system, seeded data.
2. **Day 2:** Safety module end to end, notices, notification centre.
3. **Day 3:** academics, events, clubs, communication, admin dashboards.
4. **Day 4:** PWA, accessibility, security review, tests, deployment, demo script.
