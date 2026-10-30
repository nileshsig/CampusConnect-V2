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
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SOSFlowModal } from "@/components/safety/sos-flow-modal";

export default function StudentHomePage() {
  const { currentUser, timetable, notices, events, clubs, activeIncident } = useApp();
  const [sosOpen, setSosOpen] = useState(false);

  const urgentNotice = notices.find((n) => n.is_urgent);
  const myClubs = clubs.filter((c) => c.user_membership_status === "active");

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

        {/* Urgent Notice Banner (FR-N3) */}
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
          {/* Today's Timetable (FR-A1, FR-A2) */}
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
            {/* Upcoming Events (FR-E1) */}
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
                        {evt.user_rsvp_status === "going" ? "Registered" : "Register"}
                      </span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* My Clubs (FR-C1) */}
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
