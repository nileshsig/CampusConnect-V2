"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Plus,
  CheckCircle,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function EventsPage() {
  const { events, currentUser, toggleRsvp, createEvent, clubs } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("100");
  const [selectedClub, setSelectedClub] = useState("");

  const canCreate = currentUser.role === "admin" || currentUser.is_club_lead;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startsAt) return;

    createEvent({
      title,
      description,
      venue,
      starts_at: new Date(startsAt).toISOString(),
      capacity: parseInt(capacity, 10) || 100,
      club_id: selectedClub || null,
      club_name: clubs.find((c) => c.id === selectedClub)?.name,
      category: "Campus Event",
    });

    setCreateModalOpen(false);
    setTitle("");
    setDescription("");
    setVenue("");
  };

  const downloadIcs = (event: typeof events[0]) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vinoba Bhave University//Campus Connect//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.venue || ""}
DTSTART:${new Date(event.starts_at).toISOString().replace(/[-:]/g, "").slice(0, 15)}Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink">Campus Events</h1>
            <p className="text-sm text-muted">
              Discover hackathons, debates, cultural showcases, and club activities.
            </p>
          </div>

          {canCreate && (
            <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Create event</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => {
            const isGoing = evt.user_rsvp_status === "going";
            const isWaitlist = evt.user_rsvp_status === "waitlist";
            const isFull = (evt.registered_count || 0) >= (evt.capacity || 100);

            return (
              <Card key={evt.id} className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-accent">{evt.club_name || "University"}</span>
                    <span className="text-muted tabular-nums">
                      {new Date(evt.starts_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-ink">{evt.title}</h3>
                  <p className="text-sm text-text leading-relaxed">{evt.description}</p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {evt.venue}
                    </span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {new Date(evt.starts_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Users className="w-3.5 h-3.5 text-accent" />
                      {evt.registered_count || 0} / {evt.capacity || 100} spots filled
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
                  <button
                    onClick={() => downloadIcs(evt)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink transition-colors"
                    title="Add to calendar (.ics file)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Add to calendar</span>
                  </button>

                  <Button
                    size="sm"
                    variant={isGoing ? "secondary" : isWaitlist ? "secondary" : "primary"}
                    onClick={() => toggleRsvp(evt.id)}
                  >
                    {isGoing
                      ? "Cancel registration"
                      : isWaitlist
                      ? "Leave waiting list"
                      : isFull
                      ? "Join waiting list"
                      : "Register"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Create Event Modal (FR-E3) */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Event"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Inter-College Coding Contest"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Hosting club (optional)
              </label>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                <option value="">University General</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Give details about event requirements, timings and judges..."
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
              />
            </div>

            <Input
              label="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Central Auditorium or Senate Lawn"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date & Time"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
              />
              <Input
                label="Attendee Capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="10"
                max="1000"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Publish event</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
