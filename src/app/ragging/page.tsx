"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Shield,
  Phone,
  FileCheck,
  CheckCircle,
  Lock,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { RaggingComplaint } from "@/lib/database.types";

export default function AntiRaggingPage() {
  const { raggingComplaints, submitRaggingComplaint, updateRaggingStatus, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState("");
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 10));
  const [accusedDetails, setAccusedDetails] = useState("");
  const [description, setDescription] = useState("");
  const [witnessDetails, setWitnessDetails] = useState("");
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Principal/Admin action review modal
  const [reviewingComplaint, setReviewingComplaint] = useState<RaggingComplaint | null>(null);
  const [actionStatus, setActionStatus] = useState<RaggingComplaint["status"]>("under_investigation");
  const [actionNotes, setActionNotes] = useState("");

  const isPrincipalOrAdmin = currentUser.role === "principal" || currentUser.role === "admin";

  const visibleComplaints = isPrincipalOrAdmin
    ? raggingComplaints
    : raggingComplaints.filter((c) => c.reporter_id === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description || !accusedDetails) return;

    submitRaggingComplaint({
      reporter_id: currentUser.id,
      is_anonymous: isAnonymous,
      reporter_name: isAnonymous ? undefined : currentUser.full_name,
      reporter_roll_no: isAnonymous ? undefined : currentUser.roll_no || undefined,
      department: isAnonymous ? undefined : "Computer Science & Engineering",
      incident_date: incidentDate,
      location,
      accused_details: accusedDetails,
      description,
      witness_details: witnessDetails,
    });

    setModalOpen(false);
    setLocation("");
    setAccusedDetails("");
    setDescription("");
    setWitnessDetails("");
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 5000);
  };

  const handleUpdateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingComplaint) return;

    updateRaggingStatus(reviewingComplaint.id, actionStatus, actionNotes);
    setReviewingComplaint(null);
    setActionNotes("");
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emergency" />
              <h1 className="text-xl font-heading font-bold text-ink">
                Anti-Ragging Committee Portal
              </h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Vinoba Bhave University maintains zero-tolerance for ragging, bullying, or harassment.
            </p>
          </div>

          <Button
            variant="danger"
            onClick={() => setModalOpen(true)}
            className="gap-2 self-start sm:self-auto min-h-[44px]"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>File ragging complaint</span>
          </Button>
        </div>

        {/* National Helpline Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-paper space-y-1">
            <span className="text-xs text-muted font-medium">National Anti-Ragging Helpline</span>
            <p className="text-lg font-heading font-bold text-ink tabular-nums">1800-180-5522</p>
            <p className="text-[11px] text-muted">24/7 Toll-Free UGC National Helpline</p>
          </Card>

          <Card className="p-4 bg-paper space-y-1">
            <span className="text-xs text-muted font-medium">Anti-Ragging Squad Email</span>
            <p className="text-sm font-semibold text-ink">antiragging@vbu.ac.in</p>
            <p className="text-[11px] text-muted">Direct to Principal & Committee</p>
          </Card>

          <Card className="p-4 bg-paper space-y-1">
            <span className="text-xs text-muted font-medium">Confidential Protection</span>
            <p className="text-sm font-semibold text-accent flex items-center gap-1">
              <Lock className="w-4 h-4" /> Anonymous Option
            </p>
            <p className="text-[11px] text-muted">Your identity is never disclosed</p>
          </Card>
        </div>

        {submittedNotice && (
          <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>
              Your complaint has been logged securely and forwarded to the Principal Anti-Ragging Committee.
            </span>
          </div>
        )}

        {/* Complaints Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-ink">
              {isPrincipalOrAdmin ? "All received complaints" : "My filed complaints"}
            </h2>
            <span className="text-xs text-muted tabular-nums">
              {visibleComplaints.length} on record
            </span>
          </div>

          {visibleComplaints.length > 0 ? (
            visibleComplaints.map((c) => (
              <Card key={c.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">{c.public_id}</span>
                    <StatusBadge
                      status={
                        c.status === "resolved"
                          ? "resolved"
                          : c.status === "action_taken"
                          ? "acknowledged"
                          : "in_progress"
                      }
                      label={
                        c.status === "under_investigation"
                          ? "Under investigation"
                          : c.status === "action_taken"
                          ? "Action taken"
                          : c.status === "resolved"
                          ? "Resolved"
                          : "Submitted"
                      }
                    />
                    {c.is_anonymous ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-paper border border-line font-medium text-muted">
                        Anonymous report
                      </span>
                    ) : (
                      <span className="text-xs text-muted">By {c.reporter_name}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted tabular-nums">
                    Incident Date: {c.incident_date}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-text">
                  <p>
                    <strong className="text-ink">Location:</strong> {c.location}
                  </p>
                  <p>
                    <strong className="text-ink">Persons Involved:</strong> {c.accused_details}
                  </p>
                  <p className="bg-paper p-2.5 rounded border border-line leading-relaxed">
                    <strong>Description:</strong> {c.description}
                  </p>
                  {c.witness_details && (
                    <p className="text-muted">
                      <strong>Witness / Support notes:</strong> {c.witness_details}
                    </p>
                  )}
                  {c.action_notes && (
                    <div className="p-2.5 bg-[#EEF2FB] rounded border border-line text-ink">
                      <strong>Committee Action Record:</strong> {c.action_notes}
                    </div>
                  )}
                </div>

                {/* Principal / Admin Committee Actions */}
                {isPrincipalOrAdmin && (
                  <div className="pt-2 border-t border-line flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setReviewingComplaint(c);
                        setActionStatus(c.status);
                        setActionNotes(c.action_notes || "");
                      }}
                    >
                      Update Committee Action
                    </Button>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center text-sm text-muted">
              No anti-ragging complaints on record.
            </Card>
          )}
        </div>

        {/* Modal: File Ragging Complaint */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="File Anti-Ragging Complaint"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-paper border border-line rounded text-xs text-muted leading-relaxed">
              Every complaint is reviewed directly by the <strong>Principal</strong> and the statutory <strong>Anti-Ragging Squad</strong>. You may choose to file anonymously if you do not wish your name to appear.
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-surface border border-line rounded">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-accent rounded"
              />
              <span className="text-xs font-semibold text-ink">
                Submit this complaint anonymously (Do not show my name or roll number)
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date of Incident"
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                required
              />
              <Input
                label="Location on Campus"
                placeholder="e.g. Hostel A 1st Floor Corridor or Canteen"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Persons / Groups Involved
              </label>
              <Input
                placeholder="Names, department, year or physical description of accused persons..."
                value={accusedDetails}
                onChange={(e) => setAccusedDetails(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Detailed Description of What Happened
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="State what occurred, time of event, words spoken or actions taken..."
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Witness Details or Other Evidence (Optional)
              </label>
              <Input
                placeholder="Names of students present, staff alerted, or details..."
                value={witnessDetails}
                onChange={(e) => setWitnessDetails(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                Submit complaint
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Principal Action Update */}
        <Modal
          isOpen={reviewingComplaint !== null}
          onClose={() => setReviewingComplaint(null)}
          title="Anti-Ragging Squad Action"
        >
          <form onSubmit={handleUpdateAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Investigation Status</label>
              <select
                value={actionStatus}
                onChange={(e) => setActionStatus(e.target.value as RaggingComplaint["status"])}
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                <option value="submitted">Submitted</option>
                <option value="under_investigation">Under Investigation by Squad</option>
                <option value="action_taken">Disciplinary Action Taken</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Official Committee Action Notes
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                placeholder="Enter actions taken by squad, hostel warnings, or resolutions..."
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setReviewingComplaint(null)}>
                Cancel
              </Button>
              <Button type="submit">Save committee action</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
