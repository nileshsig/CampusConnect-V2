"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  BookOpen,
  Bell,
  MessageSquare,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export default function FacultyPage() {
  const { timetable, updateTimetableStatus, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string>("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"scheduled" | "moved" | "cancelled">("moved");

  const myCourses = [
    { code: "CS401", title: "Operating Systems", enrolled: 68, sem: 4 },
    { code: "CS402", title: "Data Structures & Algorithms", enrolled: 72, sem: 4 },
    { code: "CS403", title: "Database Systems Lab", enrolled: 68, sem: 4 },
  ];

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEntryId) {
      updateTimetableStatus(selectedEntryId, status, note);
      setModalOpen(false);
      setNote("");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <h1 className="text-xl font-heading font-bold text-ink">
              Faculty Workspace: {currentUser.full_name}
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Department of Computer Science & Engineering • Teaching Portal
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedEntryId(timetable[0]?.id || "");
              setModalOpen(true);
            }}
            className="gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post class update</span>
          </Button>
        </div>

        {/* My Courses (FR-A5) */}
        <div className="space-y-3">
          <h2 className="text-base font-heading font-bold text-ink">My assigned courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myCourses.map((c) => (
              <Card key={c.code} className="p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-accent">{c.code}</span>
                <h3 className="text-sm font-heading font-bold text-ink">{c.title}</h3>
                <div className="pt-2 border-t border-line flex items-center justify-between text-xs text-muted">
                  <span>Semester {c.sem}</span>
                  <span className="tabular-nums">{c.enrolled} enrolled</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* My Classes Schedule */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-ink">
              Schedule for my classes
            </h2>
            <Link href="/today" className="text-xs text-accent font-semibold hover:underline">
              View timetable
            </Link>
          </div>

          <div className="space-y-3">
            {timetable.slice(0, 3).map((item) => (
              <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-muted">
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
                  <p className="text-sm font-semibold text-ink">{item.course_title}</p>
                  <p className="text-xs text-muted mt-1 tabular-nums">
                    {item.starts} - {item.ends} • {item.room}
                  </p>
                  {item.note && (
                    <p className="text-xs text-text mt-1 bg-paper p-1.5 rounded border border-line">
                      {item.note}
                    </p>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedEntryId(item.id);
                    setStatus(item.status);
                    setNote(item.note || "");
                    setModalOpen(true);
                  }}
                >
                  Edit update
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Modal for posting update */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Post Class Room Change or Notice"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Select class</label>
              <select
                value={selectedEntryId}
                onChange={(e) => setSelectedEntryId(e.target.value)}
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                {timetable.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.course_code}: {tt.course_title} ({tt.starts} - {tt.room})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Class status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "scheduled" | "moved" | "cancelled")
                }
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                <option value="moved">Room changed / Rescheduled</option>
                <option value="cancelled">Cancelled today</option>
                <option value="scheduled">Scheduled normally</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Notice note for students
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Moved to Room 102 for projector presentation"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Post to students</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
