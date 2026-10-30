"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  FileCheck,
  AlertCircle,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export default function AcademicsPage() {
  const { timetable, currentUser, updateTimetableStatus } = useApp();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<"scheduled" | "moved" | "cancelled">("moved");
  const [newNote, setNewNote] = useState("");

  const weekdays = [
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
  ];

  const filteredEntries = timetable.filter((item) => item.weekday === selectedDay);

  const handleUpdate = () => {
    if (editingEntry) {
      updateTimetableStatus(editingEntry, newStatus, newNote);
      setEditingEntry(null);
      setNewNote("");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink">Academics</h1>
            <p className="text-sm text-muted">
              Weekly timetable, class changes, deadlines and exam seating plans.
            </p>
          </div>
        </div>

        {/* Exam Seating Plan Notice (FR-A4) */}
        <div className="p-4 bg-surface border border-line rounded-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-heading font-bold text-ink">
                Mid-Semester Examination Seating Plan
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Semester 4: Allotted Room <strong>204</strong>, Desk <strong>B-14</strong> (Operating Systems & Algorithms).
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-[#EEF2FB] text-accent font-semibold rounded border border-line self-start">
            Desk Verified
          </span>
        </div>

        {/* Weekday Switcher Tabs */}
        <div className="flex border-b border-line gap-2 overflow-x-auto pb-1">
          {weekdays.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                selectedDay === day.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="space-y-3">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((item) => (
              <Card key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
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
                    <span className="text-xs px-2 py-0.5 rounded bg-paper border border-line text-muted capitalize">
                      {item.kind}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-ink">
                    {item.course_title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                    <span className="flex items-center gap-1 tabular-nums font-medium">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {item.starts} - {item.ends}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {item.room}
                    </span>
                  </div>

                  {item.note && (
                    <p className="text-xs bg-paper border border-line p-2 rounded text-text mt-2">
                      <strong>Update:</strong> {item.note}
                    </p>
                  )}
                </div>

                {/* Faculty or Admin Edit Control (FR-A5) */}
                {(currentUser.role === "faculty" || currentUser.role === "admin") && (
                  <div className="self-end md:self-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingEntry(item.id);
                        setNewStatus(item.status);
                        setNewNote(item.note || "");
                      }}
                    >
                      Update class
                    </Button>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="p-8 text-center bg-surface border border-dashed border-line rounded-card text-muted text-sm">
              No classes scheduled for {weekdays.find((w) => w.id === selectedDay)?.label}.
            </div>
          )}
        </div>

        {/* Deadlines Section (FR-A3) */}
        <div className="mt-8 pt-6 border-t border-line space-y-4">
          <h2 className="text-lg font-heading font-bold text-ink">
            Upcoming assignments and deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <span className="text-xs font-mono font-bold text-accent">CS403 Lab</span>
              <h3 className="text-sm font-heading font-bold text-ink mt-1">
                Database Management Journal Write-up
              </h3>
              <p className="text-xs text-muted mt-1">Submit ER-diagram exercises and queries.</p>
              <div className="mt-3 text-xs text-emergency font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Due Friday before 5:00 PM
              </div>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-mono font-bold text-accent">CS401</span>
              <h3 className="text-sm font-heading font-bold text-ink mt-1">
                Process Scheduling Simulation Assignment
              </h3>
              <p className="text-xs text-muted mt-1">Round Robin & Priority Scheduling analysis.</p>
              <div className="mt-3 text-xs text-muted font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Due next Tuesday
              </div>
            </Card>
          </div>
        </div>

        {/* Faculty Modal to Update Class Schedule */}
        <Modal
          isOpen={editingEntry !== null}
          onClose={() => setEditingEntry(null)}
          title="Update Class Status"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value as "scheduled" | "moved" | "cancelled")
                }
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                <option value="scheduled">Scheduled as usual</option>
                <option value="moved">Room changed / Rescheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Notification note for students
              </label>
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Shifted to Room 102 for projector setup"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setEditingEntry(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save update</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
