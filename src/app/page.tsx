"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ShieldAlert,
  ArrowRight,
  Phone,
  CheckCircle2,
  Calendar,
  Bell,
  Sparkles,
  Users,
  MessageSquare,
  AlertTriangle,
  HeartHandshake,
  Contact,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampusAIAssistant } from "@/components/ai/campus-ai-assistant";

// Client-only dynamic import of 3D Canvas so HTML text renders instantly
const CampusModel = dynamic(
  () => import("@/components/scene/campus-model").then((mod) => mod.CampusModel),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] md:h-[500px] bg-paper border border-line rounded-card flex items-center justify-center text-sm text-muted">
        Loading campus model...
      </div>
    ),
  }
);

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("safety");

  const sectionsList = [
    {
      id: "safety",
      num: "01",
      title: "Safety & Anti-Ragging",
      icon: ShieldAlert,
      text: "Send an alert in under 10 seconds. Choose what happened, share your location, confirm. You see who has picked it up and what they have done.",
      detail:
        "Direct connection to on-duty campus security officers and the Principal Anti-Ragging Committee with anonymous reporting.",
    },
    {
      id: "academics",
      num: "02",
      title: "Academics",
      icon: Calendar,
      text: "Today's classes, room changes, deadlines and exam seats. When a class moves, you get told straight away.",
      detail:
        "Faculty post updates once. Timetable adjustments update for every enrolled student with clear notification banners.",
    },
    {
      id: "notices",
      num: "03",
      title: "Notices & Documents",
      icon: Bell,
      text: "One official list for the whole university. Urgent notices stay at the top. You only see notices meant for your course, year and department.",
      detail:
        "Categorized by holidays, exam schedules, placement records, study materials, and rules & regulations.",
    },
    {
      id: "events",
      num: "04",
      title: "Events",
      icon: Sparkles,
      text: "See what is on this month. Register, cancel, or add it to your calendar. If an event is full, you join the waiting list.",
      detail:
        "Automated capacity caps and waiting lists promote students when spots open. Calendar invites download in one tap.",
    },
    {
      id: "clubs",
      num: "05",
      title: "Clubs",
      icon: Users,
      text: "Literature, sports, science, art, NSS, NCC, yoga and more. Join in one tap. Club leads post updates and events on their own page.",
      detail:
        "Dedicated group spaces for university societies, membership lists, and society announcements without external noise.",
    },
    {
      id: "messages",
      num: "06",
      title: "Messages & Wellness",
      icon: MessageSquare,
      text: "Write to your teachers, advisors and club leads. Access confidential mental health and student counseling support.",
      detail:
        "Structured communication respecting campus boundaries. Includes confidential psychologist bookings and 24/7 helplines.",
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-text flex flex-col">
      {/* 1. STICKY NAVIGATION (Section 6.6) */}
      <header className="sticky top-0 z-40 bg-surface border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-heading font-extrabold text-xl text-ink tracking-tight">
              Campus Connect
            </Link>
            <span className="hidden lg:inline text-xs font-medium px-2 py-0.5 rounded bg-paper border border-line text-muted">
              Vinoba Bhave University, Hazaribagh
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <a href="#safety-detail" className="hover:text-ink transition-colors">
              Safety
            </a>
            <a href="#whats-inside" className="hover:text-ink transition-colors">
              What's inside
            </a>
            <a href="#who-its-for" className="hover:text-ink transition-colors">
              Who it's for
            </a>
            <Link href="/directory" className="hover:text-ink transition-colors">
              Faculty contacts
            </Link>
            <Link href="/documents" className="hover:text-ink transition-colors">
              Documents
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-semibold text-ink px-3 py-2 rounded-button hover:bg-paper transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/student"
              className="bg-ink text-surface text-sm font-semibold px-4 py-2 rounded-button hover:bg-opacity-95 transition-colors"
            >
              Open app
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (~90vh) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface border border-line text-xs font-semibold text-ink">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Official Student &amp; Staff Portal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-heading font-extrabold text-ink leading-[1.08] tracking-tight">
            Campus news, classes and help in one app.
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-xl">
            Check today's timetable, read official notices, join a club, access anti-ragging support, or send an alert to campus security. Sign in with your university email.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/signin">
              <Button size="lg" className="gap-2">
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#whats-inside">
              <Button variant="secondary" size="lg">
                See what's inside
              </Button>
            </a>
          </div>

          <div className="pt-3 border-t border-line">
            <p className="text-xs text-muted flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emergency shrink-0" />
              <span>
                <strong>Until the university adopts this app, also call campus security in an emergency.</strong>
              </span>
            </p>
          </div>
        </div>

        {/* 3D Model on Right */}
        <div className="w-full lg:w-7/12">
          <div className="bg-surface border border-line rounded-card p-3 shadow-none overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-line mb-2">
              <span className="text-xs font-heading font-bold text-ink uppercase tracking-wider">
                Interactive Campus Model
              </span>
              <span className="text-xs text-muted">Point at any building to explore</span>
            </div>
            <CampusModel
              activeSection={activeSection}
              onSelectBuilding={(id) => {
                setActiveSection(id);
                const el = document.getElementById(`entry-${id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM (~50vh) - Asymmetric, large block of plain text, no cards */}
      <section className="bg-surface border-y border-line py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="text-xs font-heading font-bold text-accent uppercase tracking-widest">
            The problem
          </span>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-ink leading-snug">
            Right now, campus information is spread across WhatsApp groups, notice boards, email and word of mouth. A class moves to another room and you find out when you get there. An urgent notice goes out and half the batch misses it.
          </p>
          <p className="text-lg text-muted pt-2 border-t border-line">
            Staff answer the same question in five places.
          </p>
        </div>
      </section>

      {/* 4. WHAT'S INSIDE (Long, scrolls with campus model interaction) */}
      <section id="whats-inside" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="text-xs font-heading font-bold text-accent uppercase tracking-widest">
            Overview
          </span>
          <h2 className="text-3xl font-heading font-bold text-ink mt-2">What's inside</h2>
          <p className="text-muted text-base mt-1">
            Integrated sections covering all aspects of daily university life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            const isHovered = activeSection === sec.id;
            return (
              <div
                key={sec.id}
                id={`entry-${sec.id}`}
                onMouseEnter={() => setActiveSection(sec.id)}
                className={`p-6 rounded-card border transition-all duration-150 ${
                  isHovered
                    ? "bg-surface border-accent"
                    : "bg-surface border-line hover:border-accent"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-muted tabular-nums">
                    {sec.num}
                  </span>
                  <div
                    className={`p-2 rounded ${
                      sec.id === "safety" ? "bg-[#FDF2F2] text-emergency" : "bg-paper text-ink"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-ink mb-2">{sec.title}</h3>
                <p className="text-sm text-text leading-relaxed font-medium mb-3">{sec.text}</p>
                <p className="text-xs text-muted leading-relaxed border-t border-line pt-3">
                  {sec.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SAFETY IN DETAIL (~140vh) */}
      <section id="safety-detail" className="bg-surface border-y border-line py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Plain text numbered steps */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-xs font-heading font-bold text-emergency uppercase tracking-widest">
                  Emergency Pipeline
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mt-2">
                  Campus Safety in detail
                </h2>
                <p className="text-muted text-base mt-2">
                  Built to work under stress. An accountable route from the student to a responder in under 10 seconds.
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-paper border border-line rounded-card">
                  <span className="text-xs font-heading font-bold text-ink">Step 1</span>
                  <p className="text-base font-semibold text-ink mt-1">
                    1. You pick what happened and share where you are.
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Six large buttons. Location is captured with browser permission, or you enter your building manually.
                  </p>
                </div>

                <div className="p-4 bg-paper border border-line rounded-card">
                  <span className="text-xs font-heading font-bold text-ink">Step 2</span>
                  <p className="text-base font-semibold text-ink mt-1">
                    2. Security and your hostel or department contact get the alert.
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Dispatched straight away to on-duty security officers and designated resident advisors.
                  </p>
                </div>

                <div className="p-4 bg-paper border border-line rounded-card">
                  <span className="text-xs font-heading font-bold text-ink">Step 3</span>
                  <p className="text-base font-semibold text-ink mt-1">
                    3. An officer confirms and you see their name.
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Live updates show responder acknowledgement and notes as they head to your location.
                  </p>
                </div>
              </div>

              <div className="p-4 border-l-4 border-accent bg-[#EEF2FB] rounded-r">
                <p className="text-sm font-semibold text-ink">
                  The app shows "received" only after security has actually received it.
                </p>
              </div>
            </div>

            {/* Right Column: ProductCrop of Alert Status Screen */}
            <div className="lg:col-span-6">
              <div className="bg-surface border-2 border-line rounded-card p-6 shadow-none">
                <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emergency" />
                    <span className="text-sm font-heading font-bold text-ink">
                      Alert status (Demo preview)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted">
                    INC-20261031-0012
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-paper border border-line rounded">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Status:</span>
                      <span className="font-bold text-accent">Acknowledged</span>
                    </div>
                    <p className="text-sm font-semibold text-ink mt-1">
                      The designated responder has seen your alert and is on the way.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs border-l-2 border-line pl-4 py-1">
                    <div>
                      <p className="font-semibold text-ink">Security received your alert at 10:42</p>
                      <p className="text-muted">Delivered to Central Gate Security Console</p>
                    </div>
                    <div>
                      <p className="font-semibold text-ink">Alert saved</p>
                      <p className="text-muted">Recorded on university server</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-paper border border-line rounded font-medium text-ink">
                      Security: 06546-261234
                    </div>
                    <div className="p-2.5 bg-[#FDF2F2] border border-[#F8D7DA] rounded font-bold text-emergency">
                      Emergency: 112
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHO IT'S FOR */}
      <section id="who-its-for" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <span className="text-xs font-heading font-bold text-accent uppercase tracking-widest">
            Roles
          </span>
          <h2 className="text-3xl font-heading font-bold text-ink mt-2">Who it's for</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <div className="p-6 bg-surface border border-line rounded-card">
              <h3 className="text-xl font-heading font-bold text-ink mb-2">Students</h3>
              <p className="text-sm text-text leading-relaxed">
                Open the app to see today's classes, new notices, events, and fees. File anti-ragging reports or send an alert if you need help.
              </p>
            </div>

            <div className="p-6 bg-surface border border-line rounded-card md:mt-4">
              <h3 className="text-xl font-heading font-bold text-ink mb-2">
                Principal and leadership
              </h3>
              <p className="text-sm text-text leading-relaxed">
                Lead the anti-ragging squad, oversee campus safety alerts, manage admissions and student fee records from one executive dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-6 md:pt-8">
            <div className="p-6 bg-surface border border-line rounded-card">
              <h3 className="text-xl font-heading font-bold text-ink mb-2">Faculty</h3>
              <p className="text-sm text-text leading-relaxed">
                Post a class change once. Students see it and confirm they have read it. Share study materials and update consultation hours.
              </p>
            </div>

            <div className="p-6 bg-surface border border-line rounded-card">
              <h3 className="text-xl font-heading font-bold text-ink mb-2">
                Administrators and the registrar's office
              </h3>
              <p className="text-sm text-text leading-relaxed">
                Send a notice to one department or the whole campus. See who has read it. Manage events, clubs and safety alerts from one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLOSING (~60vh) */}
      <section className="bg-surface border-t border-line py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-ink tracking-tight">
            Sign in and check today.
          </h2>
          <p className="text-base text-muted">
            Everything on campus, in one place. One sign-in for students, teachers, administrators and university leadership.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link href="/signin">
              <Button size="lg" className="min-w-[160px]">
                Sign in
              </Button>
            </Link>
            <Link href="/student">
              <Button variant="secondary" size="lg" className="min-w-[160px]">
                Demo view
              </Button>
            </Link>
          </div>

          <div className="pt-8 border-t border-line max-w-md mx-auto text-xs text-muted space-y-1">
            <p className="font-semibold text-ink">Campus Security Helpline: 06546-261234</p>
            <p>Anti-Ragging Helpline: 1800-180-5522 • Tele-MANAS: 14416</p>
            <p>Vinoba Bhave University, Hazaribagh, Jharkhand 825301</p>
          </div>
        </div>
      </section>

      {/* 8. FOOTER - One row, small type */}
      <footer className="border-t border-line py-6 bg-paper text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Vinoba Bhave University, Hazaribagh</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-ink">
              Privacy and consent
            </Link>
            <a href="tel:06546261234" className="hover:text-ink">
              Helpline: 06546-261234
            </a>
            <span>Campus Connect 2026</span>
          </div>
        </div>
      </footer>
      <CampusAIAssistant />
    </div>
  );
}
