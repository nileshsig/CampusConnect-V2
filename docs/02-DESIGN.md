# Campus Connect: Design Document (Part 2 - DESIGN)

The website is light, plain and easy to scan, like a well-made printed timetable. It has one showpiece: a 3D model of the campus that people can turn, hover and click. Everything else is type, whitespace and real screenshots of the app. Colour, type and spacing below are the only values agents may use.

## 6.1 Design principles

1. **Read first.** Students read notices and timetables for long stretches. Text size, line length and contrast come before decoration.
2. **Say it plainly.** Buttons say what happens: Send alert, Publish notice, Register. Errors say what went wrong and what to do next.
3. **Calm by default, urgent when it matters.** Red appears only on the alert button, urgent notices and critical status.
4. **3D with a job.** The model shows how the campus and the six sections connect. The app works fully without it.
5. **Usable under stress.** Large tap targets, few steps, no hidden gestures in the alert flow.
6. **Built for the people using it.** No technical words in anything a user reads (see Section 6.10).

**Rules that override everything else in this section.** If a component or layout breaks one of these, change the component.

| Area | Do not build | Build this instead |
| --- | --- | --- |
| Layout | Rows of three identical cards with an icon box above each. Every section the same height. Everything centred | Asymmetric layouts: narrow text column against a wide visual, a long section followed by a short one, left-aligned text. Sections are as tall as their content needs |
| Decoration | Glowing or blurred blobs, gradient mesh backgrounds, floating translucent circles, particle or line patterns, glass panels, heavy shadows | A flat paper-coloured background. Separation comes from whitespace and 1 px lines. No shadows on the landing page |
| Imagery | Stock photos (handshakes, smiling groups, server rooms), floating clay or 3D icons, generic illustrations | The campus model, cropped screenshots of the real app with demo data, large type, empty space |
| Colour | Rainbow or gradient buttons, a different colour per module | One anchor colour, one light neutral, one accent (Section 6.2) |
| Copy | Marketing phrases, vague claims, banned words (Section 6.10) | Short, direct sentences that state what the app does |
| Motion | Fade-in-up on every line, staggered reveals, slow parallax layers, looping animations | Instant content. Short feedback on hover, focus and press. One camera move in the 3D model |

## 6.2 Colour and typography tokens

**Colour.** One anchor, one neutral set, one accent. Light theme only for version 1.

| Token | Value | Use |
| --- | --- | --- |
| ink (anchor) | #152A4E | Headings, primary buttons, sidebar, the model's roofs and details |
| paper | #F7F8FA | Page background |
| surface | #FFFFFF | Cards, inputs, modals, the model's walls |
| line | #E1E5EB | Dividers and outlines |
| text | #1B2433 | Body text |
| muted | #5A6574 | Secondary text (at least 4.5:1 on white and on paper) |
| accent | #2A56C6 | Links, focus ring, active tab, the highlighted building in the model |
| emergency | #C62828 | The alert button, urgent notices and critical status only. A safety signal, not a brand colour. It never appears in the 3D model or in section decoration |

Rules:
- Pages use ink, paper, surface, line, text, muted and the accent. Nothing else.
- Status inside the app (submitted, in progress, resolved) is shown with a word and a small shape in ink, accent or muted. Never rely on colour alone.
- No gradients anywhere. No tinted section backgrounds. Alternate paper and surface if a break is needed.
- Dark mode is a P2 item after launch.

**Typography.** Modern sans-serif only. No serif, script, rounded or decorative faces.

| Role | Typeface | Notes |
| --- | --- | --- |
| Headings and page titles | Manrope (700, 800) | Geometric and clean. Tight tracking (-0.02em) on large sizes |
| Interface, body, forms, tables | Inter (400, 500, 600) | Tabular numbers for times, room numbers and reference numbers |
| Hindi text | Noto Sans Devanagari (400, 600) | Used for both headings and body in Hindi |
| Fallbacks | system-ui, sans-serif | Used if fonts fail to load |

Load fonts with `next/font` (self-hosted, swap display, latin and devanagari subsets) to avoid layout shift.

