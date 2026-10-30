"use client";

import React, { useState } from "react";
import { Users, UserCheck, Shield, Plus, CheckCircle, Clock } from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Club } from "@/lib/database.types";

export default function ClubsPage() {
  const { clubs, currentUser, joinClubWithDetails, leaveClub } = useApp();
  const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0]?.id || "");

  // Club Join Modal State (personal details requirement)
  const [joiningClub, setJoiningClub] = useState<Club | null>(null);
  const [joinRollNo, setJoinRollNo] = useState(currentUser.roll_no || "");
  const [joinDept, setJoinDept] = useState("Computer Science & Engineering");
  const [joinSemester, setJoinSemester] = useState(String(currentUser.semester || 4));
  const [joinPhone, setJoinPhone] = useState(currentUser.phone || "");
  const [joinReason, setJoinReason] = useState("");
  const [joinSkills, setJoinSkills] = useState("");
  const [joinSuccessNotice, setJoinSuccessNotice] = useState<string | null>(null);

  const selectedClub = clubs.find((c) => c.id === selectedClubId) || clubs[0];

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningClub || !joinRollNo || !joinPhone || !joinReason) return;

    joinClubWithDetails(joiningClub.id, {
      roll_no: joinRollNo,
      department: joinDept,
      semester: parseInt(joinSemester, 10) || 4,
      phone: joinPhone,
      reason: joinReason,
      skills: joinSkills,
    });

    setJoinSuccessNotice(
      joiningClub.requires_approval
        ? `Application submitted for "${joiningClub.name}". Society lead will review.`
        : `Joined "${joiningClub.name}" as an active member.`
    );
    setJoiningClub(null);
    setJoinReason("");
    setJoinSkills("");
    setTimeout(() => setJoinSuccessNotice(null), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink">Clubs and Activities</h1>
            <p className="text-sm text-muted">
              Join university societies, sports groups, NSS, NCC, and innovation forums.
            </p>
          </div>
        </div>

        {joinSuccessNotice && (
          <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>{joinSuccessNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Clubs Directory List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-heading font-bold text-muted uppercase tracking-wider">
              Student societies ({clubs.length})
            </h2>
            {clubs.map((club) => {
              const isSelected = club.id === selectedClub?.id;
              const isMember = club.user_membership_status === "active";
              const isPending = club.user_membership_status === "pending";

              return (
                <div
                  key={club.id}
                  onClick={() => setSelectedClubId(club.id)}
                  className={`p-4 rounded-card border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-surface border-accent shadow-none"
                      : "bg-surface border-line hover:border-accent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted">{club.category}</span>
                    {isMember && <StatusBadge status="active" label="Member" />}
                    {isPending && <StatusBadge status="pending" label="Approval pending" />}
                  </div>
                  <h3 className="text-base font-heading font-bold text-ink">{club.name}</h3>
                  <p className="text-xs text-muted mt-1 tabular-nums">
                    {club.members_count} active members
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Club Detailed Workspace */}
          {selectedClub && (
            <div className="lg:col-span-7">
              <Card className="p-6 space-y-6">
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                    {selectedClub.category}
                  </span>
                  <h2 className="text-2xl font-heading font-bold text-ink mt-1">
                    {selectedClub.name}
                  </h2>
                  <p className="text-sm text-muted mt-0.5 tabular-nums">
                    {selectedClub.members_count} registered members
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-heading font-bold text-ink">About</h3>
                  <p className="text-sm text-text leading-relaxed font-normal">
                    {selectedClub.description}
                  </p>
                </div>

                {selectedClub.lead_name && (
                  <div className="p-3 bg-paper border border-line rounded flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ink text-surface flex items-center justify-center font-bold text-xs">
                      {selectedClub.lead_name[0]}
                    </div>
                    <div>
                      <p className="text-xs text-muted">Society Lead</p>
                      <p className="text-sm font-semibold text-ink">{selectedClub.lead_name}</p>
                    </div>
                  </div>
                )}

                {/* Society Notice / Announcements */}
                <div className="space-y-3 pt-4 border-t border-line">
                  <h3 className="text-sm font-heading font-bold text-ink">
                    Latest announcements
                  </h3>
                  <div className="p-3.5 bg-paper border border-line rounded space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink">Weekly meeting & orientations</span>
                      <span className="text-muted">Yesterday</span>
                    </div>
                    <p className="text-xs text-text">
                      New member welcome and project distribution in Senate Hall at 4:30 PM this Friday.
                    </p>
                  </div>
                </div>

                {/* Membership Action (Requires personal details when joining) */}
                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {selectedClub.requires_approval
                      ? "Requires society lead approval to join"
                      : "Open to all enrolled students"}
                  </span>

                  {selectedClub.user_membership_status === "active" ? (
                    <Button variant="secondary" onClick={() => leaveClub(selectedClub.id)}>
                      Leave club
                    </Button>
                  ) : selectedClub.user_membership_status === "pending" ? (
                    <Button variant="secondary" onClick={() => leaveClub(selectedClub.id)}>
                      Cancel request
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => {
                        setJoiningClub(selectedClub);
                        setJoinRollNo(currentUser.roll_no || "");
                        setJoinPhone(currentUser.phone || "");
                      }}
                    >
                      {selectedClub.requires_approval ? "Apply with details" : "Join with details"}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Modal: Fill Personal Details to Join Club */}
        <Modal
          isOpen={joiningClub !== null}
          onClose={() => setJoiningClub(null)}
          title={`Join ${joiningClub?.name || "Society"}`}
        >
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div className="p-3 bg-paper border border-line rounded text-xs text-muted">
              Please provide your student details and motivation for joining this society.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Full Name"
                value={currentUser.full_name}
                disabled
              />
              <Input
                label="Roll Number"
                value={joinRollNo}
                onChange={(e) => setJoinRollNo(e.target.value)}
                placeholder="e.g. CS2023-042"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Department</label>
                <select
                  value={joinDept}
                  onChange={(e) => setJoinDept(e.target.value)}
                  className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Department of Physics">Department of Physics</option>
                  <option value="Department of Chemistry">Department of Chemistry</option>
                  <option value="Department of Mathematics">Department of Mathematics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">Semester</label>
                <select
                  value={joinSemester}
                  onChange={(e) => setJoinSemester(e.target.value)}
                  className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Contact Phone"
              value={joinPhone}
              onChange={(e) => setJoinPhone(e.target.value)}
              placeholder="e.g. +91 9876543210"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Reason for Joining / What interests you?
              </label>
              <textarea
                value={joinReason}
                onChange={(e) => setJoinReason(e.target.value)}
                rows={2}
                placeholder="Share why you want to participate in this club..."
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Prior Experience, Skills or Instruments (Optional)
              </label>
              <Input
                value={joinSkills}
                onChange={(e) => setJoinSkills(e.target.value)}
                placeholder="e.g. Debate tournaments, robotics, badminton, guitar..."
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setJoiningClub(null)}>
                Cancel
              </Button>
              <Button type="submit">Submit membership application</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
