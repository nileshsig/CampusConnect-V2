"use client";

import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  Phone,
  Calendar,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  CheckCircle,
  Wind,
  BookOpen,
  Lock,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function MentalHealthPage() {
  const { mentalHealthBookings, bookCounselorSession, moodLogs, logMood, currentUser } = useApp();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"counselor" | "peer_buddy" | "anonymous_chat">("counselor");
  const [preferredSlot, setPreferredSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Mood state
  const [selectedMood, setSelectedMood] = useState<"calm" | "good" | "stressed" | "overwhelmed">("good");
  const [moodNote, setMoodNote] = useState("");
  const [moodSaved, setMoodSaved] = useState(false);

  // Interactive Breathing Exercise State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Breathe In" | "Hold" | "Breathe Out">("Breathe In");
  const [breathTimer, setBreathTimer] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev > 1) return prev - 1;
          if (breathPhase === "Breathe In") {
            setBreathPhase("Hold");
            return 7;
          } else if (breathPhase === "Hold") {
            setBreathPhase("Breathe Out");
            return 8;
          } else {
            setBreathPhase("Breathe In");
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredSlot) return;

    bookCounselorSession({
      booking_type: bookingType,
      preferred_slot: preferredSlot,
      notes,
    });

    setBookingModalOpen(false);
    setPreferredSlot("");
    setNotes("");
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const handleLogMood = (e: React.FormEvent) => {
    e.preventDefault();
    logMood(selectedMood, moodNote);
    setMoodSaved(true);
    setMoodNote("");
    setTimeout(() => setMoodSaved(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-heading font-bold text-ink">
                Mental Health & Student Wellness
              </h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Confidential psychological support, counseling sessions, stress reduction tools, and 24/7 helplines.
            </p>
          </div>

          <Button
            onClick={() => setBookingModalOpen(true)}
            className="gap-2 self-start sm:self-auto min-h-[44px]"
          >
            <Calendar className="w-4 h-4" />
            <span>Book counseling session</span>
          </Button>
        </div>

        {/* 24/7 Free Helplines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-[#EEF2FB] border border-line space-y-2">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              National Mental Health Helpline (Tele-MANAS)
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-heading font-bold text-ink tabular-nums">14416</p>
                <p className="text-xs text-muted">Or Toll-Free: 1800-891-4416 (24/7 in English & Hindi)</p>
              </div>
              <a
                href="tel:14416"
                className="p-3 bg-accent text-surface rounded-full hover:bg-opacity-90"
                title="Call Tele-MANAS"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </Card>

          <Card className="p-4 bg-surface border border-line space-y-2">
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              Campus Psychologist & Wellness Counselor
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-ink">Dr. Sunita Roy</p>
                <p className="text-xs text-muted">Health Centre Room 12 • Mon-Fri 9:00 AM - 5:00 PM</p>
                <p className="text-xs text-accent font-semibold mt-0.5">counselor@vbu.ac.in</p>
              </div>
              <a
                href="tel:09876543299"
                className="p-3 bg-paper border border-line text-ink rounded-full hover:border-accent"
                title="Call Campus Counselor"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </Card>
        </div>

        {bookingSuccess && (
          <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>
              Your counseling session request has been received. The counselor will confirm your slot via university email.
            </span>
          </div>
        )}

        {/* Two Column Layout: Interactive Breathing Tool + Daily Mood Check-In */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calming Breathing Exercise Tool */}
          <Card className="p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-4 h-4 text-accent" />
                <h2 className="text-base font-heading font-bold text-ink">
                  Quick Calm: 4-7-8 Breathing Exercise
                </h2>
              </div>
              <p className="text-xs text-muted">
                Proven practice to ease pre-exam nervousness, panic, and racing thoughts.
              </p>
            </div>

            <div className="py-8 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 ${
                  breathingActive
                    ? breathPhase === "Breathe In"
                      ? "border-accent bg-[#EEF2FB] scale-110"
                      : breathPhase === "Hold"
                      ? "border-ink bg-paper scale-105"
                      : "border-muted bg-surface scale-95"
                    : "border-line bg-paper"
                }`}
              >
                <span className="text-sm font-heading font-bold text-ink">{breathPhase}</span>
                <span className="text-2xl font-bold text-accent tabular-nums mt-1">
                  {breathingActive ? breathTimer : "4"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-line flex justify-center">
              <Button
                variant={breathingActive ? "secondary" : "primary"}
                onClick={() => {
                  setBreathingActive(!breathingActive);
                  setBreathPhase("Breathe In");
                  setBreathTimer(4);
                }}
              >
                {breathingActive ? "Stop exercise" : "Start 2-minute breathing"}
              </Button>
            </div>
          </Card>

          {/* Daily Mood Check-In */}
          <Card className="p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Smile className="w-4 h-4 text-accent" />
                <h2 className="text-base font-heading font-bold text-ink">Daily Wellness Check-in</h2>
              </div>
              <p className="text-xs text-muted">
                Take a moment to reflect on how you are feeling today.
              </p>
            </div>

            <form onSubmit={handleLogMood} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "calm" as const, label: "Calm", icon: Smile },
                  { key: "good" as const, label: "Good", icon: Smile },
                  { key: "stressed" as const, label: "Stressed", icon: Meh },
                  { key: "overwhelmed" as const, label: "Overwhelmed", icon: Frown },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedMood(item.key)}
                    className={`p-3 rounded border text-left flex items-center gap-2 text-xs font-semibold transition-colors ${
                      selectedMood === item.key
                        ? "bg-[#EEF2FB] border-accent text-accent"
                        : "bg-surface border-line text-text hover:bg-paper"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Reflection note (optional)
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="What is on your mind today?"
                  rows={2}
                  className="w-full p-2.5 bg-surface border border-line rounded-input text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {moodSaved ? (
                  <span className="text-xs text-accent font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Checked in!
                  </span>
                ) : (
                  <span className="text-xs text-muted">Your logs stay private</span>
                )}
                <Button type="submit" size="sm">
                  Save check-in
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Self-Help Guides */}
        <div className="space-y-3 pt-4 border-t border-line">
          <h2 className="text-base font-heading font-bold text-ink">Campus Wellness Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 space-y-2">
              <h3 className="text-sm font-heading font-bold text-ink">Managing Exam Pressure</h3>
              <p className="text-xs text-muted leading-relaxed">
                Break study sessions into 25-minute blocks. Avoid all-night cramming before morning exams.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="text-sm font-heading font-bold text-ink">Hostel Sleep Hygiene</h3>
              <p className="text-xs text-muted leading-relaxed">
                Keep screens off 30 minutes before sleep. Consistent sleep hours reduce morning fatigue.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="text-sm font-heading font-bold text-ink">Peer Support Circles</h3>
              <p className="text-xs text-muted leading-relaxed">
                Connect with resident advisors or departmental senior peers when experiencing homesickness.
              </p>
            </Card>
          </div>
        </div>

        {/* Counseling Booking Modal */}
        <Modal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          title="Schedule Confidential Counseling"
        >
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="p-3 bg-[#EEF2FB] rounded border border-line text-xs text-ink flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent shrink-0" />
              <span>
                All conversations are strictly confidential and protected under university counseling ethics.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Session Type</label>
              <select
                value={bookingType}
                onChange={(e) =>
                  setBookingType(e.target.value as "counselor" | "peer_buddy" | "anonymous_chat")
                }
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                <option value="counselor">One-on-One with Campus Counselor</option>
                <option value="peer_buddy">Peer Support Student Buddy</option>
                <option value="anonymous_chat">Anonymous Written Support Request</option>
              </select>
            </div>

            <Input
              label="Preferred Day & Time Window"
              placeholder="e.g. Thursday between 2:00 PM and 4:00 PM"
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                What would you like to discuss? (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Academic stress, personal concerns, sleep difficulties..."
                rows={3}
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm request</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