| Style | Size / line height | Weight |
| --- | --- | --- |
| Display (landing hero only) | 56 / 60 px desktop, 38 / 42 px mobile | 800 Manrope |
| H1 | 36 / 42 px | 700 Manrope |
| H2 | 26 / 32 px | 700 Manrope |
| H3 | 20 / 28 px | 600 Inter |
| Body | 16 / 26 px (never below 16 on mobile) | 400 Inter |
| Reading text (notice detail, academic updates, club descriptions) | 17 / 28 px, max 68 characters wide | 400 Inter |
| Small and captions | 14 / 20 px | 400 or 500 Inter |
| Buttons and labels | 15 / 20 px | 600 Inter |

- Left-aligned text only, never justified. Sentence case for headings and buttons. No long runs of capitals.
- Bold for emphasis. No italics for emphasis. Underline is for links only.
- Maximum three font sizes in any one card.

**Shape and spacing.** 4-point grid (4, 8, 12, 16, 24, 32, 48, 64, 96). Radius 6 for inputs and buttons, 8 for cards and modals. Cards use a 1 px line border and no shadow. Modals get one soft shadow (0 8px 24px rgba(21,42,78,0.12)). Nothing else gets a shadow.

**Motion.**
- Hover, focus and press feedback: 120 to 160 ms.
- Menus, dialogs and tabs: 200 ms at most.
- Text, cards, images and sections are visible at first paint. No entrance animations.
- The only long motion is the 3D model's camera move (about 600 ms, ease-out) when the module changes.
- Respect reduced-motion: replace every move with an instant change.

## 6.3 Component library (build once, reuse everywhere)

