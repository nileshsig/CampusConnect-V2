"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Calendar,
  Bell,
  Clock,
  MapPin,
  Sparkles,
  Users,
  AlertTriangle,
  ArrowRight,
  HeartHandshake,
  FolderOpen,
  CreditCard,
  Contact,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SOSFlowModal } from "@/components/safety/sos-flow-modal";

export default function StudentHomePage() {
  const { currentUser, timetable, notices, events, clubs, activeIncident, feeRecords } = useApp();
  const [sosOpen, setSosOpen] = useState(false);

  const urgentNotice = notices.find((n) => n.is_urgent);
  const myClubs = clubs.filter((c) => c.user_membership_status === "active");

  const myPendingFees = feeRecords.filter(
    (f) => f.student_id === currentUser.id && f.status !== "paid"
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome and Emergency SOS Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink">
              Welcome, {currentUser.full_name}
            </h1>
            <p className="text-sm text-muted mt-0.5">
              Roll No: {currentUser.roll_no} • {currentUser.hostel}
            </p>
          </div>

          <button
            onClick={() => setSosOpen(true)}
            className="bg-emergency text-surface font-heading font-bold text-sm px-6 py-3 rounded-button flex items-center justify-center gap-2 hover:bg-opacity-95 transition-colors self-start sm:self-auto min-h-[44px]"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Send alert</span>
          </button>
        </div>

        {/* Active Emergency Tracker if student has an ongoing incident */}
        {activeIncident && (
          <div className="p-4 bg-[#FDF2F2] border border-[#F8D7DA] rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-emergency mt-1 shrink-0 animate-pulse" />
              <div>
                <p className="text-xs font-mono font-bold text-ink">{activeIncident.public_id}</p>
                <p className="text-sm font-bold text-emergency">
                  Active Emergency Alert: {activeIncident.category.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-text mt-0.5">{activeIncident.location_text}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={activeIncident.status} />
              <Button size="sm" variant="secondary" onClick={() => setSosOpen(true)}>
                Track alert
              </Button>
            </div>
          </div>
        )}

        {/* Quick Student Access Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/ragging">
            <Card className="p-3.5 hover:border-accent transition-colors flex items-center gap-3">
              <div className="p-2 rounded bg-[#FDF2F2] text-emergency">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Anti-Ragging</p>
                <p className="text-[11px] text-muted">Confidential report</p>
              </div>
            </Card>
          </Link>

          <Link href="/wellness">
            <Card className="p-3.5 hover:border-accent transition-colors flex items-center gap-3">
              <div className="p-2 rounded bg-[#EEF2FB] text-accent">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Mental Health</p>
                <p className="text-[11px] text-muted">Counselor & calm tools</p>
              </div>
            </Card>
          </Link>

          <Link href="/directory">
            <Card className="p-3.5 hover:border-accent transition-colors flex items-center gap-3">
              <div className="p-2 rounded bg-paper text-ink">
                <Contact className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Faculty Contacts</p>
                <p className="text-[11px] text-muted">Phone & office hours</p>
              </div>
            </Card>
          </Link>

          <Link href="/fees">
            <Card className="p-3.5 hover:border-accent transition-colors flex items-center gap-3">
              <div className="p-2 rounded bg-paper text-ink">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">My Fees</p>
                <p className="text-[11px] text-muted">
                  {myPendingFees.length > 0 ? "1 pending payment" : "All cleared"}
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Urgent Notice Banner */}
        {urgentNotice && (
          <div className="p-4 bg-[#FDF2F2] border border-[#F8D7DA] rounded-card">
            <div className="flex items-center gap-2 text-xs font-bold text-emergency uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Urgent campus notice</span>
            </div>
            <h2 className="text-base font-heading font-bold text-ink">{urgentNotice.title}</h2>
            <p className="text-sm text-text mt-1 leading-relaxed">{urgentNotice.body}</p>
            <div className="mt-3">
              <Link
                href="/notices"
                className="text-xs font-semibold text-emergency hover:underline inline-flex items-center gap-1"
              >
                <span>Read all official notices</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Two Column Grid: Academics Today vs Community Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Today's Timetable */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-heading font-bold text-ink">Today's classes</h2>
              </div>
              <Link href="/today" className="text-xs font-semibold text-accent hover:underline">
                View full week
              </Link>
            </div>

            <div className="space-y-3">
              {timetable.slice(0, 3).map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-muted tabular-nums">
                      {item.course_code}
                    </span>
                    <StatusBadge
                      status={item.status}
                      label={
                        item.status === "moved"
                          ? "Room changed"
                          : item.status === "cancelled"
                          ? "Cancelled"
                          : "Scheduled"
                      }
                    />
                  </div>
                  <h3 className="text-base font-heading font-bold text-ink">
                    {item.course_title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted mt-2">
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {item.starts} - {item.ends}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {item.room}
                    </span>
                  </div>
                  {item.note && (
                    <div className="mt-2 text-xs bg-paper p-2 rounded border border-line text-text">
                      {item.note}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Events and Clubs Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upcoming Events */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-heading font-bold text-ink">Upcoming events</h2>
                </div>
                <Link href="/events" className="text-xs font-semibold text-accent hover:underline">
                  Browse all
                </Link>
              </div>

              {events.slice(0, 2).map((evt) => (
                <Card key={evt.id} className="p-4 space-y-2">
                  <span className="text-xs font-semibold text-accent">{evt.club_name}</span>
                  <h3 className="text-sm font-heading font-bold text-ink">{evt.title}</h3>
                  <p className="text-xs text-muted">{evt.venue}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-line text-xs">
                    <span className="text-muted tabular-nums">
                      {new Date(evt.starts_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Link href="/events">
                      <span className="text-accent font-semibold hover:underline">
                        {evt.user_rsvp_status === "going" ? "Registered" : "Register with details"}
                      </span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* My Clubs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-heading font-bold text-ink">My clubs</h2>
                </div>
                <Link href="/clubs" className="text-xs font-semibold text-accent hover:underline">
                  All clubs
                </Link>
              </div>

              {myClubs.length > 0 ? (
                <div className="space-y-2">
                  {myClubs.map((club) => (
                    <Card key={club.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">{club.name}</p>
                        <p className="text-xs text-muted">{club.members_count} members</p>
                      </div>
                      <Link href="/clubs">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-4 text-center text-xs text-muted">
                  You have not joined any club yet.
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <SOSFlowModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </AppShell>
  );
}