AppShell (sidebar on desktop, bottom tabs on mobile), PageHeader, Card, StatCard, Button (primary, secondary, danger, ghost), Input, Select, Textarea, FileUpload, DataTable with filters, Badge, StatusBadge (word plus shape), Timeline, Modal, ConfirmDialog, Toast, EmptyState, Skeleton, NotificationBell, SearchBox, RoleGuard, SOSButton, IncidentCard, NoticeCard, EventCard, ClubCard, ChatThread, ReadingText (long-form wrapper), CampusModel (the 3D canvas), ModuleIndex (the landing page's module list linked to the model), ProductCrop (a cropped, framed screenshot of a real screen).

Not in the library, on purpose: tilt cards, icon boxes, glass panels, gradient buttons.

## 6.4 Screen inventory

Screen titles shown to users are plain: Home, Today, Notices, Events, Clubs, Messages, Alerts, Safety, Profile. Names like "dashboard" or "incident" are for code only.

| Area | Screens |
| --- | --- |
| Public | Landing page with the 3D campus model, sign in, create account with college email, forgot password, privacy and consent |
| Student | Home, timetable, assignments and exams, notices, notice detail, lost and found, events, event detail, clubs, club page, messages, safety (send alert, reports, track an alert), alerts inbox, profile and settings |
| Faculty | Home, my courses, post a class update, schedule editor, notices, messages, student safety reports (permitted) |
| Admin | Overview, users, roles and permissions, notices, academics, events, clubs, safety alerts, alert detail, reports to review, numbers (analytics), activity record, settings |
| Security | Alerts assigned to me, alert detail with map and notes, status update, shift view |

## 6.5 SOS flow specification

1. Student taps the red **Send alert** button on Home or in the bottom bar.
2. Screen 1, "What happened?": six large buttons (Medical emergency, Personal safety, Harassment, Accident, Security issue, Other). Optional short description.
3. Screen 2, "Where are you?": a **Share my location** button (the browser asks permission). Always offer a text field to type the building or gate instead.
4. Screen 3, "Check and send": a summary of what will be sent and who will see it. Buttons: **Send alert** and **Cancel**.
5. Screen 4, "Alert status": a reference number, the truthful status, then each update as a timeline.
6. Always visible on this screen: **Call campus security** and **Call emergency services** (tel links).

**Status copy (must match the backend state exactly):**

| Backend state | What the student sees |
| --- | --- |
| saved | Alert saved. Sending it to security now. |
| queued | Not sent yet. We keep trying. If it's urgent, call now. |
| delivered | Security received your alert at 10:42. |
| acknowledged | Officer Singh has seen your alert and is on the way. |
| failed | Your alert did not go through. Call campus security now. |

If a student sends too many alerts in a short time, show: "You've sent several alerts in a few minutes. Call campus security if you still need help."

## 6.6 Landing page with the 3D campus model

**Concept.** A physical-model look, like an architect's table model. A light ground slab holds the campus: the university gate in the middle and five more buildings placed around it, one building per section of the app (Safety, Academics, Notices, Events, Clubs, Messages). Every building sits on the ground. Nothing floats, glows or is see-through. Walls are white, roofs and trim are ink, and the building you point at turns accent blue. The page says one thing: here is your campus, and here is what each part does.

**Buildings and what they stand for.**

| Section | Building |
| --- | --- |
| Safety | The main gate with the security post |
| Academics | The teaching block |
| Notices | The administrative office with a notice board |
| Events | The open-air stage and seating |
| Clubs | The club house and sports ground |
| Messages | The library with a small clock tower |

**Page structure (top to bottom).** Sections are deliberately different heights and layouts. Do not repeat the same card pattern twice.

| Section | Layout and content | Interaction |
| --- | --- | --- |
| Navigation | Wordmark on the left. Links: Safety, What's inside, Who it's for. On the right: Sign in, Create account. Plain background with a 1 px bottom line | Sticky |
| Hero (about 90vh) | Narrow text column on the left, the model on the right, running off the right edge. Headline: **Campus news, classes and help in one app.** Subline: **Check today's timetable, read official notices, join a club, or send an alert to campus security. Sign in with your university email.** Buttons: Sign in, See what's inside. A one-line note under the buttons: **Until the university adopts this app, also call campus security in an emergency.** | Drag to turn the model within a limited angle. Hover a building to see its name |
| The problem (about 50vh) | One large block of text, no cards. **Right now, campus information is spread across WhatsApp groups, notice boards, email and word of mouth. A class moves to another room and you find out when you get there. An urgent notice goes out and half the batch misses it.** Below it, one plain line: **Staff answer the same question in five places.** | None |
| What's inside (long, scrolls with the model) | The model stays fixed on the left (about 55% width). On the right, six entries of different lengths, listed down the page. Each has a number, a name, and 2 to 4 sentences. The section about Safety is the longest and includes a ProductCrop of the alert status screen. Others may include a small ProductCrop (timetable, notice list, event page) or none | When an entry scrolls into view, the model's camera moves to that building. Hovering a building highlights its entry. Clicking a building scrolls to its entry. Clicking an entry name moves the camera |
| Safety in detail (about 140vh) | Left: three short numbered steps in plain text. Right: the ProductCrop of the alert status screen. Steps: **1. You pick what happened and share where you are. 2. Security and your hostel or department contact get the alert. 3. An officer confirms and you see their name.** Under the steps: **The app shows "received" only after security has actually received it.** | None. No pulse, no red glow |
| Who it's for (short) | Four blocks of unequal length, set in two staggered columns, each with a bold role name and 1 to 3 sentences. No tabs, no icons | None |
| Closing (about 60vh) | Large type: **Sign in and check today.** Under it: the security helpline number and the university address | None |
| Footer | University name, privacy, contact, security helpline. One row, small type | None |

**Copy for the entries in "What's inside".**

1. **Safety.** Send an alert in under 10 seconds. Choose what happened, share your location, confirm. You see who has picked it up and what they have done.
2. **Academics.** Today's classes, room changes, deadlines and exam seats. When a class moves, you get told straight away.
3. **Notices.** One official list for the whole university. Urgent notices stay at the top. You only see notices meant for your course, year and department.
4. **Events.** See what is on this month. Register, cancel, or add it to your calendar. If an event is full, you join the waiting list.
5. **Clubs.** Literature, sports, science, art, NSS, NCC, yoga and more. Join in one tap. Club leads post updates and events on their own page.
6. **Messages.** Write to your teachers, advisors and club leads. Block or report anyone who bothers you.

**Who it's for (copy).**

- **Students.** Open the app to see today's classes, new notices and events. Send an alert if you need help.
- **Faculty.** Post a class change once. Students see it and confirm they have read it.
- **Administrators and the registrar's office.** Send a notice to one department or the whole campus. See who has read it. Manage events, clubs and safety alerts from one place.
- **Security.** See the alerts assigned to you, with the location. Confirm, add notes, and close them in the app.

**3D model behaviour.**
- Tech: React Three Fiber with drei and three.js, loaded with a client-only dynamic import so the page text renders first.
- Build the first version from simple code geometry (boxes, extrusions, flat colours from the palette). Optionally replace it with a compressed GLB model under 1.5 MB later. Keep the same restrained look.
- Lighting: one soft ambient light and one directional light, with a simple contact shadow under each building. No bloom, no glow, no transparency, no particles, no lines drawn in the air. Ground paths between buildings are flat strips on the slab.
- Interaction: drag to rotate within about 40 degrees left and right and a small tilt up and down. No zoom, so page scrolling is never captured. Hover or tap on a building shows its name as a small HTML label and turns it accent blue. A small raise (0.1 units) on hover is allowed. Click scrolls to the matching entry.
- Scroll: the camera moves between six saved positions, one per building, plus the overview. Normal scrolling is never blocked.
- Idle: the model is still. No floating, no spinning. The scene stops rendering when idle and when the tab is hidden.

**Performance, accessibility and fallbacks (all required).**
- Hero text, buttons and navigation are real HTML and visible before the canvas loads. The canvas is decorative: `aria-hidden`. The six sections are reachable as normal links and buttons.
- Cap pixel ratio at 1.75. Render only when something changes. Free memory when the page unmounts.
- Show a still image of the model (WebP or SVG, same camera angle) when 3D is not supported, on low-power or data-saver devices, or when loading fails. The page must look finished with the still image.
- Reduced motion: no camera animation. The camera jumps to the selected building. Dragging still works.
- Mobile: a simpler model (fewer details), touch drag within a limited angle, canvas height 55vh, and it never traps vertical page scroll. The "What's inside" entries sit below the model in one column and the camera still follows the entry in view.
- Targets on a mid-range phone: largest content paint under 2.5 seconds, Lighthouse mobile performance 85 or higher, accessibility 95 or higher, no layout shift from the canvas (reserve its size).

## 6.7 Responsive layout

| Width | Layout |
| --- | --- |
| Under 640 px (phone) | Single column. Bottom tab bar in the app, floating **Send alert** button for students. Landing: text first, then the 55vh model, then the entries |
| 640 to 1023 px (tablet) | Collapsible sidebar in the app. Landing: model above the text, entries in one wide column |
| 1024 to 1439 px (laptop) | Fixed 240 px sidebar, content up to 1100 px. Landing: text left, model right; "What's inside" with the model fixed on the left |
| 1440 px and up (desktop) | Same layout, wider gutters, content max width 1200 px |

## 6.8 Accessibility checklist

Visible focus ring (accent, 3 px), text contrast at least 4.5:1, a label on every input, status never shown by colour alone, a live region for toasts and alert status, full keyboard support in dialogs, alt text on images, reduced-motion respected, the 3D model never required to use any feature, Hindi and English both tested.

## 6.9 Guiding the agent: skills and MCP servers

Skills: campus-design, landing-3d, plain-copy-check, supabase-rbac, a11y-check, test-writer, git-workflow, pr-review.

## 6.10 Website copy and plain-language rules

Voice: Write like a person talking to a peer. Short sentences. Active voice. Say "you" and "we". Say what the feature does and who it is for. Use real examples.

Banned words: delve, revolutionize, revolutionary, seamless, seamlessly, testament, beacon, unlock, unlock your potential, navigating the landscape, cutting-edge, state-of-the-art, next-generation, game-changer, supercharge, elevate, empower, leverage, streamline, robust, ecosystem, journey, world-class, holistic, reimagine, digital front door, all-in-one platform, "in today's fast-paced world".

Technical words to replace:
- GPS, geolocation -> Your location
- Push notification, notification -> Alert (on your phone), or message in your inbox
- Real-time, live sync -> Straight away, as it happens
- Incident, incident ID -> Alert (for emergencies), report (for non-emergencies), reference number
- Dashboard -> Home, or Overview (for admin)
- Login, authenticate, session -> Sign in, sign out
- Role, permissions, role-based access -> Your account type. "You only see what is meant for you"
- Audit log, audit trail -> Activity record. "Every update is recorded"
- PWA, install app -> Add to home screen
- Offline mode, cache -> Works with a weak connection
- Queued, retry -> Waiting to send, we keep trying
- Delivery state, delivered -> Received by security
- Rate limit, throttled -> "You've done this several times in a short while. Try again in a few minutes"
- Upload, attachment -> Add a file
- ICS, calendar export -> Add to calendar
- CSV import -> Upload a spreadsheet
- Analytics, metrics -> Numbers
- Moderation queue -> Reports to review
- Escalation -> Sent to the administrator
- API, server, database, token, WebGL, error 500, null, undefined, exception -> Never shown.
